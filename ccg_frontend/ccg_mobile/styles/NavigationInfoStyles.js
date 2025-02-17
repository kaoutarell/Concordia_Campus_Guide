import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
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
    },
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
    startButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
        marginTop: 10,
        marginBottom: 30,
    },
    startButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#800020',
    },
});

export default styles;
