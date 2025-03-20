import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

const CalendarScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/calendar.readonly", "openid", "profile", "email"],
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
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
        />
      ) : (
        <View style={styles.userInfoContainer}>
          <Text style={styles.successText}>Connected to Google Calendar!</Text>
          <Text style={styles.userEmail}>Signed in as: {userInfo.data?.user?.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  googleButton: {
    width: 240,
    height: 48,
    marginTop: 16,
  },
  userInfoContainer: {
    alignItems: "center",
  },
  successText: {
    fontSize: 16,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
  },
});

export default CalendarScreen;
