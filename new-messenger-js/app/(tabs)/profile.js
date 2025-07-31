import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3 } from 'lucide-react-native';

export default function ProfileScreen() {
  const menuItems = [
    { icon: Settings, title: 'Account Settings', subtitle: 'Privacy, security, change phone number' },
    { icon: Bell, title: 'Notifications', subtitle: 'Messages, group chats, and others' },
    { icon: Shield, title: 'Privacy', subtitle: 'Block contacts, disappearing messages' },
    { icon: HelpCircle, title: 'Help', subtitle: 'Help center, contact us, privacy policy' },
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <item.icon size={20} color="#0084FF" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'
              }}
              style={styles.profileAvatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>Emily Rodriguez</Text>
          <Text style={styles.profileStatus}>Available</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0084FF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 16,
    color: '#65676B',
  },
  menuSection: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#65676B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 10,
  },
});