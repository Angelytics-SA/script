// Function to get an element position and rectangle.
module.exports = elmt => {
  let x = 0, y = 0, l, t, el = elmt;
  while (el && !isNaN(l = el.offsetLeft) && !isNaN(t = el.offsetTop)) {
    x += l - (el.scrollLeft || 0);
    y += t - (el.scrollTop || 0);
    el = el.offsetParent;
  }
  return {
    x,
    y,
    width: elmt.offsetWidth || 0,
    height: elmt.offsetHeight || 0
  };
};