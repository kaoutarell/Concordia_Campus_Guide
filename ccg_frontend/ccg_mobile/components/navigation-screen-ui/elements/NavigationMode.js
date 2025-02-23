import React from "react";
import { TouchableOpacity ,Text} from "react-native";

import styles from '../../../styles/NavigationModesStyles';

const NavigationMode = ({ mode, selectedMode, onModeChange, icon }) => {

    return (
        <TouchableOpacity
            style={[styles.navMode, selectedMode === mode && styles.activeMode]}
            onPress={() => onModeChange(mode)}
        >
            {React.cloneElement(icon, { color: selectedMode === mode ? '#fff' : '#800020' })}
            <Text>{mode}</Text>
        </TouchableOpacity>

    );
};

export default NavigationMode;

