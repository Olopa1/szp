import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/RegisterUser';
import { ScrollView, StyleSheet } from 'react-native';



export default function AddNewUserScreen() {
  const handleRegister = () => {
      console.log("Użytkownik został dodany!");
  };

  return (
    <>
    <Navbar></Navbar>
    <ScrollView style={styles.container}>
      <RegisterForm onRegister={handleRegister} />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '3%',
    marginTop: 40,
    //backgroundColor: '#33322d',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "gray",
    textAlign:'center'
  },
  baseText:{
    fontWeight: 'bold',
  }
});