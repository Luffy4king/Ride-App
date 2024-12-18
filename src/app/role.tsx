import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { roleStyles } from '@/styles/roleStyles'
import CustomText from '@/components/shared/CustomText'
import { router } from 'expo-router'

const Role = () => {
    const handleCustomerPress = () => {
        // Navigate to customer screen\
        router.navigate('/customer/auth')
    }
    const handleCaptainPress = () => {
        // Navigate to captain screen
        router.navigate('/captain/auth')
    }
  return (
    <View style={roleStyles.container}>
      <Image  source={require('@/assets/images/logo_t.png')} style={roleStyles.logo}/>
      <CustomText>
        Choose Your user  type
      </CustomText>
      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
      <Image source={require('@/assets/images/customer.png')} style={roleStyles.image}/>
      <View style={roleStyles.cardContent}>
        <CustomText style={roleStyles.title}>
            Customer
        </CustomText>
        <CustomText style={roleStyles.description}>Are you a Customer Order Rides and deliveries easily</CustomText>
      </View>
      </TouchableOpacity>

      <TouchableOpacity style={roleStyles.card} onPress={handleCaptainPress}>
      <Image source={require('@/assets/images/captain.png')} style={roleStyles.image}/>
      <View style={roleStyles.cardContent}>
        <CustomText style={roleStyles.title}>
            Captain
        </CustomText>
        <CustomText style={roleStyles.description}>Are you a Captain Order Rides and deliveries easily</CustomText>
      </View>
      </TouchableOpacity>
    </View>
  )
}

export default Role

const styles = StyleSheet.create({})