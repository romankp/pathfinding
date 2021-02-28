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
const latDim = 4;
const obstacles = [5, 7, 11];
const fieldArray = createFieldArray(latDim, obstacles);

// For now, with the small initial field, we already know the size and boundaries, so we don't have to go wild
const fieldEl = document.getElementById('field');

const renderField = fieldArray => {
  fieldArray.forEach(({ x, y, type }) => {
    const cell = document.createElement('li');
    cell.id = `${x}${y}`;
    cell.className = `${type === 'start' ? ' start' : ''}${
      type === 'target' ? ' target' : ''
    }${type === 'obstacle' ? ' obstacle' : ''}`;
    fieldEl.append(cell);
  });
};

renderField(fieldArray);
console.log(fieldArray);

// The fun stuff
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

// console.log(`Start --> ${JSON.stringify(startCell, null, 2)}`);
// console.log(`Target --> ${JSON.stringify(targetCell, null, 2)}`);

// We're also assuming that the current field has no dead ends, for now!

// I'm avoiding a flood check of every field array item to return the ids 
// for available moves from the "central" position

// TODO: Better left and right edge filtering
const returnOptionIDsArray = (centerID, dimVal) => {
  const idArray = [];
  const idCap = dimVal*dimVal;
  // Remainder addresses position ID being checked along the left edge of the field
  // Top 3 options
  if (centerID - dimVal - 1 > 0) {
    idArray.push(centerID - dimVal - 1);
  }
  if (centerID - dimVal > 0) {
    idArray.push(centerID - dimVal);
  }
  if (centerID - dimVal + 1 > 0) {
    idArray.push(centerID - dimVal + 1);
  }
  // Left and right of the position ID
  if ((centerID - 1) % dimVal !== 0 && centerID - 1 > 0) {
    idArray.push(centerID - 1);
  }
  if (centerID + 1 <= idCap) {
    idArray.push(centerID + 1);
  }
  // Bottom 3 options
  if ((centerID + dimVal - 1) % dimVal !== 0 && centerID + dimVal - 1 < idCap) {
    idArray.push(centerID + dimVal - 1);
  }
  if (centerID + dimVal < idCap) {
    idArray.push(centerID + dimVal);
  }
  if (centerID + dimVal + 1 < idCap) {
    idArray.push(centerID + dimVal + 1);
  }
  return idArray;
};

console.log(returnOptionIDsArray(1, 4));
console.log(returnOptionIDsArray(5, 4));
console.log(returnOptionIDsArray(4, 4));
console.log(returnOptionIDsArray(6, 4));

// Check that each field coordinate represented by the initial array of options
// is within horizontal and vertical ranges of process cell
const filterOptionIDs = (idArray, fieldArray, processX, processY) => {
  const filteredArray = idArray.filter(id => {
    const { x, y } = fieldArray[id - 1];
    const withinXRange = x >= processX - 1 && x <= processX + 1;
    const withinYRange = y >= processY - 1 && y <= processY + 1;
    return withinXRange && withinYRange ? true : false;
  });
  return filteredArray;
};

const bulldozeThroughField = (fieldArray, startCell, latDim) => {
  const { id, x, y } = startCell;
  // const startPos = id - 1;
  const path = [startCell];
  let targetReached = false;
  let testingLimit = 0;
  while (!targetReached) {
    console.log(path[path.length - 1].id);
    const moveOptions = filterOptionIDs(
      // We want the id of the last item of the path array
      // so we can find its position in the array
      returnOptionIDsArray(path[path.length - 1].id, latDim),
      fieldArray,
      x,
      y
    );
    console.log(moveOptions);
    moveOptions.sort(
      (a, b) => fieldArray[a].targetDistance - fieldArray[b].targetDistance
    );
    if (moveOptions[0].type === 'target' || testingLimit >= 10) {
      targetReached = true;
    } else {
      path.push(fieldArray[moveOptions[0] - 1]);
      testingLimit++;
    }
  }
  console.log(path);
};

// bulldozeThroughField(fieldArray, startCell, latDim);

// fieldArray.forEach(
//   cell => cell.start && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.obstacle && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.end && console.log(JSON.stringify(cell, 4, null))
// );
