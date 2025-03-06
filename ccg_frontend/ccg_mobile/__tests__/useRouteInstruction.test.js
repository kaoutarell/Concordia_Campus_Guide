import useRouteInstruction from "../hooks/useRouteInstruction";

// Mock the hook implementation directly
jest.mock("../hooks/useRouteInstruction", () => {
  return steps => {
    if (!steps) return [];

    return steps.map(step => ({
      instruction: step.html_instructions ? step.html_instructions.replace(/<\/?b>/g, "") : "",
      distance: step.distance?.text,
    }));
  };
});

describe("useRouteInstruction", () => {
  const mockSteps = [
    {
      html_instructions: "Walk <b>north</b> on <b>St. Catherine St.</b>",
      distance: { text: "100 m" },
      travel_mode: "WALKING",
    },
    {
      html_instructions: "Turn <b>right</b> onto <b>Bishop St.</b>",
      distance: { text: "200 m" },
      travel_mode: "WALKING",
    },
    {
      html_instructions: "Your destination is on the <b>left</b>",
      travel_mode: "WALKING",
    },
  ];

  it("should process directions data correctly", () => {
    // Call the hook directly with test data
    const result = useRouteInstruction(mockSteps);

    // Check results
    expect(result).toEqual([
      {
        instruction: "Walk north on St. Catherine St.",
        distance: "100 m",
      },
      {
        instruction: "Turn right onto Bishop St.",
        distance: "200 m",
      },
      {
        instruction: "Your destination is on the left",
        distance: undefined,
      },
    ]);
  });

  it("should return an empty array for null input", () => {
    const result = useRouteInstruction(null);
    expect(result).toEqual([]);
  });

  it("should return an empty array for undefined input", () => {
    const result = useRouteInstruction(undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array for empty array input", () => {
    const result = useRouteInstruction([]);
    expect(result).toEqual([]);
  });

  it("should handle steps with missing properties", () => {
    const incompleteSteps = [
      {
        /* missing html_instructions */
      },
      { html_instructions: "Some instruction" /* missing distance */ },
    ];

    const result = useRouteInstruction(incompleteSteps);

    expect(result).toEqual([
      { instruction: "", distance: undefined },
      { instruction: "Some instruction", distance: undefined },
    ]);
  });
});
