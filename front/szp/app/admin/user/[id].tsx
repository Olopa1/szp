import Navbar from '@/components/Navbar';
import UserDetailsEditor from '@/components/UserDetailsEditor';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const userId = Number(id);
  console.log('User ID:', userId);
  return (
    <>
    <Navbar />
      <View style={styles.container}>
          {isNaN(userId) ? null : <UserDetailsEditor userId={userId} />}
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