const initButton = (id, triggeredMethod) => {
  const buttonEl = document.getElementById(id);

  buttonEl.addEventListener('click', () => {
    // This notation is a bit weird but wrapping the method in an anonymous function
    // allows us to pass down arguments without invoking it
    triggeredMethod();
  });
};

export { initButton };
