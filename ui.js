const initButton = (id, triggeredMethod) => {
  const buttonEl = document.getElementById(id);

  buttonEl.addEventListener(
    'click',
    () => {
      // This notation is a bit weird but we've basically passed findPath()
      // with arguments, wrapped in an anonymous function, so that it's invoked here.
      triggeredMethod();
    },
    // Making this button only work once for now
    { once: id === 'find' ? true : false }
  );
};

export { initButton };
