import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    marginTop: "12%",
    height: '22%', // Ajustez la hauteur de la carte selon vos besoins
    width: '100%',
  },
  searchContainer: {
    // paddingHorizontal: 60,
    width: '80%',
    marginBottom: 10,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    padding: 5,
    // position: 'absolute',
    // top: 100,
    // left: 0,
    // right: 0,
    // zIndex: 100,
    // paddingHorizontal: 10,
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
    backgroundColor: '#800020', // Burgundy
    borderRadius: 5,
    alignItems: 'center',
    color: 'white',
    fontSize: 14,
  },

  rowContainer: {
    flexDirection : 'row',
    justifyContent:'space-betwwen',
  },
  text:{
    fontSize: 12,
  }

});

export default styles;
