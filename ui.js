const initUI = triggeredMethod => {
  const findButton = document.getElementById('find');

  findButton.addEventListener(
    'click',
    () => {
      // This notation is a bit weird but we've basically passed findPath()
      // with arguments, wrapped in an anonymous function, so that it's invoked here. 
      console.log(triggeredMethod());
    },
    // Making this button only work once for now
    { once: true }
  );
};

export { initUI };