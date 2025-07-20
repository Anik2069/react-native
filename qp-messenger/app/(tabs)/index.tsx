
import { useAuthInfo } from '@/hooks/useAuthInfo';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, SafeAreaView, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthInfo('user');
  const ActiveUser = ({ item }: {
    item: {
      _id: string;
      name: string;
      isGroupChat: boolean;
      lastmessage: string; time: string;
      isActive: boolean; isRecent: boolean;
      recentTime: string;
      unread: number;
      participants: [],
      lastMessage: {
        _id: string;
        content: string;
        sender: {
          _id: string;
          first_name: string;
          last_name: string;
          profile_pic: string;
          username: string;

        }
      }
    }
  }) => {

    const imageUri = `https://qposs.com:82/uploads/compressed-1744180361737-6514147376594264b1103efe-1744190982680-croppedImageProfile.png`;
    // console.log(imageUri);r

    let receiverId;
    const otherParticipant = item.participants.find(
      item => item._id.toString() !== user._id.toString()
    );

    console.log(otherParticipant?.first_name, "others");

    receiverId = otherParticipant?._id;

    console.log("==============");
    console.log(receiverId);
    console.log("==============");
    return (
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => {
          router.push(`/chat/${otherParticipant?._id}`);
        }}
      >
        <View className="relative mr-3">
          <View className="overflow-hidden bg-gray-300 rounded-full w-14 h-14">
            <Image
              source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(item.id) + 20}.jpg` }}
              className="w-full h-full"
            />
          </View>
          {item.isActive && (
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
          {item.isRecent && (
            <View className="absolute bottom-0 left-0 px-1 bg-gray-200 rounded-full">
              <Text className="text-xs">{item.recentTime}</Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold">{otherParticipant?.first_name}</Text>
            <Text className="text-sm text-gray-500">{item.time}</Text>
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-gray-500" numberOfLines={1}>{item?.lastMessage?.content}</Text>
            {item.unread > 0 ? (
              <View className="bg-[#2D7A78] rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs text-white">{item.unread}</Text>
              </View>
            ) : (
              <View className="items-center justify-center w-6 h-6">
                <View className="w-5 h-5 rounded-full border border-[#2D7A78] items-center justify-center">
                  <View className={`w-3 h-3 rounded-full ${item.isActive ? 'bg-[#2D7A78]' : 'bg-gray-300'}`} />
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const [chats, setChats] = useState();
  useEffect(() => {
    console.log('HomeScreen mounted');
    axiosInstance.get('chats').then((res) => {
      console.log(res.data.data[0], "res.data");
      setChats([res.data.data[0]]);
    });
  }, [])

  return (
    <SafeAreaView className="flex-1 mt-10 bg-white">
      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="flex-row items-center">
          <View className="relative mr-2">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              className="w-10 h-10 rounded-full"
            />
            <View className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-1 -right-1">
              <Text className="text-xs font-bold text-white">9+</Text>
            </View>
          </View>
          <Text className="text-2xl font-bold">Chat</Text>
        </View>
        <TouchableOpacity className="items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          {/* <Edit size={20} color="#000" /> */}
        </TouchableOpacity>
      </View>

      <View className="px-4 py-2">
        <View className="flex-row items-center px-4 py-2 bg-gray-100 rounded-full">
          {/* <Search size={20} color="#6B7280" /> */}
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search"
          />
        </View>
      </View>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
        {ACTIVE_USERS.map(user => renderActiveUser({ item: user }))}
      </ScrollView> */}

      <FlatList
        data={chats}
        renderItem={ActiveUser}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <View className="h-px ml-20 bg-gray-100" />}
      />
    </SafeAreaView>
  )
}

