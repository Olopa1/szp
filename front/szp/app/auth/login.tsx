import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../../components/LoginForm';


export default function LoginScreen() {
  const handleLogin = () => {
    // Tu np. przejście do ekranu głównego
    // Możesz użyć router.push("/home") jeśli korzystasz z expo-router
    router.replace('/');
  };

  return (

    <View style={styles.container}>
      <LoginForm onLogin={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '3%',
    marginTop: 80,
    //backgroundColor: '#33322d',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "gray"
  },
  baseText:{
    fontWeight: 'bold',
  }
});