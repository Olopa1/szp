import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function LogoutScreen(){
    useEffect(()=>{
        const handleLogout = async ()=>{
            try{
                await AsyncStorage.clear();
            }catch(error : any){
                Alert.alert("Error occured: " + error);
            }
        };
        handleLogout();
    });

    const pressButton = (()=>{
        router.replace('/auth/login');
    });

    return(
        <>
            <View style={styles.Container}>
                <Text style={styles.LogoutText}>Wylogowano</Text>
                <TouchableOpacity style={styles.button} onPress={pressButton}>
                    <Text style={styles.buttonText}>Zaloguj się</Text>
                </TouchableOpacity>      
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    Container:{
        width: 500,
        height:400,
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 5,
        borderRadius: 20,
        alignContent: 'center',
        alignSelf: 'center',
        textAlign:'center',
        justifyContent:'center',
        margin:50
    },
    LogoutText:{
        fontSize:50,
        textAlign: 'center',
    },
    button: {
        alignSelf:'center',
        maxWidth:200,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2, // cień dla Androida
        shadowColor: '#000', // cień dla iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
  },
});