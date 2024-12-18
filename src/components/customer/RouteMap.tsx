import { View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { mapStyles } from '@/styles/mapStyles';
import { customMapStyle, indiaInitialRegion } from '@/utils/CustomMap';
import { getRouteFromLocationIQ } from '@/utils/Direction';

const RouteMap: FC<{ drop: any; pickup: any }> = ({ drop, pickup }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const fetchDirections = async () => {
    if (!pickup?.latitude || !drop?.latitude) {
      return Alert.alert('Error', 'Pickup or drop coordinates are missing');
    }

    try {
      const data = await getRouteFromLocationIQ(pickup, drop);
      const coordinates = data?.routes[0]?.geometry?.coordinates || [];
      setRouteCoordinates(coordinates.map(([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch directions. Please try again.');
    }
  };

  useEffect(() => {
    if (pickup?.latitude && drop?.latitude) {
      fetchDirections();
    }
  }, [pickup, drop]);

  const fitToMarker = () => {
    if (pickup?.latitude && drop?.latitude) {
      mapRef.current?.fitToCoordinates(
        [
          { latitude: pickup.latitude, longitude: pickup.longitude },
          { latitude: drop.latitude, longitude: drop.longitude },
        ],
        {
          edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
          animated: true,
        }
      );
    }
  };

  useEffect(() => {
    fitToMarker();
  }, [routeCoordinates]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={indiaInitialRegion}
        customMapStyle={customMapStyle}
        showsUserLocation
      >
        {/* Plot Route */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}

        {/* Pickup Marker */}
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
      </MapView>
    </View>
  );
};

export default RouteMap;
