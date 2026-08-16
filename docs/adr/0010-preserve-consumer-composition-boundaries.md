# Preserve Consumer Composition Boundaries

The library distinguishes structural composition from behavior participation. Structural
containers accept consumer-owned React composition, while behavior-owning composites constrain the
rendered controls and DOM relationships that participate in their behavior without rejecting a
consumer abstraction merely because it introduces a React component boundary.

TypeScript continues to enforce finite choices and representable state combinations. When JSX
erases the component identity needed to prove a rendered relationship, the composite validates
that relationship at runtime. DOM-producing wrappers that change required layout or accessibility
relationships remain unsupported unless the composite exposes a named part for them.
