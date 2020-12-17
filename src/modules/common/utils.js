function _getHistoryKey() {
  const dt = new Date();
  const yr = dt.getFullYear();
  const month = dt.getMonth() + 1;
  return `${yr}-${month}`;
}

module.exports = { _getHistoryKey };
