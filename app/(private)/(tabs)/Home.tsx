import LoadingComponent from "@/components/Loading/Loading";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState, useRef } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import GalleryLayout from "@/components/Layout/GalleryLayout";
import {funcGenresFilter} from "@/utils/genresFilter";

export default function HomePage() {
  const [animeUpcoming, setAnimeUpcoming] = useState<any>(null);
  const [animeOngoing, setAnimeOngoing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const animeRecommendationCacheRef = useRef<any>(null);
  const animeUpcomingCacheRef = useRef<any>(null);
  const animeOngoingCacheRef = useRef<any>(null);


  const fetchAnimeUpcoming = async () => {
    try {
      if (animeUpcomingCacheRef.current) {
        return animeUpcomingCacheRef.current;
      } else {
        const { data, status } = await axios.get(
          "https://api.jikan.moe/v4/seasons/upcoming?limit=15",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (status === 200) {
          animeUpcomingCacheRef.current = funcGenresFilter(data.data).slice(0,12);
          return funcGenresFilter(data.data).slice(0,12);
        }
      }
    } catch (error) {
      throw new Error(`failed fetch anime upcoming : ${error}`);
    }
  };

  const fetchAnimeOngoing = async () => {
    try {
      if (animeOngoingCacheRef.current) {
        return animeOngoingCacheRef.current;
      } else {
        const { data, status } = await axios.get(
          "https://api.jikan.moe/v4/seasons/now?limit=15",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (status === 200) {
          animeOngoingCacheRef.current = funcGenresFilter(data.data).slice(0,12);
          return funcGenresFilter(data.data).slice(0,12);
        }
      }
    } catch (error) {
      throw new Error(`failed fetch anime ongoing : ${error}`);
    }
  };

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const [ animeUpcomingData, animeOngoingData] =
          await Promise.all([
            fetchAnimeUpcoming(),
            fetchAnimeOngoing(),
          ]);
        setAnimeUpcoming(animeUpcomingData);
        setAnimeOngoing(animeOngoingData);
      } catch (error) {
        console.error("Error Please Contact Admin!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeData();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Layout level="1" style={{ flex: 1 }}>
        <View>
          <View style={{ padding: 10, gap: 30 }}>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push("/Upcoming")}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#3366ff",
                  borderRadius: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: "white" }} category="h6">
                  Upcoming Anime
                </Text>
                <Icon
                  name="arrow-ios-forward-outline"
                  fill="white"
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
              {animeUpcoming ? (
                <GalleryLayout data={animeUpcoming} />
              ) : (
                <Text style={{ color: "red" }}>
                  Error Fetching Upcoming Anime
                </Text>
              )}
            </View>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push("/Ongoing")}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#3366ff",
                  borderRadius: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: "white" }} category="h6">
                  Ongoing Anime
                </Text>
                <Icon
                  name="arrow-ios-forward-outline"
                  fill="white"
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
              {animeOngoing ? (
                <GalleryLayout data={animeOngoing} />
              ) : (
                <Text style={{ color: "red" }}>
                  Error Fetching Ongoing Anime
                </Text>
              )}
            </View>
          </View>
        </View>
      </Layout>
    </ScrollView>
  );
}
