# Path Finding

I want to mess around with some pathfinding algorithms and y'all can't stop me!

## The pathfinder does 2 major things:

1. Generates and renders a "field", in the form of a grid with start/end coordinates and obstacles that the algorithm cannot traverse. The field is described by an initial array, with a handful of variables set early in the script.
2. Finds a path from the start coordinate (currently in the top left) to the end coordinate (currently set to the bottom right) on the grid, avoiding all obstacles in the way.

## Single coordinate object structure:

```
{
  "id": [number representing order in the grid field, from top left, to bottom right],
  "x": [number representing column position],
  "y": [number representing row position],
  "targetDistance": [number representing distance between coordinate cell and target for weighting],
  "type": [string: 'start', 'target', 'empty', 'obstacle', or 'path'],
  "checked": [boolean: has the coordinate cell been considered as a move option?],
  "from": [null or array of coordinate ids representing timeline of oldest to newest moves to this position]
}
```

## To do:

- Form entry to set lateral dimension of field
- Randomize start coordinate
- Randomize end/target coordinate
- Add logic to check subsequent move options when current option weights are identical (logic will currently pick the "first" option of the two, not the best in terms of move efficiency)
- Allow movement to the left and above randomized start coordinate. (Override field set)
