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
      console.log(response.data); // Log the response data (token)
      // Optionally, handle login success (e.g., store token in AsyncStorage)
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data); // Log the error response data
        // Handle specific error messages from Laravel validation or other errors
        if (error.response.status === 422) {
          // Example: handle validation errors from Laravel
          const firstErrorKey = Object.keys(error.response.data.errors)[0];
          Alert.alert("Error", error.response.data.errors[firstErrorKey][0]);
        } else {
          Alert.alert("Error", "Failed to login. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request made but no response received:", error.request);
        Alert.alert(
          "Error",
          "No response from server. Please try again later."
        );
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error:", error.message);
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
        placeholder="Username or Email"
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
