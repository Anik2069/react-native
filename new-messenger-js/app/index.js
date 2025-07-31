import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MessageCircle, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = () => {
    // Simple validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!isLogin && !fullName) {
      alert('Please enter your full name');
      return;
    }

    // Navigate to main app
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MessageCircle size={60} color="#0084FF" />
            </View>
            <Text style={styles.appName}>Messenger</Text>
            <Text style={styles.tagline}>
              {isLogin ? 'Welcome back!' : 'Connect with friends and family'}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#65676B"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#65676B"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#65676B"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#65676B" />
                ) : (
                  <Eye size={20} color="#65676B" />
                )}
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#65676B"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#65676B" />
                  ) : (
                    <Eye size={20} color="#65676B" />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Switch Auth Mode */}
          <View style={styles.switchSection}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchButton}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#65676B',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#1C1E21',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  authButton: {
    backgroundColor: '#0084FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#0084FF',
    fontSize: 14,
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#65676B',
    fontSize: 14,
  },
  switchButton: {
    color: '#0084FF',
    fontSize: 14,
    fontWeight: '600',
  },
});