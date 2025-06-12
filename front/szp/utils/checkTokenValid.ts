import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export async function checkUserRole() : Promise<string> {
      try{
        const token = await AsyncStorage.getItem("authToken");
        if(!token){
            return "noToken"
        }else{
          const response = await axios.get("http://localhost:8082/api/auth/getRoleFromToken",{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          if(response.status === 200){
            return response.data; 
          }else{
            await AsyncStorage.removeItem("authToken");
            return "badToken";
          }
        }
      }catch(error : any){
        throw error;
      }
    };