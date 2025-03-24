import { 
  formatDuration,
  calculateDays,
  remainingSecondsAfterDays,
  calculateHours,
  remainingSecondsAfterHours,
  calculateMinutes,
  addTimePart,
} from "../utils/ParsingDuration";

describe("formatDuration", () => {
  it("should return 'Now' for 0 seconds", () => {
    expect(formatDuration(0)).toBe("Now");
  });

  it("should return 'Now' for negative seconds", () => {
    expect(formatDuration(-5)).toBe("Now");
  });

  it("should correctly format seconds into minutes", () => {
    expect(formatDuration(60)).toBe("1 minute");
    expect(formatDuration(120)).toBe("2 minutes");
    expect(formatDuration(3599)).toBe("59 minutes");
  });

  it("should correctly format seconds into hours and minutes", () => {
    expect(formatDuration(3600)).toBe("1 hour");
    expect(formatDuration(3660)).toBe("1 hour, 1 minute");
    expect(formatDuration(7320)).toBe("2 hours, 2 minutes");
  });

  it("should correctly format seconds into days, hours, and minutes", () => {
    expect(formatDuration(86400)).toBe("1 day");
    expect(formatDuration(90000)).toBe("1 day, 1 hour");
    expect(formatDuration(172800)).toBe("2 days");
    expect(formatDuration(180000)).toBe("2 days, 2 hours");
  });
});

describe("Utility Methods", () => {
  it("should calculate days correctly", () => {
    expect(calculateDays(86400)).toBe(1);
    expect(calculateDays(172800)).toBe(2);
    expect(calculateDays(90000)).toBe(1);
  });

  it("should calculate remaining seconds after days correctly", () => {
    expect(remainingSecondsAfterDays(90000)).toBe(3600);
    expect(remainingSecondsAfterDays(172800)).toBe(0);
    expect(remainingSecondsAfterDays(180000)).toBe(7200);
  });

  it("should calculate hours correctly", () => {
    expect(calculateHours(3600)).toBe(1);
    expect(calculateHours(7320)).toBe(2);
    expect(calculateHours(7200)).toBe(2);
  });

  it("should calculate remaining seconds after hours correctly", () => {
    expect(remainingSecondsAfterHours(3660)).toBe(60);
    expect(remainingSecondsAfterHours(7320)).toBe(120);
    expect(remainingSecondsAfterHours(7200)).toBe(0);
  });

  it("should calculate minutes correctly", () => {
    expect(calculateMinutes(60)).toBe(1);
    expect(calculateMinutes(120)).toBe(2);
    expect(calculateMinutes(3599)).toBe(59);
  });

  it("should add time parts correctly", () => {
    const parts = [];
    addTimePart(parts, 1, "day");
    addTimePart(parts, 2, "hour");
    addTimePart(parts, 0, "minute"); // Should not add anything

    expect(parts).toEqual(["1 day", "2 hours"]);
  });

  it("should handle singular and plural units correctly in addTimePart", () => {
    const parts = [];
    addTimePart(parts, 1, "hour");
    addTimePart(parts, 2, "minute");
    expect(parts).toEqual(["1 hour", "2 minutes"]);
  });
});
