import { Image, StyleSheet, Platform, SafeAreaView, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';


export default function HomeScreen() {
  const CHATS = [
    { id: '1', name: 'Tanim Khan', message: 'You: Thanks Bro...', time: '5:04 PM', unread: 3, isActive: true },
    { id: '2', name: 'Haddatul moNir', message: 'You: bye...', time: '4:00 PM', unread: 0, isActive: true, isRecent: true, recentTime: '11m' },
    { id: '3', name: 'Haddatul moNir', message: 'You: bye...', time: '4:00 PM', unread: 0, isActive: true, isRecent: true, recentTime: '11m' },
    { id: '4', name: 'Haddatul moNir', message: 'You: bye...', time: '4:00 PM', unread: 0, isActive: true, isRecent: true, recentTime: '11m' },
    { id: '5', name: 'Dev Teaam', message: 'You: bye...', time: '4:00 PM', unread: 0, isActive: false },
    { id: '6', name: 'Haddatul moNir', message: 'You: bye...', time: '4:00 PM', unread: 0, isActive: true, isRecent: true, recentTime: '11m' },
    { id: '7', name: 'Shaikh hasan', message: 'You: ok...', time: '7:08 AM', unread: 0, isActive: false },
  ];

  const ActiveUser = ({ item }: { item: { id: string; name: string; message: string; time: string; isActive: boolean; isRecent: boolean; recentTime: string; unread: number } }) => {
    const gender = parseInt(item.id) % 2 === 0 ? 'men' : 'women';
    const imageId = 20 + parseInt(item.id);
    const imageUri = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${parseInt(item.id) + 20}.jpg`;
    console.log(imageUri);
    return (
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
      // onPress={() => navigation.navigate('Chat', { user: item })}
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
            <Text className="text-base font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.time}</Text>
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-gray-500" numberOfLines={1}>{item.message}</Text>
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
        data={CHATS}
        renderItem={ActiveUser}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View className="h-px ml-20 bg-gray-100" />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
