import { AsyncStorage } from 'react-native'

const KEY_PREFIX='@user-'

export default {
    setItem:async (key,value)=>{
      try{
        await AsyncStorage.setItem(KEY_PREFIX+key,value);
      }catch(error){
        console.log(error);
      }
    },
    getItem:async (key)=>{
      try{
        return await AsyncStorage.getItem(KEY_PREFIX+key);
      }catch(error){
        console.log(error);
      }
    },
    multiSet:async (keyValuePairs)=>{
      try{
        await AsyncStorage.multiSet(keyValuePairs);
      }catch(error){
        console.log(error);
      }
    },
    multiGet:async (keys)=>{
      try{
        return await AsyncStorage.multiGet(keys);
      }catch(error){
        console.log(error);
      }
    },
    multiRemove:async (keys)=>{
      try{
        return await AsyncStorage.multiRemove(keys);
      }catch(error){
        console.log(error);
      }
    },
}
