// Function to get an element position and rectangle.
module.exports = (elmt, maxDepth = 1000) => {
  let x = 0, y = 0, l, t, el = elmt;
  for (maxDepth = max(isNaN(maxDepth) && 0 || maxDepth, 0);
    maxDepth && el && !isNaN(l = el.offsetLeft) && !isNaN(t = el.offsetTop);
    --maxDepth,
    el = (el || {}).offsetParent
  ) {
    x += l - (el.scrollLeft || 0);
    y += t - (el.scrollTop || 0);
  }
  return {
    x,
    y,
    width: elmt.offsetWidth || 0,
    height: elmt.offsetHeight || 0
  };
};