import LoadingComponent from "@/components/Loading/Loading";
import { funcGenresFilter } from "@/utils/genresFilter";
import { Icon, Layout, Spinner, Text } from "@ui-kitten/components";
import axios from "axios";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";

export default function SearchAnime() {
  const [loading, setLoading] = useState<boolean>(true);
  const [animeSearch, setAnimeSearch] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const { q, g, name } = useLocalSearchParams();

  const queryFetch = async () => {
    const { data, status } = await axios.get("https://api.jikan.moe/v4/anime", {
      params: {
        q: q,
        page: page,
        sfw: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (status === 200) {
      const filteredData = funcGenresFilter(data.data);
      setAnimeSearch((prev) => [...prev, ...filteredData]);
      if (data.pagination.has_next_page) {
        setHasNextPage(true);
      }
      setLoading(false);
    }
  };
  const genreFetch = async () => {
    const { data, status } = await axios.get("https://api.jikan.moe/v4/anime", {
      params: {
        genres: g,
        page: page,
        sfw: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (status === 200) {
      const filteredData = funcGenresFilter(data.data);
      setAnimeSearch((prev) => [...prev, ...filteredData]);

      if (data.pagination.has_next_page) {
        setHasNextPage(true);
      }
      setLoading(false);
    }
  };
  const fetchAnimeSearch = async () => {
    if (q !== undefined) {
      queryFetch();
    } else if (g !== undefined) {
      genreFetch();
    }
  };
  useEffect(() => {
    fetchAnimeSearch();
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
  return loading ? (
    <LoadingComponent />
  ) : (
      <View >
        <Layout level={"1"}>

        <View style={{paddingVertical:10, backgroundColor:"#c8c8c8"}}>

          {q ? (
              <View style={{display:"flex", flexDirection:"row", gap:5, marginLeft:5}}>
                <Text category={
                  'h6'
                }> Anime Search for :</Text>
                <Text category='h6' style={{color:"white"}}>{q.toString()}</Text>
              </View>
          ):(
              <View style={{display:"flex", flexDirection:"row", gap:5, marginLeft:5}}>
                <Text category={
                  'h6'
                }> Genre Search for :</Text>
                <Text category='h6' style={{color:"white"}}>{name ? name : undefined}</Text>
              </View>
            )}
        </View>
        <FlatList
            data={animeSearch}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={5}
        />
        </Layout>
      </View>
  );
}
