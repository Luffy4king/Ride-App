import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'

import { signin } from '@/services/authServices'
import { useWS } from '@/services/WSProvider'
const Auth = () => {
  const [phone, setPhone] = useState('')
  const {updatedAccessToken} = useWS()
  const handleNext =() =>{
    if(!phone && phone.length!==10){
      Alert.alert("Please enter Your Phone Number")
      return

    }
   signin({role:'captain', phone},updatedAccessToken)
  }
  return (
<SafeAreaView style={authStyles.container}>
  <ScrollView contentContainerStyle={authStyles.container}>
    <View style={commonStyles.flexRowBetween}>
      <Image source={require('@/assets/images/captain_logo.png')} style={authStyles.logo}/>
      <TouchableOpacity style={authStyles.flexRowGap}>
        <MaterialIcons name="help" size={18} color="gray"/>
        <CustomText fontFamily='Medium' variant='h7'>Help</CustomText>
      
      </TouchableOpacity>
    </View>

    <CustomText fontFamily='Medium' variant='h6'>Good to see you Captain!</CustomText>
    <CustomText fontFamily='Regular' style={commonStyles.lightText} variant='h7'>Enter Your Phone Number to proceed</CustomText>
    <PhoneInput onChangeText={setPhone} value={phone}/>
  </ScrollView>
<View style={authStyles.footerContainer}>
  <CustomText fontFamily='Regular'  variant='h8'  style={[commonStyles.lightText,{
    textAlign:'center',marginHorizontal:20
  }]}>
    By continuing ,you agree to the terms and conditions of Rapido
  </CustomText>
  
  <CustomButton title="Next" onPress={handleNext} loading={false} disabled={false}/>

</View>

</SafeAreaView>
  )
}

export default Auth