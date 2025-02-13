import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../../styles/NavigationInfoStyles';
import locationService from '../../services/LocationService';
import {
    SGW_STOP,
    LOYOLA_STOP,
    LOY_SCHEDULE_FRIDAY,
    LOY_SCHEDULE_MTH,
    SGW_SCHEDULE_MTH,
    SGW_SCHEDULE_FRIDAY
} from '../../constants';
import {formatDuration, getDistance} from "../../utils";

const SHEET_HEIGHT = 300;
const INITIAL_SHEET_POSITION = SHEET_HEIGHT;

const BusNavigationInfo = ({ totalDuration, totalDistance }) => {
    const [fadeIn] = useState(new Animated.Value(0));
    const [sheetAnim] = useState(new Animated.Value(INITIAL_SHEET_POSITION));
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserLocation(locationService.getCurrentLocation());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Determine which campus is closer.
    const getCampusFromUserLocation = (loc) => {
        if (!loc) return 'LOY';
        const { latitude, longitude } = loc.coords;
        const distanceToSGW = getDistance(
            latitude,
            longitude,
            SGW_STOP.latitude,
            SGW_STOP.longitude
        );
        const distanceToLOY = getDistance(
            latitude,
            longitude,
            LOYOLA_STOP.latitude,
            LOYOLA_STOP.longitude
        );
        return distanceToSGW < distanceToLOY ? 'SGW' : 'LOY';
    };

    const campus = getCampusFromUserLocation(userLocation);

    // Select schedule based on campus and day (no service on weekends).
    const getSchedule = () => {
        const day = new Date().getDay();
        if (day === 0 || day === 6) return [];
        if (campus === 'LOY') {
            return day === 5 ? LOY_SCHEDULE_FRIDAY : LOY_SCHEDULE_MTH;
        } else if (campus === 'SGW') {
            return day === 5 ? SGW_SCHEDULE_FRIDAY : SGW_SCHEDULE_MTH;
        }
        return [];
    };

    const schedule = getSchedule();

    // Compute upcoming departures with the time difference (in minutes).
    const getUpcomingSchedule = (schedule) => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        return schedule
            .map((timeStr) => {
                const [hour, minute] = timeStr.split(':').map(Number);
                const departureMinutes = hour * 60 + minute;
                const diff = departureMinutes - currentMinutes;
                return { time: timeStr, diff };
            })
            .filter((item) => item.diff >= 0);
    };

    const upcomingSchedule = getUpcomingSchedule(schedule);

    const openScheduleSheet = () => {
        Animated.timing(sheetAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsSheetOpen(true));
    };

    const closeScheduleSheet = () => {
        Animated.timing(sheetAnim, {
            toValue: INITIAL_SHEET_POSITION,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsSheetOpen(false));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.container, { opacity: fadeIn }]}>
                <View style={styles.infoBand}>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={20} color="#fff" />
                        <Text style={styles.infoText}>
                            {totalDuration
                                ? formatDuration(totalDuration)
                                : 'Duration not available'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="road" size={20} color="#fff" />
                        <Text style={styles.infoText}>
                            {totalDistance
                                ? (totalDistance / 1000).toFixed(2) + ' km'
                                : 'Distance not available'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={openScheduleSheet}>
                    <Text style={styles.startButtonText}>View Bus Schedule</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    localStyles.bottomSheet,
                    { transform: [{ translateY: sheetAnim }] },
                ]}
            >
                <View style={localStyles.header}>
                    <Text style={localStyles.headerTitle}>
                        Bus Schedule - {campus} Campus
                    </Text>
                    <TouchableOpacity onPress={closeScheduleSheet} style={localStyles.closeButton}>
                        <Text style={localStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={localStyles.scrollContainer}>
                    <View style={localStyles.tableHeader}>
                        <Text style={localStyles.tableHeaderText}>Departure</Text>
                        <Text style={localStyles.tableHeaderText}>In</Text>
                    </View>
                    <View style={localStyles.tableBody}>
                        {upcomingSchedule.length === 0 ? (
                            <Text style={localStyles.scheduleText}>No bus service today.</Text>
                        ) : (
                            upcomingSchedule.map((item, index) => (
                                <View key={index} style={localStyles.tableRow}>
                                    <Text style={localStyles.tableCell}>{item.time}</Text>
                                    <Text style={localStyles.tableCell}>
                                        {item.diff === 0 ? 'Now' : formatDuration(item.diff * 60)}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: SHEET_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    scrollContainer: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        color: '#333',
    },
    tableBody: {},
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: '#444',
    },
    scheduleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default BusNavigationInfo;