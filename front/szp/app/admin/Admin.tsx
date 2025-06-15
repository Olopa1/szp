import Navbar from '@/components/Navbar';
import OptionTile from '@/components/OptionTile';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function home(){
    const tiles = Array.from({ length: 15 }, (_, index) => index); // [0,1,2,3,4]

    const goToRegisterUser = (()=>{
        router.push('/admin/user/AddNewUser');
    })

    const goToSearchUsers = (()=>{
        router.push('/admin/user/BrowseAllUsers');
    })


    return(
        <>
            <View >
                <Navbar></Navbar>
                <View style={styles.ContainerAll}>
                    <Text>Panel admina</Text>
                    <View style={styles.TileContainer}>
                        <OptionTile onTileClick={goToRegisterUser} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Utwórz nowe konto' description='Zarejestruj nowego użytkownika w swoim systemie aby mógł korzystać z wspólnego planowania zadań'></OptionTile>
                        <OptionTile onTileClick={goToSearchUsers} bgColor='#63C9FF' bgHoverColor='#EDDD53' title='Przeglądaj istniejące konta' description='Zobacz istniejące konta, nadwaj prawa użytkownikom oraz moderuj użytkowników'></OptionTile>
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