import {
  Text,
  List,
  Divider,
  ListItem,
  Icon,
  Avatar,
  Button,
} from "@ui-kitten/components";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { removeAccountData, getAccountData } from "@/utils/storage";
import { router } from "expo-router";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import LoadingComponent from "@/components/Loading/Loading";
export default function ProfilePage() {
  const [accountData, setAccountData] = useState<any>(null);
  const [allAccountData, setAllAccountData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccountData();
      if (data) {
        setAccountData(data.data.user);
        setAllAccountData(data);
      }
    };

    fetchData();
  }, []);



  const emailVerifyHandler = async () => {
    sendEmailVerification(FIREBASE_AUTH.currentUser!);
    alert("please check your mail inbox!");
    await FIREBASE_AUTH.signOut();
    await removeAccountData();
    router.replace("/");
  };

  const signOutHandle = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      await removeAccountData();
      router.replace("/");
    } catch (err) {
      console.error("Error during sign out:", err);
    }
  };

  const RenderItem = ({
    item,
    index,
  }: {
    item: { id: number; name: string; icon: string };
    index: number;
  }) => {
    return (
      <ListItem title={item.name} accessoryLeft={<Icon name={item.icon} />} />
    );
  };

  return accountData === null ? (
    <LoadingComponent />
  ) : (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: 10,
          marginHorizontal: 16,
          marginTop: 16,
          alignItems: "center",
          marginBottom: 6,
          padding: 10,
          flexDirection: "row",
          gap: 15,
        }}
      >
        <View >
          <Text category="h5">{accountData?.displayName}</Text>
          <Text>{accountData?.email} </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Email Verified: </Text>
            {accountData?.emailVerified ? (
              <Icon
                name="checkmark-square-2"
                fill="green"
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <>
                <Icon
                  name="close-square"
                  fill="red"
                  style={{ width: 24, height: 24 }}
                />
              </>
            )}
          </View>
          {!accountData?.emailVerified && (
            <Button
              onPress={emailVerifyHandler}
              accessoryLeft={<Icon name="email" />}
              size="small"
              style={{ width: "70%", marginTop: 10 }}
            >
              Verify Email
            </Button>
          )}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "flex-end",
          paddingHorizontal: 20,
        }}
      >
        <Button
          status="danger"
          size="small"
          accessoryRight={<Icon name="log-out-outline" />}
          onPress={signOutHandle}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
}
