import { Easing, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function OptionTile({
    bgColor='white',
    title='Tile',
    bgHoverColor='gray',
    description='',
    borderColor='black',
    onTileClick
    }:{
    bgColor?:string,
    title?:string,
    bgHoverColor?:string, 
    description?:string,
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
                        <Text style={styles.TitleStyle}>
                            {title}
                        </Text>
                        <Text style={styles.DescStyle}>
                            {description}
                        </Text>
                        
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
        width: 300,
        height: 300,
        borderRadius: 20,
        borderWidth: 4,
        padding: 10,
        margin: 20,
    },
    TitleStyle:{
        fontSize:30,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 15
    },
    DescStyle:{
        fontSize:20,
        textAlign: 'center'
    }
});
