import axios from 'axios';

export type UserOption = {
  id : number;
  userName : string;
  firstName : string;
  lastName : string;
};

export async function CheckTokenValidity(token?: string): Promise<boolean>{
    try{
        if(!token){
            return false;
        }
        const responseCheckToken = await axios.get("http://localhost:8082/api/auth/validateToken",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        if(responseCheckToken){

        }
        if(responseCheckToken.status === 200){
            return true;
        }
        return false;
    }catch(error: any){
        return false;
    }
}

export async function GetUserFromToken(token?: string): Promise<UserOption | null>{
    try{
        if(!token){
            return null;
        }
        const responseToken = await axios.get("http://localhost:8082/api/auth/getUserFromToken",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        if(responseToken.status === 200){
            return responseToken.data;
        }
        return null;
    }catch(error: any){
        return null;
    }
}