import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList } from "react-native";

const EventsList = ({ accessToken, selectedCalendars }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!accessToken || selectedCalendars.length === 0) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      let allEvents = [];
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
        allEvents = allEvents.concat(data.items || []);
      }
      // Sort events by start time
      allEvents.sort(
        (a, b) => new Date(a.start?.dateTime || a.start?.date) - new Date(b.start?.dateTime || b.start?.date)
      );
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken, selectedCalendars]);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.summary}</Text>
      <Text style={styles.eventTime}>{item.start?.dateTime || item.start?.date}</Text>
    </View>
  );

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
      <Text style={styles.sectionTitle}>Events</Text>
      {renderEventsContent()}
    </View>
  );
};

EventsList.propTypes = {
    accessToken: PropTypes.string,
    selectedCalendars: PropTypes.array,
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
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
});


export default EventsList;