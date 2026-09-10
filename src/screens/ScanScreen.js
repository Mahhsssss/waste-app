import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import globalStyles, { colors } from '../globalStyles';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  // Request permissions if not yet granted
  if (!permission) {
    return <View style={globalStyles.cameraContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={globalStyles.permissionContainer}>
        <Text style={globalStyles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity 
          style={globalStyles.primaryButton} 
          onPress={requestPermission}
        >
          <Text style={globalStyles.primaryButtonText}>Grant Permission</Text>
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
    <View style={globalStyles.cameraContainer}>
      <CameraView style={{ flex: 1 }} ref={(ref) => setCameraRef(ref)}>
        {/* Overlay Back Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 8,
            borderRadius: 20,
          }} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={colors.white} />
        </TouchableOpacity>

        {/* Shutter Button Container */}
        <View 
          style={{
            position: 'absolute',
            bottom: 100,
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity 
            style={globalStyles.captureButton} 
            onPress={takePicture}
            activeOpacity={0.8}
          >
            <View style={globalStyles.innerCaptureCircle} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}