// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import './services/trackPlayerService'; // Register the service

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} // Hide the header on the Home screen
      />
      <Stack.Screen 
        name="Player" 
        component={PlayerScreen} 
        options={{ title: 'Now Playing' }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
);


export default App;
