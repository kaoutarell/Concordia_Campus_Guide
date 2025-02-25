import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NavigationDirection = ({ distance, instruction }) => {

  const getDirectionIcon = (instruction) => {

    if (instruction.toLowerCase().includes("keep left")) return "↖"; // Diagonal left arrow
    if (instruction.toLowerCase().includes("keep right")) return "↗"; // Diagonal right arrow
    if (instruction.toLowerCase().includes("left")) return "←"; // Thicker left arrow
    if (instruction.toLowerCase().includes("right")) return "→"; // Thicker right arrow
    if (instruction.toLowerCase().includes("straight")) return "↑"; // Thicker straight arrow

    return "↑"; // Default to straight if no match
  };

  const arrowIcon = getDirectionIcon(instruction);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{arrowIcon}</Text>
      <Text style={styles.text}>
        In {distance.toFixed(1)} meters, {instruction}!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "12%",
    height: '12%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 36, // Larger for a thicker appearance
    fontWeight: 'bold', // Makes the arrow visually stronger
    color: '#7a003c', // Rouge Bourgogne color
    marginRight: 15, // Spacing between arrow and text
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7a003c', // Rouge Bourgogne for the text
    textAlign: 'center', // Center the text
    flexWrap: 'wrap', // Allow text to wrap when needed
    width: '80%', // Control the width for wrapping (you can adjust the percentage)
  }

});

export default NavigationDirection;
