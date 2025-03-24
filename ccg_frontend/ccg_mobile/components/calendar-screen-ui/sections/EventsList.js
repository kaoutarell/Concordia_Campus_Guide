import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const normalizeString = str => {
  return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

const parseEventLocation = (location, buildings) => {
  // Expected format: "Campus Name - Building Name Rm RoomNumber"
  // Example: "Loyola Campus - Richard Renaud Science Complex Rm S110"
  const regex = /^(.+?)\s*-\s*(.+?)\s+Rm\s+(.+)$/i;
  const match = location.match(regex);
  if (!match) {
    return null;
  }
  const [, , buildingNameFromEvent, room] = match;
  // Normalize the event building name for fuzzy matching
  const normalizedEventBuilding = normalizeString(buildingNameFromEvent);
  let matchedBuilding = null;
  for (const building of buildings) {
    const buildingName = building.name;
    const normalizedBuildingDataName = normalizeString(buildingName);
    // Check if one string contains the other to allow for slight variations
    if (
      normalizedBuildingDataName.includes(normalizedEventBuilding) ||
      normalizedEventBuilding.includes(normalizedBuildingDataName)
    ) {
      matchedBuilding = building;
      break;
    }
  }
  if (!matchedBuilding) {
    return null; // No matching building found
  }
  return {
    campus: matchedBuilding.campus,
    buildingName: matchedBuilding.name,
    buildingCode: matchedBuilding.code,
    room: room.trim(),
  };
};

// Helper to check if an event location is supported for indoor navigation
const isSupportedLocation = classLocation => {
  if (!classLocation) return false;
  const supportedPrefixes = ["H", "H1", "H2", "H8", "H9", "MB1", "MBS2", "CC1", "VE1", "VE2", "VL1", "VL2"];
  return supportedPrefixes.some(prefix => classLocation.startsWith(prefix));
};

const EventsList = ({ accessToken, selectedCalendars, buildings }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [filterClassesOnly, setFilterClassesOnly] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  const fetchEvents = async () => {
    if (!accessToken || selectedCalendars.length === 0) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      let fetchedEvents = [];
      // Set timeMin to today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timeMin = today.toISOString();
      for (const calendar of selectedCalendars) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            calendar.id
          )}/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await response.json();
        fetchedEvents = fetchedEvents.concat(data.items || []);
      }

      // Sort events by start time
      fetchedEvents.sort(
        (a, b) => new Date(a.start?.dateTime || a.start?.date) - new Date(b.start?.dateTime || b.start?.date)
      );
      setAllEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const classEvents = allEvents.reduce((acc, event) => {
      if (event.location) {
        const parsedLocation = parseEventLocation(event.location, buildings);
        if (parsedLocation) {
          event.classLocation = `${parsedLocation.buildingCode} ${parsedLocation.room}`;
          event.building = parsedLocation.buildingName;
          acc.push(event);
        }
      }
      return acc;
    }, []);

    if (filterClassesOnly) {
      setEvents(classEvents);
    } else {
      setEvents(allEvents);
    }
  }, [allEvents, buildings, filterClassesOnly]);

  useEffect(() => {
    fetchEvents();
  }, [accessToken, selectedCalendars]);

  const handleGoPress = event => {
    navigation.navigate("Indoor", {
      start: "",
      destination: event.classLocation.replace(/\s/g, ""),
      building: event.building,
    });
  };

  const renderEventItem = ({ item }) => {
    const hasClassLocation = !!item.classLocation;
    const supported = hasClassLocation && isSupportedLocation(item.classLocation);

    return (
      <View style={[styles.eventItem, hasClassLocation && !supported && styles.disabledEvent]}>
        <Text style={styles.eventTitle}>{item.summary}</Text>
        <Text style={styles.eventTime}>{item.start?.dateTime || item.start?.date}</Text>
        {hasClassLocation && <Text style={styles.eventLocation}>{item.classLocation}</Text>}

        {hasClassLocation &&
          (supported ? (
            <Button title="Go" onPress={() => handleGoPress(item)} />
          ) : (
            <Text style={{ marginTop: 6, fontStyle: "italic", color: "red", textAlign: "center" }}>
              Location not supported
            </Text>
          ))}
      </View>
    );
  };

  const renderEventsContent = () => {
    if (loading) {
      return <Text>Loading events...</Text>;
    }
    if (events.length === 0) {
      return <Text>No events to display.</Text>;
    }
    return (
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    );
  };

  return (
    <View style={[styles.sectionContainer, { flex: 1 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Events</Text>
        <View style={styles.toggleButton}>
          <Text style={styles.toggleButtonText} onPress={() => setFilterClassesOnly(!filterClassesOnly)}>
            {filterClassesOnly ? "Show All Events" : "Show Classes Only"}
          </Text>
        </View>
      </View>
      {renderEventsContent()}
    </View>
  );
};

EventsList.propTypes = {
  accessToken: PropTypes.string,
  selectedCalendars: PropTypes.array,
  buildings: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  googleButton: {
    width: 240,
    height: 48,
    alignSelf: "center",
    marginTop: 16,
  },
  successText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  sectionContainer: {
    marginVertical: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  calendarItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  calendarItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarTitle: {
    fontSize: 16,
  },
  tick: {
    fontSize: 18,
  },
  eventItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  disabledEvent: {
    opacity: 0.5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  eventLocation: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#005BBB",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default EventsList;
