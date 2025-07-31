import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    sender: 'other',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished a project at work. How about you?',
    sender: 'me',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    text: 'That\'s awesome! What kind of project was it?',
    sender: 'other',
    timestamp: '10:33 AM',
  },
  {
    id: '4',
    text: 'It was a mobile app for our client. Really challenging but fun to work on!',
    sender: 'me',
    timestamp: '10:35 AM',
  },
  {
    id: '5',
    text: 'Sounds exciting! I\'d love to hear more about it sometime.',
    sender: 'other',
    timestamp: '10:36 AM',
  },
];

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={[
          styles.messageTime,
          isMe ? styles.myMessageTime : styles.otherMessageTime
        ]}>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Image source={{ uri: avatar }} style={styles.headerAvatar} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>Active now</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push({
              pathname: '/call/[id]',
              params: { 
                id: id, 
                name: name, 
                avatar: avatar,
                type: 'voice'
              }
            })}
          >
            <Phone size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push({
              pathname: '/call/[id]',
              params: { 
                id: id, 
                name: name, 
                avatar: avatar,
                type: 'video'
              }
            })}
          >
            <Video size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#65676B"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : {}]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#65676B"} />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0084FF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesContent: {
    paddingVertical: 15,
  },
  messageContainer: {
    marginVertical: 3,
    paddingHorizontal: 15,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: '#E4E6EA',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1C1E21',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 5,
  },
  myMessageTime: {
    color: '#65676B',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#65676B',
    textAlign: 'left',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: '#F8F9FA',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E6EA',
  },
  sendButtonActive: {
    backgroundColor: '#0084FF',
  },
});