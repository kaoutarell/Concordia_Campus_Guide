import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const DirectionsButton = ({ handleSelect, value, startLocation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOptionSelect = option => {
    handleSelect(option);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal} style={styles.directionsButton} testID="get-directions-button">
        <FontAwesome5 name="directions" size={20} color="white" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" transparent={true} onRequestClose={toggleModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={toggleModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect("start")}>
              <Text style={styles.optionText}>Set as Start</Text>
              {startLocation && startLocation.id === value.id && (
                <FontAwesome5 name="check" size={16} color="#8B1D3B" style={styles.selectedStart} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect("destination")}>
              <Text style={styles.optionText}>Set as Destination</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.optionText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  directionsButton: {
    backgroundColor: "#8B1D3B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  directionsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignItems: "center",
  },
  selectedStart: {
    marginLeft: "auto",
  },
});

export default DirectionsButton;
