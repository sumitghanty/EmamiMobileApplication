import React, { Component } from 'react'
import { StatusBar, View, Text, Image, ActivityIndicator, AsyncStorage } from "react-native"
import { LinearTextGradient } from "react-native-text-gradient"

import { NetworkError } from '../Components';
import logo from '../Assets/Images/logo.png'
import styles from './Styles/SplashScreen'

export default class SplashScreen extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      timePassed: false,
      isLoading: true,
      isLogedin: false
    }
    global.DATEFORMAT = 'DD/MM/YYYY',
    global.COSTCENTRE = "CORP16",

    global.USER = null;
    global.PASSWORD = null;
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      this.getToken()
      .then (() => {
        this.setState({isLoading: false});
      });
    });
    setTimeout( () => {
        this.setTimePassed();
    },2000);
  }
  setTimePassed() {
      this.setState({timePassed: true});
  }
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      if (data) {
        console.log(data);
        this.setState({isLogedin: true});
        global.USER = data.userInfo;
        global.PASSWORD = data.password;
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  render() {
    //console.log('Screen:'+this.props.navigation.state.routeName)
    if (this.state.timePassed && !this.state.isLoading) {
      return (
        this.state.isLogedin ?
        this.props.navigation.navigate('Home')
        : this.props.navigation.navigate('Login')
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <NetworkError />
          <Image source={logo} style={styles.logo} />
          <Text style={styles.welcome}>Welcome to</Text>
          <View>
            <LinearTextGradient
              style={styles.titleWraper}
              locations={[0, 1]}
              colors={["#008ab3", "#8c3fff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
              <Text style={styles.title}>Travel Management</Text>
            </LinearTextGradient>
            <LinearTextGradient
              style={styles.titleWraper}
              locations={[0, 1]}
              colors={["#008ab3", "#8c3fff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
              <Text style={styles.title}>System</Text>
            </LinearTextGradient>
          </View>
          <ActivityIndicator size="large" color="#0066b3" style={{marginTop:50}} />
        </View>
      );
    }
  }
}