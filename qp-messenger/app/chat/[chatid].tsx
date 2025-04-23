import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, Video, Grid, Camera, Image as ImageIcon, Mic, Smile, ThumbsUp } from 'lucide-react-native';

const MESSAGES = [
    { id: '1', text: '👋', time: '21:32', isUser: false },
    { id: '2', text: 'Hello, Jacob!', time: '16:44', isUser: false },
    {
        id: '3', text: 'How are you doing?', time: '16:44', isUser: false, reactions: [
            { type: 'like', count: 1 },
            { type: 'love', count: 1 },
            { type: 'haha', count: 1 },
            { type: 'total', count: 5 }
        ]
    },
    { id: '4', text: 'I think top two are', time: '16:45', isUser: true, status: 'sent' },
    { id: '5', text: 'Hello, Jacob!\nI think top two are:', time: '16:45', isUser: true, status: 'sent' },
];

export default function ChatScreen() {
    const user = { id: '1', name: 'Jacob' }; // Replace with actual user data
    const [message, setMessage] = useState('');

    const renderMessage = ({ item }: {
        item: {
            id: string; text: string; time: string; isUser: boolean; reactions?: { type: string; count: number }[]; status?: string;
        }
    }) => (
        <View className={`px-4 py-2 max-w-[80%] ${item.isUser ? 'self-end' : 'self-start'}`}>
            {!item.isUser && item.id === '1' && (
                <View className="items-center justify-center mb-2">
                    <Text className="text-xs text-gray-400">{item.time}</Text>
                </View>
            )}

            <View className={`rounded-3xl p-3 ${item.isUser ? 'bg-[#2D7A78]' : 'bg-gray-200'}`}>
                <Text className={`text-base ${item.isUser ? 'text-white' : 'text-black'}`}>{item.text}</Text>
            </View>

            {item.reactions && (
                <View className="flex-row items-center mt-1">
                    <View className="flex-row px-2 py-1 bg-white rounded-full shadow-sm">
                        <Text className="text-xs">👍</Text>
                        <Text className="text-xs">❤️</Text>
                        <Text className="text-xs">😄</Text>
                        {/* <Text className="ml-1 text-xs">{item?.reactions?.total?.count}</Text> */}
                    </View>
                </View>
            )}

            {item.isUser && (
                <View className="items-end mt-1">
                    <View className="w-5 h-5 rounded-full border border-[#2D7A78] items-center justify-center">
                        <View className="w-3 h-3 rounded-full bg-[#2D7A78]" />
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity
                    // onPress={() => navigation.goBack()} className="mr-2"
                    >
                        <ChevronLeft size={28} color="#2D7A78" />
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(user.id) + 40}.jpg` }}
                            className="w-10 h-10 mr-3 rounded-full"
                        />
                        <View>
                            <Text className="text-lg font-bold">{user.name}</Text>
                            <Text className="text-gray-500">Messenger</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row">
                    <TouchableOpacity className="mr-4">
                        <Phone size={24} color="#2D7A78" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Video size={24} color="#2D7A78" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1">
                <View className="items-center py-6">
                    <Image
                        source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(user.id) + 40}.jpg` }}
                        className="w-32 h-32 mb-4 rounded-full"
                    />
                    <Text className="text-2xl font-bold">{user.name}</Text>
                    <Text className="mt-1 text-gray-500">You're friends on QP</Text>
                </View>

                <FlatList
                    data={MESSAGES}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    inverted={false}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="flex-row items-center px-2 py-2 border-t border-gray-200">
                    <View className="flex-row justify-between w-full">
                        <View className="flex-row">
                            <TouchableOpacity className="items-center justify-center w-10 h-10">
                                <Grid size={24} color="#6B7280" />
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center justify-center w-10 h-10">
                                <Camera size={24} color="#6B7280" />
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center justify-center w-10 h-10">
                                <ImageIcon size={24} color="#6B7280" />
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center justify-center w-10 h-10">
                                <Mic size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center flex-1 px-4 mx-2 bg-gray-100 rounded-full">
                            <TextInput
                                className="flex-1 py-2 text-base"
                                placeholder="Aa"
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity>
                                <Smile size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="items-center justify-center w-10 h-10">
                            <ThumbsUp size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}