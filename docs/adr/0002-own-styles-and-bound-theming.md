# Own Styles and Bound Theming

The library will ship static CSS backed by semantic custom properties and will own its typography,
spacing, shape, elevation, component structure, and interaction states. Consuming applications will
receive a narrow typed contract for accent color and light or dark appearance, with accessible
accent roles derived by the library; a general public token-customization surface is outside the
first release because it would undermine consistent agent output.

The chosen accent remains literal wherever application identity can be carried directly, including
primary filled emphasis, while rich hover tint preserves its hue. Ordinary content text remains
neutral. Focus, selection rails, accent-bearing edges and underlines, and conditional boundaries
use the exact accent when it is already visible on the surface they actually meet; otherwise the
library derives a deliberately saturated same-hue signal. Contrast is enforced for those real
role/surface pairings rather than forcing every accent-bearing role to contrast against every owned
surface. Achromatic accents receive neutral support. When a literal accent fill is not distinct
from its surrounding surface, the library adds this structural support instead of recoloring the
fill. This preserves free accent choice, including deep accents in dark appearance, without making
the accent responsible for semantic status or ordinary readable content.
