import Navbar from '@/components/Navbar';
import UserDetailsEditor from '@/components/UserDetailsEditor';
import { GetUserFromToken, UserOption } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function UserDetailScreen() {
  const [userDetails, setUserDetails] = useState<UserOption|null>(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error("Brak tokenu autoryzacji");
          return;
        }
        const userData: UserOption | null = await GetUserFromToken(token);
        if (userData) {
          setUserDetails(userData);
        } else {
          console.error("Nie udało się pobrać szczegółów użytkownika");
        }
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów użytkownika:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
    <Navbar />
      <View style={styles.container}>
          {(!userDetails?.id) ? null : <UserDetailsEditor userId={userDetails?.id as number} />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  id: {
    fontSize: 18,
    color: '#ccc',
  },
});