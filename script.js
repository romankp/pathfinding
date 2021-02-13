const returnX = (dimVal, workingVal) => {
  if (workingVal % dimVal === 0) {
    return dimVal;
  }
  for (let i = dimVal - 1; i > 0; i--) {
    if (workingVal % i === 0) {
      x = i;
      i = 0;
      return x;
    }
  }
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
const obstacles = [7, 11];
const fieldArray = createFieldArray(4, obstacles);

// Some variables for the future
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

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

const latVal = 7;
const diagVal = 10;

// fieldArray.forEach(
//   cell => cell.start && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.obstacle && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.end && console.log(JSON.stringify(cell, 4, null))
// );
