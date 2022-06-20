import {
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
} from './fieldData.mjs';
import { findPath } from './pathing.mjs';
import { renderField } from './fieldRender.mjs';

let found = false;

const initButton = (id, triggeredMethod) => {
  const buttonEl = document.getElementById(id);

  buttonEl.addEventListener('click', () => {
    // This notation is a bit weird but wrapping the method in an anonymous function
    // allows us to pass down arguments without invoking it
    triggeredMethod();
  });
};

const initUI = (latDim, startPos, endPos, override, fieldArray, fieldEl) => {
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
};

export { initUI };
