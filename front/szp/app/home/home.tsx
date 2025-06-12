import Navbar from '@/components/Navbar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function home(){
    const tiles = Array.from({ length: 15 }, (_, index) => index); // [0,1,2,3,4]

    return(
        <>
            <View >
                <Navbar></Navbar>
                
                <Text>HOME</Text>

                
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    Container:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent:'center',
        width: '70%',
        alignSelf: 'center'
    }
});