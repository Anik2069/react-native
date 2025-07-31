import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  MessageCircle,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  const { id, name, avatar, type = 'voice' } = useLocalSearchParams();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Request camera permission if video call
    if (type === 'video' && !permission?.granted) {
      requestPermission();
    }

    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, [type, permission]);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    setCallStatus('ended');
    router.back();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return 'Calling...';
    }
  };

  // Show permission request if needed
  if (type === 'video' && !permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (type === 'video' && !permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need camera permission for video calls</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1E21" />
      
      {/* Camera View for Video Calls */}
      {isVideoOn && type === 'video' && permission?.granted ? (
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera} 
            facing={facing}
          >
            {/* Remote user video placeholder */}
            <View style={styles.remoteVideoContainer}>
              <Image
                source={{ uri: avatar }}
                style={styles.remoteVideo}
                blurRadius={10}
              />
              <View style={styles.remoteVideoOverlay}>
                <Image source={{ uri: avatar }} style={styles.remoteAvatar} />
                <Text style={styles.remoteUserName}>{name}</Text>
              </View>
            </View>

            {/* Local video preview */}
            <TouchableOpacity 
              style={styles.localVideoPreview}
              onPress={toggleCameraFacing}
            >
              <View style={styles.localVideoContainer}>
                <Text style={styles.flipText}>Tap to flip</Text>
              </View>
            </TouchableOpacity>
          </CameraView>
        </View>
      ) : (
        // Voice call or video off background
        <View style={styles.voiceBackground}>
          {/* Call Info */}
          <View style={styles.callInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              {callStatus === 'connecting' && (
                <View style={styles.pulseRing} />
              )}
            </View>
            
            <Text style={styles.callerName}>{name}</Text>
            <Text style={styles.callStatus}>{getStatusText()}</Text>
          </View>
        </View>
      )}

      {/* Call Controls Overlay */}
      <View style={styles.controlsOverlay}>
        {/* Top Info (for video calls) */}
        {isVideoOn && type === 'video' && (
          <View style={styles.topInfo}>
            <Text style={styles.videoCallName}>{name}</Text>
            <Text style={styles.videoCallStatus}>{getStatusText()}</Text>
          </View>
        )}

        {/* Call Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={toggleSpeaker}
            >
              <Volume2 
                size={24} 
                color={isSpeakerOn ? "#0084FF" : "#FFFFFF"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
            >
              <MessageCircle size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={toggleMute}
            >
              {isMuted ? (
                <MicOff size={28} color="#FF3B30" />
              ) : (
                <Mic size={28} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.endCallButton]}
              onPress={endCall}
            >
              <PhoneOff size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {type === 'video' && (
              <TouchableOpacity
                style={[styles.controlButton, styles.secondaryButton]}
                onPress={toggleVideo}
              >
                {isVideoOn ? (
                  <Video size={28} color="#FFFFFF" />
                ) : (
                  <VideoOff size={28} color="#FF3B30" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1E21',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  remoteVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  remoteVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 15,
  },
  remoteUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  localVideoPreview: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  localVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  voiceBackground: {
    flex: 1,
    backgroundColor: '#1C1E21',
  },
  callInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  pulseRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: '#0084FF',
    opacity: 0.6,
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  callStatus: {
    fontSize: 16,
    color: '#B0B3B8',
    textAlign: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
  },
  topInfo: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  videoCallName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  videoCallStatus: {
    fontSize: 14,
    color: '#B0B3B8',
  },
  controlsContainer: {
    paddingHorizontal: 40,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});