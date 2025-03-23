import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

// testProps is an object that can be passed to the component to set the initial state for testing purposes
const CalendarScreen = ({ testProps }) => {
  const [userInfo, setUserInfo] = useState(testProps?.userInfo || null);
  const [accessToken, setAccessToken] = useState(testProps?.accessToken || null);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState(testProps?.selectedCalendars || []);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/calendar.readonly", "openid", "profile", "email"],
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const restoreSignIn = async () => {
      try {
        // Attempt to restore the previous session
        const info = await GoogleSignin.signInSilently();
        console.log("Restored previous sign in session.", info);
        setUserInfo(info);
        const tokens = await GoogleSignin.getTokens();
        setAccessToken(tokens.accessToken);
      } catch (error) {
        // If there is no previous session, ignore the error.
        console.log("No previous sign in or sign in expired.", error);
        setUserInfo(null);
        setAccessToken(null);
      }
    };
    restoreSignIn();
  }, []);

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const info = await GoogleSignin.signIn();
      setUserInfo(info);
      const tokens = await GoogleSignin.getTokens();
      setAccessToken(tokens.accessToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the sign-in flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error("Something went wrong:", error);
      }
    } finally {
      setIsSigninInProgress(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo(null);
      setAccessToken(null);
      setSelectedCalendars([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Class Schedule</Text>
      {!userInfo ? (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          disabled={isSigninInProgress}
          style={styles.googleButton}
          testID="googleSignInButton"
        />
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.successText}>Connected to Google Calendar!</Text>
          <Text style={styles.userEmail}>Signed in as: {userInfo.data?.user?.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
          <CalendarsList
            accessToken={accessToken}
            selectedCalendars={selectedCalendars}
            onSelectCalendar={setSelectedCalendars}
          />
          <EventsList accessToken={accessToken} selectedCalendars={selectedCalendars} />
        </View>
      )}
    </SafeAreaView>
  );
};

const CalendarsList = ({ accessToken, selectedCalendars, onSelectCalendar }) => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCalendars = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setCalendars(data.items || []);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, [accessToken]);

  const toggleCalendarSelection = calendar => {
    if (selectedCalendars.find(item => item.id === calendar.id)) {
      onSelectCalendar(selectedCalendars.filter(item => item.id !== calendar.id));
    } else {
      onSelectCalendar([...selectedCalendars, calendar]);
    }
  };

  const renderCalendarItem = ({ item }) => {
    const isSelected = !!selectedCalendars.find(cal => cal.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.calendarItem, isSelected && styles.selectedItem]}
        onPress={() => toggleCalendarSelection(item)}
      >
        <View style={styles.calendarItemContainer}>
          <Text style={styles.calendarTitle}>{item.summary}</Text>
          {isSelected && <Text style={styles.tick}>✔️</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Select Calendars</Text>
      {loading ? (
        <Text>Loading calendars...</Text>
      ) : (
        <FlatList data={calendars} keyExtractor={item => item.id} renderItem={renderCalendarItem} />
      )}
    </View>
  );
};

const EventsList = ({ accessToken, selectedCalendars }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!accessToken || selectedCalendars.length === 0) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      let allEvents = [];
      // Set timeMin to today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timeMin = today.toISOString();
      for (const calendar of selectedCalendars) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            calendar.id
          )}/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await response.json();
        allEvents = allEvents.concat(data.items || []);
      }
      // Sort events by start time
      allEvents.sort(
        (a, b) => new Date(a.start?.dateTime || a.start?.date) - new Date(b.start?.dateTime || b.start?.date)
      );
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken, selectedCalendars]);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.summary}</Text>
      <Text style={styles.eventTime}>{item.start?.dateTime || item.start?.date}</Text>
    </View>
  );

  const renderEventsContent = () => {
    if (loading) {
      return <Text>Loading events...</Text>;
    }
    if (events.length === 0) {
      return <Text>No events to display.</Text>;
    }
    return (
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    );
  };

  return (
    <View style={[styles.sectionContainer, { flex: 1 }]}>
      <Text style={styles.sectionTitle}>Events</Text>
      {renderEventsContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  googleButton: {
    width: 240,
    height: 48,
    alignSelf: "center",
    marginTop: 16,
  },
  successText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  sectionContainer: {
    marginVertical: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  calendarItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  calendarItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarTitle: {
    fontSize: 16,
  },
  tick: {
    fontSize: 18,
  },
  eventItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
});

CalendarsList.propTypes = {
  accessToken: PropTypes.string,
  selectedCalendars: PropTypes.array,
  onSelectCalendar: PropTypes.func,
};

EventsList.propTypes = {
  accessToken: PropTypes.string,
  selectedCalendars: PropTypes.array,
};

CalendarScreen.propTypes = {
  testProps: PropTypes.shape({
    userInfo: PropTypes.object,
    accessToken: PropTypes.string,
    selectedCalendars: PropTypes.array,
  }),
};

export default CalendarScreen;
