import { paintCell } from './fieldRender.js';

let workingFieldArray = [];

// Using remainder to address position ID being checked along
// the left or right edge of the field, where an option will appear along
// the far right or left edge, respectively.
const willCauseWrap = (optionID, dimVal) => optionID % dimVal === 0;

// I'm avoiding a flood check of every field array item to return the ids
// for available moves from around the "central" position
const returnOptionIDsArray = (centerID, dimVal) => {
  const idArray = [];
  const idCap = dimVal * dimVal;
  const topCenter = centerID - dimVal;
  const bottomCenter = centerID + dimVal;
  // Top 3 options
  if (topCenter - 1 > 0 && !willCauseWrap(topCenter - 1, dimVal)) {
    idArray.push(topCenter - 1);
  }
  if (topCenter > 0) {
    idArray.push(topCenter);
  }
  if (topCenter + 1 > 0 && !willCauseWrap(topCenter, dimVal)) {
    idArray.push(topCenter + 1);
  }
  // Left and right of center ID
  if (centerID - 1 > 0 && !willCauseWrap(centerID - 1, dimVal)) {
    idArray.push(centerID - 1);
  }
  if (centerID + 1 <= idCap && !willCauseWrap(centerID, dimVal)) {
    idArray.push(centerID + 1);
  }
  // Bottom 3 options
  if (bottomCenter - 1 <= idCap && !willCauseWrap(bottomCenter - 1, dimVal)) {
    idArray.push(bottomCenter - 1);
  }
  if (bottomCenter <= idCap) {
    idArray.push(bottomCenter);
  }
  if (bottomCenter + 1 <= idCap && !willCauseWrap(bottomCenter, dimVal)) {
    idArray.push(bottomCenter + 1);
  }
  return idArray;
};

const filterOptionIDs = (optionsArray, fieldArray) => {
  const filteredOptions = optionsArray.filter(id => {
    // We need to see if the cell has been checked to navigate dead ends
    // but only when we also know the from position
    const { type, checked, from } = fieldArray[id - 1];
    return type === 'empty' || type === 'path' || type === 'target'
      ? true
      : false;
  });
  return filteredOptions;
};

const markCheckedOptions = (optionIDs, fieldArray) => {
  optionIDs.forEach(id => {
    fieldArray[id - 1].checked = true;
    paintCell('option', id);
  });
};

// TODO: Fix from to represent algorithm travel, accross the field, not just down the path itself.
// Field array items should describe the full path traveled, including backtracking

const updateFrom = (currentID, pathID) => {
  workingFieldArray[pathID - 1].from = currentID;
};

const updateType = (string, pathID) => {
  workingFieldArray[pathID - 1].type = string;
};

const findPath = (fieldArray, startCell, targetCell, latDim) => {
  const targetCellID = targetCell.id;
  let path = [startCell];
  let targetReached = false;
  workingFieldArray = fieldArray;
  // let loop = 0;

  // Gonna' keep this guy here for testing.
  // while (!targetReached && loop < 24) {
  while (!targetReached) {
    const currentID = path[path.length - 1].id;
    const moveOptions = filterOptionIDs(
      returnOptionIDsArray(currentID, latDim),
      workingFieldArray
    );

    console.log(`Available options before sort -> ${moveOptions}`);
    markCheckedOptions(moveOptions, workingFieldArray);

    if (moveOptions.some(option => option === targetCellID)) {
      // If moveOptions contains the target ID, stop loop. We've made it!
      path.push(workingFieldArray[targetCellID - 1]);
      targetReached = true;
      // } else if (moveOptions.length < 2 && currentID !== 1) {
      //   // Very specific dead end check for now, while the field is tight.
      //   // Basically we want to backtrack until we find an 'empty' coordinate type.
      //   // If we backtrack all the way to the start, we want to preserve it in the path array as the start.
      //   // This will only be viable while we know that the start coordinate is at the top left corner of the field

      //   // TODO: As the field becomes larger, this becomes less likely to happen
      //   // But the likelihood of having to double back or choose an option that has
      //   // a higher distance value (lower sort order) becomes more likely.
      //   // Need to create a solution here that removes exploratory steps that end up backtracking
      //   // when the path is not a blocked tunnel (has only 1 or 2 move options)
      //   console.log('Hit a dead end.');
      //   console.log(`Current ID --> ${currentID}, After sort --> ${moveOptions}`);
      //   updateFrom(currentID, moveOptions[0]);
      //   updateType('blocked', currentID);
      //   paintCell('blocked', currentID);
      //   // Remove current coord from path array
      //   path.pop();
      //   loop++;
    } else {
      // Sort move options by distance from target, with the shortest option at the start
      moveOptions.sort(
        (a, b) =>
          workingFieldArray[a - 1].targetDistance -
          workingFieldArray[b - 1].targetDistance
      );
      console.log(
        `Deciding options: Current ID --> ${currentID}, After sort --> ${moveOptions}`
      );
      if (workingFieldArray[moveOptions[0] - 1].type === 'path') {
        updateType('blocked', currentID);
        paintCell('blocked', currentID);
        // We might change this in the future but we want to get rid of the last 2 path items in the array.
        // In a deadend field, the current cell can move back and forth, attempting to find a possible exit from a "central" coord.
        // Removing the last 2 entries here cleans up the path array at the end
        path.splice(-2, 2);
        // loop++;
      }
      if (!workingFieldArray[moveOptions[0] - 1].from) {
        updateFrom(currentID, moveOptions[0]);
      }
      updateType('path', moveOptions[0]);
      paintCell('path', moveOptions[0]);
      path.push(workingFieldArray[moveOptions[0] - 1]);
      // loop++;
    }
  }
  console.log(`DEBUG: final path array -> ${JSON.stringify(path, null, 2)}`);
  // console.log(
  //   `DEBUG: field array after path -> ${JSON.stringify(
  //     workingFieldArray,
  //     null,
  //     2
  //   )}`
  // );
  return path;
};

export { findPath };
