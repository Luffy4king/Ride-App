import { View, Text, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { screenHeight } from '@/utils/Constants';
import { useWS } from '@/services/WSProvider';
import { rideStyles } from '@/styles/rideStyles';
import { StatusBar } from 'expo-status-bar';
import LiveTrackingMap from '@/components/customer/LiveTrackingMap';
import { resetAndNavigate } from '@/utils/Helpers';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import LiveTrackingSheet from '@/components/customer/LiveTrackingSheet';
import SearchingRideSheet from '@/components/customer/SearchingRideSheet';

const androidHeights = [screenHeight * 0.12, screenHeight * 0.427];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];

const Liveride = () => {
  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const [captainCoords, setCaptainCoords] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;

  const bottomSheetRef = useRef(null);
  const snapPoints = Platform.OS === 'android' ? androidHeights : iosHeights;
  const [mapHeight, setMapHeight] = useState(snapPoints[0]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index == 1) {
      height = screenHeight * 0.5;
    }
    setMapHeight(height);
  }, []);

  useEffect(() => {
    if (id) {
      emit('subscribeRide', id);
      on('rideData', (data) => {
        
        setRideData(data);
        if (data?.status === 'SEARCHING_FOR_CAPTAIN') {
          emit('searchCaptain', id);
        }
      });
      on('rideUpdate', (data) => {
      
        setRideData(data);
      });
      on('rideCanceled', (error) => {
        
        resetAndNavigate('/customer/home');
        Alert.alert('Ride Cancelled');
      });
      on('error', (error) => {
        console.log('Error:', error); // Log errors
        resetAndNavigate('/captain/home');
        Alert.alert('No rider Found');
      });
    }
    return () => {
      off('rideData');
      off('rideUpdate');
      off('rideCancelled');
      off('error');
    };
  }, [id, emit, on, off]);


  useEffect(() => {

  
    if (rideData?.captain && rideData?.captain._id) {
      emit('subscribeToCaptainLocation', rideData?.captain._id);
      on('captainLocationUpdate', (data) => {
        setCaptainCoords(data?.coords);
      });
    }
    return () => {
      off('captainLocationUpdate');
    };
  }, [rideData]);
  

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      {rideData && (
        <LiveTrackingMap
          height={mapHeight}
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          captain={
            captainCoords
              ? {
                  latitude: captainCoords?.latitude,
                  longitude: captainCoords?.longitude,
                  heading: captainCoords.heading,
                }
              : {}
          }
        />
      )}
      {rideData ?
      <BottomSheet ref={bottomSheetRef}
      index={1}
      handleIndicatorStyle={{
        backgroundColor: '#ccc',
      }}
      enableDynamicSizing={false}
      enableOverDrag={false}
      style={{zIndex:4}}
      snapPoints={snapPoints}

      onChange={handleSheetChanges}>
        <BottomSheetScrollView contentContainerStyle={rideStyles?.container}>
{
  rideData ?.status ==='SEARCHING_FOR_CAPTAIN'?
  <SearchingRideSheet item={rideData}/>:
  <LiveTrackingSheet item={rideData}/>
}
        </BottomSheetScrollView>
     
        </BottomSheet>
           :
           <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
             <ActivityIndicator color='black' size='small'/>
   
           </View>
        }

    </View>
  );
};

export default memo(Liveride);
