import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";

interface Props {
  userId: number;
}

type UserRole = "ADMIN" | "USER" | "MANAGER"; // Dostosuj do swojego backendu

interface UserDataDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  userRole: UserRole;
}

interface UserUpdatePassword{
  userId: number;
  newPassword: string;
}

const API_BASE_URL = "http://localhost:8082/api/user"; // <- Zmień na właściwy adres API

const UserDetailsEditor: React.FC<Props> = ({ userId }) => {
  const [user, setUser] = useState<UserDataDetails | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {
            Alert.alert("Błąd", "Brak tokenu autoryzacji.");
            return;
        }
        console.log("Fetching user data for ID:", typeof userId);
        console.log("Using auth token:", authToken);
      const response = await axios(`${API_BASE_URL}/findUserById/${userId.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
                // Dodaj inne nagłówki, jeśli są wymagane, np. autoryzacja
            },
        }
      );
      console.log("Fetched user data:", response);
      setUser(response.data);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się pobrać danych użytkownika.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        Alert.alert("Błąd", "Brak tokenu autoryzacji.");
        setLoading(false);
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/updateUser`, user, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        console.log("Nowy token zapisany");
      }

      Alert.alert("Sukces", "Dane użytkownika zostały zapisane.");
    } catch (error) {
      console.error("Błąd zapisu:", error);
      Alert.alert("Błąd", "Nie udało się zapisać danych.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password) return Alert.alert("Błąd", "Wprowadź nowe hasło.");
    setLoading(true);
    if(!user) return;
    const userPassword : UserUpdatePassword = {
        userId: user.id,
        newPassword: password,
      };
    try {
      await axios.post(`${API_BASE_URL}/${userId}/change-password`, {
        newPassword: password,
      });
      setPassword("");
      Alert.alert("Sukces", "Hasło zostało zmienione.");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zmienić hasła.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Imię"
            value={user.firstName}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nazwisko"
            value={user.lastName}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nazwa użytkownika"
            value={user.userName}
            onChangeText={(text) => setUser({ ...user, userName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefon"
            keyboardType="phone-pad"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
          />
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Rola"
            value={user.userRole}
            onChangeText={(text) =>
              setUser({ ...user, userRole: text.toUpperCase() as UserRole })
            }
          />

          <Button title="Zapisz zmiany" onPress={handleSave} />

          <Text style={styles.sectionTitle}>Zmień hasło</Text>
          <TextInput
            style={styles.input}
            placeholder="Nowe hasło"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Zmień hasło" onPress={handleChangePassword} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
});

export default UserDetailsEditor;