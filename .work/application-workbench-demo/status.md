# Application workbench demo

## Destination

Deliver [Docket](spec.md) for [foundation Ticket 28](../library-foundation/tickets/28-application-workbench-prerelease.md) under Whitney's substantial prototype boundary.

## Current state

Complete. Whitney ended critique and authorized closure after cleanup review. Whitney still finds the demo design confusing, but considers the library solid for the intended use. The fixture is retained as integration evidence, not an endorsed application-design template.

## Delivered work

The document editor, [register and commissioning expansion](tickets/03-workspace-expansion.md), and requested layout corrections are complete. No library-only corrections were established; the [correction placeholder](tickets/02-library-corrections.md) is closed without implementation. No cleanup task remains.

Start the packed-package consumer with `npm run prototype:workbench` at `http://localhost:5177`; build with `npm run prototype:workbench:build`. Sample data and attached evidence live only in the current session. Reload resets them.

## Accepted sources

- [Specification](spec.md)
- [Applied design](design.md)
- [Demo ticket](tickets/01-document-workbench.md)
- Whitney's final assessment and authorization to close the integration proof.

## Verification

[Current evidence](verification.md) records the package build, types, lint, formatting, domain checks, Chromium/Firefox workflows, responsive continuity, layout correction, and delivery review. No public library components changed, so showcase or generated-guidance updates are unnecessary. Release-wide certification remains with foundation Tickets 30 and 31.

## Delivery

The fixture, runner, verification scripts, and work records form one delivery on `main`. No further work is scheduled for this effort.
