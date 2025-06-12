import TaskForm from '@/components/CreateTaskForm';
import Navbar from '@/components/Navbar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function home(){
    const handleSubmit = (()=>{

    })

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