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
const obstacles = [7, 11];
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
const latVal = 1;
const diagVal = Math.hypot(latVal, latVal);

const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

console.log(`Start --> ${JSON.stringify(startCell, null, 2)}`);
console.log(`Target --> ${JSON.stringify(targetCell, null, 2)}`);

// For the initial solution, we're assuming the start is top-left and target is bottom-right.
// We're also assuming that the current field has no dead ends, for now!
const returnMoveOptions = (startPos, dimVal) => {
  const optionsArray = [];
  if (startPos - dimVal - 1 >= 0) {
    optionsArray.push(startPos - dimVal - 1);
  }
  if (startPos - dimVal >= 0) {
    optionsArray.push(startPos - dimVal);
  }
  if (startPos - dimVal + 1 >= 0) {
    optionsArray.push(startPos - dimVal + 1);
  }
  if (startPos - 1 >= 0) {
    optionsArray.push(startPos - 1);
  }
  if (startPos + 1 >= 0) {
    optionsArray.push(startPos + 1);
  }
  if (startPos + dimVal - 1 >= 0) {
    optionsArray.push(startPos + dimVal - 1);
  }
  if (startPos + dimVal >= 0) {
    optionsArray.push(startPos + dimVal);
  }
  if (startPos + dimVal + 1 >= 0) {
    optionsArray.push(startPos + dimVal + 1);
  }
  return optionsArray;
};

const bulldozeThroughField = (fieldArray, startCell, latDim) => {
  const { id } = startCell;
  const startPos = id - 1;
  const moveOptions = returnMoveOptions(startPos, latDim);
  console.log(moveOptions);
};

bulldozeThroughField(fieldArray, startCell, latDim);

// fieldArray.forEach(
//   cell => cell.start && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.obstacle && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.end && console.log(JSON.stringify(cell, 4, null))
// );
