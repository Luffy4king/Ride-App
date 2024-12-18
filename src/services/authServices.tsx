import { useCaptainStore } from "@/store/CaptainStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/UserStore"
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";


export const signin = async (payload: {
    role: 'customer' | 'captain',
    phone: string
},
updatedAccessToken:() => void
) => {
    const { setUser } = useUserStore.getState();
    const { setUser: setCaptainUser } = useCaptainStore.getState();
    try {
  const res = await axios.post(`${BASE_URL}/auth/signin`,payload);
  if(res.data.user.role ==='customer') {

    setUser(res.data.user)
  }  else {
    setCaptainUser(res.data.user)
  }     
await tokenStorage.set("access_token",res.data.access_token);
 await tokenStorage.set("refresh_token",res.data.refresh_token);
if(res.data.user.role  ==='customer') {
    resetAndNavigate('/customer/home')
}
else{
    resetAndNavigate('/captain/home')
}

updatedAccessToken();
    } catch (error: any) {
        console.log("Error during sign-in:", error); // Log the error
        Alert.alert('Oops!, there was an error');
        console.log("Error", error?.response?.data?.msg || "Error signIn");
    }
}


export const logout = async (disconnect?:()=> void) => {
    if(disconnect) {
        disconnect();
    }
    const { clearData } = useUserStore.getState();
    const { clearCaptainData } = useCaptainStore.getState();


    tokenStorage.clearAll();
    clearCaptainData();
    clearData();
    resetAndNavigate('/role')
}