import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import Constants from "expo-constants";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Added message state
  const [isError, setIsError] = useState(false); // ✅ To differentiate error from success
  const navigation = useNavigation();
  const { API_URL } = Constants.expoConfig.extra;
  const url = `${API_URL}/api/users/login`;
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    console.log("handleLogin triggered");
    setMessage(""); // Clear previous messages
    setIsError(false);

    const user = { email, password };
    console.log("Sending request to:", url, "with", user);

    try {
      const response = await axios.post(url, user, { timeout: 3000 }); // ⏳ Timeout set to 10 seconds
      console.log("Login successful:", response.data);

      const token = response.data.token;
      if (!token) {
        throw new Error("No token received");
      }

      await AsyncStorage.setItem("authToken", token);
      setMessage("Login successful! Redirecting...");
      setIsError(false);

      console.log("Navigating to Main...");
      setTimeout(() => navigation.replace("Main"), 100);
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error("❌ Error: Request timed out.");
        setMessage(
          "Server is taking too long to respond. Please try again later."
        );
      } else if (
        error.message.includes("Network Error") ||
        error.code === "ERR_NETWORK"
      ) {
        console.error("❌ Error: Backend API not reachable.");
        setMessage(
          "Unable to connect to server. Please check your internet or backend."
        );
      } else {
        console.error("❌ Error during login:", error);
        setMessage(
          error?.response?.data?.message || "Login failed. Please try again."
        );
      }
      setIsError(true);
      Alert.alert("❌ Error during login:", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 150, height: 100 }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Login In to your Account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="enter your Email"
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="enter your Password"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>

        {/* ✅ Message Display */}
        {message ? (
          <Text
            style={{
              marginTop: 20,
              color: isError ? "red" : "green",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {message}
          </Text>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate("SignUp")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
