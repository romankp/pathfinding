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
const latDim = 10;
let startPos = returnRandomID(latDim);
let endPos = returnNoncollidingID(latDim, startPos);
const override = [];

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
