import { createFieldArray } from './fieldData.js';
import { renderField } from './fieldRender.js';
import { findPath } from './pathing.js';
import { initButton } from './ui.js';

// Describe initial field options and construct field array.
// The override is used to test novel field arrays and can be defined here
const latDim = 7;
const startPos = 1;
const endPos = latDim ** 2;
const override = [];

console.log(`lateral dim of field -> ${latDim}`);
console.log(`start position ID -> ${startPos}`);
console.log(`end position ID -> ${endPos}`);

// Build initial field array
let fieldArray = createFieldArray(latDim, startPos, override);

const fieldEl = document.getElementById('field');

// Render field visual
renderField(fieldArray, fieldEl, latDim);

// The fun stuff.
// Again, this will be neccessary in the future, when these are dynamic or random
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');
let found = false;

// UI stuff
initButton('randomize', () => {
  fieldArray = createFieldArray(latDim, startPos, override);
  renderField(fieldArray, fieldEl, latDim);
  found = false;
});
initButton('find', () => {
  findPath(fieldArray, startCell, targetCell, latDim, found);
  // Prevent subsequent actions on click events until obstacle randomization occurs
  found = true;
});
