import Navbar from '@/components/Navbar';
import OptionTile from '@/components/OptionTile';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function home(){
    const tiles = Array.from({ length: 15 }, (_, index) => index); // [0,1,2,3,4]

    const goToCreateTask = (()=>{
        router.push('/home/CreateTask');
    })


    return(
        <>
            <View >
                <Navbar></Navbar>
                <View style={styles.ContainerAll}>
                    <Text>Zadania</Text>
                    <View style={styles.TileContainer}>
                        <OptionTile onTileClick={goToCreateTask} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Utwórz zadanie' description='Utwórz nowe zadanie i dodaj ludzi aby można było śledzi progres zdania'></OptionTile>
                        <OptionTile bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Moje zadania' description='Zobacz swoje zadania twórz komentarze oraz aktualizuj stan zadań w razie progresu'></OptionTile>
                        <OptionTile bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Zobacz kalendarz' description='Zobacz zadania w formie kompaktowego kalendarza w kontekście czasu ich wykonania'></OptionTile>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    ContainerAll:{
        justifyContent:'center',
        alignContent:'center',
        textAlign:'center'
    },
    TileContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent:'center',
        width: '70%',
        alignSelf: 'center'
    }
});