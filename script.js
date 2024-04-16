import {
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
} from './modules/fieldData.mjs';
import { renderField } from './modules/fieldRender.mjs';
import { initUI } from './modules/ui.mjs';

const fieldEl = document.getElementById('field');

const latDim = 10;
let startPos = returnRandomID(latDim);
let endPos = returnNoncollidingID(latDim, startPos);

// The override is used to test novel field arrays and can be defined here
const override = [];

let fieldArray = createFieldArray(latDim, startPos, endPos, override);

// Expose the field array to the window for manual troubleshooting
window.fieldArray = fieldArray;

renderField(fieldArray, fieldEl, latDim);
initUI(latDim, startPos, endPos, override, fieldArray, fieldEl);
