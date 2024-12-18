import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'
import CustomText from '@/components/shared/CustomText'

import {useFonts}  from 'expo-font'
import { resetAndNavigate } from '@/utils/Helpers'
import {jwtDecode} from'jwt-decode'
import { tokenStorage } from '@/store/storage'
import { refresh_tokens } from '@/services/apiIntercepetors'
import { useUserStore } from '@/store/UserStore'

interface  DecodedToken{
  exp:number;
}
const Main = () => {

  const  [loaded] = useFonts({
 Bold:require( '../assets/fonts/NotoSans-Bold.ttf'),
 Medium:require( '../assets/fonts/NotoSans-Medium.ttf'),
 Regular:require( '../assets/fonts/NotoSans-Regular.ttf'),
 Light:require( '../assets/fonts/NotoSans-Light.ttf'),
 SemiBold:require( '../assets/fonts/NotoSans-SemiBold.ttf'),
  })

const {user} = useUserStore();
const [hasNavigated, setHasNavigated] = useState(false)
const tokenCheck = async () =>{
  const access_token = tokenStorage.getString('refresh_token')as string;
  const refresh_token = tokenStorage.getString('refresh_token') as string;



  if(access_token){
 const decodeAccessToken = jwtDecode<DecodedToken>(access_token)
 const decodeRefreshToken = jwtDecode<DecodedToken>(refresh_token)
 
 const currentTime = Date.now()/1000;
 
 if(decodeRefreshToken?.exp <currentTime) {
  resetAndNavigate('/role')
  Alert.alert("Session expired ,Please Login again")
 }
 if(decodeAccessToken?.exp < currentTime)
 {
  try{
    refresh_tokens();
  }
  catch(error){
    console.log(error)
    Alert.alert("Refresh Token error")
  }
 }
 if(user) {
  resetAndNavigate('/customer/home')
 }else {
  resetAndNavigate('/captain/home')
 }

    return
  }
  resetAndNavigate('/role')
}
useEffect(() =>{
if(loaded && !hasNavigated) {
  const timeoutId = setTimeout(() =>{
    tokenCheck()
    setHasNavigated(true)
  },1000)
  return () => clearTimeout(timeoutId)
}
},[loaded,hasNavigated])

  return (
    <View style={commonStyles.container}>
<Image 
source={require("@/assets/images/logo_t.png")}
     style={splashStyles.img}/>
     <CustomText variant='h5' fontFamily='Medium'  style={splashStyles.text}>
      Made with 💖
     </CustomText>
    </View>
  )
}

export default Main