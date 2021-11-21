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
  return optionsArray.filter(id => {
    // We consider 'path' and 'start' types a viable option to be able to backtrack out of a dead end
    const viableTypes = ['empty', 'path', 'start', 'target'];
    const { type } = fieldArray[id - 1];
    return viableTypes.includes(type) ? true : false;
  });
};

const markConsideredOptions = (optionIDs, fieldArray) => {
  optionIDs.forEach(id => {
    fieldArray[id - 1].checked = true;
    if (fieldArray[id - 1].type !== 'start') {
      paintCell('option', id);
    }
  });
};

const updateFrom = (currentID, pathID) => {
  workingFieldArray[pathID - 1].from.push(currentID);
};

const updateType = (string, pathID) => {
  workingFieldArray[pathID - 1].type = string;
};

const sortAscending = (arrayToSort, fieldArray) => {
  return arrayToSort.sort(
    (a, b) =>
      fieldArray[a - 1].targetDistance - fieldArray[b - 1].targetDistance
  );
};

const checkFork = (moveOptions, latDim, workingFieldArray) => {
  console.log(
    `Fork detected, deciding between --> ${moveOptions[0]} and ${moveOptions[1]}`
  );

  // Find the best move option from the 2 highest weighted coordinates
  // by looking at each of their options
  const optionA = sortAscending(
    filterOptionIDs(
      returnOptionIDsArray(moveOptions[0], latDim),
      workingFieldArray
    ),
    workingFieldArray
  )[0];

  const optionB = sortAscending(
    filterOptionIDs(
      returnOptionIDsArray(moveOptions[1], latDim),
      workingFieldArray
    ),
    workingFieldArray
  )[0];

  // If Math.sign is positive, we consider it "B" weighted.
  // As in, option A (index 0) is further from the target than B (index 1).

  // For the moment, if both future options are also identical
  // (Math.sign returns 0), we're just going with the first option.
  // In the future, we want to randomize or check one step further.
  const bWeighted =
    Math.sign(
      workingFieldArray[optionA - 1].targetDistance -
        workingFieldArray[optionB - 1].targetDistance
    ) === 1;

  return bWeighted ? moveOptions[1] : moveOptions[0];
};

const findPath = (fieldArray, startCell, targetCell, latDim, found) => {
  if (found) {
    return;
  }

  const targetCellID = targetCell.id;
  let path = [startCell];
  let targetReached = false;
  let loopCount = 0;
  const loopLimit = latDim ** 2;
  workingFieldArray = fieldArray;

  while (!targetReached && loopCount < loopLimit) {
    const currentID = path[path.length - 1].id;
    let moveOptions = filterOptionIDs(
      returnOptionIDsArray(currentID, latDim),
      workingFieldArray
    );

    if (moveOptions.length === 0) {
      console.log(
        'No move options. Target coordinate was not reached. Final path array:'
      );
      console.log(JSON.stringify(path, null, 2));
      console.log(`Final loop count -> ${loopCount}`);
      return;
    }

    console.log(
      `Current ID --> ${currentID}. Move options before sort -> ${moveOptions}`
    );
    markConsideredOptions(moveOptions, workingFieldArray);

    if (moveOptions.some(option => option === targetCellID)) {
      // If moveOptions contains the target ID, stop loop. We've made it!
      path.push(workingFieldArray[targetCellID - 1]);
      targetReached = true;
    } else {
      // Sort move options by distance from target, with the shortest option at the start
      moveOptions = sortAscending(moveOptions, workingFieldArray);
      console.log(
        `Current ID --> ${currentID}. Sorted options --> ${moveOptions}`
      );

      // If there are only 2 sorted cell options
      // or the 2 best options' target distance is identical,
      // we want to weigh future paths radiating from them
      // so that we don't just arbitrarily pick the first option.
      const forkConditions =
        moveOptions.length === 2 ||
        (moveOptions.length > 1 &&
          workingFieldArray[moveOptions[0] - 1].targetDistance ===
            workingFieldArray[moveOptions[1] - 1].targetDistance);

      if (forkConditions) {
        moveOptions[0] = checkFork(moveOptions, latDim, workingFieldArray);
      }

      // If the best move option after a regular sort is to backtrack to the last path coordinate,
      // we consider the current coordinate blocked and check to see if adjusting the 'path' option weight
      // will allow us to move around an obstacle.
      if (workingFieldArray[moveOptions[0] - 1].type === 'path') {
        console.log(
          `${moveOptions[0]} is an existing path coord, checking against option ${moveOptions[1]}`
        );
        // In some obstacle formations (like a horizontal line where we want the path to hop backwards, around a 'corner'),
        // an existing path coordinate may have the smallest targetDistance but may not be the best option.
        // So we check if the division of the top 2 options' targetDistance value is within a small threshhold.
        // If it is, we sort the second option (non-path) to the front of the list.
        if (
          moveOptions.length > 1 &&
          workingFieldArray[moveOptions[0] - 1].targetDistance /
            workingFieldArray[moveOptions[1] - 1].targetDistance >=
            0.824
        ) {
          moveOptions[0] = moveOptions[1];
        } else {
          // If the best option is still the existing path coord,
          // mark the current coord as 'blocked'
          if (startCell.id !== currentID) {
            updateType('blocked', currentID);
            paintCell('blocked', currentID);
          }
          // We might change this in the future but we want to get rid of the last 2 path items in the array.
          // In a deadend field, the current cell can move back and forth,
          // attempting to find a possible exit from a "central" coord.
          // Removing the last 2 entries here cleans up the path array at the end
          path.splice(-2, 2);
        }
      }

      updateFrom(currentID, moveOptions[0]);
      // If the move option is the start cell, we want to leave the type and paint job as is
      if (startCell.id !== moveOptions[0]) {
        updateType('path', moveOptions[0]);
        paintCell('path', moveOptions[0]);
      }
      path.push(workingFieldArray[moveOptions[0] - 1]);
      loopCount++;
    }
  }
  console.log(`Final path array -> ${JSON.stringify(path, null, 2)}`);
  if (loopCount === loopLimit) {
    console.warn(
      `Loop limit reached without resolution -> ${loopCount}. Pathfinding stopped`
    );
  } else {
    console.log(`Final loop count -> ${loopCount}`);
  }
  return path;
};

export { findPath };
