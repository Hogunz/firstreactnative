import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:8000/api/login", {
        email: email,
        password: password,
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userName", user.name);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        if (error.response.status === 422) {
          const firstErrorKey = Object.keys(error.response.data.errors)[0];
          Alert.alert("Error", error.response.data.errors[firstErrorKey][0]);
        } else {
          Alert.alert("Error", "Failed to login. Please try again.");
        }
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No response from server. Please try again later."
        );
      } else {
        Alert.alert(
          "Error",
          "Network request failed. Please check your internet connection."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupLink}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  signupLink: {
    marginTop: 20,
    fontSize: 16,
    color: "#3498db",
  },
});

export default LoginScreen;
