import {
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
} from './modules/fieldData.js';
import { renderField } from './modules/fieldRender.js';
import { initUI } from './modules/ui.js';

// Describe initial field options and construct field array.
const latDim = 10;
let startPos = returnRandomID(latDim);
let endPos = returnNoncollidingID(latDim, startPos);

// The override is used to test novel field arrays and can be defined here
const override = [];

console.log(`lateral dim of field -> ${latDim}`);
if (override.length < 1) {
  console.log(`start position ID -> ${startPos}`);
  console.log(`end position ID -> ${endPos}`);
}

// Build initial field array
let fieldArray = createFieldArray(latDim, startPos, endPos, override);

// Render field visual
const fieldEl = document.getElementById('field');

// Workflow
renderField(fieldArray, fieldEl, latDim);
initUI(latDim, startPos, endPos, override, fieldArray, fieldEl);
