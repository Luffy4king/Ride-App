import { mapStyles } from "@/styles/mapStyles";
import { Colors } from "@/utils/Constants";
import { getPoints } from "@/utils/mapUtils";
import { FC, memo, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Marker, Polyline } from "react-native-maps";
import MapView from "react-native-maps/lib/MapView";
import CustomText from "../shared/CustomText";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { customMapStyle, indiaInitialRegion } from "@/utils/CustomMap";

const apikey = process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY || ""; // LocationIQ API Key

const CaptainLiveTracking: FC<{
    drop: any,
    pickup: any,
    captain: any;
    status: string
}> = ({ drop, status, pickup, captain }) => {

    const mapRef = useRef<MapView>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

    const fitToMarkers = async () => {
        if (isUserInteracting) return;

        const coordinates = [];

        if (pickup?.latitude && pickup?.longitude && status === "START") {
            coordinates.push({ latitude: pickup.latitude, longitude: pickup.longitude });
        }

        if (drop?.latitude && drop?.longitude && status === "ARRIVED") {
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
            console.error("Error fitting to markers:", error);
        }
    };

    const fetchRouteFromLocationIQ = async () => {
        if (!pickup?.latitude || !drop?.latitude) return;

        const url = `https://us1.locationiq.com/v1/directions/driving/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?key=${apikey}&steps=false&geometries=geojson`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data?.routes?.[0]?.geometry?.coordinates) {
                const coordinates = data.routes[0].geometry.coordinates.map((coord: any) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(coordinates);
            }
        } catch (error) {
            console.error("Error fetching route from LocationIQ:", error);
        }
    };

    useEffect(() => {
        fetchRouteFromLocationIQ();
        if (pickup?.latitude && drop?.latitude) fitToMarkers();
    }, [pickup, drop]);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                followsUserLocation
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: (pickup?.latitude + drop?.latitude) / 2 || indiaInitialRegion.latitude,
                    longitude: (pickup?.longitude + drop?.longitude) / 2 || indiaInitialRegion.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                provider="google"
                showsMyLocationButton={false}
                showsCompass={false}
                showsIndoors={false}
                customMapStyle={customMapStyle}
                showsUserLocation={true}
                onRegionChange={() => setIsUserInteracting(true)}
                onRegionChangeComplete={() => setIsUserInteracting(false)}
            >
                {/* Drop Marker */}
                {drop?.latitude && (
                    <Marker
                        coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={1}
                    >
                        <Image
                            source={require('@/assets/icons/drop_marker.png')}
                            style={{ height: 30, width: 30, resizeMode: 'contain' }}
                        />
                    </Marker>
                )}

                {/* Pickup Marker */}
                {pickup?.latitude && (
                    <Marker
                        coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={2}
                    >
                        <Image
                            source={require('@/assets/icons/marker.png')}
                            style={{ height: 30, width: 30, resizeMode: 'contain' }}
                        />
                    </Marker>
                )}

                {/* Captain Marker */}
                {captain?.latitude && (
                    <Marker
                        coordinate={{ latitude: captain.latitude, longitude: captain.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={3}
                    >
                        <View style={{ transform: [{ rotate: `${captain?.heading || 0}deg` }] }}>
                            <Image
                                source={require('@/assets/icons/cab_marker.png')}
                                style={{ height: 40, width: 40, resizeMode: 'contain' }}
                            />
                        </View>
                    </Marker>
                )}

                {/* LocationIQ Polyline Route */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor={Colors.iosColor}
                        strokeWidth={5}
                    />
                )}
            </MapView>

            {/* Open Live GPS Button */}
            <TouchableOpacity style={mapStyles.gpsLiveButton} onPress={() => { }}>
                <CustomText fontFamily='SemiBold' fontSize={10}>
                    Open Live GPS
                </CustomText>
                <FontAwesome6 name="location-arrow" size={RFValue(12)} color='#000' />
            </TouchableOpacity>

            {/* Center Map Button */}
            <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
                <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color='#3C75BE' />
            </TouchableOpacity>
        </View>
    )
}

export default memo(CaptainLiveTracking);
