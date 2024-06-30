import { Icon, Layout, Text } from "@ui-kitten/components";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { funcGenresFilter } from "@/utils/genresFilter";
import { Link, router } from "expo-router";

export default function Upcoming() {
  const [data, setData] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const fetchAnime = async () => {
    const { data, status } = await axios.get(
      `https://api.jikan.moe/v4/seasons/upcoming`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          page: page,
          sfw: true,
        },
      }
    );
    if (status === 200) {
      setData((prev: any) => [...prev, ...data.data]);
    }
    if (data.pagination.has_next_page) {
      setHasNextPage(true);
    }
  };
  useEffect(() => {
    fetchAnime();
  }, [page]);
  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/Details?id=${item.mal_id}`);
        }}
        style={{
          borderBottomWidth: 1,
          borderColor: "#C8C8C8",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 10,
          gap: 5,
        }}
      >
        <Image
          style={{ flex: 1 }}
          resizeMode="cover"
          source={{ uri: item.images.webp.large_image_url }}
        />
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <Text category="s1" style={{ fontWeight: "bold", color: "#3366ff" }}>
            {item.title}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text category="s2">Type : </Text>
            <Text category="s2" style={{ color: "#3366ff" }}>
              {item.type ? item.type : "-"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text category="s2">Episodes : </Text>
            <Text category="s2" style={{ color: "#3366ff" }}>
              {item.episodes ? item.episodes : "-"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text category="s2">Status : </Text>
            <Text category="s2" style={{ color: "#3366ff" }}>
              {item.airing ? "Ongoing" : "Completed"}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text category="s2">Year : </Text>
            <Text category="s2" style={{ color: "#3366ff" }}>
              {item.year ? item.year : "-"}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Icon
              name="star"
              style={{ width: 15, height: 15 }}
              fill="#f79041"
            />
            <Text category="s2" style={{ color: "#3366ff" }}>
              {item.score ? item.score : "-"}
            </Text>
          </View>
          <View style={{ width: "100%", display: "flex", gap: 5 }}>
            {item?.genres.length !== 0 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 5,
                }}
              >
                {item?.genres.map((genre: any) => (
                  <Link
                    key={genre.mal_id}
                    href={`/SearchAnime?g=${genre.mal_id}&name=${genre.name}`}
                  >
                    <Layout
                      style={{
                        backgroundColor: "#3366ff",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                      }}
                    >
                      <Text category="s2" style={{ color: "#fff" }}>
                        {genre.name}
                      </Text>
                    </Layout>
                  </Link>
                ))}
              </View>
            ) : (
              <Text style={{ color: "red" }}>Genre Not Available</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const loadMore = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={5}
      />
    </View>
  );
}
