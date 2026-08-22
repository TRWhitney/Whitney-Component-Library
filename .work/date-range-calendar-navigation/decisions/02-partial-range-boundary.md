# 02 Partial range boundary

**Status:** resolved
**Blocked by:** none
**Type:** research

## Question

Must the public value contract become partial for the first selected endpoint to appear in the field?

## Answer

No. Keep incomplete endpoint selection as picker draft state. Show a selected start in its segmented field immediately, but do not serialize it or emit it as a complete public range. `onChange`, controlled `value`, and form submission remain complete-range-or-null boundaries.

This preserves the established API and prevents a half-range from becoming application data while still providing the requested visual feedback.

## Evidence

- [React Aria capability research](../research/react-aria-capabilities.md)
- Existing DateRangePicker contract: public events and form values are complete ranges or empty.
