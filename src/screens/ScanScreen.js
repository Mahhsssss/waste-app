import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import globalStyles, { colors } from '../globalStyles';

const API_URL = "https://mahhsssss--waste-detection-detect.modal.run";

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  
  // Added missing states
  const [loading, setLoading] = useState(false);
  const [detection, setDetection] = useState(null);

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

  // Handle Photo Capture & API Action
  const takePicture = async () => {
    if (!cameraRef || loading) return;

    setLoading(true);
    setDetection(null);

    try {
      const photo = await cameraRef.takePictureAsync({ quality: 0.7 });

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'trash.jpg',
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Server Request Failed');
      
      const result = await response.json();
      setDetection(result);
    } catch (e) {
      console.error(e);
      setDetection({ class: "Connection Error", confidence: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. CameraView is now entirely empty to prevent child-rendering warnings/crashes */}
      <CameraView 
        ref={(ref) => setCameraRef(ref)} 
        style={StyleSheet.absoluteFillObject} 
        facing="back"
      />

      {/* 2. All overlay UI elements are now correct siblings positioned on top */}
      {detection && (
        <View style={styles.resultBox} pointerEvents="box-none">
          <Text style={styles.label}>
            {detection.class !== "Connection Error" && detection.class !== "nothing" ? "🗑️ " : "⚠️ "}
            {detection.class.toUpperCase()}
          </Text>
          {detection.confidence > 0 && (
            <Text style={styles.conf}>
              {(detection.confidence * 100).toFixed(1)}% Confidence
            </Text>
          )}
        </View>
      )}

      <View style={styles.footer} pointerEvents="box-none">
        <Pressable 
          style={[styles.scanButton, loading && styles.disabledButton]} 
          onPress={takePicture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.scanText}>Classify Waste</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  resultBox: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  conf: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  scanButton: {
    backgroundColor: colors.primary600 || '#2e7d32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});