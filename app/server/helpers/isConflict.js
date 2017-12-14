module.exports = (dates1, dates2) => {
  const tracker = {};

  dates1.forEach((date) => {
    tracker[date.id] = true;
  });
  for (let i = 0; i < dates2.length; i += 1) {
    if (tracker[dates2[i].date_id]) return true;
  }
  return false;
};
