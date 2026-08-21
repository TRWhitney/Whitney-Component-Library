# Keep Disabled Controls Visually Inert

Disabled controls do not respond to pointer hover with color, outline, elevation, transform, or
motion. A disabled control keeps its resting disabled appearance so it does not imply that pointer
interaction is available. Persistent status styling and non-hover activity such as pending progress
remain independent of this rule.

Read-only controls may retain focus, selection, and text-selection cues for operations they still
allow. They must not advertise an unavailable action. In particular, a read-only range thumb does
not dilate because it cannot be dragged.

Components should suppress hover state at their interaction boundary. CSS that uses native
`:hover`, styles a descendant from composite state, or animates an interaction affordance must also
exclude disabled state explicitly. This keeps the invariant visible in both component behavior and
presentation rules instead of depending on incidental event behavior.
