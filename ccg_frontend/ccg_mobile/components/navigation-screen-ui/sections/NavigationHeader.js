
import React, { } from 'react';
import { View, } from 'react-native';

import { modes } from '../../../constants/TransportModes';
import styles from '../../../styles/NavigationModesStyles';

import NavigationSearch from '../elements/NavigationSearch';

import CustomButton from "../elements/CustomButton";
import NavigationMode from '../elements/NavigationMode';

const NavigationHeader = ({

    // onStartNavigation,
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

    const onStartNavigation = (text) => {
        console.log(text);
    };


    return (
        <View style={styles.container}>

            <CustomButton title="Back" onPress={onBackPress} />

            <NavigationSearch
                startAddress={startAddress}
                onStartNavigation={onStartNavigation}
                onModifyAddress={onModifyAddress}
                destinationAddress={destinationAddress}
                onBackPress={onBackPress}
                allLocations={allLocations}

            />
            {/* Navigation Modes at the top */}
            <View style={styles.navModesContainer}>
                {modes.map(({ mode, icon }) => (

                    <NavigationMode
                        key={mode}
                        mode={mode}
                        icon={icon}
                        selectedMode={selectedMode}
                        onModeChange={handleModeChange}
                    />
                ))}
            </View>
        </View>
    );
};

export default NavigationHeader;
