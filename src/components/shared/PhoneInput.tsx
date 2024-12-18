import { View, Text,StyleSheet, TextInput } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from './CustomText'

const PhoneInput:FC<PhoneInputProps> = ({value,onChangeText,onBlur,onFocus}) => {
    
  return (
<View style={styles.container}>
    <CustomText fontFamily='Medium' style={styles.text}>
        📞 +91
    </CustomText>
    <TextInput  placeholder='000-000-000 0' keyboardType='phone-pad' value={value} onChangeText={onChangeText} placeholderTextColor={'#ccc'} style={styles.input} onFocus={onFocus} maxLength={10} onBlur={onBlur}/>

</View>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        gap:4,
        marginVertical:15,
        borderWidth:1,
        borderColor:'#222',
        borderRadius:5,
        paddingHorizontal:10
    },
    input:{
        fontSize:RFValue(13),
        fontFamily:'Medium',
        height:45,
        width:'90%'
    }, 
    text:{
        fontSize:RFValue(13),
        fontFamily:'Medium',
        top:-1,
    }
})
export default PhoneInput