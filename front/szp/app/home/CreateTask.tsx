import TaskForm, { TaskFormData } from '@/components/CreateTaskForm';
import Navbar from '@/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, StyleSheet, Text, View } from 'react-native';


export default function home(){
    const handleSubmit = async (data:TaskFormData)=>{
        try{
            const authToken = await AsyncStorage.getItem("authToken");
            console.log(data);
            const response = await axios.post(
            "http://localhost:8082/api/task/addNewTask", // endpoint do dodawania zadania
            data, // ciało
            {
                headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json', // opcjonalnie, ale warto
                },
            }
            );
            console.log(response);
            if(response.status === 200){
                Alert.alert("Sukces", "Zadanie zostało dodane");
            }
        }catch(error: any){
            Alert.alert("Błąd", "Nie udało się dodać zadania");
        }
    }

    return(
        <>
            <View >
                <Navbar></Navbar>
                <View style={styles.Container}>
                <Text>Dodaj zadanie</Text>

                <TaskForm onSubmit={handleSubmit}></TaskForm>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    Container:{
        //flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent:'center',
        width: '80%',
        alignSelf: 'center'
    }
});