import {
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
} from './fieldData.js';
import { renderField } from './fieldRender.js';
import { findPath } from './pathing.js';
import { initButton } from './ui.js';

// Describe initial field options and construct field array.
// The override is used to test novel field arrays and can be defined here
const latDim = 7;
let startPos = returnRandomID(latDim);
let endPos = returnNoncollidingID(latDim, startPos);
// const override = [];
const override = [
  {
    id: 1,
    x: 1,
    y: 1,
    targetDistance: 6,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 2,
    x: 2,
    y: 1,
    targetDistance: 6.083,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 3,
    x: 3,
    y: 1,
    targetDistance: 6.325,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 4,
    x: 4,
    y: 1,
    targetDistance: 6.708,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 5,
    x: 5,
    y: 1,
    targetDistance: 7.211,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 6,
    x: 6,
    y: 1,
    targetDistance: 7.81,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 7,
    x: 7,
    y: 1,
    targetDistance: 8.485,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 8,
    x: 1,
    y: 2,
    targetDistance: 5,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 9,
    x: 2,
    y: 2,
    targetDistance: 5.099,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 10,
    x: 3,
    y: 2,
    targetDistance: 5.385,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 11,
    x: 4,
    y: 2,
    targetDistance: 5.831,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 12,
    x: 5,
    y: 2,
    targetDistance: 6.403,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 13,
    x: 6,
    y: 2,
    targetDistance: 7.071,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 14,
    x: 7,
    y: 2,
    targetDistance: 7.81,
    type: 'start',
    checked: false,
    from: [],
  },
  {
    id: 15,
    x: 1,
    y: 3,
    targetDistance: 4,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 16,
    x: 2,
    y: 3,
    targetDistance: 4.123,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 17,
    x: 3,
    y: 3,
    targetDistance: 4.472,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 18,
    x: 4,
    y: 3,
    targetDistance: 5,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 19,
    x: 5,
    y: 3,
    targetDistance: 5.657,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 20,
    x: 6,
    y: 3,
    targetDistance: 6.403,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 21,
    x: 7,
    y: 3,
    targetDistance: 7.211,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 22,
    x: 1,
    y: 4,
    targetDistance: 3,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 23,
    x: 2,
    y: 4,
    targetDistance: 3.162,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 24,
    x: 3,
    y: 4,
    targetDistance: 3.606,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 25,
    x: 4,
    y: 4,
    targetDistance: 4.243,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 26,
    x: 5,
    y: 4,
    targetDistance: 5,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 27,
    x: 6,
    y: 4,
    targetDistance: 5.831,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 28,
    x: 7,
    y: 4,
    targetDistance: 6.708,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 29,
    x: 1,
    y: 5,
    targetDistance: 2,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 30,
    x: 2,
    y: 5,
    targetDistance: 2.236,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 31,
    x: 3,
    y: 5,
    targetDistance: 2.828,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 32,
    x: 4,
    y: 5,
    targetDistance: 3.606,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 33,
    x: 5,
    y: 5,
    targetDistance: 4.472,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 34,
    x: 6,
    y: 5,
    targetDistance: 5.385,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 35,
    x: 7,
    y: 5,
    targetDistance: 6.325,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 36,
    x: 1,
    y: 6,
    targetDistance: 1,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 37,
    x: 2,
    y: 6,
    targetDistance: 1.414,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 38,
    x: 3,
    y: 6,
    targetDistance: 2.236,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 39,
    x: 4,
    y: 6,
    targetDistance: 3.162,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 40,
    x: 5,
    y: 6,
    targetDistance: 4.123,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 41,
    x: 6,
    y: 6,
    targetDistance: 5.099,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 42,
    x: 7,
    y: 6,
    targetDistance: 6.083,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 43,
    x: 1,
    y: 7,
    targetDistance: 0,
    type: 'target',
    checked: false,
    from: [],
  },
  {
    id: 44,
    x: 2,
    y: 7,
    targetDistance: 1,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 45,
    x: 3,
    y: 7,
    targetDistance: 2,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 46,
    x: 4,
    y: 7,
    targetDistance: 3,
    type: 'obstacle',
    checked: false,
    from: [],
  },
  {
    id: 47,
    x: 5,
    y: 7,
    targetDistance: 4,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 48,
    x: 6,
    y: 7,
    targetDistance: 5,
    type: 'empty',
    checked: false,
    from: [],
  },
  {
    id: 49,
    x: 7,
    y: 7,
    targetDistance: 6,
    type: 'obstacle',
    checked: false,
    from: [],
  },
];

console.log(`lateral dim of field -> ${latDim}`);
console.log(`start position ID -> ${startPos}`);
console.log(`end position ID -> ${endPos}`);

// Build initial field array
let fieldArray = createFieldArray(latDim, startPos, endPos, override);

const fieldEl = document.getElementById('field');

// Render field visual
renderField(fieldArray, fieldEl, latDim);

let found = false;

// UI stuff
initButton('randomize', () => {
  // Reset start/end position
  startPos = returnRandomID(latDim);
  endPos = returnNoncollidingID(latDim, startPos);

  fieldArray = createFieldArray(latDim, startPos, endPos, override);
  renderField(fieldArray, fieldEl, latDim);
  found = false;
});
initButton('find', () => {
  // We expect the start cell (and soon the target cell) to be randomized via the UI.
  // So we find it here, right before attempting to find the path
  const startCell = fieldArray.find(({ type }) => type === 'start');
  const targetCell = fieldArray.find(({ type }) => type === 'target');

  findPath(fieldArray, startCell, targetCell, latDim, found);
  // Prevent subsequent actions on click events until obstacle randomization occurs
  found = true;
});
