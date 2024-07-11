import {
  Layout,
  Text,
  Divider,
  Button,
  Input,
  Icon,
} from "@ui-kitten/components";
import { View } from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { TouchableWithoutFeedback } from "react-native";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { addAccountData, getAccountData } from "@/utils/storage";
import LoadingComponent from "@/components/Loading/Loading";
import ButtonLoading from "@/components/Loading/ButtonLoading";
export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<null | string>(null);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccountData();
      if (data.status === 200) {
        setIsLoading(false);
        router.replace("/Home");
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailChange = (e: string) => {
    if (e === "" || !emailRegex.test(e)) {
      setErrorStatus("email");
    } else {
      setEmail(e);
      setErrorStatus(null);
    }
  };

  const handlePasswordChange = (e: string) => {
    if (e === "") {
      setErrorStatus("password");
    } else {
      setPassword(e);
      setErrorStatus(null);
    }
  };
  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const signInHandle = async () => {
    setIsProcess(true);
    if (email !== "" && password !== "") {
      const emailFilter = email.replace(/\s+/g, "");
      try {
        const response = await signInWithEmailAndPassword(
          FIREBASE_AUTH,
          emailFilter,
          password
        );
        if (response) {
          addAccountData(JSON.stringify(response));
          router.replace("/Home");
        }
      } catch (error: any) {
        setIsProcess(false);
        if (error.code === "auth/invalid-credential") {
          alert("Wrong Email or Password!");
        } else {
          alert(`Error! please contact ADMIN \n${error}`);
        }
      }
    } else {
      setIsProcess(false);
      console.error("something went wrong");
    }
  };

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Layout
      level="1"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Layout
        level="2"
        id="CardContainer"
        style={{
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "black",
          paddingHorizontal: 30,
          paddingVertical: 10,
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 300,
          gap: 10,
        }}
      >
        <Text category={"h4"} style={{ textAlign: "center" }}>
          Sign In
        </Text>
        <Divider
          style={{
            borderWidth: 1,
            marginBottom: 10,
          }}
        />
        <Input
          status={errorStatus === "email" ? "danger" : "basic"}
          keyboardType="email-address"
          accessoryLeft={
            <Icon style={{ width: 10, height: 10 }} name="email" />
          }
          placeholder="Email@example.com"
          autoCapitalize="none"
          style={{ width: "100%" }}
          onChangeText={(e) => handleEmailChange(e)}
        />
        {errorStatus === "email" && (
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
              fill="red"
            />
            <Text category="s2" style={{ color: "red" }}>
              Please enter a valid email address!
            </Text>
          </View>
        )}
        <Input
          accessoryLeft={<Icon name="lock" />}
          placeholder="Password"
          style={{ width: "100%" }}
          accessoryRight={renderIcon}
          status={errorStatus === "password" ? "danger" : "basic"}
          secureTextEntry={secureTextEntry}
          onChangeText={(e) => handlePasswordChange(e)}
        />
        {errorStatus === "password" && (
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
              fill="red"
            />
            <Text category="s2" style={{ color: "red" }}>
              Please enter the password!
            </Text>
          </View>
        )}
        {isProcess ? (
          <Button
            size="medium"
            style={{ width: "100%", marginTop: 5, backgroundColor: "#3366ff" }}
            disabled
          >
            <ButtonLoading />
          </Button>
        ) : (
          <Button
            size="medium"
            style={{
              width: "100%",
              marginTop: 5,
              backgroundColor: "#3366ff",
              borderColor: "#3366ff",
            }}
            accessoryRight={<Icon name="log-in" />}
            onPress={signInHandle}
          >
            SignIn
          </Button>
        )}

        <Text
          category="s2"
          style={{ color: "gray", textAlign: "right" }}
          onPress={() => {
            router.push("/ResetPassword");
          }}
        >
          Forgot Password?
        </Text>

        <Divider
          style={{
            width: "100%",
            borderColor: "black",
            marginTop: 20,
          }}
        />
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            position: "relative",
            backgroundColor: "transparent",
            top: -22,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              backgroundColor: "#F7F9FC",
              width: "15%",
              color: "gray",
            }}
          >
            Or
          </Text>
          <Button
            status="basic"
            size="medium"
            accessoryLeft={<Icon name="google" />}
            style={{ marginTop: 20 }}
            disabled
          >
            SignIn With Google
          </Button>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            flexDirection: "row",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <Text category="s2" style={{ color: "gray", textAlign: "right" }}>
            Don't have an account?
          </Text>
          <Link href={"/SignUp"}>
            <Text
              category="s2"
              style={{ color: "#3366ff", textDecorationLine: "underline" }}
            >
              SignUp Here
            </Text>
          </Link>
            <Link href={"Home"}>
            <Text
              category="s2"
              style={{ color: "#3366ff", textDecorationLine: "underline" }}
            >
              Home
            </Text>
          </Link>
        </View>
      </Layout>
    </Layout>
  );
}
