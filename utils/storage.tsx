import AsyncStorage from "@react-native-async-storage/async-storage";

const getAccountData = async () => {
  const data = await AsyncStorage.getItem("acc");
  if (data) {
    return { data: JSON.parse(data), status: 200, message: "success" };
  } else {
    return {
      status: 404,
      message: "user not found",
    };
  }
};

const addAccountData = async (data: string) => {
  await AsyncStorage.setItem("acc", data);
};

const removeAccountData = async () => {
  try {
    return await AsyncStorage.setItem("acc", "");
  } catch (err) {
    console.error(err);
  }
};

export { getAccountData, addAccountData, removeAccountData };
