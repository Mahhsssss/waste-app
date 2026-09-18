import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../globalStyles';

const API_URL = "https://mahhsssss--waste-detection-detect.modal.run";

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>We need your permission to use the camera.</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isUploading) {
      try {
        setIsUploading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });

        if (photo?.uri) {
          // Prepare form-data to send to your Modal detection endpoint
          const formData = new FormData();
          
          // Universal React Native image format compatible with Expo fetch
          formData.append('file', {
            uri: photo.uri,
            name: 'waste_scan.jpg',
            type: 'image/jpeg',
          });

          const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            // Do NOT manually set Content-Type header; fetch handles boundary automatically
          });

          if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
          }

          const result = await response.json();

          // Navigate to your results/history screen passing both the local image and API detection output
          navigation.navigate('HistoryTab', { 
            scannedImage: photo.uri, 
            detectionResult: result 
          });
        }
      } catch (error) {
        console.warn('Detection error:', error);
        // Fallback navigation in case of temporary network timeout
        navigation.navigate('HistoryTab', { scannedImage: cameraRef.current ? photo?.uri : null });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        {/* Top Header */}
        <SafeAreaView style={styles.topHeader}>
          <Text style={styles.screenTitle}>Hazard Scanner</Text>
        </SafeAreaView>

        {/* Floating Capture Overlay */}
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <View style={styles.captureWrapper}>
            <Text style={styles.captureInstruction}>
              {isUploading ? 'Analyzing Waste...' : 'Classify Waste'}
            </Text>
            <TouchableOpacity
              style={[styles.captureButtonOuter, isUploading && { opacity: 0.6 }]}
              onPress={takePicture}
              disabled={isUploading}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner}>
                {isUploading ? (
                  <ActivityIndicator size="small" color={colors.primary800} />
                ) : (
                  <Ionicons name="camera" size={26} color={colors.primary800} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: colors.primary600,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  topHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? spacing.xs : spacing.md,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  captureWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  captureInstruction: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  captureButtonOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});