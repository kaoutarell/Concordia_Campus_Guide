import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import styles from '../../../styles/NavigationInfoStyles';
import locationService from '../../../services/LocationService';
import {formatDuration} from "../../../utils";
import {getUpcomingShuttles} from "../../../api/dataService";

const SHEET_HEIGHT = 300;
const INITIAL_SHEET_POSITION = SHEET_HEIGHT;

const BusNavigationInfo = ({totalDuration, totalDistance}) => {
    const [fadeIn] = useState(new Animated.Value(0));
    const [sheetAnim] = useState(new Animated.Value(INITIAL_SHEET_POSITION));
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [upcomingSchedule, setUpcomingSchedule] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserLocation(locationService.getCurrentLocation());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
       const schedule = getUpcomingShuttles(userLocation?.coords.latitude, userLocation?.coords.longitude);
       console.log(schedule);
       setUpcomingSchedule(schedule);
    }, []);

    useEffect(() => {

        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

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
            <Animated.View style={[styles.container, {opacity: fadeIn}]}>
                <View style={styles.infoBand}>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={20} color="#fff"/>
                        <Text style={styles.infoText}>
                            {totalDuration
                                ? formatDuration(totalDuration)
                                : 'Duration not available'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome5 name="road" size={20} color="#fff"/>
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
                    {transform: [{translateY: sheetAnim}]},
                ]}
            >
                <View style={localStyles.header}>
                    <Text style={localStyles.headerTitle}>
                        Bus Schedule - {upcomingSchedule?.shuttle_stop?.name} Campus
                    </Text>
                    <TouchableOpacity onPress={closeScheduleSheet} style={localStyles.closeButton}>
                        <Text style={localStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={localStyles.scrollContainer}>
                    {!upcomingSchedule?.upcoming_shuttles ? (
                        <Text style={localStyles.scheduleText}>No bus service available.</Text>
                    ) : (
                        <>
                            <View style={localStyles.tableHeader}>
                                <Text style={localStyles.tableHeaderText}>Departure</Text>
                                <Text style={localStyles.tableHeaderText}>In</Text>
                            </View>
                            <View style={localStyles.tableBody}>
                                upcomingSchedule.upcoming_shuttles.map((item, index) => (
                                <View key={index} style={localStyles.tableRow}>
                                    <Text style={localStyles.tableCell}>{item.scheduled_time}</Text>
                                    <Text style={localStyles.tableCell}>
                                        {item.time_to_departure < 1 ? 'Now' : formatDuration(item.time_to_departure * 60)}
                                    </Text>
                                </View>
                                ))
                            </View>
                        </>
                    )}
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
        shadowOffset: {width: 0, height: -3},
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