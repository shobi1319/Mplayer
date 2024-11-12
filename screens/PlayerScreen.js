// src/screens/PlayerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TrackPlayer, { usePlaybackState, State, useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';

const PlayerScreen = ({ route }) => {
  const { track } = route.params;
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    const playSelectedTrack = async () => {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      await TrackPlayer.play();
    };

    playSelectedTrack();
  }, [track]);

  const togglePlayPause = async () => {
    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const playNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log("No next track available.");
    }
  };

  const playPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.log("No previous track available.");
    }
  };

  const seekTo = async (position) => {
    await TrackPlayer.seekTo(position);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.trackTitle}>{track.title}</Text>
      <Text style={styles.artist}>Unknown Artist</Text>

      {/* Progress bar */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#f77f00"
        maximumTrackTintColor="#e0e0e0"
        thumbTintColor="#f77f00"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{Math.floor(progress.position / 60)}:{Math.floor(progress.position % 60).toString().padStart(2, '0')}</Text>
        <Text style={styles.timeText}>{Math.floor(progress.duration / 60)}:{Math.floor(progress.duration % 60).toString().padStart(2, '0')}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
          <Icon name="skip-previous" size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Icon name={playbackState === State.Playing ? "pause" : "play"} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={styles.controlButton}>
          <Icon name="skip-next" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8f9fa',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  timeText: {
    color: '#f8f9fa',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    marginHorizontal: 15,
  },
});

export default PlayerScreen;
