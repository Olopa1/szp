import Navbar from '@/components/Navbar';
import OptionTile from '@/components/OptionTile';
import { checkUserRole } from '@/utils/checkTokenValid';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';


export default function myTasks(){
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
                Alert.alert("Error fetching user role:", error);
            }
        }
        fetchUserRole();
    },[]);

    const goToCreateTask = (()=>{
        router.push('/home/CreateTask');
    })

    const goToCallendar = (()=>{
        router.push('/home/CallendraView');
    })

    const goToCreateProject = (()=>{
        router.push('/home/CreateProject');
    });

    const goToMyTasks = (()=>{
        router.push('/home/home');   
    });

    const goToAllTasks = (()=>{
        router.push('/home/allTasks');
    });

    return(
        <>
            <View >
                <Navbar></Navbar>
                <View style={styles.ContainerAll}>
                    <Text>Zadania</Text>
                    <View style={styles.TileContainer}>
                        <OptionTile onTileClick={goToCreateTask} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Utwórz zadanie' description='Utwórz nowe zadanie i dodaj ludzi aby można było śledzi progres zdania'></OptionTile>
                        <OptionTile onTileClick={goToMyTasks} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Moje zadania' description='Zobacz swoje zadania twórz komentarze oraz aktualizuj stan zadań w razie progresu'></OptionTile>
                        <OptionTile onTileClick={goToCallendar} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Zobacz kalendarz' description='Zobacz zadania w formie kompaktowego kalendarza w kontekście czasu ich wykonania'></OptionTile>
                        {(role === 'ADMIN') && <OptionTile onTileClick={goToCreateProject} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Dodaj projekt' description='Dodaj nowy projekt aby módz dodawać nowe zdania'></OptionTile>}
                        {(role === 'ADMIN') && <OptionTile onTileClick={goToAllTasks} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Zobacz wszystkie zadania' description='Zobacz wszystkie dostępne zadania'></OptionTile>}
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