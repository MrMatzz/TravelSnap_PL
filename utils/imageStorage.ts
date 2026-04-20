import * as FileSystem from 'expo-file-system/legacy';

export const ensureTripFolder = async (tripId: string): Promise<string> => {
  const folderPath = `${FileSystem.documentDirectory}trips/${tripId}/`;
  const dirInfo = await FileSystem.getInfoAsync(folderPath);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
  }
  
  return folderPath;
};

export const saveImageToTrip = async (uri: string, tripId: string): Promise<string> => {
  const folderPath = await ensureTripFolder(tripId);
  const fileName = uri.split('/').pop() || `${Date.now()}.jpg`;
  const newPath = `${folderPath}${fileName}`;
  
  await FileSystem.copyAsync({ from: uri, to: newPath });
  
  return newPath;
};

export const deleteImage = async (uri: string): Promise<void> => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(uri);
  }
};