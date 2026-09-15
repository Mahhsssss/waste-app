import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import globalStyles, { colors } from '../globalStyles';

const API_URL = "https://mahhsssss--waste-detection-detect.modal.run";

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
    if (!cameraRef.current || loading) return;

    setLoading(true);
    setDetection(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

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
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back">
        {detection && (
          <View style={styles.resultBox}>
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

        <View style={styles.footer}>
          <Pressable 
            style={[styles.scanButton, loading && styles.disabledButton]} 
            onPress={scanTrash}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.scanText}>Classify Waste</Text>
            )}
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}