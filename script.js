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

const createFieldArray = (dimVal, obstacles) => {
  const arrayLength = dimVal ** 2;
  const finalArray = [];
  for (let i = 1; i <= arrayLength; i++) {
    if (i === 1) {
      finalArray.push({
        id: i,
        x: returnX(dimVal, i),
        y: returnY(dimVal, i),
        type: 'start',
      });
    } else if (i === arrayLength) {
      finalArray.push({
        id: i,
        x: returnX(dimVal, i),
        y: returnY(dimVal, i),
        type: 'target',
      });
    } else if (obstacles.some(pos => pos === i)) {
      finalArray.push({
        id: i,
        x: returnX(dimVal, i),
        y: returnY(dimVal, i),
        type: 'obstacle',
      });
    } else {
      finalArray.push({
        id: i,
        x: returnX(dimVal, i),
        y: returnY(dimVal, i),
        type: 'empty',
      });
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

// fieldArray.forEach(
//   cell => cell.start && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.obstacle && console.log(JSON.stringify(cell, 4, null))
// );

// fieldArray.forEach(
//   cell => cell.end && console.log(JSON.stringify(cell, 4, null))
// );
