// Utility function to throttle a function call
// involved in an intensive process.
// Very useful for exmple with onmousemove and onscroll event.
module.exports = (cb, delay = 50, wait = false, queued = false) => delay > 0 && (
  (...args) => {
    if (wait) {
      queued = true;
      return;
    }

    cb(...args);
    wait = true;
    setTimeout(() => {
      queued && cb(...args);
      queued = wait = false;
    }, delay);
  }
) || cb;