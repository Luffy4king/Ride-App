import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { useUserStore } from '@/store/UserStore';
import { calculateFare } from '@/utils/mapUtils';
import { rideStyles } from '@/styles/rideStyles';
import { StatusBar } from 'expo-status-bar';
import CustomText from '@/components/shared/CustomText';
import { ScrollView } from 'react-native-gesture-handler';
import { commonStyles } from '@/styles/commonStyles';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '@/components/shared/CustomButton';
import RouteMap from '@/components/customer/RouteMap';

import { createRide } from"@/services/Rideservice"

const Ridebooking = () => {
  const route = useRoute() as any;
  const item = route?.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike")
  const [loading, setLoading] = useState(false)


  const farePrices = useMemo(() => calculateFare(parseFloat(item?.distance || '0')), [item?.distance]);

  const rideOptions = useMemo(() => [
    { type: "Bike", seats: 1, time: "1 min", dropTime: "6:30pm", price: farePrices?.bike, isFastest: true, icon: require('@/assets/icons/bike.png') },
    {
      type: "Auto", seats: 2, time: "2 min", dropTime: "7:00pm", price: farePrices?.auto, isFastest: false, icon: require('@/assets/icons/auto.png')
    },
    {
      type: "Cab Economy", seats: 3, time: "3 min", dropTime: "7:30pm", price: farePrices?.cabEconomy, isFastest: false, icon: require('@/assets/icons/cab.png')
    },
    {
      type: "Cab Premium", seats: 4, time: "4 min", dropTime: "8:00pm", price: farePrices?.cabPremium, isFastest: false, icon: require('@/assets/icons/cab_premium.png')
    }

  ], [farePrices])

  const handleOptionSelect = useCallback((type: string) => {
    setSelectedOption(type)
  }, [])

  const handleRideBooking = async () => {
    setLoading(true); // Start loading before the API call
  
    try {
      await createRide({
        vehicle: selectedOption === 'Cab Economy'
          ? 'cabEconomy'
          : selectedOption === 'Cab Premium'
          ? 'cabPremium'
          : selectedOption === 'Bike'
          ? 'bike'
          : 'auto',
        drop: {
          latitude: parseFloat(item?.drop_latitude),
          longitude: parseFloat(item?.drop_longitude),
          address: item?.drop_address
        },
        pickup: {
          latitude: parseFloat(location?.latitude),
          longitude: parseFloat(location?.longitude),
          address: location?.address
        }
      });
    } catch (error) {
      console.log("Error in booking ride:", error);
    } finally {
      
      setLoading(false);
      // Always stop loading, regardless of success or failure
    }
  };
  
  return (
    <View style={rideStyles.container}>
      <StatusBar
        style='light'
        backgroundColor='orange'
        translucent={false} />
            <TouchableOpacity style={rideStyles.backButton} onPress={() => router.back()}>
          <MaterialIcons name='arrow-back-ios' size={RFValue(14)} style={{ left: 4 }} color='black' />

        </TouchableOpacity>
      {item?.drop_latitude && location?.latitude  && (
        <RouteMap 
        drop={{latitude:parseFloat(item?.drop_latitude), longitude:parseFloat(item?.drop_longitude)}}
        
        pickup={{latitude:parseFloat(location?.latitude), longitude:parseFloat(location?.longitude)}}/>
      )}
      <View style={rideStyles.rideSelectionContainer}>
        <View style={rideStyles?.offerContainer}>
          <CustomText style={rideStyles.offerText} fontSize={12}>
            You get $10 off 5 coins cashback!
          </CustomText>
        </View>
        <ScrollView contentContainerStyle={rideStyles?.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {rideOptions?.map((ride, index) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}

        </ScrollView>
     
        <View style={rideStyles.bookingContainer}>
          <View style={commonStyles.flexRowBetween}>
            <View style={[
              rideStyles.couponContainer, {
                borderRightWidth: 1, borderRightColor: '#ccc',
              }]}>
              <Image source={require('@/assets/icons/rupee.png')} style={rideStyles?.icon} />
              <View>
                <CustomText fontFamily='Medium' fontSize={12}>Cash</CustomText>
                <CustomText fontFamily='Medium' fontSize={10}
                  style={{ opacity: 0.7 }}>Far:{item?.distanceInKm} km</CustomText>

              </View>
              <Ionicons name='chevron-forward' size={RFValue(14)} color="#777"/>
            </View>

            <View style={ rideStyles.couponContainer}>
              <Image source={require('@/assets/icons/coupon.png')} style={rideStyles?.icon} />
              <View>
                <CustomText fontFamily='Medium' fontSize={12}>GOBIKE</CustomText>
                <CustomText fontFamily='Medium' fontSize={10}
                  style={{ opacity: 0.7 }}>Coupon Applied</CustomText>

              </View>
              <Ionicons name='chevron-forward' size={RFValue(14)} color="#777"/>
            </View>
          </View>

          <CustomButton
          title="Book Ride"
          disabled={loading}
          loading={loading}
          onPress={handleRideBooking}
          />

        </View>

      </View>

    </View>

  )
}

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity onPress={() => onSelect(ride?.type)} style={[rideStyles.rideOption,
  {
    borderColor: selected === ride.type ? "#222" : "#ddd"
  }
  ]}>
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride?.icon} style={rideStyles?.rideIcon} />
      <View style={rideStyles.rideDetails}>
        <CustomText fontFamily='Medium' fontSize={12}>
          {ride?.type} {ride?.isFastest && <Text style={rideStyles.fastestLabel}>Fastest</Text>}
        </CustomText>

        <CustomText fontSize={10}>
          {ride?.seats} seats *{ride?.time} away * {ride?.dropTime}
        </CustomText>
      </View>
      <View style={rideStyles?.priceContainer}>
        <CustomText fontFamily='Medium' fontSize={14}>
          ${ride?.price?.toFixed(2)}
        </CustomText>
        {selected === ride.type && <Text style={rideStyles?.discountedPrice}>${Number((ride?.price + 10)).toFixed(2)}</Text>}
      </View>

    </View>
  </TouchableOpacity>
))

export default memo(Ridebooking) 