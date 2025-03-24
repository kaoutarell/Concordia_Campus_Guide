import { formatDuration } from "../utils/formatDuration";

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
