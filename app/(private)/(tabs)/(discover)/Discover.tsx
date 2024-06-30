import { View, ScrollView } from "react-native";
import { Layout, Text, Input, Icon } from "@ui-kitten/components";
import { useEffect, useState, useRef } from "react";
import LoadingComponent from "@/components/Loading/Loading";
import { Link, router } from "expo-router";
import SmallAnimeCard from "@/components/AnimeCard/SmallAnimeCard";
import axios from "axios";
import { funcGenresFilter, genresFilter } from "@/utils/genresFilter";
export default function DiscoverPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<any>(null);
  const [topAnime, setTopAnime] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const genreCacheRef = useRef<any>(null);
  const topAnimeCacheRef = useRef<any>(null);

  const fetchGenres = async () => {
    if (genreCacheRef.current) {
      return genreCacheRef.current;
    } else {
      const { data, status } = await axios.get(
        "https://api.jikan.moe/v4/genres/anime",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (status === 200) {
        genreCacheRef.current = data.data.filter((item: any) => {
          return !genresFilter.includes(item.mal_id);
        });
        return data.data.filter((item: any) => {
          return !genresFilter.includes(item.mal_id);
        });
      } else {
        throw new Error("Failed to fetch genres");
      }
    }
  };

  const fetchTopAnime = async () => {
    if (topAnimeCacheRef.current) {
      return topAnimeCacheRef.current;
    } else {
      const { data, status } = await axios.get(
        "https://api.jikan.moe/v4/top/anime?limit=10",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (status === 200) {
        topAnimeCacheRef.current = funcGenresFilter(data.data);
        return funcGenresFilter(data.data);
      } else {
        throw new Error("Failed to fetch top anime");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, topAnimeData] = await Promise.all([
          fetchGenres(),
          fetchTopAnime(),
        ]);
        setGenres(genresData);
        setTopAnime(topAnimeData);
      } catch (error) {
        console.error("Error Please Contact Admin!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? (
    <LoadingComponent />
  ) : (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      <Layout level="1" style={{ padding: 10, gap: 10 }}>
        <View>
          <Input
            placeholder="Search Anime..."
            value={search}
            style={{ borderRadius: 50 }}
            accessoryLeft={<Icon name="search-outline" fill="#3366ff" />}
            onChangeText={(text) => {
              setSearch(text);
            }}
            onSubmitEditing={() => {
              if (search?.trim() !== "") {
                router.push(`/SearchAnime?q=${search}`);
                setSearch("");
              }
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text category="h6">Top 10 Anime :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              {topAnime?.map((item: any) => (
                <SmallAnimeCard
                  key={item.mal_id}
                  id={item.mal_id}
                  image={item.images.webp.large_image_url}
                  title={item.title}
                />
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{ gap: 10 }}>
          <Text category="h6">Search by Genres :</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {genres
              ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
              .map((data: any) => (
                <Link
                  href={`/SearchAnime?g=${data.mal_id}&name=${data.name}`}
                  key={data.mal_id}
                >
                  <Layout
                    key={data.mal_id}
                    level="4"
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 20,
                      backgroundColor: "#3366ff",
                    }}
                  >
                    <Text
                      category="s2"
                      style={{ color: "#FFF", fontWeight: "bold" }}
                    >
                      {data.name} ({data.count})
                    </Text>
                  </Layout>
                </Link>
              ))}
          </View>
        </View>
      </Layout>
    </ScrollView>
  );
}
