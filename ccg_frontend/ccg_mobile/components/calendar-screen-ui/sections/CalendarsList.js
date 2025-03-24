import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const CalendarsList = ({ accessToken, selectedCalendars, onSelectCalendar }) => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCalendars = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setCalendars(data.items || []);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, [accessToken]);

  const toggleCalendarSelection = calendar => {
    if (selectedCalendars.find(item => item.id === calendar.id)) {
      onSelectCalendar(selectedCalendars.filter(item => item.id !== calendar.id));
    } else {
      onSelectCalendar([...selectedCalendars, calendar]);
    }
  };

  const renderCalendarItem = ({ item }) => {
    const isSelected = !!selectedCalendars.find(cal => cal.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.calendarItem, isSelected && styles.selectedItem]}
        onPress={() => toggleCalendarSelection(item)}
      >
        <View style={styles.calendarItemContainer}>
          <Text style={styles.calendarTitle}>{item.summary}</Text>
          {isSelected && <Text style={styles.tick}>✔️</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Select Calendars</Text>
      {loading ? (
        <Text>Loading calendars...</Text>
      ) : (
        <FlatList data={calendars} keyExtractor={item => item.id} renderItem={renderCalendarItem} />
      )}
    </View>
  );
};

CalendarsList.propTypes = {
  accessToken: PropTypes.string,
  selectedCalendars: PropTypes.array,
  onSelectCalendar: PropTypes.func,
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

export default CalendarsList;
