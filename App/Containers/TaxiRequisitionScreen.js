import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, TextInput, Platform, AsyncStorage, Keyboard } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/TaxiRequisitionScreen'

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'

class TaxiRequisitionScreen extends Component {
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
      curDate: new Date('00, 0, 0'),
      date: new Date('00, 0, 0'),
      mode: 'date',
      show: false,     
      attachFiles: [],
      locationList: [],
      toLocation: [],
      isLoading: true,
      tripFrom: null,
      tripTo: null,
      error: false,
      tripFromError: '',
      tripToError: '',
      aprxAmnt: null,
      aprxAmntError: ''
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
      if (results.length>1) {
        alert(results.length + ' fils are uploade successfuly.');
      } else {
        alert(results.length + ' fil is uploade successfuly.');
      }
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
  onValueChangeFrom = (tripFrom) => {
    this.setState({
      tripFrom: tripFrom,
      tripFromError: tripFrom=='Select From Location'?'Please select Trip From Location':'',
    });
    var toLocations = Array.value(this.state.locationList);
    for( var i = 0; i < toLocations.length; i++){ 
      if ( toLocations[i].city === tripFrom) {
        toLocations.splice(i, 1); 
      }
    }
    this.setState({toLocation: toLocations});
  }
  onValueChangeTo = (tripTo) => {
    this.setState({
      tripTo: tripTo,
      tripToError: tripTo=='Select To Location'?'Please select Trip To Location':'',
    });
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
  handleChangeAmount = (amount) => {
    this.setState({ aprxAmnt: amount })
  }

  submitReq = () => {
    const {params, item} = this.props.navigation.state;
    if(
      this.state.tripFrom == null || this.state.tripFrom == "Select From Location" ||
      this.state.tripTo == null || this.state.tripTo == "Select To Location" ||
      this.state.aprxAmnt == null
    ) {
      if(this.state.tripFrom == null || this.state.tripFrom == "Select From Location") {
        this.setState({
          tripFromError: 'Please select Trip From Location',
          error: true,
        });
      }
      if(this.state.tripTo == null || this.state.tripTo == "Select To Location") {
        this.setState({
          tripToError: 'Please select Trip To Location',
          error: true,
        });
      }
      if(this.state.aprxAmnt == null) {
        this.setState({
          aprxAmntError: 'Please enter approx amount ',
          error: true,
        });
      }
      console.log('There are some eroor.');
    } else {
      this.setState({ isLoading: true }, () => {      
        this.props.tripCreate([{
          "trip_hdr_id": params.trip_hdr_id,
          "trip_no": params.trip_no,
          "req_type": item.sub_category_id,
          "start_date": params.start_date,
          "end_date": params.end_date,

          "travel_date": this.state.date,
          "travel_from": this.state.tripFrom,
          "travel_to": this.state.tripTo,
          "creation_date": moment(this.state.curDate).format("DD-MM-YYYY"),
          "through": "Self",
          "status_id": "7",
          "sub_status_id": this.state.aprxAmnt?"7.5":"7.4",
          "amount": this.state.aprxAmnt?this.state.aprxAmnt:0,
          "is_outof_policy": this.state.aprxAmnt?"Y":"N",
          "status": "Plan Trip/PJP",
          "sub_status": this.state.aprxAmnt?"Requisition - Out of Policy":"Requisition Saved",
          "gl": item.gl,
          "travel_heads": item.travel_heads
        }])
        .then(()=>{
          this.props.navigation.goBack();
          this.setState({ 
            error: false,
            isLoading: false
          });
          Toast.show('Requisition Create Successfully', Toast.LONG);
        });
      })
    }
    Keyboard.dismiss();
  }

  render() {
    const {params, item} = this.props.navigation.state;
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    console.log(params,item);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.item.sub_category}</Text>
        </View>
        <Form>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Travel Date:</Label>
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
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
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Approx Amount :</Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aprxAmnt}
              keyboardType= "number-pad"
              onChangeText={this.handleChangeAmount} />
          </Item>
          {this.state.aprxAmntError.length>0 &&
            <Text style={styles.errorText}>{this.state.aprxAmntError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Destination From:</Label>
            <Picker
              placeholder="Select From Location" 
              selectedValue = {this.state.tripFrom} 
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
          {this.state.tripFromError.length>0 &&
            <Text style={styles.errorText}>{this.state.tripFromError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Destination To:</Label>
            <Picker
              placeholder="Select To Location" 
              selectedValue = {this.state.tripTo} 
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
          {this.state.tripToError.length>0 &&
            <Text style={styles.errorText}>{this.state.tripToError}</Text>
          }
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
        </ScrollView>
        <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#53c55c', '#33b8d6']} 
            style={styles.ftrBtnBg}>
            <Icon name='done-all' style={styles.ftrBtnIcon} />
            <Text style={styles.ftrBtnTxt}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    tripReq: state.tripReq
  };
};

const mapDispatchToProps = {
  tripReq : Actions.tripReq
};

export default connect(mapStateToProps, mapDispatchToProps)(TaxiRequisitionScreen);