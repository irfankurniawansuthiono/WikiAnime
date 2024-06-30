import {
  Layout,
  Text,
  Input,
  Icon,
  Divider,
  Button,
} from "@ui-kitten/components";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { router } from "expo-router";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<null | string>(null);
  const [emailError, setEmailError] = useState<boolean>(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailChange = (e: string) => {
    if (e === "" || !emailRegex.test(e)) {
      setEmailError(true);
    } else {
      setEmail(e);
    }
  };

  const handleResetPasswordLink = async () => {
    try {
      if (email !== null && email !== "") {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);
        alert("please check your mail inbox!");
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Layout
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text category="h4">Reset Password Page</Text>
        <Text category="s2">
          Please enter the email address you want to recover
        </Text>
        <Divider style={{ borderWidth: 1 }} />
        <KeyboardAvoidingView behavior="padding">
          <Layout
            level="2"
            style={{
              marginTop: 20,
              width: 300,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 10,
            }}
          >
            <Text>Email Address : </Text>
            <Input
              accessoryLeft={<Icon name="email" />}
              status={emailError ? "danger" : "basic"}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleEmailChange}
            />
            {emailError && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: -8,
                }}
              >
                <Icon
                  name="alert-circle-outline"
                  style={{ width: 15, height: 15 }}
                />
                <Text category="s2">Please enter a valid email address!</Text>
              </View>
            )}
            <Button
              style={{ marginTop: 20 }}
              accessoryRight={<Icon name="arrow-ios-forward-outline" />}
              onPress={handleResetPasswordLink}
            >
              Send Link
            </Button>
          </Layout>
        </KeyboardAvoidingView>
      </Layout>
    </View>
  );
}
