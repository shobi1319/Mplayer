// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, StatusBar, TextInput } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import RNFS from 'react-native-fs';
import { requestStoragePermission } from '../utils/permissions';
import TrackListItem from '../components/TrackListItem';

const HomeScreen = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerInitialized, setPlayerInitialized] = useState(false);

  useEffect(() => {
    const setupPlayer = async () => {
      if (!playerInitialized) {
        const permissionGranted = await requestStoragePermission();
        if (!permissionGranted) return;

        try {
          await TrackPlayer.setupPlayer();
          setPlayerInitialized(true);
        } catch (error) {
          console.error("Error initializing player:", error);
        }
      }

      try {
        const audioFiles = await scanForAudioFiles();
        setTracks(audioFiles);
        setFilteredTracks(audioFiles); // Initially show all tracks
        if (audioFiles.length > 0) {
          await TrackPlayer.add(audioFiles);
        }
      } catch (error) {
        console.error("Error scanning for audio files:", error);
      }
    };

    setupPlayer();

    return () => {
      if (playerInitialized) {
        TrackPlayer.stop();
        TrackPlayer.reset();
      }
    };
  }, [playerInitialized]);

  const scanForAudioFiles = async () => {
    const path = `${RNFS.ExternalStorageDirectoryPath}/Music`;
    const exists = await RNFS.exists(path);
    if (!exists) {
      console.log("Music directory does not exist.");
      return [];
    }

    const audioFiles = [];
    const items = await RNFS.readDir(path);

    let idCounter = 1;
    for (const item of items) {
      if (item.isFile() && (item.name.endsWith('.mp3') || item.name.endsWith('.wav'))) {
        audioFiles.push({
          id: idCounter,
          url: item.path,
          title: item.name,
        });
        idCounter += 1;
      }
    }
    return audioFiles;
  };

  const openPlayerScreen = async (track) => {
    try {
      console.log("Navigating to Player screen with track:", track);  // Debugging line
      await TrackPlayer.skip(track.id);
      await TrackPlayer.play();
      navigation.navigate('Player', { track });
    } catch (error) {
      console.error("Error navigating to player screen:", error);
    }
  };

  // Search filter function
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = tracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTracks(filtered);
    } else {
      setFilteredTracks(tracks); // Show all if search query is empty
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>My Music</Text>
      <Text style={styles.subheader}>Browse Your Collection</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by song title"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Updated FlatList with openPlayerScreen as onPlay */}
      <FlatList
        data={filteredTracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TrackListItem track={item} onPlay={() => openPlayerScreen(item)} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subheader: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
