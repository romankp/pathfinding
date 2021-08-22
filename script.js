import { createFieldArray } from './fieldData.js';
import { renderField } from './fieldRender.js';
import { findPath } from './pathing.js';
import { initButton } from './ui.js';

const debug = true;

// Describe obstacle positions and construct field array
const latDim = 7;
const obstacles = [7, 12, 16, 17, 18, 24, 33, 34, 35];
let fieldArray = createFieldArray(latDim, obstacles);

// We don't really need this right now but it'll be good
// for debugging in the future, when initial values become dynamic

if (debug) {
  console.log(`DEBUG: lateral dim of field -> ${latDim}`);
  console.log(`DEBUG: initial obstacles -> ${obstacles}`);
  console.log(`DEBUG: field array -> ${JSON.stringify(fieldArray, null, 2)}`);
}

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
  fieldArray = createFieldArray(latDim, obstacles);
  renderField(fieldArray, fieldEl, latDim);
  found = false;
});
initButton('find', () => {
  findPath(fieldArray, startCell, targetCell, latDim, found);
  // Prevent subsequent actions on click events until obstacle randomization occurs
  found = true;
});
