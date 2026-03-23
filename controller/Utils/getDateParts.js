const getDateParts = () => {
  const now = new Date();

  const day = now.toLocaleString("en-US", { weekday: "long" });
  const week = Math.ceil(
    ((now - new Date(now.getFullYear(), 0, 1)) / 86400000 +
      new Date(now.getFullYear(), 0, 1).getDay() + 1) /
      7
  );

  return {
    date: new Date(now.toDateString()), // removes time
    day,
    week,
    month: now.getMonth(),
    year: now.getFullYear(),
  };
};


module.exports = getDateParts;