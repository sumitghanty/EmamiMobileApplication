import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, AsyncStorage } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import Loader from '../Components/Loader'
import {API_URL} from '../config'

import styles from './Styles/TrainReqScreen.js';

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'
const CLASS = ['AC - 2 tier', 'AC - 3 tier', 'Sleeper', 'General'];
const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default class TrainReqScreen extends Component {
  UNSAFE_componentWillMount() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.setState({
      curDate: year+'-'+month+'-'+date,
      date: new Date(year+'-'+month+'-'+date),
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      date: new Date('00, 0, 0'),
      mode: 'date',
      show: false,
      tclass: '',
      time: '',
      locationList: [],
      toLocation: [],
      attachFiles: [],
      isLoading: true,
    };
  }
  getTripLocationResponse() {  
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getLocationList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          locationList: responseJson, 
          isLoading: false,
        })
        locationList.push( locationList )
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })  
  };
  componentDidMount() {
    this.getTripLocationResponse();
  }
  onValueChangeTime = (time) => {
    this.setState({
      time: time
    });
  }
  onValueChangeClass = (tclass) => {
    this.setState({
      tclass: tclass
    });
  }
  onValueChangeFrom = (from) => {
    this.setState({
      from: from
    });
    var toLocations = Array.from(this.state.locationList);
    for( var i = 0; i < toLocations.length; i++){ 
      if ( toLocations[i].city === from) {
        toLocations.splice(i, 1); 
      }
    }
    this.setState({toLocation: toLocations});
  }
  onValueChangeTo = (to) => {
    this.setState({
      to: to
    });
  }
  
  removeAttach(e) {
    var newList = this.state.attachFiles;
    if (e !== -1) {
      newList.splice(e, 1);
      this.setState({attachFiles: newList});
    }
  }
  async selectAttachFiles() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
      }
      if (results.length>1) {
        alert(results.length + ' fils are uploade successfuly.');
      } else {
        alert(results.length + ' fil is uploade successfuly.');
      }
      this.state.attachFiles.push(results);
      this.setState({ attachFiles: results });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You have not select any file for attachment');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }
  setDate = (event, date) => {
    date = date || this.state.date; 
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  } 
  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  } 
  datepicker = () => {
    this.show('date');
  }
  render() {
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Train Travel</Text>
          <Form>            
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Max Amount:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>600</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment.utc(this.state.date).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={this.state.date}
              mode={this.state.mode}
              minimumDate={new Date(this.state.curDate)}
              is24Hour={true}
              display="default"
              onChange={this.setDate} />
            }
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Class:</Label>
              <Picker
                placeholder="Select Class" 
                selectedValue = {this.state.tclass} 
                onValueChange = {this.onValueChangeClass}                
                style={styles.formInput}>
                {CLASS.map((item, index) => {
                  return (
                  <Picker.Item label={item} value={item} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Suitable Time:</Label>
              <Picker
                mode="dropdown"
                placeholder="Select Travel Time" 
                selectedValue = {this.state.time} 
                onValueChange = {this.onValueChangeTime}                
                style={styles.formInput}
                prompt="Select Travel Time">
                {SUIT_TIME.map((item, index) => {
                return (
                  <Picker.Item label={item} value={item} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Form:</Label>
              <Picker
                placeholder="Select a Location" 
                selectedValue = {this.state.from} 
                onValueChange = {this.onValueChangeFrom}                
                style={styles.formInput}>
                <Picker.Item label={'Select From Location'} value={'Select From Location'} />
                {this.state.locationList.map((item, index) => {
                return (
                  <Picker.Item label={item.city} value={item.city} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Picker
                placeholder="Select a Location" 
                selectedValue = {this.state.to} 
                onValueChange = {this.onValueChangeTo}                
                style={styles.formInput}>
                <Picker.Item label={'Select To Location'} value={'Select To Location'} />
                {this.state.toLocation.map((item, index) => {
                return (
                  <Picker.Item 
                    label={item.city} 
                    value={item.city}
                    key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Personal Email:</Label>
              <TextInput 
                autoCompleteType="email" 
                TYPE="email" 
                style={[styles.formInput,styles.inputType]} 
                placeholder="Enter your email"
                keyboardType="email-address"
                underlineColorAndroid= "rgba(0,0,0,0)" />
            </Item>
            <View style={styles.attachRow}>
              <Text style={styles.formLabel}>Attachments:</Text>
              <Button rounded bordered info onPress={this.selectAttachFiles.bind(this)} style={styles.atchBtn}>                
                <Icon name='attach' style={{fontSize:16, marginRight:0}} />
                <Text style={{fontSize:12,textAlign:'center'}}>
                  Attach Documents
                </Text>
              </Button>
            </View>
          </Form>
          {this.state.attachFiles.map((item, key) => (
            <View key={key} style={styles.atchFileRow}>
              <Text style={styles.atchFileName}>{item.name ? item.name : ''}</Text>
              <Button bordered small rounded danger style={styles.actionBtn}
                onPress={()=>this.removeAttach(key)}>
                <Icon name='close' style={styles.actionBtnIco} />
              </Button>
            </View>
          ))}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('TripPlan')} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>     
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}