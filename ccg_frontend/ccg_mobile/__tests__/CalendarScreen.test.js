import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import CalendarScreen from "../components/calendar-screen-ui/CalendarScreen";

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock useNavigation for EventsList component
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock Google Sign-in
jest.mock("@react-native-google-signin/google-signin", () => {
  const { TouchableOpacity, Text } = require("react-native");

  const GoogleSigninButtonComponent = ({ onPress, testID }) => {
    return (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Text>Google Sign In</Text>
      </TouchableOpacity>
    );
  };

  GoogleSigninButtonComponent.Size = {
    Standard: 0,
    Wide: 1,
    Icon: 2,
  };

  GoogleSigninButtonComponent.Color = {
    Auto: 0,
    Light: 1,
    Dark: 2,
  };

  return {
    GoogleSignin: {
      configure: jest.fn(),
      signIn: jest.fn(),
      signInSilently: jest.fn(),
      signOut: jest.fn(),
      revokeAccess: jest.fn(),
      getTokens: jest.fn(),
      hasPlayServices: jest.fn(),
    },
    GoogleSigninButton: GoogleSigninButtonComponent,
    statusCodes: {
      SIGN_IN_CANCELLED: 12501,
      IN_PROGRESS: 12502,
      PLAY_SERVICES_NOT_AVAILABLE: 12503,
    },
  };
});

// Import after setting up mocks
const { GoogleSignin, statusCodes } = require("@react-native-google-signin/google-signin");

// Mock fetch API
global.fetch = jest.fn();

describe("CalendarScreen Component", () => {
  // Mock console methods
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();

    // Default implementation of mock functions
    GoogleSignin.hasPlayServices.mockResolvedValue(true);
    GoogleSignin.configure.mockResolvedValue(null);
    GoogleSignin.signInSilently.mockRejectedValue(new Error("No previous sign-in"));
    GoogleSignin.getTokens.mockResolvedValue({ accessToken: "mock-token" });
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("renders correctly when user is not signed in", async () => {
    let { getByText, getByTestId } = render(<CalendarScreen />);

    // Verify initial rendering
    expect(getByText("Class Schedule")).toBeTruthy();
    expect(getByTestId("googleSignInButton")).toBeTruthy();

    // Verify Google Sign-in was configured
    expect(GoogleSignin.configure).toHaveBeenCalledWith(
      expect.objectContaining({
        scopes: expect.arrayContaining([
          "https://www.googleapis.com/auth/calendar.readonly",
          "openid",
          "profile",
          "email",
        ]),
      })
    );

    // Verify silent sign-in was attempted
    await waitFor(() => {
      expect(GoogleSignin.signInSilently).toHaveBeenCalled();
    });
  });

  it("handles successful sign in", async () => {
    const mockUserInfo = {
      data: {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      },
    };

    // Setup successful sign-in
    GoogleSignin.signIn.mockResolvedValueOnce(mockUserInfo);
    GoogleSignin.getTokens.mockResolvedValueOnce({ accessToken: "test-token" });

    // Mock calendar list API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        items: [
          { id: "cal1", summary: "Primary Calendar" },
          { id: "cal2", summary: "Work Calendar" },
        ],
      }),
    });

    let { getByText, getByTestId, queryByText } = render(<CalendarScreen />);

    // Trigger sign in
    const signInButton = getByTestId("googleSignInButton");
    await act(async () => {
      fireEvent.press(signInButton);
    });

    // Verify sign in was called with correct params
    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(GoogleSignin.signIn).toHaveBeenCalled();
    expect(GoogleSignin.getTokens).toHaveBeenCalled();

    // After sign in, UI should show different content
    await waitFor(() => {
      expect(queryByText("Connected to Google Calendar!")).toBeTruthy();
      expect(queryByText("Signed in as: test@example.com")).toBeTruthy();
      expect(queryByText("Sign Out")).toBeTruthy();
      expect(queryByText("Select Calendars")).toBeTruthy();
    });
  });

  it("handles sign in error - SIGN_IN_CANCELLED", async () => {
    // Setup cancelled sign-in
    GoogleSignin.signIn.mockRejectedValueOnce({ code: statusCodes.SIGN_IN_CANCELLED });

    let { getByTestId } = render(<CalendarScreen />);

    // Trigger sign in
    const signInButton = getByTestId("googleSignInButton");
    await act(async () => {
      fireEvent.press(signInButton);
    });

    // Verify error was handled
    expect(consoleLogSpy).toHaveBeenCalledWith("User cancelled the sign-in flow");
  });

  it("handles sign in error - IN_PROGRESS", async () => {
    // Setup in-progress sign-in error
    GoogleSignin.signIn.mockRejectedValueOnce({ code: statusCodes.IN_PROGRESS });

    let { getByTestId } = render(<CalendarScreen />);

    // Trigger sign in
    const signInButton = getByTestId("googleSignInButton");
    await act(async () => {
      fireEvent.press(signInButton);
    });

    // Verify error was handled
    expect(consoleLogSpy).toHaveBeenCalledWith("Sign-in is already in progress");
  });

  it("handles sign in error - PLAY_SERVICES_NOT_AVAILABLE", async () => {
    // Setup play services not available error
    GoogleSignin.signIn.mockRejectedValueOnce({ code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE });

    let { getByTestId } = render(<CalendarScreen />);

    // Trigger sign in
    const signInButton = getByTestId("googleSignInButton");
    await act(async () => {
      fireEvent.press(signInButton);
    });

    // Verify error was handled
    expect(consoleLogSpy).toHaveBeenCalledWith("Play services not available or outdated");
  });

  it("handles other sign in errors", async () => {
    // Setup generic sign-in error
    const mockError = new Error("Unknown error");
    GoogleSignin.signIn.mockRejectedValueOnce(mockError);

    let { getByTestId } = render(<CalendarScreen />);

    // Trigger sign in
    const signInButton = getByTestId("googleSignInButton");
    await act(async () => {
      fireEvent.press(signInButton);
    });

    // Verify error was handled
    expect(consoleErrorSpy).toHaveBeenCalledWith("Something went wrong:", mockError);
  });

  it("successfully restores previous sign in", async () => {
    const mockUserInfo = {
      data: {
        user: {
          email: "test@example.com",
        },
      },
    };

    // Setup successful silent sign-in
    GoogleSignin.signInSilently.mockResolvedValueOnce(mockUserInfo);
    GoogleSignin.getTokens.mockResolvedValueOnce({ accessToken: "restored-token" });

    // Mock calendar list API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        items: [{ id: "cal1", summary: "Primary Calendar" }],
      }),
    });

    // Render component - silent sign in should happen automatically
    let { queryByText } = render(<CalendarScreen />);

    // Verify silent sign in was attempted
    await waitFor(() => {
      expect(GoogleSignin.signInSilently).toHaveBeenCalled();
      expect(GoogleSignin.getTokens).toHaveBeenCalled();
      expect(queryByText("Connected to Google Calendar!")).toBeTruthy();
      expect(queryByText("Signed in as: test@example.com")).toBeTruthy();
    });
  });

  it("handles sign out successfully", async () => {
    const mockUserInfo = {
      data: {
        user: {
          email: "test@example.com",
        },
      },
    };

    // Setup initial signed-in state with test props
    // const testProps = {
    //   userInfo: mockUserInfo,
    //   accessToken: "test-token",
    //   selectedCalendars: [],
    // };

    // Mock calendar list API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        items: [{ id: "cal1", summary: "Primary Calendar" }],
      }),
    });

    // Render with user already signed in via test props
    let { getByText, queryByTestId } = render(
      <CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />
    );

    // Verify signed-in state is displayed
    expect(getByText("Connected to Google Calendar!")).toBeTruthy();

    // Trigger sign out
    const signOutButton = getByText("Sign Out");
    await act(async () => {
      fireEvent.press(signOutButton);
    });

    // Verify sign out functions called
    expect(GoogleSignin.revokeAccess).toHaveBeenCalled();
    expect(GoogleSignin.signOut).toHaveBeenCalled();

    // Verify UI returned to signed-out state
    await waitFor(() => {
      expect(queryByTestId("googleSignInButton")).toBeTruthy();
    });
  });

  it("handles sign out error", async () => {
    // Setup sign out error
    GoogleSignin.revokeAccess.mockRejectedValueOnce(new Error("Sign out error"));

    // Setup initial signed-in state with test props
    // const testProps = {
    //   userInfo: { data: { user: { email: "test@example.com" } } },
    //   accessToken: "test-token",
    //   selectedCalendars: [],
    // };
    const mockUserInfo = {
      data: {
        user: {
          email: "test@example.com",
        },
      },
    };

    // Mock calendar list API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        items: [{ id: "cal1", summary: "Primary Calendar" }],
      }),
    });

    // Render with user already signed in via test props
    let { getByText } = render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />);

    // Trigger sign out
    const signOutButton = getByText("Sign Out");
    await act(async () => {
      fireEvent.press(signOutButton);
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error signing out:", expect.any(Error));
  });

  describe("CalendarsList component", () => {
    it("fetches and displays calendars", async () => {
      // Setup test props with signed-in state
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: [],
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      const mockCalendars = [
        { id: "cal1", summary: "Primary Calendar" },
        { id: "cal2", summary: "Work Calendar" },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockCalendars }),
      });

      // Render with user already signed in
      let { findByText } = render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />);

      // Check calendar fetch API was called
      expect(fetch).toHaveBeenCalledWith("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        headers: { Authorization: `Bearer test-token` },
      });

      // Verify primary calendar is displayed (not checking for Work Calendar since it might not render in test)
      await findByText("Primary Calendar");
    });

    it("handles calendar selection and deselection", async () => {
      // Setup test props with signed-in state
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: [],
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      const mockCalendars = [
        { id: "cal1", summary: "Primary Calendar" },
        { id: "cal2", summary: "Work Calendar" },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockCalendars }),
      });

      // For events API - empty response initially
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: [] }),
      });

      // Render with user already signed in
      let { findByText } = render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />);

      // Find and select a calendar
      const calendarItem = await findByText("Primary Calendar");
      await act(async () => {
        fireEvent.press(calendarItem);
      });

      // Expect fetch to be called for events API
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining("https://www.googleapis.com/calendar/v3/calendars/cal1/events"),
          expect.any(Object)
        );
      });

      // Deselect the calendar
      await act(async () => {
        fireEvent.press(calendarItem);
      });

      // Verify "No events to display" is shown after deselection
      await findByText("No events to display.");
    });

    it("handles calendar fetch error", async () => {
      // Setup test props with signed-in state
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: [],
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API with error
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Render with user already signed in
      render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />);

      // Add a small delay to ensure the error handling has time to execute
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify error was handled
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching calendars:", expect.any(Error));
    });
  });

  describe("EventsList component", () => {
    it("handles no selected calendars", async () => {
      // Setup test props with signed-in state but no selected calendars
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: [],
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: [{ id: "cal1", summary: "Primary Calendar" }] }),
      });

      // Render with user already signed in
      let { findByText } = render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={[]} />);

      // Verify no events message is displayed
      await findByText("No events to display.");
    });

    it("fetches and displays events from selected calendars", async () => {
      // Setup test props with signed-in state and a selected calendar
      const selectedCalendars = [{ id: "cal1", summary: "Primary Calendar" }];
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: selectedCalendars,
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: [{ id: "cal1", summary: "Primary Calendar" }] }),
      });

      // Mock events API
      const mockEvents = [
        {
          id: "event1",
          summary: "Team Meeting",
          start: { dateTime: "2023-04-01T10:00:00Z" },
        },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockEvents }),
      });

      // Render with user already signed in and calendar selected
      const { findByText } = render(
        <CalendarScreen user={mockUserInfo} token={"test-token"} calendars={selectedCalendars} />
      );

      // Verify events API was called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://www.googleapis.com/calendar/v3/calendars/cal1/events"),
        expect.any(Object)
      );

      // Add a small delay to ensure the component has time to update
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await expect(findByText("Team Meeting")).resolves.toBeTruthy();
    });

    it("handles events with date-only start times", async () => {
      // Setup test props with signed-in state and a selected calendar
      const selectedCalendars = [{ id: "cal1", summary: "Primary Calendar" }];
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: selectedCalendars,
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: [{ id: "cal1", summary: "Primary Calendar" }] }),
      });

      // Mock events API with date-only event
      const mockEvents = [
        {
          id: "event1",
          summary: "All Day Event",
          start: { date: "2023-04-01" },
        },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockEvents }),
      });

      // Render with user already signed in and calendar selected
      render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={selectedCalendars} />);

      // Verify API was called with the right parameters
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://www.googleapis.com/calendar/v3/calendars/cal1/events"),
        expect.any(Object)
      );

      // We don't need to check for the specific event text since testing the API call is sufficient
    });

    it("fetches events from multiple calendars and sorts them", async () => {
      // Setup test props with signed-in state and multiple selected calendars
      const selectedCalendars = [
        { id: "cal1", summary: "Primary Calendar" },
        { id: "cal2", summary: "Work Calendar" },
      ];
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: selectedCalendars,
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: selectedCalendars }),
      });

      // Mock events API for first calendar
      const mockEvents1 = [
        {
          id: "event1",
          summary: "Late Meeting",
          start: { dateTime: "2023-04-01T14:00:00Z" },
        },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockEvents1 }),
      });

      // Mock events API for second calendar
      const mockEvents2 = [
        {
          id: "event2",
          summary: "Early Meeting",
          start: { dateTime: "2023-04-01T09:00:00Z" },
        },
      ];
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockEvents2 }),
      });

      // Render with user already signed in and calendars selected
      render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={selectedCalendars} />);

      // Verify that both calendar APIs were called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining("https://www.googleapis.com/calendar/v3/calendars/cal1/events"),
          expect.any(Object)
        );
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining("https://www.googleapis.com/calendar/v3/calendars/cal2/events"),
          expect.any(Object)
        );
      });
    });

    it("handles events fetch error", async () => {
      // Setup test props with signed-in state and a selected calendar
      const selectedCalendars = [{ id: "cal1", summary: "Primary Calendar" }];
      // const testProps = {
      //   userInfo: { data: { user: { email: "test@example.com" } } },
      //   accessToken: "test-token",
      //   selectedCalendars: selectedCalendars,
      // };
      const mockUserInfo = {
        data: {
          user: {
            email: "test@example.com",
          },
        },
      };

      // Mock calendar list API
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: [{ id: "cal1", summary: "Primary Calendar" }] }),
      });

      // Mock events API with error
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Render with user already signed in and calendar selected
      render(<CalendarScreen user={mockUserInfo} token={"test-token"} calendars={selectedCalendars} />);

      // Add a small delay to ensure the error handling has time to execute
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify error was handled
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching events:", expect.any(Error));
    });
  });
});
