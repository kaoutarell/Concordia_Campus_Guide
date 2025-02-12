import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View} from "react-native";

// Monday–Thursday schedules:
const LOY_SCHEDULE_MTH = [
    "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00",
    "11:15", "11:30", "11:45", "12:30", "12:45", "13:00", "13:15", "13:30",
    "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30",
    "15:45", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00",
    "18:15", "18:30"
];
const SGW_SCHEDULE_MTH = [
    "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15",
    "11:30", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "16:00",
    "16:15", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15",
    "18:30"
];
// Friday schedules:
const LOY_SCHEDULE_FRIDAY = [
    "09:15", "09:30", "09:45", "10:15", "10:45", "11:00", "11:15", "12:00",
    "12:15", "12:45", "13:00", "13:15", "13:45", "14:15", "14:30", "14:45",
    "15:15", "15:30", "15:45", "16:45", "17:15", "17:45", "18:15"
];
const SGW_SCHEDULE_FRIDAY = [
    "09:45", "10:00", "10:15", "10:45", "11:15", "11:30", "12:15", "12:30",
    "12:45", "13:15", "13:45", "14:00", "14:15", "14:45", "15:00", "15:15",
    "16:00", "16:45", "17:15", "17:45", "18:15"
];

/**
 * Helper: Given a schedule (array of "HH:mm" strings), returns the number
 * of minutes until the next departure (or null if none remain today).
 */
const getNextDeparture = (schedule) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const timeStr of schedule) {
        const [hour, minute] = timeStr.split(":").map(Number);
        const departureMinutes = hour * 60 + minute;
        if (departureMinutes >= currentMinutes) {
            return departureMinutes - currentMinutes;
        }
    }
    return null;
};

export const BusNavigationInfo = () => {
    const [nextLOY, setNextLOY] = useState("");
    const [nextSGW, setNextSGW] = useState("");

    const updateDepartureTimes = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        if (day === 0 || day === 6) {
            setNextLOY("No shuttle service today");
            setNextSGW("No shuttle service today");
            return;
        }
        if (day === 5) {
            // Friday schedule
            const minutesLOY = getNextDeparture(LOY_SCHEDULE_FRIDAY);
            const minutesSGW = getNextDeparture(SGW_SCHEDULE_FRIDAY);
            setNextLOY(
                minutesLOY !== null
                    ? `${minutesLOY} minute(s)`
                    : "No more shuttles today"
            );
            setNextSGW(
                minutesSGW !== null
                    ? `${minutesSGW} minute(s)`
                    : "No more shuttles today"
            );
        } else {
            // Monday–Thursday schedule
            const minutesLOY = getNextDeparture(LOY_SCHEDULE_MTH);
            const minutesSGW = getNextDeparture(SGW_SCHEDULE_MTH);
            setNextLOY(
                minutesLOY !== null
                    ? `${minutesLOY} minute(s)`
                    : "No more shuttles today"
            );
            setNextSGW(
                minutesSGW !== null
                    ? `${minutesSGW} minute(s)`
                    : "No more shuttles today"
            );
        }
    };

    useEffect(() => {
        updateDepartureTimes();
        const timer = setInterval(updateDepartureTimes, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
                Next shuttle from Loyola: {nextLOY}
            </Text>
            <Text style={styles.infoText}>Next shuttle from SGW: {nextSGW}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 8,
    },
    infoText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
});