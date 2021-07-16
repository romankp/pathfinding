const initUI = (fieldArray, startCell, targetCell, latDim, findPath) => {
  const findButton = document.getElementById('find');

  findButton.addEventListener(
    'click',
    () => {
      console.log(findPath(fieldArray, startCell, targetCell, latDim));
    },
    // Making this button only work once for now
    { once: true }
  );
};

export { initUI };