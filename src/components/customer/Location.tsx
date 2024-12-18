import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useUserStore } from '@/store/UserStore'
import { useWS } from '@/services/WSProvider';
import { uiStyles } from '@/styles/uiStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "@expo/vector-icons/Ionicons"
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { navigate } from 'expo-router/build/global-state/routing';
import { router } from 'expo-router';
import CustomText from '../shared/CustomText';
import { logout } from '@/services/authServices';

const LocationBar = () => {
    const {location} =useUserStore();
    const {disconnect} = useWS();
  return (
    <View style={uiStyles.absoluteTop}>
        <SafeAreaView/>

     <View style={uiStyles.container}>
        <TouchableOpacity style={uiStyles.btn}  onPress={()=>logout(disconnect)}>
          <Ionicons name='menu-outline' size={RFValue(18)} color={Colors.text}/>

        </TouchableOpacity>
        <TouchableOpacity style={uiStyles.locationBar} onPress={() =>router.navigate('/customer/selectlocations')}>
     <View style={uiStyles.dot}/>
        <CustomText numberOfLines={1} style={uiStyles.locationText}>
{location?.address  || "Getting address......"}
        </CustomText>

          
        </TouchableOpacity>

     </View>
    </View>
  )
}

export default LocationBar