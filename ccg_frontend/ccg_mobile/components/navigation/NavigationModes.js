import React, { useState } from 'react'; 
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { modes } from '../../constants/TransportModes';

const { width } = Dimensions.get("window");

const NavigationModes = ({ 
  onModeChange, 
  onStartNavigation, 
  startAddress, 
  destinationAddress, 
}) => { 
  const [selectedMode, setSelectedMode] = useState('Walking');

  

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onModeChange(mode);
  };

  return (
    <View style={styles.container}>
      {/* Start and Destination Address Search Bar */}
      <View style={styles.searchContainer}>
        {/* Start Address TextInput with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Start Address" 
            value={startAddress} 
            onChangeText={(text) => onStartNavigation(text)} 
          />
        </View>

        {/* Destination Address TextInput with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#800020" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Destination Address" 
            value={destinationAddress} 
            onChangeText={(text) => onStartNavigation(text)} 
          />
        </View>
      </View>

      {/* Navigation Modes at the top */}
      <View style={styles.navModesContainer}>
        {modes.map(({ mode, icon }) => (
          <TouchableOpacity 
            key={mode} 
            style={[styles.navMode, selectedMode === mode && styles.activeMode]} 
            onPress={() => handleModeChange(mode)} 
          >
            {/* Icon only, no text */}
            {React.cloneElement(icon, { color: selectedMode === mode ? '#fff' : '#800020' })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 60, // Ajout d'un espacement au-dessus pour le faire descendre
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1, // Assure que la barre de recherche soit au-dessus des autres composants
  },
  inputContainer: {
    flexDirection: 'row', // Alignement horizontal de l'icône et du TextInput
    alignItems: 'center', // Centrer l'icône et le TextInput
    marginBottom: 10, // Espacement entre les champs
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 1, // Espacement entre l'icône et le champ de texte
  },
  input: {
    width: '100%', // S'assurer que chaque TextInput prenne toute la largeur
    height: 40,
    fontSize: 16,
    paddingVertical: 0, // Enlever le padding vertical pour que le champ de texte soit centré
  },
  navModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Répartir les éléments de façon égale
    alignItems: 'center', // Aligner les éléments verticalement
    height: 40, // Hauteur du conteneur de navigation (ajustée pour être plus basse)
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    position: 'absolute',
    top: 100, // Marge ajoutée pour faire de la place aux champs de recherche
    left: 0,
    right: 0,
    zIndex: 100, // Garder en haut des autres éléments
    paddingHorizontal: 10,
  },
  navMode: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.14, // Réduire la largeur du bouton
  },
  activeMode: {
    backgroundColor: '#800020',
  },
});

export default NavigationModes;
