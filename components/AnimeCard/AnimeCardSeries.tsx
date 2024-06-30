import { View, ScrollView } from "react-native";
import AnimeCard from "./AnimeCard";

export default function AnimeCardSeries({
  malId,
  data,
  content,
  date,
  user,
}: any) {
  return (
    <View key={malId}>
      <ScrollView>
        {data.length !== 0 &&
          data.map((item: any) => (
            <AnimeCard
              key={item.mal_id}
              malId={item.mal_id}
              data={item}
              content={content}
              date={date}
              user={user}
            />
          ))}
      </ScrollView>
    </View>
  );
}
