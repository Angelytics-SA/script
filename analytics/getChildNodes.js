module.exports = node => (
  node && (
    node.assignedNodes && node.assignedNodes()
    || node.childNodes
    || node.addedNodes
  ) || []
);