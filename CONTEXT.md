# Component Library Context

This project provides reusable React components, styles, behaviors, and concept-owning composites
for consistent application development by people and agents.

## Language

**Component contract**:
The canonical, structured description of a public export's intended and inappropriate uses,
alternatives, content rules, composition, states, accessibility obligations, and focused examples.
Human and machine-readable guidance derive from this source.

**Breadth-aware vertical slice**:
A first-release strategy that uses one non-exported consumer fixture to validate shared foundations
against the wider component families the library is expected to support later.
_Avoid_: turning the fixture's workflow or layout into a public component contract.

**Aggregate navigation slice**:
A PieChart or DonutChart slice that represents undisplayed ranked categories and moves to their
next chart page when activated. Its angle represents their combined value by default, with an
optional deliberately smallest treatment when navigation should stay visually secondary.
_Avoid_: treating the aggregate as an ordinary category or assuming it always uses one sizing
policy.

**Radar shoulder**:
A visual-only fill point added beside an isolated positive radar value so the polygon does not
collapse into a line. It never changes the dimension's value, point, reading, or structured output.
_Avoid_: reporting a shoulder as measured or inferred data.
