import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView ,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NotesListScreen from './NotesListScreen';
import NoteDetailScreen from './NotesDetailScreen';


const Stack = createStackNavigator();

const App = () => {


  return (
    <NavigationContainer>
     
        <StatusBar />
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator>
          
          <Stack.Screen name="Notes" component={NotesListScreen} />
          <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
          </Stack.Navigator>
        </SafeAreaView>
    
    </NavigationContainer>
  );
};

export default App;