import React, { Component } from 'react'
import { View, TouchableOpacity, Picker, Platform, AsyncStorage, Keyboard } from "react-native"
import { Container, Content, Icon, Text, Form, Item, Label, Input } from 'native-base'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { NavigationEvents } from 'react-navigation'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/TripCreateScreen';
import updateStyles from './Styles/TripUpdateScreen';

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'

class TripUpdateScreen extends Component {
  UNSAFE_componentWillMount() {
    const {params} = this.props.navigation.state;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.setState({
      curDate: year+'-'+month+'-'+date,
    });
  }
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      dateStart: new Date(params.start_date),
      modeStart: 'date',
      showStart: false,
      dateEnd: new Date(params.end_date),
      modeEnd: 'date',
      showEnd: false,
      purpose: '',
      purposeId: params.purpose,
      for: '',
      travelsName: null,
      forId: params.trip_for,
      retainer_id: 1,
      locationList: [],
      toLocation: [],
      tripForList: [],
      purposeList: [],
      travelersList: [],
      isLoading: true,
      tripNo: params.trip_no,
      details: params.details,
      tripFrom: params.trip_from,
      tripTo: params.trip_to,
      error: false,
      name: global.USER.userName,
      updateParams: '',
    };
  }

  getTripForResposnse() {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getTripForMasterList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({
          tripForList: responseJson,
          isLoading: false,  
        })
        //tripForList.push( tripForList )
      })
      .then(()=> {
        for(var i=0; i<=this.state.tripForList.length; i++) {
          if(this.state.tripForList[i].tripFor_type_id == params.trip_for) {
            this.setState({ 
              for : this.state.tripForList[i].tripFor_type,
              isLoading: false,
            })
          }
        }
      })
      .catch((Error) => {
        console.log(Error)
      });
    })
  };  
  getTripLocationResponse() {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getLocationList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          locationList: responseJson, 
          isLoading: false,
        })
        //locationList.push( locationList )
      })
      .then(()=> {
        var toLocations = Array.from(this.state.locationList);
        for( var i = 0; i < toLocations.length; i++){ 
          if ( toLocations[i].city === params.trip_from) {
            toLocations.splice(i, 1); 
          }
        }
        this.setState({
          toLocation: toLocations
        });
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })  
  };
  getTripPurposeResponse() { 
    const {params} = this.props.navigation.state; 
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'activeForListOfTripForMaster?active_for=B')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          purposeList: responseJson,
        })
      })
      .then(()=> {
        for(var i=0; i<=this.state.purposeList.length; i++) {
          if(this.state.purposeList[i].purpose_type_id == params.purpose) {
            this.setState({ 
              purpose : this.state.purposeList[i].purpose_type, 
              isLoading: false,
            })
          }
        }
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })
  };
  getTravelersResponse() {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
      return fetch(API_URL+'getRetainerNameList')
      .then((response)=> response.json() )
      .then((responseJson) => {
        this.setState({ 
          travelersList: responseJson,
        })
      })
      .then(()=> {
        if(params.trip_for == "3") {
          for(var i=0; i<=this.state.travelersList.length; i++) {
            if(this.state.travelersList[i].retainer_id == parseInt(params.name)) {
              this.setState({ 
                travelsName : this.state.travelersList[i].name_of_retainers, 
                isLoading: false,
              })
            }
          }
        }
      })
      .catch((Error) => {
        console.log(Error)
      });  
    })  
  };
  componentDidMount() {
    this.getTripForResposnse();
    this.getTripLocationResponse();
    this.getTripPurposeResponse();
    this.getTravelersResponse();
  }

  onValueChangePurpose = (value) => {
    this.setState({ purpose: value });
    this.state.purposeList.map((item) => {
      if (item.purpose_type == value) {
        this.setState({ purposeId: item.purpose_type_id });
      }      
    })
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
    this.setState({ 
      travelsName: value,
    });
    this.state.travelersList.map((item) => {
      if (item.name_of_retainers == value) {
        this.setState({ retainer_id: item.retainer_id });
      }      
    })
  }
  setDateEnd = (event, dateEnd) => {
    dateEnd = dateEnd || this.state.dateEnd; 
    this.setState({
      showEnd: Platform.OS === 'ios' ? true : false,
      dateEnd,
    });
  } 
  showEnd = modeEnd => {
    this.setState({
      showEnd: true,
      modeEnd,
    });
  } 
  datepickerEnd = () => {
    this.showEnd('dateEnd');
  }
  setDateStart = (event, dateStart) => {
    dateStart = dateStart || this.state.dateStart; 
    this.setState({
      showStart: Platform.OS === 'ios' ? true : false,
      dateStart,
    });
  } 
  showStart = mode => {
    this.setState({
      showStart: true,
      mode,
    });
  } 
  datepickerStart = () => {
    this.showStart('dateStart');
  }
  onValueChangeFrom = (tripFrom) => {
    this.setState({
      tripFrom: tripFrom,
    });
    var toLocations = Array.from(this.state.locationList);
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
    });
  }
  handleChangeDetails = (text) => {
    this.setState({ details: text })
  }
 
  submitTrip = (statusId) => {
    const {params} = this.props.navigation.state;
    let newParams = params;

    newParams.trip_no = this.state.tripNo;
    newParams.trip_from = this.state.tripFrom;
    newParams.trip_to = this.state.tripTo;
    newParams.trip_hdr_id = params.trip_hdr_id;
    newParams.start_date = moment(this.state.dateStart).format("YYYY-MM-DD");
    newParams.end_date = moment(this.state.dateEnd).format("YYYY-MM-DD");
    newParams.trip_for = this.state.forId;
    newParams.purpose = this.state.purposeId;
    newParams.trip_creator_name = global.USER.userName;
    newParams.trip_creator_userid = global.USER.userId;
    newParams.details = this.state.details;
    newParams.status_id = statusId;
    newParams.status = statusId == "1"?"Create Trip/PJP - Saved":statusId == "2"?"Create Trip/PJP - Pending with Supervisor":null;
    newParams.userid = global.USER.userId;
    newParams.email = global.USER.userEmail;
    newParams.delete_status = "false";
    newParams.pending_with_email = global.USER.supervisorEmail;
    newParams.pending_with_name = global.USER.supervisorName;
    newParams.pending_with = global.USER.supervisorId;
    newParams.name = this.state.forId == "1" ? this.state.name 
                    : this.state.forId == "3"?this.state.retainer_id
                    :this.state.forId == "5"?''
                    :'';

    this.setState({ isLoading: true }, () => {
      this.props.tripUpdate([newParams])
      .then(()=>{
        this.props.navigation.navigate('TripList')
        .then(()=>{
          this.setState({ 
            error: false,
            isLoading: false
          });
          if(statusId == "1") {
            Toast.show('Trip Saved Successfully', Toast.LONG);
          }
          if(statusId == "2") {
            Toast.show('Trip Updated Successfully', Toast.LONG);
          }
        })        
      });
    });
    Keyboard.dismiss();
  }

  componentWillUnmount() {
    this.getTripForResposnse();
    this.getTripLocationResponse();
    this.getTripPurposeResponse();
    this.getTravelersResponse();
    this.props.getTrips(global.USER.userId);
  }

  render() {
    if(this.state.isLoading || this.props.tripUpdate.isLoading){
      return(
        <Loader/>
      )
    }
    const {params} = this.props.navigation.state;
    //console.log(this.props.navigation.state.routeName);
    return (
      <Container style={styles.container}>
        <Content Style={styles.content}>
          <NavigationEvents onDidFocus={() => {}} />
          <View style={updateStyles.header}>
            <Text style={updateStyles.headerLabel}>Trip Id</Text>
            <Text style={updateStyles.headerValue}>{params.trip_no}</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Start Date:</Label>
              <TouchableOpacity onPress={this.datepickerStart} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showStart && 
            <DateTimePicker value={this.state.dateStart}
              mode={this.state.modeStart}
              minimumDate={new Date(this.state.curDate)}
              is24Hour={true}
              display="default"
              onChange={this.setDateStart} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>End Date:</Label>
              <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateEnd).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showEnd && 
            <DateTimePicker value={this.state.dateEnd}
              mode={this.state.modeEnd}
              minimumDate={new Date(this.state.dateStart)}
              is24Hour={true}
              display="default"
              onChange={this.setDateEnd} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select your Purpose"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue= {this.state.purpose}
                onValueChange={this.onValueChangePurpose}
                >
                {this.state.purposeList.map((item, index) => {
                  return (
                  <Picker.Item label={item.purpose_type} value={item.purpose_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Form:</Label>
              <Picker
                placeholder="Select From Location" 
                selectedValue = {this.state.tripFrom} 
                onValueChange = {this.onValueChangeFrom}                
                style={styles.formInput}>
                {this.state.locationList.map((item, index) => {
                return (
                  <Picker.Item label={item.city} value={item.city} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Picker
                placeholder="Select To Location" 
                selectedValue = {this.state.tripTo} 
                onValueChange = {this.onValueChangeTo}                
                style={styles.formInput}>
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
              {this.state.forId == "1" ?
              <Text style={[styles.value,styles.readOnly]}>{this.state.name}</Text>
              : this.state.forId == "3" ?
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Travelers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.travelsName}
                onValueChange={this.onValueChangeTraveler}
                >
                {this.state.travelersList.map((item, index) => {
                  return (
                  <Picker.Item label={item.name_of_retainers} value={item.name_of_retainers} key={index} />
                  );
                })}
              </Picker>
              : this.state.forId == "5" ?
              <Text>&nbsp;</Text>
              :null}
            </Item>
            <Item stackedLabel style={[styles.formRow,styles.mb]}>
              <Label style={styles.formLabel}>Details:</Label>
              <Input 
                multiline
                numberOfLines={2}
                placeholder='Enter your comments'
                onChangeText={this.handleChangeDetails}
                value = {this.state.details}
                style={styles.formInput}
                />
            </Item>
          </Form>         
        </Content>
        {(this.state.purpose.length > 0 && this.state.for.length > 0 && this.state.tripFrom.length > 0 && this.state.tripTo.length > 0) ?
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.submitTrip(1)} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBg}>
              <Ficon name='save' style={[styles.ftrBtnIcon,{marginVertical:2}]} />
              <Text style={styles.ftrBtnTxt}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.submitTrip(2)} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name="md-done-all" style={[styles.ftrBtnIcon,{fontSize:20}]} />
              <Text style={styles.ftrBtnTxt}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>:null}
      </Container>
    );
  }
};

const mapStateToProps = state => {
  return {
    tripUpdate: state.tripUpdate,
    trips: state.trips
  };
};

const mapDispatchToProps = {
  tripUpdate : Actions.tripUpdate,
  getTrips : Actions.getTrips
};

export default connect(mapStateToProps, mapDispatchToProps)(TripUpdateScreen);