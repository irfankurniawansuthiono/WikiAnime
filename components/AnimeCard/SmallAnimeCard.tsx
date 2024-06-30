import { Text } from "@ui-kitten/components";
import { Link } from "expo-router";
import { View, Image } from "react-native";

export default function SmallAnimeCard({
  image,
  title,
  id,
}: {
  image: string;
  title: string;
  id: string;
}) {
  return (
    <Link href={`/Details?id=${id}`}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          borderColor: "#3366ff",
          borderWidth: 3,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 250 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              flex: 1,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </Link>
  );
}
