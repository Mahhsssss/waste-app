import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

/* * GLOBAL STYLES LINK:
 * Add nativewind/global.css hooks here when created
 */

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  // Request permissions if not yet granted
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle Photo Capture Action
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        Alert.alert("Success", `Photo captured: ${photo.uri}`);
        // Backend logic: Pass photo.uri to your scrap recognition API here
      } catch (error) {
        Alert.alert("Error", "Could not capture image.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)}>
        {/* Overlay Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>

        {/* Shutter Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.innerCaptureCircle} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// Styling (Can migrate to global.css)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7fee7',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#374151',
  },
  permissionButton: {
    backgroundColor: '#84cc16',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#1a2e05',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100, // Kept clear of the bottom navigation bar
    alignSelf: 'center',
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#84cc16',
  },
});