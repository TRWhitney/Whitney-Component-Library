# 04 Two-month layout

**Status:** resolved
**Blocked by:** none
**Type:** prototype

## Question

How should the required adjacent two-month range calendar behave when a very narrow viewport cannot contain two full grids at accessible target sizes?

## Answer

Show consecutive left and right months under one shared previous/next control and page by one month, so the old right month becomes the new left month when moving forward. The popup compresses both panes together to the available viewport width and does not introduce horizontal or vertical scrollbars. It does not stack or replace either pane at narrow widths.

## Evidence

- [React Aria capability research](../research/react-aria-capabilities.md)
- The accepted prototype preserved adjacent panes without scrollbars at the reviewed 403 px viewport.
