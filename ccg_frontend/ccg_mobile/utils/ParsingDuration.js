export const formatDuration = (seconds) => {
  if (seconds <= 0) return "Now";

  const days = calculateDays(seconds);
  seconds = remainingSecondsAfterDays(seconds);

  const hours = calculateHours(seconds);
  seconds = remainingSecondsAfterHours(seconds);

  const minutes = calculateMinutes(seconds);

  const parts = [];
  addTimePart(parts, days, "day");
  addTimePart(parts, hours, "hour");
  addTimePart(parts, minutes, "minute");

  return parts.join(", ");
};

// Extracted methods for calculations
export const calculateDays = (seconds) => Math.floor(seconds / 86400);
export const remainingSecondsAfterDays = (seconds) => seconds % 86400;

export const calculateHours = (seconds) => Math.floor(seconds / 3600);
export const remainingSecondsAfterHours = (seconds) => seconds % 3600;

export const calculateMinutes = (seconds) => Math.floor(seconds / 60);

// Extracted method for adding parts
export const addTimePart = (parts, value, unit) => {
  if (value > 0) {
    parts.push(`${value} ${unit}${value !== 1 ? "s" : ""}`);
  }
};
