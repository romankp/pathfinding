# Path Finding

I want to mess around with some pathfinding algorithms and y'all can't stop me!

## The pathfinder does 2 major things

1. Generates and renders a "field", in the form of a grid with start/end coordinates and obstacles that the algorithm cannot traverse. The field is described by an initial array, with a handful of variables set early in the script.
2. Finds a path from the start coordinate (currently in the top left) to the end coordinate (currently set to the bottom right) on the grid, avoiding all obstacles in the way.

## Running the app

The pathfinder "app" requires a bit of setup with NPM since we rely on `http-server`.

1. Clone the repo
2. Run `npm install`
3. Run `npm start`
4. The app is served over port 8080

## Single coordinate object structure

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

## To do

- Form entry to set lateral dimension of field
- Evaluate how findPath requires start/end cell objects when we could just pass the start/end ids
