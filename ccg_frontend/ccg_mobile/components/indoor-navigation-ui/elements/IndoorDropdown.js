import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";

const IndoorDropdown = ({ options, selectedValue, onValueChange, placeholder }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible); // Toggle visibility
  };

  const handleSelectItem = item => {
    onValueChange(item.value); // Update the selected value
    setDropdownVisible(false); // Hide dropdown after selection
  };

  // Find the selected label from the options based on the selected value
  const selectedLabel = options.find(item => item.value === selectedValue)?.label;

  return (
    <View style={styles.container}>
      {/* The button which shows the selected building or placeholder */}
      <TouchableOpacity style={styles.input} onPress={handleDropdownToggle} testID="dropdown-input">
        <Text style={styles.text}>{selectedLabel || placeholder}</Text>
        {/* Dropdown Icon */}
        <Icon
          name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#333"
          style={styles.icon}
          testID="dropdown-icon"
        />
      </TouchableOpacity>

      {/* Dropdown list shown when the button is pressed */}
      {isDropdownVisible && (
        <View style={styles.dropdown} testID="dropdown">
          <ScrollView style={styles.scrollView}>
            {options.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.item}
                onPress={() => handleSelectItem(item)}
                testID={`dropdown-item-${item.value}`}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

IndoorDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative", // positioning the dropdown list
  },
  input: {
    height: 40,
    width: 250,
    borderRadius: 24,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row", // Align text and icon horizontally
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginLeft: 10, // Space between text and icon
  },
  dropdown: {
    position: "absolute",
    top: 22,
    left: 0,
    right: 0,
    width: 250,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 200, // Limit the dropdown height -- avoid overflow
    zIndex: 100, // Should be displayed above other components
  },
  scrollView: {
    maxHeight: 150,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default IndoorDropdown;
