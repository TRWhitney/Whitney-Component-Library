# 14 Prerelease Integration Slice Set

**Status:** resolved
**Blocked by:** [Stable Catalog Model](11-stable-catalog-model.md),
[Markdown Editor Scope](12-markdown-editor-scope.md),
[Charting Scope](13-charting-scope.md)
**Type:** discussion

## Question

Which materially distinct application slices must integrate the broad conventional catalog,
Markdown editor, and chart family before the library becomes intended for use and compatibility
stable?

## Answer

Require four materially distinct prerelease integration slices:

1. **Operational workflow:** configure, validate, review, execute, and monitor through entry,
   choice, validation, dialogs, actions, progress, status, and responsive workflow composition.
2. **Data analysis workspace:** search, filter, sort, select, compare, chart, inspect details, and
   handle loading, empty, partial, and error states through collections, tables, charts, tooltips,
   coordinated selection, dense layout, and data-state behavior.
3. **Markdown authoring workspace:** compose and preview Markdown, navigate wiki links, insert
   dropped assets, invoke formatting commands, and coordinate metadata through the editor,
   toolbars, file handling, links, overlays, undo and redo, and compound form state.
4. **Application workbench:** navigate among tools, manage tabs and panels, invoke menus and
   commands, display notifications, and preserve responsive workspace structure through the
   application shell, navigation, disclosure, overlays, split views, and transient feedback.

The slices do not restrict the catalog. Other accepted conventional components retain their own
contracts, examples, and behavior tests even when they are not central to a slice. Stable release
requires all four slices to consume only the package's public surface without private imports or
external component substitutes.

## Evidence

- Whitney requires several completed slices before the library is intended for use.
- Component breadth determines the stable catalog; slices provide integration evidence rather than
  limiting which components may ship.
- [Initial Prerelease Export Catalog](08-initial-export-catalog.md)
- [Markdown Editor Scope](12-markdown-editor-scope.md)
- [Charting Scope](13-charting-scope.md)
