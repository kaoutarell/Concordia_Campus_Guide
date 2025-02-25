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
import PropTypes from 'prop-types';
import locationService from '../../../services/LocationService';
import { formatDuration } from '../../../utils';
import { getUpcomingShuttles } from '../../../api/dataService';
import DurationAndDistanceInfo from "../elements/DurationAndDistanceInfo";

const SHEET_HEIGHT = 300;
const INITIAL_SHEET_POSITION = SHEET_HEIGHT;

const BusNavigationInfo = ({ totalDuration, totalDistance, onStartNavigation }) => {
  // Animated values using refs to prevent unnecessary re-renders.
  const fadeIn = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(INITIAL_SHEET_POSITION)).current;

  const [upcomingSchedule, setUpcomingSchedule] = useState(null);

  const updateLocation = useCallback(async () => {
    try {
      const location = await locationService.getCurrentLocation();
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
    }).start();
  };

  const closeScheduleSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: INITIAL_SHEET_POSITION,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const sheetTransformStyle = { transform: [{ translateY: sheetAnim }] };

  return (
    <SafeAreaView style={sheetStyles.safeArea}>
      <Animated.View style={[sheetStyles.container, { opacity: fadeIn }]}>
        <DurationAndDistanceInfo duration={totalDuration} distance={totalDistance} />
        <TouchableOpacity style={sheetStyles.startButton} onPress={onStartNavigation}>
          <Text style={sheetStyles.startButtonText}>Start Navigation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sheetStyles.startButton} onPress={openScheduleSheet}>
          <Text style={sheetStyles.startButtonText}>View Bus Schedule</Text>
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
                {upcomingSchedule.upcoming_shuttles.map((item) => (
                  <View
                    key={`${item.scheduled_time}-${item.time_to_departure}`}
                    style={sheetStyles.tableRow}
                  >
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

BusNavigationInfo.propTypes = {
  totalDuration: PropTypes.number.isRequired,
  totalDistance: PropTypes.number.isRequired,
  onStartNavigation: PropTypes.func.isRequired,
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
  safeArea: {
    // flex: 1,
    justifyContent: 'flex-end',
    height: '15%', // Ajustez la hauteur de la carte selon vos besoins
    width: '100%',
    // backgroundColor: '#800020',
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
    paddingBottom: 40,
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
    marginBottom: 10,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#800020',
  },
});

export default BusNavigationInfo;
