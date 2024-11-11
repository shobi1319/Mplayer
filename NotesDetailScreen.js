import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const NoteDetailScreen = ({ route, navigation }) => {
  const { note } = route.params || {};
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [fontSize, setFontSize] = useState(16);
  const [titleFontSize, setTitleFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: note ? 'Edit Note' : 'New Note',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={saveNote}>
          <Icon name="save" size={24} color="#28428C" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, note, title, content]);

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Empty Note", "Please enter a title or content before saving.");
      return;
    }

    const newNote = {
      id: note ? note.id : Date.now().toString(),
      title,
      content,
    };

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      const notesArray = existingNotes ? JSON.parse(existingNotes) : [];

      if (note) {
        const updatedNotes = notesArray.map(n => (n.id === note.id ? newNote : n));
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        notesArray.push(newNote);
        await AsyncStorage.setItem('notes', JSON.stringify(notesArray));
      }

      Alert.alert('Success', 'Note saved successfully.');
      if (navigation.canGoBack()) {
        navigation.navigate('Notes');
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to save note:", error);
      Alert.alert('Error', 'Failed to save the note.');
    }
  };

  const addBulletPoint = () => {
    setContent(content + '\n• '); // Adds a bullet point to the content
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 2); // Increases the font size
  };

  const decreaseFontSize = () => {
    if (fontSize > 10) setFontSize(fontSize - 2); // Decreases the font size
  };

  const increaseTitleFontSize = () => {
    setTitleFontSize(titleFontSize + 2);
  };

  const decreaseTitleFontSize = () => {
    if (titleFontSize > 18) setTitleFontSize(titleFontSize - 2);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <TextInput
            style={[styles.titleInput, { fontSize: titleFontSize, fontFamily }]}
            placeholder="Title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          {/* Only show font adjustment buttons for title if keyboard is not visible */}
          {!keyboardVisible && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.fontButton} onPress={decreaseTitleFontSize}>
                <Icon name="remove" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.fontButton} onPress={increaseTitleFontSize}>
                <Icon name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={[styles.contentInput, { fontSize, fontFamily }]}
            placeholder="Write your note here..."
            placeholderTextColor="#aaa"
            value={content}
            onChangeText={setContent}
            multiline
          />

          {/* Only show font adjustment and bullet button when keyboard is not visible */}
          {!keyboardVisible && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.fontButton} onPress={decreaseFontSize}>
                <Icon name="remove" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.fontButton} onPress={increaseFontSize}>
                <Icon name="add" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bulletButton} onPress={addBulletPoint}>
                <Icon name="format-list-bulleted" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Show font picker when keyboard is not visible */}
          {!keyboardVisible && (
            <Picker
              selectedValue={fontFamily}
              style={styles.fontPicker}
              onValueChange={(itemValue) => setFontFamily(itemValue)}
            >
              <Picker.Item label="Arial" value="Arial" />
              <Picker.Item label="Courier" value="Courier" />
              <Picker.Item label="Roboto" value="Roboto" />
              <Picker.Item label="Georgia" value="Georgia" />
            </Picker>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Icon name="check-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    padding: 10,
    color: '#333',
  },
  contentInput: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    color: '#333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    textAlignVertical: 'top',
  },
  fontButton: {
    backgroundColor: '#28428C',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  bulletButton: {
    backgroundColor: '#28428C',
    borderRadius: 50,
    padding: 10,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  fontPicker: {
    height: 50,
    width: '100%',
    marginVertical: 15,
    color: '#28428C',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#28428C',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
});

export default NoteDetailScreen;
