import {StyleSheet, Text, View, Dimensions} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import {formatDuration} from "../../../utils";
import React from "react";
import PropTypes from 'prop-types';

const { width } = Dimensions.get("window");

export default function DurationAndDistanceInfo({ duration, distance }) {
    return (
        <View style={styles.infoBand}>
            <View style={styles.infoItem}>
                <FontAwesome5 name="clock" size={20} color="#fff" />
                <Text style={styles.infoText}>
                    {duration ? formatDuration(duration) : 'Duration not available'}
                </Text>
            </View>
            <View style={styles.infoItem}>
                <FontAwesome5 name="road" size={20} color="#fff" />
                <Text style={styles.infoText}>
                    {distance
                        ? (distance / 1000).toFixed(2) + ' km'
                        : 'Distance not available'}
                </Text>
            </View>
        </View>
    );
}

DurationAndDistanceInfo.propTypes = {
    duration: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
    infoBand: {
        width: '100%',
        // marginBottom: 10,
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
        color: '#fff',
        marginLeft: 8,
        maxWidth: width - 80,
    },
});