import React, { Component } from 'react'
import { View, TouchableOpacity, Picker, AsyncStorage } from "react-native"
import { Container, Content, Icon, Text, Form, Item, Label, Input } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import {API_URL} from '../config'
import Loader from '../Components/Loader'

import styles from './Styles/PjpCreateScreen';

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'
const MONTHS = ['January','February','March','April','May','Jun','July','August','September','October','November','December']

export default class PjpCreateScreen extends Component {
  UNSAFE_componentWillMount() {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    this.setState({
      curYear: ''+year,
      selectedYear: ''+year,
      curMonth: MONTHS[month],
      selectedMonth: MONTHS[month],
    });
    this.onValueChangeYear(''+year)
  }
  constructor(props) {
    super(props);
    this.state = {
      purpose: undefined,
      for: undefined,
      travelsName: undefined,
      forId: 1,
      retainer_id: 1,
      tripForList: [],
      purposeList: [],
      travelersList: [],
      curYear: '',
      selectedYear: '',
      curMonth: '',
      selectedMonth: '',
      monthList: [],
      isLoading: true
    };
  } 

  getTripForResposnse() {
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getTripForMasterList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({
          tripForList: responseJson,
          isLoading: false,  
        })
        tripForList.push( tripForList )
      })
      .catch((Error) => {
        console.log(Error)
      });
    })
  };
  getTripPurposeResponse() {  
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'activeForListOfTripForMaster?active_for=B')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          purposeList: responseJson, 
          isLoading: false,
        })
        purposeList.push( purposeList )
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })  
  };
  getTravelersResponse() {  
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getRetainerNameList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          travelersList: responseJson, 
          isLoading: false,
        })
        travelersList.push( travelersList )
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })  
  };
  componentDidMount() {
    this.getTripForResposnse();
    this.getTripPurposeResponse();
    this.getTravelersResponse();
  }

  onValueChangePurpose = (value) => {
    this.setState({ purpose: value });
  }
  onValueChangeFor = (value) => {
    this.setState({ for: value });
    this.state.tripForList.map((item) => {
      if (item.tripFor_type == value) {
        this.setState({ forId: item.tripFor_type_id });
      }      
    })
  }
  onValueChangeTraveler = (value) => {
    this.setState({ travelsName: value });
    this.state.travelersList.map((item) => {
      if (item.name_of_retainers == value) {
        this.setState({ retainer_id: item.retainer_id });
      }      
    })
  }
  onValueChangeYear = (value) => {
    this.setState({ selectedYear: value });
    var newMotnhList = Array.from(MONTHS);
    if(value == ''+new Date().getFullYear()){
      newMotnhList.splice(0, new Date().getMonth());
    }
    this.setState({monthList: newMotnhList});
  }
  onValueChangeMonth= (value) => {
    this.setState({ selectedMonth: value });
  }
  
  render() {
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    return (
      <Container style={styles.container}>
        <Content Style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Create New PJP</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>PJP Year:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Year"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={''+this.state.selectedYear}
                onValueChange={this.onValueChangeYear}
                >
                <Picker.Item label={''+parseInt(this.state.curYear)} value={''+parseInt(this.state.curYear)} />
                <Picker.Item label={''+(parseInt(this.state.curYear)+1)} value={''+(parseInt(this.state.curYear)+1)} />
                <Picker.Item label={''+(parseInt(this.state.curYear)+2)} value={''+(parseInt(this.state.curYear)+2)} />
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>PJP Month:</Label>
              <Picker
                mode="popup"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select month"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectedMonth}
                onValueChange={this.onValueChangeMonth}
                >
                {this.state.monthList.map((item, index) => {
                  return (
                  <Picker.Item label={item} value={item} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select your Purpose"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.purpose}
                onValueChange={this.onValueChangePurpose}
                >
                {this.state.purposeList.map((item, index) => {
                  return (
                  <Picker.Item label={item.purpose_type} value={item.purpose_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select your Location"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.for}
                onValueChange={this.onValueChangeFor}
                >
                {this.state.tripForList.map((item, index) => {
                  return (
                  <Picker.Item label={item.tripFor_type} value={item.tripFor_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Traveler's Name:</Label>
              {this.state.forId == 1 ?
              <Text style={[styles.value,styles.readOnly]}>{global.USER.userName}</Text>
              : this.state.forId == 5 ?
              <Text>&nbsp;</Text>
              : 
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Travelers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.travelsName}
                onValueChange={this.onValueChangeTraveler}
                >
                <Picker.Item label={'Select Travelers'} value={'Select Travelers'} />
                {this.state.travelersList.map((item, index) => {
                  return (
                  <Picker.Item label={item.name_of_retainers} value={item.name_of_retainers} key={index} />
                  );
                })}
              </Picker>
              }
            </Item>            
            <Item stackedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Details:</Label>
              <Input 
                multiline
                numberOfLines={2}
                placeholder='Enter your comments'
                style={styles.formInput}
                />
            </Item>
          </Form>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('PjpList')} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={["#9752ff", "#5e93ff"]} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Generate Trip ID</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}