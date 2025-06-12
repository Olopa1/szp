import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Navbar from '../components/Navbar';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });



  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }



  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Navbar />
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="auth/login" options={{title:"Logowanie"}}/>
        <Stack.Screen name="auth/logout" options={{title:"Wyloguj"}}/>
        <Stack.Screen name="home/home" options={{headerShown:false}}/>
        <Stack.Screen name='admin/AddNewUser' options={{headerShown:false}}/>
        <Stack.Screen name='home/profile' options={{headerShown:false}}/>
        <Stack.Screen name='home/myTasks' options={{headerShown:false}}/>
        <Stack.Screen name='home/CreateTask' options={{headerShown:false}}/>
        
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
