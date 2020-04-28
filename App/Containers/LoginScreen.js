import React, { Component, PropTypes } from 'react';
import { StatusBar, ScrollView, View, Text, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, AsyncStorage, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Form, ListItem, Body, CheckBox, Button } from 'native-base';
import { LinearTextGradient } from "react-native-text-gradient"
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-simple-toast'

import {API_URL_FRONT} from '../config'
import { Loader } from '../Components';
import styles from './Styles/LoginScreen';
import logo from '../Assets/Images/logo.png';

class LoginScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {			
      username: '',
      password: '',
      remember: false,
      isLoading: false,
      userNameError: '',
      passwordError: '',
      userData: null,
    }
  };

	handleChangeUsername = (text) => {
    this.setState({ 
      username: text,
      userNameError: ''
    });
  }

  handleChangePassword = (text) => {
    this.setState({ 
      password: text,
      passwordError: ''
    })
  }

  loginFail = () => {
    Alert.alert(
      "Login failed!",
      "User Id or Password is not match.",
      [
        {
          text: "Try Again",
          style: 'cancel',
        }
      ],
      { cancelable: false }
    );
  }

  loginRequest () {
    if(this.state.username.length<1 || this.state.password.length<1) {
      if (this.state.username.length<1) {
        this.setState({
          userNameError: 'Please enter User Id'
        });
      }
      if (this.state.password.length<1) {
        this.setState({
          passwordError: 'Please enter Password'
        });
      }
    } else {
      this.setState({ isLoading: true }, () => {
        fetch(API_URL_FRONT+'login',{
          method: "GET",
          mode: "no-cors",
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'userId': this.state.username,
            'password': this.state.password
          }
        })
        .then((response)=> response.json())
        .then((res) => {
          console.log(res);
          this.setState({
            userData: {'userInfo':res,'password':this.state.password}
          });
        })
        .then(() => {
          if(JSON.stringify(this.state.userData.userInfo) == '"Login failed!"' || JSON.stringify(this.state.userData.userInfo) == '"Login failed 00!"' 
          || JSON.stringify(this.state.userData.userInfo) == '"Login failed !"') {
            this.loginFail();
            this.setState({
              isLoading: false
            });
          } else {
            global.USER = this.state.userData.userInfo;
            global.PASSWORD = this.state.userData.password;
            if(this.state.remember) {
              this.storeToken(JSON.stringify(this.state.userData));
            }
            this.setState({
              isLoading: false
            });
            this.props.navigation.navigate('Home');
            Toast.show('Login Successfully.', Toast.LONG);
          }
        })
        .catch((Error) => {
          console.log(Error)
        });
      })
    }
  }

  async storeToken(user) {
    try {
       await AsyncStorage.setItem("userData", user);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  handleBackButton = () => {
    Alert.alert(
        'Exit App',
        'Exiting the application?', [{
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'Yes',
            onPress: () => BackHandler.exitApp()
        }, ], {
            cancelable: false
        }
     )
     return true;
   }

   componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
   
  render() {
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    const { username, password } = this.state;
    console.log(API_URL_FRONT)
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View style={styles.bgImg}></View>
          <View style={styles.logoWraper}>
            <Image source={logo} style={styles.logo} />
            <LinearTextGradient
              style={styles.sloganWraper}
              locations={[0, 1]}
              colors={["#008ab3", "#8c3fff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
              <Text style={styles.slogan}>Making people healthy &amp; beautiful, naturally</Text>
            </LinearTextGradient>
          </View>
          <Form style={styles.form}>
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.formRow}>
              <Icon name="ios-contact" size={32} color="rgba(0,0,0,.35)" style={styles.inputIcon} />
              <TextInput 
                //getRef={(ref)=>this.emailInput=ref}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='next'
                underlineColorAndroid='transparent'
                style={styles.formInput}
                value={username}
                placeholder="Employee ID" 
                returnKeyType="next"
								onChangeText={this.handleChangeUsername}
                onSubmitEditing={() => this.refs.password.focus()} />
            </View>
            {this.state.userNameError.length>0 &&
            <Text style={styles.error}>{this.state.userNameError}</Text>}
            <View style={styles.formRow}>
              <Icon name="ios-key" size={32} color="rgba(0,0,0,.35)" style={styles.inputIcon} />
              <TextInput 
                ref='password'
								value={password}
                keyboardType='default'
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                style={styles.formInput}
                underlineColorAndroid='transparent'
                placeholder="Password"								
								onChangeText={this.handleChangePassword}
                //onSubmitEditing={()=>this.login()}
                />
            </View>
            {this.state.passwordError.length>0 &&
            <Text style={styles.error}>{this.state.passwordError}</Text>}
            <View style={styles.rememberWraper}>
              <ListItem onPress={() => this.setState({ remember: !this.state.remember })} style={styles.rememberItem}>
                <CheckBox checked={this.state.remember} onPress={() => this.setState({ remember: !this.state.remember })}/>
                <Body>
                  <Text style={styles.rememberLabel}>Keep Me Logged In</Text>
                </Body>
              </ListItem>
              {/*<Button transparent style={styles.forgotBtn} onPress={() => this.props.navigation.navigate('Forgot')}>
                <Text style={styles.forgotBtnText}>Forgot Password?</Text>
              </Button>*/}
            </View>
            <TouchableOpacity onPress={() => this.loginRequest()} style={styles.btn}>
              <LinearGradient 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                colors={['#008ab3', '#8c3fff']} 
                style={styles.btnBg}>
                <Text style={styles.btnTxt}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity >
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
};

export default LoginScreen;