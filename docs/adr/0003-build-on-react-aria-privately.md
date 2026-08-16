# Build on React Aria Privately

The library will use React Aria Components as its private behavior and accessibility foundation,
including its lower-level hooks when a distinct structure requires them. The library will define
and test its own public concepts, props, compositions, and styles rather than re-exporting React
Aria components or extending their complete prop types, preserving the library's design intent and
leaving room to change the foundation later.
