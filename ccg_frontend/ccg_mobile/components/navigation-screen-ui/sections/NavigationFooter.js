import React from 'react';
import { Text, TouchableOpacity, Animated, SafeAreaView, StyleSheet } from 'react-native';
import DurationAndDistanceInfo from "../elements/DurationAndDistanceInfo";
import PropTypes from 'prop-types';

const NavigationFooter = ({ onStartNavigation, totalDuration, totalDistance }) => {
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
                <DurationAndDistanceInfo duration={totalDuration} distance={totalDistance} />
                <TouchableOpacity style={styles.startButton} onPress={onStartNavigation}>
                    <Text style={styles.startButtonText}>Start Navigation</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

NavigationFooter.propTypes = {
    totalDuration: PropTypes.number,
    totalDistance: PropTypes.number,
    onStartNavigation: PropTypes.func.isRequired,
};

export default NavigationFooter;

const styles = StyleSheet.create({
    safeArea: {
        justifyContent: 'flex-end',
        height: '15%', // Ajustez la hauteur de la carte selon vos besoins
        width: '100%',
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#800020',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    startButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
        marginTop: 10,
        marginBottom: 30,
    },
    startButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#800020',
    },
});
