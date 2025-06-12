import { CheckTokenValidity } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log(token); 
      if(token){
        const tokenValidity = await CheckTokenValidity(token);
        if(tokenValidity){
            router.replace("/home/home");
        }else{
          AsyncStorage.removeItem("authToken");
          router.replace("/auth/login");  
        }
      }else{
        router.replace("/auth/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return null;
}