import React from 'react';
import { View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from "../../../styles/NavigationInfoStyles";

const NavigationInfo = ({ onStartNavigation, totalDuration, totalDistance }) => {
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
            <Animated.View style={[styles.container, { opacity: fadeIn }]}>
                <View style={styles.infoBand}>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={20} color="#fff" />
                        <Text style={styles.infoText}>{totalDuration ? parseFloat(totalDuration / 60).toFixed(2) + " minutes" : 'Duration not available'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="road" size={20} color="#fff" />
                        <Text style={styles.infoText}>{totalDistance ? parseFloat(totalDistance / 1000).toFixed(2) + " km" : 'Distance not available'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={onStartNavigation}>
                    <Text style={styles.startButtonText}>Start Navigation</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

export default NavigationInfo;
