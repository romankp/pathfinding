// Basic 3x3 field with obstacle in the center.
// Start cell at top left, end at bottom right
const fieldArray = [
  {
    x: 1,
    y: 1,
    start: true,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 3,
    y: 1,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 2,
    y: 2,
    obstacle: true,
  },
  {
    x: 3,
    y: 2,
  },
  {
    x: 1,
    y: 3,
  },
  {
    x: 2,
    y: 3,
  },
  {
    x: 3,
    y: 3,
    end: true,
  },
];

const fieldEl = document.getElementById('field');

fieldArray.forEach(item => {
  const cell = document.createElement('li');
  cell.id = `${item.x}${item.y}`;
  cell.className = `${item.start ? ' start' : ''}${item.end ? ' end' : ''}${
    item.obstacle ? ' obstacle' : ''
  }`;
  fieldEl.append(cell);
});

fieldArray.forEach(
  cell => cell.start && console.log(JSON.stringify(cell, 4, null))
);

fieldArray.forEach(
  cell => cell.obstacle && console.log(JSON.stringify(cell, 4, null))
);

fieldArray.forEach(
  cell => cell.end && console.log(JSON.stringify(cell, 4, null))
);
