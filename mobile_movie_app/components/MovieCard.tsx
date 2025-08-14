import { icons } from "@/constants/icons"
import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"

const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <Link href={`/movies/${movie.id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                <Image className="w-full h-52 rounded-lg"
                    source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png' }} />
                <Text className="text-white text-sm font-bold mt-2" numberOfLines={1}>{movie.title}</Text>

                <View className="flex-row items-center justify-start gap-x-1">
                    <Image source={icons.star} className="size-4" />
                    <Text className="text-white text-xs font-bold uppercase">{Math.round(movie.vote_average / 2)}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-light-300 text-xs font-medium mt-1">{movie.release_date.split('-')[0]}</Text>
                </View>

            </TouchableOpacity>
        </Link>
    )
}
export default MovieCard