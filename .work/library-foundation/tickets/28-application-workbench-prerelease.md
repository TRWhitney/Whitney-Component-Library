# 28 Application Workbench Integration Proof

**What to build:** A non-exported packed-package fixture that composes public navigation, tabs,
panels, commands, overlays, and transient feedback inside a consumer-owned application layout.

**Blocked by:** [Application Structure](17-application-structure.md),
[Navigation and Disclosure Family](14-navigation-and-disclosure-family.md),
[Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Loading, Empty, and Notification Feedback](11-loading-empty-and-notification-feedback.md)

**Status:** complete

- [x] Deliver a non-exported document workspace with consumer-owned navigation, editing state, details, commands, overlays, and notifications.
- [x] Preserve the current document, selection, undo history, and unsaved changes across modes and responsive layouts.
- [x] Compose public application components, Markdown editing, analytical content, and document review tools through an installed package archive.
- [x] Verify complete desktop and phone workflows, including empty, loading, error, unsaved, save, readiness, and export states.
- [x] Review the demo with Whitney, resolve client-side critiques, and record any necessary library-only corrections separately.
- [x] Keep application arrangement, routing, and state outside the library's public exports.

These checks follow Whitney's accepted proof-of-concept delivery boundary below. They do not claim the original release-wide SSR, hydration, accessibility, browser, or compatibility certification; those remain in Tickets 30 and 31.

## Delivery boundary

Whitney requests a cohesive document application with a distinct visual identity and complete browser workflow proof at large and small sizes. This is a substantial proof of concept without production hardening. Routine design decisions and public-client corrections are authorized. Required library changes are recorded in a separate ticket after demo critique; they are not implemented during demo development. See the [demo specification](../../application-workbench-demo/spec.md) and [correction ticket](../../application-workbench-demo/tickets/02-library-corrections.md). All listed prerequisites are complete. Release-wide certification remains with Tickets 30 and 31.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

The [Docket demo](../../application-workbench-demo/status.md) and its [verification evidence](../../application-workbench-demo/verification.md) satisfy the accepted integration-proof boundary. Whitney ended critique and authorized closure: the demo design remains confusing, but the library appears solid for Whitney's intended use. This closes the integration proof without endorsing Docket as an application-design reference.

Cleanup review found no outstanding library corrections or implementation cleanup tasks. The empty correction placeholder is closed without implementation. Demo sources, runner, and regression checks remain as the non-exported integration fixture.
