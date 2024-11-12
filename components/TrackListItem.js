// src/components/TrackListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TrackListItem = ({ track, onPlay }) => (
  <TouchableOpacity style={styles.container} onPress={() => onPlay(track.id)}>
    <Icon name="music-note" size={24} color="#f39c12" style={styles.icon} />
    <View style={styles.trackInfo}>
      <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
      <Text style={styles.subtitle}>Unknown Artist</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#f39c12" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  icon: {
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#AAAAAA',
  },
});

export default TrackListItem;
