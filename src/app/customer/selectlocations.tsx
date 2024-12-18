import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { homeStyles } from '@/styles/homeStyles'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { commonStyles } from '@/styles/commonStyles'
import { router } from 'expo-router'
import CustomText from '@/components/shared/CustomText'
import { uiStyles } from '@/styles/uiStyles'
import LocationInputs from '../../components/customer/LocationInputs'
import { calculateDistance, getLatLong, getPlacesSuggestions } from '@/utils/mapUtils'
import { FlatList } from 'react-native-gesture-handler'
import { locationStyles } from '@/styles/locationStyles'
import { useUserStore } from '@/store/UserStore'
import LocationItem from '../../components/customer/LocationItem'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import MapPickerModal from '../../components/customer/MappickerModel'
import * as Location from "expo-location"

const Selectlocations = () => {
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<any>(null)
  const [dropCoords, setDropCoords] = useState<any>(null)
  const [drop, setDrop] = useState("")
  const [locations, setLocations] = useState([])
  const [focusedInput, setFocusedInput] = useState('drop')
  const [modalTitle, setModalTitle] = useState('drop')
    const [isMapModalVisible, setIsMapModalVisible] =useState(false)
    const {location} = useUserStore();
  

  const  fetchLocation = async(query :string) => {
    if(query?.length>4){
      
       const data = await getPlacesSuggestions(query)
      
     setLocations(data)
    }
    
  }
  useEffect(() =>{
if(location){
  setPickupCoords(location)
  setPickup(location?.address)
}
  },[location])
const checkDistance = async() =>{
if(!pickupCoords ||!dropCoords) return
const {latitude:lat1,longitude:lon1} =pickupCoords
  const {latitude:lat2,longitude:lon2} = dropCoords
  if(lat1 === lat2 && lon1===lon2) {
    alert("Pick up and drop locations cannot be same.Please select different location")
    return
  }
  const  distance = calculateDistance(lat1,lon1,lat2,lon2)

  const minDistance = 0.5
  const maxDistance =50
  if(distance<minDistance) {
    alert("The selected locations are too close to each other.Please select different location")
  }else if(distance>maxDistance) {
    alert("The selected locations are too far to each other.Please select closest location")
  }else{
    setLocations([])
    router.navigate({
      pathname:'/customer/ridebooking',params:{
        distanceInKm: distance.toFixed(2),
        drop_latitude:dropCoords?.latitude,
        drop_longitude:dropCoords?.longitude,
        drop_address:drop
      }
      

    })
    setIsMapModalVisible(false)
    console.log(`Distance is valid:${distance.toFixed(2)}km`)
  }
}
  useEffect(() =>{
    if(dropCoords && pickupCoords){
      checkDistance();
    }else{
      setLocations([])
      setIsMapModalVisible(false)
    }
  },[dropCoords,pickupCoords])

  const addLocation = async (id: string) => {
const data = await getLatLong(id);
if(data) {
  if(focusedInput ==="drop"){
    setDrop(data?.address)
    setDropCoords(data)
  }
  else{
    // setLocations(data)
    setPickupCoords(data)
    setPickup(data?.address)
  }
}
  }
  const renderLocations=({item}:any) =>{
    return (
    <LocationItem item={item} onPress={() => addLocation(item?.place_id)}/>
    )
  }
  return (
    <View style={homeStyles.container}>
      <StatusBar style='light' backgroundColor='orange'
      translucent={false}/>
      <SafeAreaView/>
      <TouchableOpacity style={commonStyles.flexRow} onPress={() =>router.back()}>
        <Ionicons name='chevron-back' size={24} color={Colors.androidColor}/>
        <CustomText fontFamily='Regular' style={{color:Colors.androidColor}}>Back
          
        </CustomText>
      </TouchableOpacity>
      <View style={uiStyles.locationInputs}>
        <LocationInputs
          placeholder="Search Pick Up Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text)
            fetchLocation(text)
          }}
          onFocus={() => setFocusedInput('pickup')
          }
        />
        <LocationInputs
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text)
            fetchLocation(text)
          }}
         onFocus={() => setFocusedInput('drop')}
        />
   <CustomText fontFamily="Medium" style={uiStyles.suggestionText}>
   {focusedInput} suggestions
        </CustomText>
      </View>
      <FlatList
      data={locations}
      renderItem={renderLocations}
      keyExtractor={(item:any)=> item?.place_id}
      initialNumToRender={5}
      windowSize={5}
      ListFooterComponent={
        <TouchableOpacity style={[commonStyles.flexRow,locationStyles.container]} onPress={() => {setModalTitle(focusedInput) ,setIsMapModalVisible(true)}}>
          <Image source={require('@/assets/icons/map_pin.png')} style={uiStyles.mapPinIcon}/>
          <CustomText fontFamily='Medium' fontSize={12}>
            Select from map
          </CustomText>
        </TouchableOpacity>
      }/>{
        isMapModalVisible && 
        <MapPickerModal
        selectedLocation={{
          latitude:focusedInput==='drop' ? dropCoords?.latitude : pickupCoords?.latitude,
          longitude:focusedInput==='drop'?dropCoords?.longitude:pickupCoords?.longitude,
          address:focusedInput==='drop'? drop:pickup
        }}
        title={modalTitle}
        visible={isMapModalVisible}
        onClose={()=> setIsMapModalVisible(false)}
        onSelectedLocation={(data)=>{
          if(data)
          {
            if(modalTitle ==='drop'){
              setDropCoords(data)
              setDrop(data.address)
            }else{
              setLocations(data)
              setPickupCoords(data)
              setPickup(data?.address)
            }
          }
        }
      }
        />

      }
    </View>
  )
}

export default Selectlocations