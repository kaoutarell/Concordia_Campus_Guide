import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const FloorChangeButton = ({index, maxIndex, setIndex}) =>{
    const increment = ()=>{
        if (index<maxIndex){
            setIndex(index+1);
        };
    }

    const decrement = ()=>{
        if (index>0){
            setIndex(index-1);
        };
    }
    return(
        <View style={styles.view}>
            <TouchableOpacity style={styles.button} onPress={decrement}>
                <Text style={styles.text}>
                    {"< Prev"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={increment}>
                <Text style={styles.text}>
                    {"Next >"}
                </Text>
            </TouchableOpacity>
        </View>
    )

}
export default FloorChangeButton

const styles = StyleSheet.create({
    view:{
        position: "relative",
        marginTop:"55%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    button:{
        padding: 12,
        backgroundColor: "#800020", // Burgundy
        borderRadius: 30, // More rounded button
        alignItems: "center",
        justifyContent: "center",
        width: 100, // Fixed width for consistency
        height: 50, // Fixed height for consistency
        elevation: 5, // Shadow effect
        marginLeft: 10,
        marginRight: 10
    },
    text:{
        color: "white",
        fontSize: 18,
    }
})