# sintesis

## Library

`library/` is a curated reference collection. Access rules:

- **Read**: any agent or user may read any file in `library/`
- **Write**: only the **librarian agent** may add, edit, or remove documents or update `library/CATALOG.md`

**Never write to `library/` directly.** When something needs to be saved, updated, or removed from the library, invoke the librarian agent and let it handle acquisition, cataloging, and the CATALOG.md update as a single operation.

This applies even when the content is already prepared — the librarian assigns the LIB-ID, applies the format standard, enforces the Collection Development Test, and keeps the catalog consistent.

## Agents

`.claude/agents/` is the agent registry. Access rules:

- **Read**: any agent or user may read any file in `.claude/agents/`
- **Write**: only the **agent-creator agent** may add, edit, or remove agent files

**Never write to `.claude/agents/` directly.** When an agent needs to be created, updated, or removed, invoke the agent-creator agent and let it handle design, validation, conflict detection, testing, and the registry update as a single operation.

This applies even when the content is already prepared — the agent-creator enforces the format standard, checks for authority conflicts, runs the testing protocol, and keeps the registry consistent.

**Genesis exception:** agent-creator itself was written directly at initial installation, before it existed to manage its own creation. This one-time exception is intentional and does not apply to any other agent.

**Agent-creator maintenance exception:** agent-creator cannot apply its own testing protocol to itself — doing so would be circular. Updates to `agent-creator.md` are made directly by the user or main-thread Claude Code (not routed through agent-creator). The user acts as the external auditor: Tests 1 and 4 are static checks on the file; Tests 2 and 3 are run by invoking agent-creator from the main thread with in-scope and out-of-scope scenarios. This exception covers modifications to agent-creator only — all other agent files must go through agent-creator as normal.
