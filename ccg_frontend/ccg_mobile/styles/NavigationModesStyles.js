import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: "6%", 
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1, 
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10, 
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 1, 
  },
  input: {
    width: '100%', 
    height: 40,
    fontSize: 16,
    paddingVertical: 0, 
  },
  navModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center', 
    height: 40, 
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    position: 'absolute',
    top: 100, 
    left: 0,
    right: 0,
    zIndex: 100, 
    paddingHorizontal: 10,
  },
  navMode: {
    alignItems: 'center',
    padding: 10,
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
});

export default styles;
