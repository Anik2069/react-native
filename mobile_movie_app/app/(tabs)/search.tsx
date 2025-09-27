import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'

const search = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const { data: movies, loading: movieLoading, error: movieError, reset, refetch: loadMovies } = useFetch(() =>
    fetchMovies({
      query: searchQuery
    })
  );

  useEffect(() => {
    // console.log(movies[0])

    const timeoutId = setTimeout(async () => {
      if (searchQuery) {
        await loadMovies();
      } else {
        reset()
      }
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [searchQuery])


  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies])

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover' />

      <FlatList data={movies}
        renderItem={({ item }) =>
          <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className='px-5'
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20'>
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className='my-5'>
              <SearchBar placeholder='Search ...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {
              movieLoading && (
                <ActivityIndicator size='large' color='#0000ff' className='mt-10 self-center' />
              )
            }

            {
              movieError && (
                <Text className='text-red-500 px-5 my-3'>Error: {movieError?.message}</Text>
              )
            }

            {
              !movieLoading && !movieError && movies?.length > 0 && (
                <Text className='text-white text-xl font-bold'>
                  Search Results for {' '}
                  <Text className='text-accent'>{searchQuery}</Text>
                </Text>
              )
            }

          </>
        }
        ListEmptyComponent={
          !movieLoading && !movieError ? (
            <View className='mt-10 px-4'>
              <Text className="text-center text-gray-500">{searchQuery.trim() ? 'No Movies found' : 'Search for a movie'}</Text>
            </View>
          ) : null
        }
      />

    </View>
  )
}

export default search

const styles = StyleSheet.create({})