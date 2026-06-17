# sintesis

## Library

`library/` is a curated reference collection. Access rules:

- **Read**: any agent or user may read any file in `library/`
- **Write**: only the **librarian agent** may add, edit, or remove documents or update `library/CATALOG.md`

**Never write to `library/` directly.** When something needs to be saved, updated, or removed from the library, invoke the librarian agent and let it handle acquisition, cataloging, and the CATALOG.md update as a single operation.

This applies even when the content is already prepared — the librarian assigns the LIB-ID, applies the format standard, enforces the Collection Development Test, and keeps the catalog consistent.
