import React, {Component} from 'react'
import { View, ActivityIndicator } from 'react-native';

export default class Loader extends React.Component{
  render(){
    return <View style={{flax:1, flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', backgroundColor:'#fff'}}>
      <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
    </View>;
  }
}
