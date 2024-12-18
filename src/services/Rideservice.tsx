import { Alert } from "react-native";
import { appAxios } from "./apiIntercepetors";
import { router } from "expo-router";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
  address: string;
  latitude: number;
  longitude: number;
}

export const createRide = async (payload: {
  vehicle: 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';
  pickup: coords;
  drop: coords;
}) => {
  try {
    
    const res = await appAxios.post(`/ride/create`, payload);


    if (res?.data?.ride?._id) {
      
      if (router) {
        router.navigate({
          pathname: '/customer/liveride',
          params: { id: res?.data?.ride._id },
        });
      } else {
        console.log("Router is not available");
      }
    } else {
      console.log("Ride ID not found in response");
    }
  } catch (error) {
    Alert.alert("There was an error");
    console.log("Error:create ride", error);
  }
};


export const getMyRides = async (isCustomer:boolean =true) => {
  try {
    
    const res = await appAxios.get(`/ride/rides`);

const filterRides = res.data.rides?.filter((ride:any) => ride?.status != 'COMPLETED')

if(filterRides?.length > 0) {
  router?.navigate({
    pathname:isCustomer? '/customer/liveride':'/captain/liveride',
    params:{
      id:filterRides![0]?._id
    }
  })
}
   
  } catch (error) {
    Alert.alert("There was an error");
    console.log("Error:get my ride", error);
  }
};




export const acceptRideOffer = async (rideId:string) => {
  try {
    
    const res = await appAxios.patch(`/ride/accept/${rideId}`);
    resetAndNavigate({
      pathname:'/captain/liveride',
      params:{id:rideId}
    })



   
  } catch (error) {
    Alert.alert("There was an error in Accepting the Ride");
    console.log("Error:ACCEPT ride", error);
  }
};

export const updateRideStatus = async (rideId:string,status:string) => {
  try {
    
    const res = await appAxios.patch(`/ride/update/${rideId}`,{status});
  return true;



   
  } catch (error) {
    Alert.alert("There was an error in Accepting the Ride");
    console.log(error);
    return false;
  }
};