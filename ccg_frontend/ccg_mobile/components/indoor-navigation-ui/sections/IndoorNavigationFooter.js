import React from "react";
import { Text, TouchableOpacity, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

const IndoorNavigationFooter = ({ onShowDirections, startAddress, destinationAddress }) => {
  const [fadeIn] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeIn }]} testID="footer-container">
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => onShowDirections(startAddress, destinationAddress)}
            testID="start-button"
          >
            <Icon name="location-arrow" size={20} color="#800020" style={styles.icon} testID="icon" />
            <Text style={styles.startButtonText} testID="start-button-text">
              Get Direction
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

IndoorNavigationFooter.propTypes = {
  onShowDirections: PropTypes.func.isRequired,
  startAddress: PropTypes.string.isRequired,
  destinationAddress: PropTypes.string.isRequired,
};

export default IndoorNavigationFooter;

const styles = StyleSheet.create({
  safeArea: {
    justifyContent: "flex-end",
    height: "12%",
    width: "100%",
    marginTop: 330,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#800020",
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    paddingVertical: 30,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 200,
    marginVertical: 5,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#800020",
    marginLeft: 10,
  },
  icon: {},
});
