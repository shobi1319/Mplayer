// src/utils/permissions.js
import { request, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';

export const requestStoragePermission = async () => {
  const permission = Platform.OS === 'android' 
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE 
    : PERMISSIONS.IOS.MEDIA_LIBRARY;

  const result = await request(permission);
  return result === 'granted';
};
