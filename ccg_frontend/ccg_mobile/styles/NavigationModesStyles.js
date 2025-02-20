import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    marginTop: "12%",
    height: '22%',
    width: '100%',
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
    zIndex: 1,
  },
  inputSwapContainer: {
    position: "relative", // Ensures correct positioning for swap button
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    height: 45, // Ensures a good clickable area
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  swapButtonContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    right:"auto",
    zIndex: 2,
    transform: [{ translateY: -25 }],
  },
  swapButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#800020",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  navModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    padding: 5,
  },
  navMode: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.14,
  },
  activeMode: {
    backgroundColor: '#800020',
  },
  button: {
    padding: 10,
    backgroundColor: '#800020',
    borderRadius: 5,
    alignItems: 'center',
    color: 'white',
    fontSize: 14,
  },
});

export default styles;
