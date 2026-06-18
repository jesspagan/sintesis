---
lib-id: LIB-003
title: Claude Code Agent Design Patterns — Reference Guide
subjects: [agents, claude-code, workflow, tokens]
type: reference-guide
date: 2026-06-17
abstract: Comprehensive reference for designing Claude Code subagents: complete frontmatter spec, tool grants and authority enforcement, agents vs skills vs CLAUDE.md decision framework, parallel execution costs, nested agents, fork mechanics, testing patterns, and the agent-creator meta-pattern.
---

# Claude Code Agent Design Patterns — Reference Guide

*Researched June 17, 2026*

---

## 1. Agent File Format — Complete Frontmatter Spec

Subagents are Markdown files in `.claude/agents/` (project) or `~/.claude/agents/` (user). YAML frontmatter configures the agent; the body is its system prompt.

**Scope priority (highest to lowest):**
1. Managed settings (org-wide)
2. `--agents` CLI flag (session only)
3. `.claude/agents/` (project)
4. `~/.claude/agents/` (user)
5. Plugin `agents/` directory

**Startup note:** Files added manually to `.claude/agents/` require a session restart to load. Agents created via `/agents` UI take effect immediately.

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | Unique identifier, lowercase + hyphens. Used by hooks (`agent_type`). Filename does not have to match. |
| `description` | When Claude should delegate to this agent. Write clearly — Claude uses this for automatic delegation. Add "use proactively" to encourage automatic use. |

### Optional Fields

| Field | Type/Values | Description |
|-------|-------------|-------------|
| `tools` | comma-separated list | Allowlist — agent can only use these tools. Omit to inherit all. Use `Agent(name1, name2)` to restrict which subagents this agent can spawn. |
| `disallowedTools` | comma-separated list | Denylist — removed from inherited or specified pool. `mcp__<server>` or `mcp__<server>__*` removes entire MCP server. |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, full model ID, `inherit` | Default: `inherit`. Resolution order: `CLAUDE_CODE_SUBAGENT_MODEL` env var → per-invocation param → frontmatter → main session. |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` | Parent mode takes precedence if parent is `bypassPermissions` or `acceptEdits`. |
| `maxTurns` | integer | Maximum agentic turns before the subagent stops. |
| `skills` | list of skill names | Preloads full skill content into agent context at startup. Without this, agent can still invoke skills via Skill tool. |
| `mcpServers` | list | MCP servers scoped to this agent. Inline definitions connect on start, disconnect on finish. Not supported in plugin subagents. |
| `hooks` | hook config | Lifecycle hooks scoped to this agent (PreToolUse, PostToolUse, Stop → SubagentStop). Not supported in plugin subagents. |
| `memory` | `user`, `project`, `local` | Enables persistent memory directory across conversations. Injects first 200 lines of `MEMORY.md` at startup. Auto-enables Read/Write/Edit. |
| `background` | `true` / `false` | Always run as background task. Default: `false`. |
| `effort` | `low`, `medium`, `high`, `xhigh`, `max` | Overrides session effort level for this agent. |
| `isolation` | `worktree` | Runs agent in a temporary git worktree (isolated copy). Auto-cleaned if no changes. |
| `color` | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` | Display color in task list and transcript. |
| `initialPrompt` | string | Auto-submitted as first user turn when agent runs as main session via `--agent`. |

### Minimal Example

```markdown
---
name: code-reviewer
description: Reviews code for quality and security issues. Use proactively after any code changes.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer. When invoked, run `git diff` to see recent changes, then review for: correctness, security, naming, error handling, and test coverage. Organize findings as Critical / Warning / Suggestion.
```

---

## 2. Tool Grants — Full Available Tool List

Subagents inherit all tools available in the main conversation by default, with these exceptions — these are **never available to subagents** regardless of `tools` field:

- `AskUserQuestion`
- `EnterPlanMode`
- `ExitPlanMode` *(unless `permissionMode: plan`)*
- `ScheduleWakeup`
- `WaitForMcpServers`

**Built-in tools grantable to subagents:**

| Category | Tools |
|----------|-------|
| File read | `Read`, `Glob`, `Grep` |
| File write | `Write`, `Edit`, `NotebookEdit` |
| Execution | `Bash`, `PowerShell` |
| Agent control | `Agent` (spawns subagents), `Agent(name1,name2)` (restricted spawn) |
| Skills | `Skill` |
| Web | `WebSearch`, `WebFetch` |
| Task tracking | `TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`, `TaskStop`, `TaskOutput` |
| Monitor | `Monitor` |
| Context | `EnterWorktree`, `ExitWorktree` |

**Tool restriction syntax:**

```yaml
# Allowlist only — agent gets exactly these tools
tools: Read, Grep, Glob, Bash

# Denylist only — inherits all tools except these
disallowedTools: Write, Edit

# MCP server removal
disallowedTools: mcp__github        # removes all github MCP tools
disallowedTools: mcp__*             # removes all MCP tools from any server

# Restrict which subagents this agent can spawn
tools: Agent(worker, researcher), Read, Bash
```

---

## 3. Agents vs. Skills vs. CLAUDE.md — Decision Framework

Three tools for encoding instructions. Choose based on scope, lifetime, and execution model.

| Criterion | CLAUDE.md | Skill | Subagent |
|-----------|-----------|-------|---------|
| **When it loads** | Every turn, always | On demand (description in context; body loads on invocation) | Only when spawned |
| **Where it runs** | Main thread | Main thread (default); subagent if `context: fork` | Isolated context window |
| **Sees conversation history** | n/a (it IS context) | Yes | No (fresh start; fork inherits) |
| **Tool restrictions** | No | Via `allowed-tools` / `disallowed-tools` (turn-scoped) | Via `tools` / `disallowedTools` (enforced) |
| **Parallel execution** | No | No | Yes |
| **Persistent memory** | No | No | Yes (via `memory` field) |
| **Token cost** | Always loaded (keep under 4K tokens) | ~100 tokens description; full body only on use | High startup; full isolated context |
| **Best for** | Facts, conventions, access rules | Reusable procedures, workflows, reference | Context isolation, parallel work, tool enforcement |

### Decision Rule

```
Is this a fact/convention that should always be active?
  → CLAUDE.md

Is this a procedure I repeat, loaded on demand?
  → Skill

Does it need parallel execution, context isolation, or strict tool restrictions?
  → Subagent

Does it need external system access (API, database)?
  → MCP server
```

### Can Agents Invoke Skills?

Yes. Two mechanisms:

1. **Preloaded** (`skills` frontmatter): full skill content injected at startup. Agent has it immediately without invoking.
2. **On-demand** (Skill tool): agent discovers and invokes skills during execution, same as main thread. This requires `Skill` to not be in `disallowedTools`.

A skill can also **run inside a subagent** using `context: fork` in the skill's frontmatter — the skill executes in an isolated subagent context.

---

## 4. Nested Agents — What's Supported

**As of Claude Code v2.1.172**, subagents can spawn their own subagents.

| Depth | Foreground | Background |
|-------|-----------|-----------|
| Any depth | Allowed | Max depth 5 |
| > depth 5 | Allowed | Agent tool not available |

- A **fork cannot spawn another fork**. It can spawn named subagents (which count toward depth limit).
- Intermediate output from nested agents never reaches the main conversation — only the top-level summary returns.

**Restricting spawning:** Omit `Agent` from `tools` entirely to prevent a subagent from spawning child agents.

---

## 5. Fork vs. Fresh Subagent

| | Fork | Fresh Subagent |
|--|------|----------------|
| Context | Inherits full conversation history | Fresh start (only agent system prompt + task) |
| System prompt | Same as main session | Agent's own definition |
| Model | Same as main session | Agent's `model` field |
| Prompt cache | **Shared with parent** (first request is cheap) | Separate cache (higher startup cost) |
| Isolation | Lower (sees same history) | Higher (clean context) |
| Can spawn fork | No | Yes |
| Use when | Side task needing full context; parallel approaches from same starting point | Focused task needing clean context; parallel independent workers |

**Enabling forks:**
- v2.1.161+: `/fork <directive>` available by default
- Earlier: requires `CLAUDE_CODE_FORK_SUBAGENT=1`

---

## 6. Authority Enforcement Patterns

Claude Code enforces authority through **tool restriction** (hard) and **convention** (soft). CLAUDE.md rules are convention — they shape Claude's behavior but are not harness-enforced.

### Pattern 1: Tool Allowlist (Hard Enforcement)

Grant only the tools the agent needs. An agent without `Write` cannot write files — period.

```yaml
tools: Read, Grep, Glob    # read-only: cannot modify anything
```

### Pattern 2: PreToolUse Hook (Conditional Hard Enforcement)

When tool-level control is not granular enough (e.g., allow Bash for read commands but not writes):

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
```

Exit code 2 from the hook blocks the tool call. Exit code 0 allows it.

### Pattern 3: CLAUDE.md Convention

For authority over files where tool restriction cannot help (e.g., "only agent-creator may write to `.claude/agents/`"):

```markdown
<!-- CLAUDE.md -->
## Agent Files
`.claude/agents/` — Write only via agent-creator agent. Never write here directly.
```

**Limitation:** Claude Code does not enforce path-level write permissions. There is no `tools: Write(.claude/agents/*)` path restriction. Authority over a directory is convention + CLAUDE.md + agent system prompt, not hard enforcement. PreToolUse hooks blocking writes to protected paths are the closest to hard enforcement available.

---

## 7. Parallel Execution — Token Economics

### Cost Model

| Mode | Context Startup | Cache Behavior |
|------|----------------|----------------|
| Fork | Full session (inherited) | **Shared with parent** |
| Fresh subagent | Agent prompt + task | Separate cache |
| Agent teams | Each has full own session | Separate per agent |

**Token multiplier:** Agent teams are most expensive — each is a separate Claude instance. Fresh subagents add overhead. Forks are cheapest because they share the parent's prompt cache.

**Practical limit:** ~10 simultaneous subagents before context return volume degrades the main conversation.

### When Parallel Agents Are Worth It

Use when: tasks are genuinely independent, each produces verbose output you don't want in main context, latency matters more than token cost.

Skip when: tasks require frequent back-and-forth, tasks share context, the synthesis step will blow out the main context anyway.

---

## 8. What Loads at Subagent Startup

A fresh (non-fork) subagent starts with:

| What | Included? | Notes |
|------|-----------|-------|
| Agent's own system prompt | Yes | From markdown body |
| Task delegation message | Yes | What Claude wrote when handing off |
| CLAUDE.md hierarchy | Yes | All levels. Explore and Plan skip it. |
| Git status | Yes | Snapshot from session start. Explore and Plan skip it. |
| Preloaded skills | Yes | Full content of skills listed in `skills` field |
| Parent conversation history | No | Fresh start. Use fork to inherit. |
| Previously invoked skills | No | Must preload or re-invoke. |
| Files Claude already read | No | Subagent starts with no file context. |

---

## 9. Agent Testing Patterns

There is no harness-native test runner for agents. Use behavioral testing:

### Pattern 1: Format Compliance
Read the agent file. Verify all required frontmatter fields are present and correct.

### Pattern 2: Authority Boundary
Invoke the agent with a scenario outside its declared authority. Verify it declines or redirects.

### Pattern 3: Core Workflow
Invoke the agent with a representative in-scope task. Verify it follows its declared workflow steps. Evaluate behavioral compliance, not exact string match.

### Pattern 4: Tool Justification
For each tool in `tools`, identify which workflow step requires it. Flag any tool with no clear justification.

### Pattern 5: LLM-as-Judge
For semantic quality: have a separate reviewer agent evaluate the output against the system prompt's stated criteria. Three-layer approach: assertions (structural checks) → pattern matching (protocol compliance) → LLM judge (semantic quality).

**Key principle:** Test behavioral patterns and format compliance, not exact output strings.

---

## 10. Agent Maintenance Patterns

### Version Control
Project agents (`.claude/agents/`) belong in git. Treat agent changes like code changes — they affect behavior and deserve review.

### Naming and Conflict Detection
- Names must be unique within each scope level
- Higher scope wins: project agents override user agents with same name
- Authority overlap is convention-based — detectable only by auditing CLAUDE.md and agent system prompts

### The Agent-Creator Meta-Pattern
Designate one agent as sole authority for creating and modifying other agents. This agent:
- Has `Write` and `Edit` in its `tools` field
- Enforces format standards
- Checks for authority conflicts before creating new agents
- Is declared as sole write authority in CLAUDE.md

Use `memory: project` on the agent-creator to accumulate registry knowledge across sessions.

---

## 11. Quick Reference — Common Patterns

### Read-Only Auditor
```yaml
tools: Read, Grep, Glob
model: haiku
```

### Write-Capable Specialist
```yaml
tools: Read, Write, Edit, Grep, Glob, Bash
permissionMode: acceptEdits
```

### Background Research Worker
```yaml
tools: Read, Grep, Glob, WebSearch, WebFetch
background: true
model: haiku
```

### Isolated Repository Worker
```yaml
tools: Read, Write, Edit, Bash, Grep, Glob
isolation: worktree
```

---

## Sources

- Claude Code official documentation — subagents and skills sections (primary)
- Tembo.io: Claude Code Subagents Practical Guide (2026)
- Smith Horn Group: Choosing between skills, subagents, and MCP servers
- RanketAI: Claude Code Advanced Patterns — Skills, Fork, and Subagents (2026-03-31)
