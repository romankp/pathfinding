const fieldEl = document.getElementById('field');

// Basic 3x3 field with obstacle in the center.
// Start cell at top left, end at bottom right
const fieldArray = [
  {
    x: 1,
    y: 1,
    type: 'start',
  },
  {
    x: 2,
    y: 1,
    type: 'empty',
  },
  {
    x: 3,
    y: 1,
    type: 'empty',
  },
  {
    x: 1,
    y: 2,
    type: 'empty',
  },
  {
    x: 2,
    y: 2,
    type: 'obstacle',
  },
  {
    x: 3,
    y: 2,
    type: 'empty',
  },
  {
    x: 1,
    y: 3,
    type: 'empty',
  },
  {
    x: 2,
    y: 3,
    type: 'empty',
  },
  {
    x: 3,
    y: 3,
    type: 'target',
  },
];

// Some variables for the future
const startCell = fieldArray.find(({ type }) => type === 'start');
const targetCell = fieldArray.find(({ type }) => type === 'target');

// For now, with the small initial field, we already know the size and boundaries, so we don't have to go wild

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
