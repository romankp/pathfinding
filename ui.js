const initUI = findPath => {
  const findButton = document.getElementById('find');

  findButton.addEventListener(
    'click',
    () => {
      console.log(findPath);
    },
    // Making this button only work once for now
    { once: true }
  );
};

export { initUI };