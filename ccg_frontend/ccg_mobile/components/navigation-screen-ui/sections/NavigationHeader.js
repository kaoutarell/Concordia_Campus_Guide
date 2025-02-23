import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { modes } from '../../../constants/TransportModes';
import styles from '../../../styles/NavigationModesStyles';

import NavigationSearch from '../elements/NavigationSearch';
import CustomButton from "../elements/CustomButton";
import NavigationMode from '../elements/NavigationMode';

const NavigationHeader = ({
    startAddress,
    destinationAddress,
    onSelectedMode,
    onModifyAddress,
    selectedMode,
    allLocations,
    onBackPress,
}) => {

  const handleModeChange = (mode) => {
    onSelectedMode(mode);
  };

    return (
        <View style={styles.container}>

      <View style={styles.rowContainer}>
        <CustomButton title="←" onPress={onBackPress} style={styles.button} />

            <NavigationSearch
                startAddress={startAddress}
                destinationAddress={destinationAddress}
                onBackPress={onBackPress}
                onModifyAddress={onModifyAddress}
                allLocations={allLocations}
            />
      </View>

            {/* Navigation Modes at the top */}
            <View style={styles.navModesContainer}>
                {modes.map(({ mode, icon }) => (
                    <NavigationMode
                        key={name}
                        mode={mode}
                        name={name}
                        icon={icon}
                        selectedMode={selectedMode}
                        onModeChange={handleModeChange}
                        style={[styles.navMode, selectedMode === mode ? styles.activeMode : null]} // Conditionally apply active style
                    />
                ))}
            </View>
        </View>
    );
};

export default NavigationHeader;
