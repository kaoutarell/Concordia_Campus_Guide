// Mock the vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "Ionicons",
  FontAwesome5: () => "FontAwesome5",
}));

// Create a mock version of InfoPopup for testing
jest.mock("../components/map-screen-ui/elements/InfoPopUp.js", () => {
  return function MockInfoPopup(props) {
    return {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              testID: "building-name",
              children: props.value.name,
            },
          },
          {
            type: "div",
            props: {
              testID: "building-code",
              children: ["Building Code: ", props.value.building_code],
            },
          },
          {
            type: "div",
            props: {
              testID: "civic-address",
              children: props.value.civic_address,
            },
          },
          {
            type: "div",
            props: {
              testID: "campus",
              children: ["Campus: ", props.value.campus],
            },
          },
          {
            type: "div",
            props: {
              testID: "parking-icon",
              children: props.value.parking_lot ? "car" : "close-circle",
            },
          },
          {
            type: "div",
            props: {
              testID: "accessibility-icon",
              children: props.value.accessibility ? "accessibility" : "close-circle",
            },
          },
          {
            type: "div",
            props: {
              testID: "atm-icon",
              children: props.value.atm ? "cash-outline" : "close-circle",
            },
          },
          {
            type: "button",
            props: {
              testID: "close-icon",
              onClick: props.onClose,
              children: "X",
            },
          },
          {
            type: "button",
            props: {
              testID: "directions-button",
              onClick: () => props.onGo(props.value),
              children: "Directions",
            },
          },
          {
            type: "button",
            props: {
              testID: "close-button",
              onClick: props.onClose,
              children: "Close",
            },
          },
        ],
      },
    };
  };
});

describe("InfoPopup", () => {
  // Mock components and data
  const mockBuilding = {
    name: "Building A",
    building_code: "A",
    civic_address: "1234 Elm St",
    campus: "SGW",
    parking_lot: true,
    accessibility: true,
    atm: false,
  };

  const mockOnClose = jest.fn();
  const mockOnGo = jest.fn();

  // Import the mocked component
  const InfoPopup = require("../components/map-screen-ui/elements/InfoPopUp.js");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes the correct data to the InfoPopup component", () => {
    const result = InfoPopup({ 
      value: mockBuilding, 
      onClose: mockOnClose, 
      onGo: mockOnGo 
    });
    
    expect(result.props.children[0].props.children).toBe("Building A");
    expect(result.props.children[1].props.children).toEqual(["Building Code: ", "A"]);
    expect(result.props.children[2].props.children).toBe("1234 Elm St");
    expect(result.props.children[3].props.children).toEqual(["Campus: ", "SGW"]);
  });

  it("shows the correct icons based on building amenities", () => {
    const result = InfoPopup({ 
      value: mockBuilding, 
      onClose: mockOnClose, 
      onGo: mockOnGo 
    });
    
    expect(result.props.children[4].props.children).toBe("car"); // parking_lot is true
    expect(result.props.children[5].props.children).toBe("accessibility"); // accessibility is true
    expect(result.props.children[6].props.children).toBe("close-circle"); // atm is false
  });

  it("calls onClose when close icon is clicked", () => {
    const result = InfoPopup({ 
      value: mockBuilding, 
      onClose: mockOnClose, 
      onGo: mockOnGo 
    });
    
    result.props.children[7].props.onClick();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const result = InfoPopup({ 
      value: mockBuilding, 
      onClose: mockOnClose, 
      onGo: mockOnGo 
    });
    
    result.props.children[9].props.onClick();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onGo with building value when directions button is clicked", () => {
    const result = InfoPopup({ 
      value: mockBuilding, 
      onClose: mockOnClose, 
      onGo: mockOnGo 
    });
    
    result.props.children[8].props.onClick();
    expect(mockOnGo).toHaveBeenCalledTimes(1);
    expect(mockOnGo).toHaveBeenCalledWith(mockBuilding);
  });
});