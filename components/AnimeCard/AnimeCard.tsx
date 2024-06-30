import { Image, View } from "react-native";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { useEffect, useState } from "react";
import { ExternalLink } from "../ExternalLink";
import { router } from "expo-router";

export default function AnimeCard({ malId, data, content, date, user }: any) {
  return (
    <Layout>
      <Card id={malId.toString()}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 15,
          }}
        >
          {data.images && data.images.webp && data.images.webp.image_url && (
            <Image
              source={{ uri: data.images.webp.image_url }}
              style={{
                flex: 0.5,
                resizeMode: "contain",
              }}
            />
          )}
          <View
            style={{
              flex: 1,
              display: "flex",
              gap: 10,
              justifyContent: "space-around",
            }}
          >
            <Text
              category="s1"
              style={{ fontWeight: "bold", color: "#3366ff" }}
            >
              {data.title}
            </Text>
            <View>
              <Text category="s2" style={{ fontWeight: "bold" }}>
                Recommended By :
              </Text>
              <ExternalLink href={user.url}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text category="s2" style={{ color: "#3366ff" }}>
                    {user.username}
                  </Text>
                  <Icon
                    name="external-link-outline"
                    fill="#3366ff"
                    style={{ width: 20, height: 20, marginLeft: 5 }}
                  />
                </View>
              </ExternalLink>
            </View>
            <Button
              accessoryLeft={<Icon name="info-outline" />}
              status="info"
              size="small"
              onPress={() => {
                router.push(`/Details?id=${malId}`);
              }}
              style={{
                width: "60%",
              }}
            >
              Details
            </Button>
          </View>
        </View>
      </Card>
    </Layout>
  );
}
