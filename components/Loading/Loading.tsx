import { Spinner } from "@ui-kitten/components";

import { View } from "react-native";

export default function LoadingComponent() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner size="giant" />
    </View>
  );
}
