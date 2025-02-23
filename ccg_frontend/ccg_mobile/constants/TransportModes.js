import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const modes = [
  { mode: 'foot-walking', name: "Walk",  icon: <Ionicons name="walk" size={20} color="#800020" /> },
  { mode: 'cycling-regular', name: "Bike", icon: <MaterialCommunityIcons name="bike" size={20} color="#800020" /> },
  { mode: 'driving-car', name: "Car", icon: <Ionicons name="car" size={20} color="#800020" /> },
  { mode: 'public-transport', name: "Bus", icon: <Ionicons name="bus" size={20} color="#800020" /> },
  { mode: 'concordia-shuttle',name: "Shuttle", icon: <Ionicons name="school" size={20} color="#800020" /> },
];