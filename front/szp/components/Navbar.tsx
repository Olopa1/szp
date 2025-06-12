// components/Navbar.tsx
import { checkUserRole } from '@/utils/checkTokenValid';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Navbar() {



  const router = useRouter();
  
  const [role, setRole] = useState("NoRole");

  useEffect(()=>{
    const fetchUserRole = async ()=>{
      try{
        const userRole : string = await checkUserRole(); 
        if(userRole.localeCompare("noToken") === 0){
          Alert.alert("Token error: " + userRole);
          router.replace("/auth/login");
        }
        else if(userRole.localeCompare("badToken") === 0){
            Alert.alert("Token error: " + userRole);
            router.replace("/auth/login");
        }
        else{
          setRole(userRole);
        }
      }catch(error : any){
        Alert.alert("Error occured: " + error);
      }
    }
    fetchUserRole();
  },[]);

  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>System zarządzania projektami</Text>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => router.push('/home/home')}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/home/profile')}>
          <Text style={styles.link}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/home/myTasks')}>
          <Text style={styles.link}>Moje zadania</Text>
        </TouchableOpacity>
        {(role.localeCompare("ADMIN") == 0) && <TouchableOpacity onPress={() => router.push('/home/myTasks')}>
          <Text style={styles.link}>Panel admina</Text>
        </TouchableOpacity>}
        <TouchableOpacity onPress={() => router.push('/auth/logout')}>
          <Text style={styles.link}>Wyloguj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#1f1f1f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    gap: 20,
  },
  link: {
    color: '#ddd',
    marginLeft: 20,
    fontSize: 16,
  },
});