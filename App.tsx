import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView ,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesListScreen from './NotesListScreen';
import NoteDetailScreen from './NotesDetailScreen';

const { GoogleGenerativeAI } = require("@google/generative-ai");
// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a story about a magic backpack.";

const result = await model.generateContent(prompt);
console.log(result.response.text());

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