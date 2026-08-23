# Notification variants and legible stacking

## Problem Statement

Notifications currently inherit the general feedback tone set, so an ordinary message cannot use
the application accent and an error is named `danger`. Notifications also prohibit recovery
actions. Multiple visible messages look like unrelated floating cards, do not show the queued
total, and give no visual indication of their remaining lifetime.

## Solution

NotificationProvider accepts notification-specific `general`, `success`, `warning`, and `error`
tones. General uses the active application accent. Success, warning, and error reuse the same
semantic green, yellow, and red tokens as the rest of the library. A notification may include one
text action paired with one callback. Invoking the action calls the callback and dismisses that
notification.

The region begins at the selected viewport edge and presents messages as one compact stack. At
least five ordinary messages fit without scrolling on a standard desktop viewport. Past the
available region height, every current message remains available through native scrolling. The
scrollbar follows ScrollRegion semantics: hidden while idle, revealed during pointer or scroll
activity and while focus is within the region, and continuously visible in forced-color mode. The
region also displays the total number of current messages. Each timed message has a tone-colored
lifetime rail that drains over its configured timeout. Hovering the region or moving focus into it
pauses both the timeout and the rail. Persistent messages have no rail.

## User Stories

1. As an application developer, I want ordinary, success, warning, and error notification variants,
   so that transient messages use the correct accent or semantic color.
2. As an application developer, I want to attach one concise action to a notification, so that a
   user can perform a nearby follow-up without arbitrary notification composition.
3. As an application user, I want a notification count and visible lifetime, so that I can read the
   stack and judge when each timed message will disappear.

## Implementation Decisions

- `NotificationTone` is a notification-specific public type with `general`, `success`, `warning`,
  and `error`. Existing notification-only uses of `neutral` and `danger` migrate to the new terms;
  the existing `success` behavior remains supported.
- `NotificationInput` requires `actionLabel` and `onAction` together and permits neither alone.
  The action is one plain-text button, inherits its notification tone, and dismisses the message
  after the callback returns.
- The total count includes every current notification. It updates for timeout, dismiss control,
  notification action, and programmatic dismissal.
- All current notifications render. By default, the stack uses the available viewport and scrolls
  only when its content needs it. The optional `maxVisible` value caps the list's visible height at
  the measured height of that many cards; additional cards remain rendered and become reachable by
  scrolling inside the capped list. It never hides, replaces, or queues cards behind the cap.
- The default placement is top-end so the first notification starts at the top viewport edge. The
  existing timeout bounds, placement options, live-region urgency, focus behavior, Escape handling,
  and dismissal callback behavior remain unchanged.
- A CSS lifetime rail mirrors each visible toast's configured timeout. Region hover and focus pause
  it through the same states that pause the React Aria queue timers.
- Reduced-motion mode removes entry motion and the draining animation. The timeout itself still
  works, and the stack count and static tone remain visible.
- No durable glossary or ADR is needed. The tone names and stack behavior belong to this component's
  canonical contract rather than a system-wide architecture rule.

### Applied visual direction

- Colors: accent rail and accent soft surface; success `--wcl-success` and
  `--wcl-success-surface`; warning `--wcl-warning` and `--wcl-warning-surface`; error
  `--wcl-danger` and `--wcl-danger-surface`; and raised neutral surface tokens.
- Type: the established body face at 0.875rem bold for titles, 0.8125rem for descriptions and
  actions, and tabular compact numerals for the stack count.
- Layout: a narrow, top-aligned viewport-corner column with a small overlap between adjacent raised
  messages, enough room for at least five ordinary messages on a standard desktop viewport, plus a
  count marker at the stack edge. Overflow keeps every rendered message reachable through native
  scrolling without an idle scrollbar gutter competing with the stack.
- Showcase controls: the three-card cap toggle occupies its own row. The general, success, warning,
  and error triggers share one consistent button treatment in a separate wrapping row.
- Motion: one short entry settle and one linear lifetime rail per timed message. Paused and
  reduced-motion states remain mechanically aligned with timeout behavior.
- Signature element: the lifetime rail continues the notification's leading tone rail around the
  lower edge, turning each card into a visible countdown without adding copy.

This direction follows the established raised surfaces, logical edges, compact spacing, type scale,
accent derivation, status tokens, and forced-color behavior in `src/styles.css`. The stack device and
lifetime rail specifically encode count and expiry, so neither is decorative.

## Testing Decisions

- Behavior tests cover all tones, action rendering and dismissal, total count changes, timed versus
  persistent rails, pause states already owned by React Aria, uncapped rendering, scrolling
  affordance activity, and capped viewport measurement without queue hiding.
- Type tests prove tone bounds and the paired action contract.
- Stylesheet tests cover the notification tone selectors, lifetime animation, pause selectors,
  reduced motion, and forced colors.
- The human-facing showcase renders a separate, clearly labeled button for general, success,
  warning, and error messages. A toggle applies a three-card viewport cap to those same controls so
  capped scrolling can be compared directly with the uncapped stack. At least one message includes
  an action, and the four controls can create enough messages to inspect the stack and overflow.
- Full repository checks and a production showcase build are required.

## Out of Scope

- Arbitrary React content, multiple actions, links, progress semantics announced to assistive
  technology, consumer-controlled stack animation, or changes to alert and status tone names.

## Further Notes

Rendered verification must cover one message, five messages without scrolling, uncapped viewport
overflow, three cards visible with more cards scrollable under `maxVisible={3}`, each tone, an
action, a persistent message, both themes, compact width, hover or focus pause, transient scrollbar
activity, reduced motion, and forced colors.
