import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Phone, PhoneCall, Video } from 'lucide-react-native';
import { router } from 'expo-router';

const MOCK_CALLS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    type: 'video',
    status: 'incoming',
    timestamp: '2 hours ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '2',
    name: 'Mike Chen',
    type: 'voice',
    status: 'outgoing',
    timestamp: 'Yesterday',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    type: 'voice',
    status: 'missed',
    timestamp: 'Yesterday',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '4',
    name: 'David Kim',
    type: 'video',
    status: 'outgoing',
    timestamp: '2 days ago',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
];

export default function CallsScreen() {
  const getCallIcon = (type, status) => {
    const color = status === 'missed' ? '#FF3B30' : '#0084FF';
    const size = 20;
    
    if (type === 'video') {
      return <Video size={size} color={color} />;
    }
    return <Phone size={size} color={color} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'missed':
        return '#FF3B30';
      case 'incoming':
        return '#00C851';
      case 'outgoing':
        return '#0084FF';
      default:
        return '#65676B';
    }
  };

  const renderCallItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.callItem}
      onPress={() => router.push({
        pathname: '/call/[id]',
        params: { 
          id: item.id, 
          name: item.name, 
          avatar: item.avatar,
          type: item.type 
        }
      })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.callContent}>
        <Text style={styles.callerName}>{item.name}</Text>
        <View style={styles.callInfo}>
          {getCallIcon(item.type, item.status)}
          <Text style={[styles.callStatus, { color: getStatusColor(item.status) }]}>
            {item.status} • {item.timestamp}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.callButton}
        onPress={() => router.push({
          pathname: '/call/[id]',
          params: { 
            id: item.id, 
            name: item.name, 
            avatar: item.avatar,
            type: 'voice'
          }
        })}
      >
        <PhoneCall size={20} color="#0084FF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
      </View>

      <FlatList
        data={MOCK_CALLS}
        renderItem={renderCallItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callsList}
      />
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
  callsList: {
    paddingVertical: 10,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  callContent: {
    flex: 1,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callStatus: {
    fontSize: 14,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  callButton: {
    padding: 8,
  },
});