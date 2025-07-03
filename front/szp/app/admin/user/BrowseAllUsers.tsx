import Navbar from '@/components/Navbar';
import UserShortTile from '@/components/UserShortTile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}

export default function BrowseAllUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8082/api/user/allUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się pobrać użytkowników");
    }
  };

  const handleUserDetail = (id?: number) => {
    if (!id) return;
    router.push({
      pathname: "/admin/user/[id]",
      params: { id: id.toString() },
    });
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Lista użytkowników</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj po nazwie użytkownika"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <UserShortTile
                id={item.id}
                username={item.userName}
                firstName={item.firstName}
                lastName={item.lastName}
                onTileClick={() => handleUserDetail(item.id)}
                bgColor="#f1f5f9"
                bgHoverColor="#e2e8f0"
                borderColor="#cbd5e1"
              />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak użytkowników</Text>}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#1e293b",
  },
  searchInput: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    color: "#1e293b",
  },
  listContainer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  cardWrapper: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 18,
    marginTop: 24,
  },
});