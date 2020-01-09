import React, { Component } from 'react';
import { StatusBar, ScrollView, View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient'

import styles from './Styles/ForgotScreen';

export default class ForgotScreen extends Component {
  render() {
    return (
		<KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
			<ScrollView contentContainerStyle={styles.scrollView}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
				<Text style={styles.label}>ENTER YOUR ID</Text>
				<TextInput 
					autoCapitalize='none'
          autoCorrect={false}
					placeholder="Your ID" 
					underlineColorAndroid='transparent'
					style={styles.input}/>
				<TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('Login')}>
					<LinearGradient 
						start={{x: 0, y: 0}} 
						end={{x: 1, y: 0}} 
						colors={['#008ab3', '#8c3fff']} 
						style={styles.btnBg}>
						<Text style={styles.btnText}>SUBMIT</Text>
					</LinearGradient>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
    );
  }
}