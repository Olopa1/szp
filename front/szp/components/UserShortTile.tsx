import { Easing, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function UserShortTile({
    id,
    username,
    firstName,
    lastName,
    bgColor='white',
    bgHoverColor='gray',
    borderColor='black',
    onTileClick
    }:{
    id?:number,
    username?:string,
    firstName?:string,
    lastName?:string,
    bgColor?:string,
    bgHoverColor?:string, 
    borderColor?:string,
    onTileClick?:()=> void,
    }){
    const progress = useSharedValue(0);
    
    const hover = Gesture.Hover().onStart(()=>{
        progress.value = withTiming(1,{
            duration: 400,
            easing: Easing.out(Easing.ease)
        })
    }).onEnd(()=>{
        progress.value = withTiming(0,{
            duration: 400,
            easing: Easing.out(Easing.ease)
        })
    });

    const animatedStyle = useAnimatedStyle(()=>({
        backgroundColor: interpolateColor(
            progress.value,
            [0,1],
            [bgColor,bgHoverColor],
        ),
        borderColor: borderColor
    }));

    return(
        <>
        
        <GestureHandlerRootView style={styles.Container}>
            <GestureDetector gesture={hover}>
                <Pressable onPress={onTileClick}>    
                    <Animated.View style={[styles.Tile, animatedStyle]}>
                        <Text style={styles.LabelStyle}>Nazwa użytkownika</Text>
                        <Text style={styles.TitleStyle}>{username}</Text>

                        <Text style={styles.LabelStyle}>Imię</Text>
                        <Text style={styles.TitleStyle}>{firstName}</Text>

                        <Text style={styles.LabelStyle}>Nazwisko</Text>
                        <Text style={styles.TitleStyle}>{lastName}</Text>
                        
                        
                    </Animated.View>
                </Pressable>
            </GestureDetector>
        </GestureHandlerRootView>
        </>
    );
};

const styles = StyleSheet.create({
    Container:{
        display:'flex'
    },
    Tile:{
        alignItems: 'center',
        display: 'flex',
        width: 700,
        height: 200,
        borderRadius: 20,
        borderWidth: 4,
        padding: 10,
        marginTop: 10,
    },
    TitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b', // ciemnoniebieski (czytelny na jasnym tle)
    textAlign: 'center',
    marginBottom: 6,
    },

    LabelStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b', // szary z palety Tailwind (Slate-500)
    textAlign: 'center',
    },
    DescStyle:{
        fontSize:20,
        textAlign: 'center'
    }
});
