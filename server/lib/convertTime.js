const convertTime = (number) => {
  if (number === 0) return "12:00 AM";
  if (number === 12) return "12:00 PM";
  let time = `${number % 12}:00`;

  if (number < 12) {
    return (time += " AM");
  } else {
    return (time += " PM");
  }
};

module.exports = { convertTime };
