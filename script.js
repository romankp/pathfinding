import {
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
} from './modules/fieldData.mjs';
import { renderField } from './modules/fieldRender.mjs';
import { initUI } from './modules/ui.mjs';

const fieldEl = document.getElementById('field');

// Describe initial field options and construct field array
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

let fieldArray = createFieldArray(latDim, startPos, endPos, override);

renderField(fieldArray, fieldEl, latDim);
initUI(latDim, startPos, endPos, override, fieldArray, fieldEl);
