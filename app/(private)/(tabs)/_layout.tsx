import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
      <Tabs
        screenOptions={{
          tabBarStyle: { height: 60 },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "WikiAnime",
            headerStyle: {
              borderBottomWidth: 2,
              borderColor: "#3366ff",
            },
            headerTitleStyle: {
              color: "#3366ff",
              fontVariant: ["small-caps"],
              fontWeight: "bold",
              fontSize: 30,
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
            tabBarLabelStyle: {
              marginBottom: 5,
            },
          }}
        />
        <Tabs.Screen
          name="(discover)/Discover"
          options={{
            title: "Discover Anime",
            headerStyle: {
              borderBottomWidth: 2,
              borderColor: "#3366ff",
            },
            headerTitleStyle: {
              color: "#3366ff",
              fontWeight: "bold",
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "search" : "search-outline"}
                color={color}
              />
            ),
            tabBarLabelStyle: {
              marginBottom: 5,
            },
          }}
        />
          <Tabs.Screen
          name="(bookmarks)/Bookmarks"
          options={{
            title: "My Bookmarks",
            headerStyle: {
              borderBottomWidth: 2,
              borderColor: "#3366ff",
            },
            headerTitleStyle: {
              color: "#3366ff",
              fontWeight: "bold",
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "bookmark" : "bookmark-outline"}
                color={color}
              />
            ),
            tabBarLabelStyle: {
              marginBottom: 5,
            },
          }}
        />
        <Tabs.Screen
          name="(profile)/Profile"
          options={{
            title: "My Profile",
            headerStyle: {
              borderBottomWidth: 2,
              borderColor: "#3366ff",
            },
            headerTitleStyle: {
              color: "#3366ff",
              fontWeight: "bold",
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
            tabBarLabelStyle: {
              marginBottom: 5,
            },
          }}
        />
      </Tabs>
  );
}
