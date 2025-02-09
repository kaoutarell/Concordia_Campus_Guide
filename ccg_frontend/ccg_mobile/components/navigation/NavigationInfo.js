import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const NavigationInfo = ({ onStartNavigation, totalDuration, totalDistance }) => {
    const [fadeIn] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        // Fade in the info card on mount
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 600,  // Animation fluide et rapide
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.container, { opacity: fadeIn }]}>
                <View style={styles.infoBand}>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={20} color="#fff" />
                        <Text style={styles.infoText}>{totalDuration ? totalDuration : 'Duration not available'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="road" size={20} color="#fff" />
                        <Text style={styles.infoText}>{totalDistance ? totalDistance : 'Distance not available'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={onStartNavigation}>
                    <Text style={styles.startButtonText}>Start Navigation</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#800020',  // Rouge bourgogne
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#800020',  // Rouge bourgogne
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
    infoBand: {
        width: '100%',
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        justifyContent: 'flex-start',
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',  // Texte en blanc pour un bon contraste
        marginLeft: 8,
        maxWidth: width - 80,
    },
    startButton: {
        backgroundColor: '#fff',  // Fond du bouton en blanc
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
        color: '#800020',  // Texte du bouton en rouge bourgogne
    },
});

export default NavigationInfo;
