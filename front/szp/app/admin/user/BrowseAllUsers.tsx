import Navbar from '@/components/Navbar';
import UserShortTile from '@/components/UserShortTile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'; // Importujemy TextInput

interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}

export default function BrowseAllUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>(''); // nowy stan na tekst wyszukiwania

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
      const data = response.data;
      setUsers(data);
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

  // Filtrujemy użytkowników na podstawie searchText
  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <View style={styles.page}>
        <Text style={styles.title}>Lista użytkowników</Text>

        {/* Pole wyszukiwania */}
        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj po nazwie użytkownika"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <UserShortTile
              id={item.id}
              username={item.userName}
              firstName={item.firstName}
              lastName={item.lastName}
              onTileClick={() => handleUserDetail(item.id)}
              bgColor="#33322d"
              bgHoverColor="#4d4c47"
              borderColor="white"
            />
          )}
          ListEmptyComponent={<Text style={styles.LogoutText}>Brak użytkowników</Text>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#333',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  LogoutText: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  // inne style...
});