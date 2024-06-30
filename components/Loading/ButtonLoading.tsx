import { View } from "react-native";
import { Spinner } from "@ui-kitten/components";

export default function ButtonLoading() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Spinner size="small" status="basic" />
    </View>
  );
}
