const renderField = (fieldArray, fieldEl, dim) => {
  // Set css variable on field element
  fieldEl.style.setProperty('--dim-val', dim);

  // Remove all previously rendered li elements.
  // We take this shortcut because we're certain the child lis
  // have no attached event handlers
  fieldEl.innerHTML = '';

  fieldArray.forEach(({ id, type }) => {
    const cell = document.createElement('li');
    cell.id = `${id}`;
    cell.innerText = `${id}`;
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

export { renderField, paintCell };
