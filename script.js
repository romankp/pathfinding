const returnX = (dimVal, workingVal) => {
  const xRemainder = workingVal % dimVal;
  return xRemainder === 0 ? dimVal : xRemainder;
};

const returnY = (dimVal, workingVal) => {
  return Math.ceil(workingVal / dimVal);
};

// Returns distance of cell from target
const returnDistance = (dimVal, x, y) => {
  const yDist = dimVal - y;
  const xDist = dimVal - x;
  if (dimVal === x) {
    return yDist;
  }
  if (dimVal === y) {
    return xDist;
  }
  return Math.hypot(yDist, xDist);
};

const returnCoordObj = (i, dimVal, type) => {
  const x = returnX(dimVal, i);
  const y = returnY(dimVal, i);
  return {
    id: i,
    x: x,
    y: y,
    targetDistance: returnDistance(dimVal, x, y),
    type: type,
    checked: false,
    from: null,
  };
};

const createFieldArray = (dimVal, obstacles) => {
  const arrayLength = dimVal ** 2;
  const finalArray = [];
  for (let i = 1; i <= arrayLength; i++) {
    if (i === 1) {
      finalArray.push(returnCoordObj(i, dimVal, 'start'));
    } else if (i === arrayLength) {
      finalArray.push(returnCoordObj(i, dimVal, 'target'));
    } else if (obstacles.some(pos => pos === i)) {
      finalArray.push(returnCoordObj(i, dimVal, 'obstacle'));
    } else {
      finalArray.push(returnCoordObj(i, dimVal, 'empty'));
    }
  }
  return finalArray;
};

// Describe obstacle positions and construct field array
const latDim = 5;
// const obstacles = [7, 11, 18, 24];
// Temporary obstacles with a dead-end
const obstacles = [7, 12, 17, 18, 24];
const fieldArray = createFieldArray(latDim, obstacles);

// Render field
const fieldEl = document.getElementById('field');

const renderField = (fieldArray, fieldEl, dim) => {
  const gridRepeat = `repeat(${dim}, auto)`;
  let elStyle = fieldEl.style;
  elStyle.gridTemplateColumns = gridRepeat;
  elStyle.gridTemplateRows = gridRepeat;
  fieldArray.forEach(({ id, type }) => {
    const cell = document.createElement('li');
    cell.id = `${id}`;
    cell.className = `${type}`;
    fieldEl.append(cell);
  });
};

const paintCell = (id, type) => {
  const optionLI = document.getElementById(`${id}`);
  if (type === 'option' && optionLI.className === 'empty') {
    optionLI.className = 'empty considered';
  }
  if (type === 'path') {
    optionLI.className = 'empty path';
  }
};

renderField(fieldArray, fieldEl, latDim);
console.log(fieldArray);

// The fun stuff
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

// We're assuming that the current field has no dead ends, for now!
// We also know explicitely where the start and target cells
// are on the fied and their meta-data.

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
    const { type, checked } = fieldArray[id - 1];
    return type === 'empty' || type === 'target' ? true : false;
  });
  console.log(filteredOptions);
  return filteredOptions;
};

const findPath = (fieldArray, startCell, targetCell, latDim) => {
  const targetCellID = targetCell.id;
  let path = [startCell];
  let targetReached = false;
  while (!targetReached) {
    const moveOptions = filterOptionIDs(
      returnOptionIDsArray(path[path.length - 1].id, latDim),
      fieldArray
    );
    // Mark field array option entries as checked
    // and paint rendered option cells after they are filtered.
    // TODO: Pull this out into separate method
    moveOptions.forEach(id => {
      fieldArray[id - 1].checked = true;
      paintCell(id, 'option');
    });
    // If moveOptions contains the target ID, stop loop
    if (moveOptions.some(option => option === targetCellID)) {
      path.push(fieldArray[targetCellID - 1]);
      targetReached = true;
    } else {
      // Sort move options by distance from target, with the shortest option at the start
      moveOptions.sort(
        (a, b) => fieldArray[a].targetDistance - fieldArray[b].targetDistance
      );
      // TODO: Check if no options, need to start building out a way to retreat from a dead end
      paintCell(moveOptions[0], 'path');
      path.push(fieldArray[moveOptions[0] - 1]);
    }
  }
  return path;
};

console.log(findPath(fieldArray, startCell, targetCell, latDim));
