# Path Finding

I want to mess around with some pathfinding algorithms and y'all can't stop me!

## The pathfinder does 2 major things:

1. Generates and renders a "field", in the form of a grid with start and end coordinates, and obstacles that the algorithm cannot traverse. This is based on a handful of variables set early in the script.
2. Finds a path from the start coordinate (currently in the top left) to the end coordinate (currently set to the bottom right) on the grid, avoiding all obstacles in the way.

## To do:

- Break apart the script into rendering and navigating modules
- Form entry to set lateral dimension of field
- Randomize start coordinate
- Randomize end/target coordinate
- Randomize obstacles
- ~~Do I want a webserver? Maybe throw that in~~
