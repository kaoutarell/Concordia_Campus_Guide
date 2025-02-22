import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import globalStyles from '../../../styles/NavigationInfoStyles'; // renamed for clarity
import locationService from '../../../services/LocationService';
import { formatDuration } from '../../../utils';
import { getUpcomingShuttles } from '../../../api/dataService';

const SHEET_HEIGHT = 300;
const INITIAL_SHEET_POSITION = SHEET_HEIGHT;

const BusNavigationInfo = ({ totalDuration, totalDistance }) => {
  // Animated values using refs to prevent unnecessary re-renders.
  const fadeIn = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(INITIAL_SHEET_POSITION)).current;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [upcomingSchedule, setUpcomingSchedule] = useState(null);

  const updateLocation = useCallback(async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      const schedule = await getUpcomingShuttles(
        location.coords.latitude,
        location.coords.longitude
      );
      setUpcomingSchedule(schedule);
    } catch (error) {
      console.error('Error fetching location or schedule:', error);
    }
  }, []);

  useEffect(() => {
    // Fade in animation on mount.
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    updateLocation();
    const intervalId = setInterval(updateLocation, 10000);

    return () => clearInterval(intervalId);
  }, [fadeIn, updateLocation]);

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

  const sheetTransformStyle = { transform: [{ translateY: sheetAnim }] };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Animated.View style={[globalStyles.container, { opacity: fadeIn }]}>
        <View style={globalStyles.infoBand}>
          <View style={globalStyles.infoItem}>
            <FontAwesome5 name="clock" size={20} color="#fff" />
            <Text style={globalStyles.infoText}>
              {totalDuration ? formatDuration(totalDuration) : 'Duration not available'}
            </Text>
          </View>
          <View style={globalStyles.infoItem}>
            <FontAwesome5 name="road" size={20} color="#fff" />
            <Text style={globalStyles.infoText}>
              {totalDistance ? (totalDistance / 1000).toFixed(2) + ' km' : 'Distance not available'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={globalStyles.startButton} onPress={openScheduleSheet}>
          <Text style={globalStyles.startButtonText}>View Bus Schedule</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View style={[sheetStyles.bottomSheet, sheetTransformStyle]}>
        <View style={sheetStyles.header}>
          <Text style={sheetStyles.headerTitle}>
            Bus Schedule - {upcomingSchedule?.shuttle_stop?.name || 'Unknown'} Campus
          </Text>
          <TouchableOpacity onPress={closeScheduleSheet} style={sheetStyles.closeButton}>
            <Text style={sheetStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={sheetStyles.scrollContainer}>
          {!upcomingSchedule?.upcoming_shuttles.length ? (
            <Text style={sheetStyles.scheduleText}>No bus service available.</Text>
          ) : (
            <>
              <View style={sheetStyles.tableHeader}>
                <Text style={sheetStyles.tableHeaderText}>Departure</Text>
                <Text style={sheetStyles.tableHeaderText}>In</Text>
              </View>
              <View style={sheetStyles.tableBody}>
                {upcomingSchedule.upcoming_shuttles.map((item, index) => (
                  <View key={index} style={sheetStyles.tableRow}>
                    <Text style={sheetStyles.tableCell}>{item.scheduled_time}</Text>
                    <Text style={sheetStyles.tableCell}>
                      {item.time_to_departure < 1
                        ? 'Now'
                        : formatDuration(item.time_to_departure * 60)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const sheetStyles = StyleSheet.create({
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