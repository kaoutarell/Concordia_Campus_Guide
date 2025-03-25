import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const parseEventLocation = (location, buildings) => {
  // Expected format: "Campus Name - Building Name Rm RoomNumber"
  const regex = /^([^\s-][^-]*?)\s*-\s*([^\s-][^-]*?)\s+Rm\s+(\S+)$/i;
  const match = location.match(regex);
  if (!match) return null;
  const [, , buildingNameFromEvent, room] = match;
  const tokensEvent = buildingNameFromEvent.split(/\s+/).map(t => t.toLowerCase());

  // First, check if the first token directly matches a building code
  const firstToken = tokensEvent[0];
  const directMatch = buildings.find(building => building.code.toLowerCase() === firstToken);
  if (directMatch) {
    return {
      campus: directMatch.campus,
      buildingName: directMatch.name,
      buildingCode: directMatch.code,
      room: room.trim(),
    };
  }

  // Fallback: find the best match based on matching tokens from the building name
  let bestMatch = null;
  let bestMatchCount = 0;

  for (const building of buildings) {
    const tokensBuilding = building.name.split(/\s+/).map(t => t.toLowerCase());
    const matchCount = tokensEvent.filter(token => tokensBuilding.includes(token)).length;
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestMatch = building;
    }
  }

  if (!bestMatch) return null;

  return {
    campus: bestMatch.campus,
    buildingName: bestMatch.name,
    buildingCode: bestMatch.code,
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
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterClassesOnly, setFilterClassesOnly] = useState(false);
  const navigation = useNavigation();

  const fetchEvents = async () => {
    if (!accessToken || selectedCalendars.length === 0) {
      setAllEvents([]);
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
    fetchEvents();
  }, [accessToken, selectedCalendars]);

  // Process events and filter by class location using useMemo instead of a separate useEffect.
  const processedEvents = useMemo(() => {
    return allEvents
      .map(event => {
        if (event.location) {
          const parsedLocation = parseEventLocation(event.location, buildings);
          if (parsedLocation) {
            return {
              ...event,
              classLocation: `${parsedLocation.buildingCode} ${parsedLocation.room}`,
              building: parsedLocation.buildingName,
            };
          }
        }
        return event;
      })
      .filter(event => (filterClassesOnly ? event.classLocation : true));
  }, [allEvents, buildings, filterClassesOnly]);

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
            <Text
              style={{
                marginTop: 6,
                fontStyle: "italic",
                color: "red",
                textAlign: "center",
              }}
            >
              Location not supported
            </Text>
          ))}
      </View>
    );
  };

  const renderEventsContent = () => {
    if (loading) return <Text>Loading events...</Text>;
    if (processedEvents.length === 0) return <Text>No events to display.</Text>;
    return (
      <FlatList
        data={processedEvents}
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
  sectionContainer: {
    marginVertical: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
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
