import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, Video, Grid, Camera, Image as ImageIcon, Mic, Smile, ThumbsUp } from 'lucide-react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { } from 'expo-router'
import axiosInstance from '@/lib/axios';
import { useAuthInfo } from '@/hooks/useAuthInfo';
import * as SecureStore from 'expo-secure-store';

export default function ChatScreen() {
    const uuserser = { id: '1', name: 'Jacob' }; // Replace with actual user data
    const { user } = useAuthInfo('user');
    const [message, setMessage] = useState([]);
    const [chat, setChat] = useState();
    const [header, setHeader] = useState();
    console.log("user", user?.first_name);
    const { chatid } = useLocalSearchParams();
    console.log("==============", chatid);
    useEffect(() => {
        // Fetch chat data using chatid
        // Example: fetchChatData(chatid).then(data => setChatData(data));  
        axiosInstance.post(`/chats/c/${chatid}`).then((res) => {
            const response = res.data.data;
            setChat(res.data.data);
            const otherParticipant = response.participants.find(
                item => item._id.toString() !== user._id.toString()
            );
            console.log("==============");
            console.log(otherParticipant);

            setHeader(otherParticipant?.first_name);
            axiosInstance.get(`/messages/${response._id}?pageNo=1&pageSize=3`).then((res) => {
                setMessage(res.data.data.reverse());

            }).catch((err) => {
                console.log(err);
            });


        }).catch((err) => {
            console.log(err)
        });

    }
        , [chatid]);

    console.log(message[0]);
    const renderMessage = ({ item }: {
        item: {
            _id: string;
            sender: {
                _id: string;
                first_name: string;
                last_name: string;
                profile_pic: string;
                username: string;
                email: string;
            };
            content: string;
            time: string;
            reactions?: { type: string; count: number }[];
            status?: string;
        }
    }) => {
        const isUser = item?.sender?._id == user._id;
        return (

            <View className={`px-4 py-2 max-w-[80%] ${isUser ? 'self-end' : 'self-start'}`}>
                {!isUser && item._id === '1' && (
                    <View className="items-center justify-center mb-2">
                        <Text className="text-xs text-gray-400">{item.time}</Text>
                    </View>
                )}

                <View className={`rounded-3xl p-3 ${isUser ? 'bg-[#2D7A78]' : 'bg-gray-200'}`}>
                    <Text className={`text-base ${isUser ? 'text-white' : 'text-black'}`}>{item.content}</Text>
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

                {isUser && (
                    <View className="items-end mt-1">
                        <View className="w-5 h-5 rounded-full border border-[#2D7A78] items-center justify-center">
                            <View className="w-3 h-3 rounded-full bg-[#2D7A78]" />
                        </View>
                    </View>
                )}
            </View>

        )
    };
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()} className="mr-2"
                    >
                        <ChevronLeft size={28} color="#2D7A78" />
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(user?.id) + 40}.jpg` }}
                            className="w-10 h-10 mr-3 rounded-full"
                        />
                        <View>
                            <Text className="text-lg font-bold">{header}</Text>
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
                        source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(user?.id) + 40}.jpg` }}
                        className="w-32 h-32 mb-4 rounded-full"
                    />
                    <Text className="text-2xl font-bold">{user?.name}</Text>
                    <Text className="mt-1 text-gray-500">You're friends on QP</Text>
                </View>

                <FlatList
                    data={message}
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