import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import EventsList from "./sections/EventsList";
import CalendarsList from "./sections/CalendarsList";
import { getBuildings } from "../../api/dataService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CalendarScreen = ({ user, token, calendars }) => {
  const [userInfo, setUserInfo] = useState(user || null);
  const [accessToken, setAccessToken] = useState(token || null);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState(calendars || []);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/calendar.readonly", "openid", "profile", "email"],
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });

    const fetchBuildings = async () => {
      try {
        const buildingsData = await getBuildings();
        const formattedBuildings = buildingsData.map(building => ({
          campus: building.campus,
          name: building.name,
          code: building.building_code,
        }));
        setBuildings(formattedBuildings);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  const handleSelectCalendars = async calendars => {
    try {
      setSelectedCalendars(calendars);
      await AsyncStorage.setItem("selectedCalendars", JSON.stringify(calendars));
    } catch (error) {
      console.error("Failed to save selected calendars:", error);
    }
  };

  useEffect(() => {
    const loadSelectedCalendars = async () => {
      try {
        const stored = await AsyncStorage.getItem("selectedCalendars");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedCalendars(parsed);
        }
      } catch (error) {
        console.error("Failed to load selected calendars:", error);
      }
    };
    loadSelectedCalendars();
  }, []);

  useEffect(() => {
    const restoreSignIn = async () => {
      try {
        // Attempt to restore the previous session
        const info = await GoogleSignin.signInSilently();
        setUserInfo(info);
        const tokens = await GoogleSignin.getTokens();
        setAccessToken(tokens.accessToken);
      } catch (error) {
        // If there is no previous session, ignore the error.
        console.log("No previous sign in or sign in expired.", error);
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
      {!userInfo || !userInfo.data ? (
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
            onSelectCalendar={handleSelectCalendars}
          />
          <EventsList accessToken={accessToken} selectedCalendars={selectedCalendars} buildings={buildings} />
        </View>
      )}
    </SafeAreaView>
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

CalendarScreen.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string,
  calendars: PropTypes.array,
};

export default CalendarScreen;
