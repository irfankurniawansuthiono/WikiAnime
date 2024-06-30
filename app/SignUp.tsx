import {
  Layout,
  Text,
  Divider,
  Button,
  Input,
  Icon,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { TouchableWithoutFeedback } from "react-native";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import LoadingComponent from "@/components/Loading/Loading";
import ButtonLoading from "@/components/Loading/ButtonLoading";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<null | string>(null);
  const [errorStatus2, setErrorStatus2] = useState<null | string>(null);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      return await AsyncStorage.getItem("acc");
    };
    fetchData()
      .then((data) => {
        if (data) {
          setIsLoading(false);
          router.replace("/Home");
        } else {
          throw Error;
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };
  const toggleSecureEntry2 = (): void => {
    setSecureTextEntry2(!secureTextEntry2);
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

  const passwordRegex = /^.{6,}$/;

  const handlePasswordChange = (e: string) => {
    if (!passwordRegex.test(e)) {
      setErrorStatus("password");
    } else {
      setPassword(e);
      if (e !== confirmPassword) {
        setErrorStatus2("passwordNotSame");
      } else {
        setErrorStatus2(null);
      }
      setErrorStatus(null);
    }
  };

  const handleConfirmPasswordChange = (e: string) => {
    if (!passwordRegex.test(e)) {
      setErrorStatus2("confirmPassword");
    } else {
      setConfirmPassword(e);
      if (e !== password) {
        setErrorStatus2("passwordNotSame");
      } else {
        setErrorStatus2(null);
      }
    }
  };
  const handleDisplayNameChange = (e: string) => {
    if (e === "") {
      setErrorStatus("displayName");
    } else {
      setDisplayName(e);
      setErrorStatus(null);
    }
  };
  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );
  const renderIcon2 = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry2}>
      <Icon {...props} name={secureTextEntry2 ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const signUpHandle = async () => {
    if (
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      displayName !== ""
    ) {
      setIsProcess(true);
      const emailFilter = email.replace(/\s+/g, "");
      try {
        const response = await createUserWithEmailAndPassword(
          FIREBASE_AUTH,
          emailFilter,
          password
        );
        const user = response.user;
        await updateProfile(user, { displayName });
        router.replace("/");
      } catch (error: any) {
        setIsProcess(false);
        if (error.code === "auth/email-already-in-use") {
          alert("Email already in use!");
        } else {
          alert(`Error! please contact admin! \n ${error}`);
        }
      }
    } else {
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
          Sign Up
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
              Password must be at least 6 characters
            </Text>
          </View>
        )}
        <Input
          accessoryLeft={<Icon name="lock" />}
          placeholder="Confirm Password"
          style={{ width: "100%" }}
          accessoryRight={renderIcon2}
          status={
            errorStatus2 === "confirmPassword" ||
            errorStatus2 === "passwordNotSame"
              ? "danger"
              : "basic"
          }
          secureTextEntry={secureTextEntry2}
          onChangeText={(e) => handleConfirmPasswordChange(e)}
        />
        {errorStatus2 === "confirmPassword" && (
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
              Password must be at least 6 characters
            </Text>
          </View>
        )}
        {errorStatus2 === "passwordNotSame" && (
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
              Password doesn't match!
            </Text>
          </View>
        )}
        <Input
          accessoryLeft={<Icon name="person" />}
          status={errorStatus === "displayName" ? "danger" : "basic"}
          placeholder="Display Name"
          style={{ width: "100%" }}
          onChangeText={(e) => handleDisplayNameChange(e)}
        />
        {errorStatus === "displayName" && (
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
              Please fill out this field!
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
            accessoryLeft={<Icon name="person-add" />}
            onPress={signUpHandle}
          >
            Create Account
          </Button>
        )}

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
            SignUp With Google
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
            Already have an account?
          </Text>
          <Link href={"/"}>
            <Text
              category="s2"
              style={{ color: "#3366ff", textDecorationLine: "underline" }}
            >
              SignIn Here
            </Text>
          </Link>
        </View>
      </Layout>
    </Layout>
  );
}
