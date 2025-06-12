import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/RegisterUser';
import React from 'react';
import { StyleSheet, View } from 'react-native';


export default function LoginScreen() {
  const handleRegister = () => {
    // Tu np. przejście do ekranu głównego
    // Możesz użyć router.push("/home") jeśli korzystasz z expo-router
    //router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Navbar></Navbar>
      <RegisterForm onRegister={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '3%',
    marginTop: 80,
    backgroundColor: '#33322d',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "white"
  },
  baseText:{
    fontWeight: 'bold',
  }
});