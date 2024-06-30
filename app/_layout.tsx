import { Stack } from "expo-router";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            options={{ headerShown: true, headerTitle: "Back" }}
          />
          <Stack.Screen
            name="ResetPassword"
            options={{ headerShown: true, headerTitle: "Reset Password" }}
          />

          <Stack.Screen name="(private)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}
