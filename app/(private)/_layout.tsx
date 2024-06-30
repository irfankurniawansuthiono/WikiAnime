import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { getAccountData } from "@/utils/storage";
export default function PrivateLayout() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccountData();
      if (data.status === 404) {
        router.replace("/");
      } else {
        router.replace("/Home");
      }
    };
    fetchData();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        options={{
          title: "Anime Details",
          headerTitleStyle: {
            color: "#3366ff",
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="SearchAnime"
        options={{
          title: "Search Anime",
          headerTitleStyle: {
            color: "#3366ff",
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Ongoing"
        options={{
          title: "ONGOING",
          headerTitleStyle: {
            color: "#3366ff",
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Upcoming"
        options={{
          title: "UPCOMING",
          headerTitleStyle: {
            color: "#3366ff",
            fontWeight: "bold",
          },
        }}
      />
       
    </Stack>
  );
}
