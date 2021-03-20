const returnX = (dimVal, workingVal) => {
  const xRemainder = workingVal % dimVal;
  return xRemainder === 0 ? dimVal : xRemainder;
};

const returnY = (dimVal, workingVal) => {
  return Math.ceil(workingVal / dimVal);
};

// Returns distance of cell from target with a bit of rounding
const returnDistance = (dimVal, x, y) => {
  const yDist = dimVal - y;
  const xDist = dimVal - x;
  if (dimVal === x) {
    return yDist;
  }
  if (dimVal === y) {
    return xDist;
  }
  return Number(Math.round(Math.hypot(yDist, xDist) + 'e3') + 'e-3');
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
const latDim = 7;
const obstacles = [7, 12, 16, 17, 18, 24, 33, 34];
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

// Amend cell class name to add context color to rendered field
const paintCell = (type, id) => {
  const optionLI = document.getElementById(`${id}`);
  if (type === 'option' && optionLI.className === 'empty') {
    optionLI.className = 'empty considered';
  }
  if (type === 'path') {
    optionLI.className = 'empty path';
  }
  if (type === 'blocked') {
    optionLI.className = 'empty blocked';
  }
};

// Render field visual
renderField(fieldArray, fieldEl, latDim);
console.log(fieldArray);

// The fun stuff
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

// We know explicitely where the start and target cells for now
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

const updateFrom = (currentID, pathID) => {
  fieldArray[pathID - 1].from = currentID;
};

const updateType = (string, pathID) => {
  fieldArray[pathID - 1].type = string;
};

const findPath = (fieldArray, startCell, targetCell, latDim) => {
  const targetCellID = targetCell.id;
  let path = [startCell];
  let targetReached = false;

  while (!targetReached) {
    const currentID = path[path.length - 1].id;
    const moveOptions = filterOptionIDs(
      returnOptionIDsArray(currentID, latDim),
      fieldArray
    );

    console.log(moveOptions);
    markCheckedOptions(moveOptions, fieldArray);

    if (moveOptions.some(option => option === targetCellID)) {
      // If moveOptions contains the target ID, stop loop. We've made it!
      path.push(fieldArray[targetCellID - 1]);
      targetReached = true;
    } else if (moveOptions.length < 2 && currentID !== 1) {
      // Very specific dead end check for now, while the field is tight.
      // Basically we want to backtrack until we find an 'empty' coordinate type.
      // If we backtrack all the way to the start, we want to preserve it in the path array as the start.
      // This will only be viable while we know that the start coordinate is at the top left corner of the field

      // TODO: As the field becomes larger, this becomes less likely to happen
      // But the likelihood of having to double back or choose an option that has
      // a higher distance value (lower sort order) becomes more likely.
      // Need to create a solution here that removes exploratory steps that end up backtracking
      // when the path is not a blocked tunnel (has only 1 or 2 move options)
      console.log('Hit a dead end.');
      updateFrom(currentID, moveOptions[0]);
      updateType('blocked', currentID);
      paintCell('blocked', currentID);
      // Remove current coord from path array
      path.pop();
    } else {
      // Sort move options by distance from target, with the shortest option at the start
      moveOptions.sort(
        (a, b) =>
          fieldArray[a - 1].targetDistance - fieldArray[b - 1].targetDistance
      );
      console.log(`After sort --> ${moveOptions}`);
      updateFrom(currentID, moveOptions[0]);
      updateType('path', moveOptions[0]);
      paintCell('path', moveOptions[0]);
      path.push(fieldArray[moveOptions[0] - 1]);
    }
  }
  return path;
};

console.log(findPath(fieldArray, startCell, targetCell, latDim));
