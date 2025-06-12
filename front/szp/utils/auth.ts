import axios from 'axios';

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