import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const NotesListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notes from AsyncStorage
  const fetchNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      Alert.alert('Error', 'Failed to load notes.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes(); // Re-fetch notes
    setRefreshing(false); // Reset the refreshing state
  };

  const deleteNote = async (noteId) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      Alert.alert('Success', 'Note deleted successfully.');
    } catch (error) {
      console.error("Failed to delete note:", error);
      Alert.alert('Error', 'Failed to delete the note.');
    }
  };

  const filteredNotes = notes.filter(note =>
    (note.title ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    (note.content ? note.content.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );
  
  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}
    >
      <View style={styles.card}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
        
        {/* Conditionally render the date if available */}
        {item.createdAt && (
          <Text style={styles.noteDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('NoteDetail', { note: item })}
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNote(item.id)}
        >
          <Icon name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const addNote = () => {
    navigation.navigate('NoteDetail', { note: null });
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#fff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Notes..."
          placeholderTextColor="#fff"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNote}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes available</Text>}
      />

      {/* Floating Action Button */}
      <TouchableNativeFeedback onPress={addNote}>
        <View style={styles.fab}>
          <Icon name="add" size={30} color="#fff" />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28428C', // Your app logo color
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    color: '#fff',
  },
  noteItem: {
    marginBottom: 15,
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#777',
    marginVertical: 5,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#28428C', // Your app logo color
    padding: 8,
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: '#28428C', // Your app logo color
    padding: 8,
    borderRadius: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#28428C', // Your app logo color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});

export default NotesListScreen;
