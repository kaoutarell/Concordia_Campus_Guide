export const formatDuration = (seconds) => {
  if (seconds <= 0) return "Now";

  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);

  const parts = [];
  addTimePart(parts, days, "day");
  addTimePart(parts, hours, "hour");
  addTimePart(parts, minutes, "minute");

  return parts.join(", ");
};

const addTimePart = (parts, value, unit) => {
  if (value > 0) {
    parts.push(`${value} ${unit}${value !== 1 ? "s" : ""}`);
  }
};
