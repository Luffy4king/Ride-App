import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { customMapStyle, indiaInitialRegion } from '@/utils/CustomMap';
import { Colors } from '@/utils/Constants';
import MapViewDirections from"react-native-maps-directions"
import { getPoints } from '@/utils/mapUtils';
import { mapStyles } from '@/styles/mapStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

const apiKey = 'EXPO_PUBLIC_MAP_API_KEY'; // Replace with your actual API key.

const LiveTrackingMap: FC<{
  height: number;
  drop: any;
  pickup: any;
  captain: any;
  status: string;
}> = ({ drop, status, height, pickup, captain }) => {
  const mapRef = useRef<MapView>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);


  const fitToMarkers = async () => {

    if (isUserInteracting) return;

    const coordinates: { latitude: number, longitude: number }[] = [];

    if (pickup?.latitude && pickup?.longitude && status === 'START') {
      coordinates.push({ latitude: pickup.latitude, longitude: pickup.longitude });
    }
    if (drop?.latitude && drop?.longitude && status === 'ARRIVED') {
      coordinates.push({ latitude: drop.latitude, longitude: drop.longitude });
    }
    if (captain?.latitude && captain?.longitude) {
      coordinates.push({ latitude: captain.latitude, longitude: captain.longitude });
    }

    if (coordinates.length === 0) return;

    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } catch (error) {
      console.error('Error while fitting to coordinates', error);
    }
  };
  const calculateInitialRegion = () => {
 
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.03,  // Increased the delta for better initial zoom level
        longitudeDelta: 0.03, // Increased the delta for better initial zoom level
      };
    }
    return indiaInitialRegion;
  };

  useEffect(() => {
   
    if (pickup?.latitude && drop?.latitude) fitToMarkers();
  }, [drop?.latitude, pickup?.latitude, captain?.latitude]);

  return (
    <View style={{ height, width: '100%' }}>
      <MapView
        ref={mapRef}
        followsUserLocation
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        provider="google"
        showsMyLocationButton={false}
        customMapStyle={customMapStyle}
        showsCompass={false}
        showsIndoors={false}
        showsUserLocation
        onRegionChange={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
      >
            {captain?.latitude && pickup?.latitude && (
          <MapViewDirections
            origin={status === 'START' ? captain : pickup}
            destination={status === 'START' ? pickup : drop}
            onReady={fitToMarkers}
            apikey={apiKey}
            strokeColor={Colors.iosColor}
            strokeWidth={3}
            precision="high"
            onError={(error) => console.error('Direction error:', error)}
          />
        )}
         {pickup?.latitude && (
                   <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}>
                     <Image source={require('@/assets/icons/marker.png')} style={{ height: 30, width: 30 }} />
                   </Marker>
                 )}
         
                 {/* Drop Marker */}
                 {drop?.latitude && (
                   <Marker coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}>
                     <Image source={require('@/assets/icons/drop_marker.png')} style={{ height: 30, width: 30 }} />
                   </Marker>
                 )}
    {captain?.latitude && (
      <Marker coordinate={{ latitude:captain.latitude,longitude:captain.longitude}}
      anchor={{x:0.5,y:1}}
      zIndex={1}>
        <View style={{transform:[{rotate:`${captain?.heading}deg`}]}}>
          <Image source={require('@/assets/icons/cab_marker.png')} style={{ height: 40, width: 40,resizeMode:'contain'}} />
        </View>

      </Marker>
    )}

    {
      drop && pickup && 
   (   <Polyline
      coordinates={getPoints([drop,pickup])}
      strokeColor={Colors.text}
      strokeWidth={2}
      geodesic={true}
      lineDashPattern={[12,10]}/>
   ) }


      </MapView>
      <TouchableOpacity style={mapStyles.gpsButton} onPress={ fitToMarkers}
      >
          <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
        </TouchableOpacity>
    </View>
  );
};

export default memo(LiveTrackingMap);
