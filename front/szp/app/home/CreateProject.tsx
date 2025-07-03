import Navbar from "@/components/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";

const API_URL = "http://localhost:8082/api/project"; // Zmień na poprawny endpoint

const AddProjectForm: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [company, setCompany] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [projectCountry, setProjectCountry] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !company || !projectPath || !projectCountry) {
      Alert.alert("Błąd", "Uzupełnij wszystkie pola.");
      return;
    }

    const newProject = {
      projectName,
      company,
      projectPath,
      projectCountry,
    };

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Błąd", "Brak tokenu autoryzacji.");
        return;
      }

      await axios.post(`${API_URL}/createProject`, newProject, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Sukces", "Projekt został dodany.");
      // Wyczyść formularz
      setProjectName("");
      setCompany("");
      setProjectPath("");
      setProjectCountry("");
    } catch (error) {
      console.error("Błąd dodawania projektu:", error);
      Alert.alert("Błąd", "Nie udało się dodać projektu.");
    }
  };

  return (
    <>
    <Navbar />
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dodaj nowy projekt</Text>

      <TextInput
        style={styles.input}
        placeholder="Nazwa projektu"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        style={styles.input}
        placeholder="Firma"
        value={company}
        onChangeText={setCompany}
      />
      <TextInput
        style={styles.input}
        placeholder="Ścieżka projektu"
        value={projectPath}
        onChangeText={setProjectPath}
      />
      <TextInput
        style={styles.input}
        placeholder="Kraj projektu"
        value={projectCountry}
        onChangeText={setProjectCountry}
      />

      <Button title="Dodaj projekt" onPress={handleSubmit} />
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default AddProjectForm;