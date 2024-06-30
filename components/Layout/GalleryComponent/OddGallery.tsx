import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
export default function OddGallery({ data }: any) {
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/Details?id=${data[0].mal_id}`)}
        >
          <Image
            source={{ uri: data[0].images.webp.large_image_url }}
            resizeMode="cover"
            style={{
              width: 225,
              height: 305,
              borderRadius: 8,
              overflow: "hidden",
            }}
          />
        </TouchableOpacity>
        <View style={{ gap: 5, flex: 1 }}>
          <TouchableOpacity
            onPress={() => router.push(`/Details?id=${data[1].mal_id}`)}
          >
            <Image
              source={{ uri: data[1].images.webp.large_image_url }}
              style={{ width: 110, height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/Details?id=${data[2].mal_id}`)}
          >
            <Image
              source={{ uri: data[2].images.webp.large_image_url }}
              style={{ width: 110, height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <TouchableOpacity
            onPress={() => router.push(`/Details?id=${data[3].mal_id}`)}
          >
            <Image
              source={{ uri: data[3].images.webp.large_image_url }}
              style={{ width: 110, height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/Details?id=${data[4].mal_id}`)}
          >
            <Image
              source={{ uri: data[4].images.webp.large_image_url }}
              style={{ width: 110, height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/Details?id=${data[5].mal_id}`)}
          >
            <Image
              source={{ uri: data[5].images.webp.large_image_url }}
              style={{ width: 110, height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
