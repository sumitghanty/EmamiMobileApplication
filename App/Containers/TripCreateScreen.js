import React, { Component } from 'react'
import { View, TouchableOpacity, Picker, Platform, AsyncStorage, Keyboard, ActivityIndicator } from "react-native"
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

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'

class TripCreateScreen extends Component {
  _isMounted = false;
  UNSAFE_componentWillMount() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.setState({
      curDate: year+'-'+month+'-'+date,
      dateStart: new Date(year+'-'+month+'-'+date),
      dateEnd: new Date(year+'-'+month+'-'+date),
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      dateStart: new Date('00-00-00'),
      modeStart: 'date',
      showStart: false,
      dateEnd: new Date('00-00-00'),
      modeEnd: 'date',
      showEnd: false,
      purpose: undefined,
      purposeId: "1",
      for: undefined,
      travelsName: null,
      travelsNameError: '',
      forId: "1",
      retainer_id: 1,
      locationList: [],
      toLocation: [],
      tripForList: [],
      purposeList: [],
      travelersList: [],
      isLoading: true,
      tripNo: '',
      details: '',
      tripFrom: null,
      tripTo: null,
      error: false,
      tripFromError: '',
      tripToError: '',
      name: global.USER.userName,      
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
        //tripForList.push( tripForList )
      })
      .catch((Error) => {
        console.log(Error)
      });
    })
  };  
  getTripLocationResponse() {  
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
        //purposeList.push( purposeList )
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
        })
        //travelersList.push( travelersList )
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
    this._isMounted = true;
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
      travelsNameError: value=='Select Travelers'?'Please select a Traveler':'',
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
      dateEnd: dateStart
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
      tripFromError: tripFrom=='Select From Location'?'Please select Trip From Location':'',
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
      tripToError: tripTo=='Select To Location'?'Please select Trip To Location':'',
    });
  }
  handleChangeDetails = (text) => {
    this.setState({ details: text })
  }
  
  submitTrip = (statusId,tripNo) => {
    if(
      this.state.tripFrom == null || this.state.tripFrom == "Select From Location" ||
      this.state.tripTo == null || this.state.tripTo == "Select To Location" ||
      ((this.state.travelsName == null || this.state.travelsName == "Select Travelers") && this.state.forId == "3" )
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
      if((this.state.travelsName == null || this.state.travelsName == "Select Travelers") && this.state.forId == "3") {
        this.setState({
          travelsNameError: 'Please select a Traveler',
          error: true,
        });
      }
      console.log('There are some eroor.');
    } else {
      AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY ).then(value => {
        return fetch(API_URL+'getLatestTripNumber',{
          method: "POST",
          mode: "no-cors",
          headers: {
            Accept: 'text/plain',
            'Content-Type': 'text/plain',
          },
          body: "TRIP"
        })
        .then((response)=> response.text() )

        .then((tripNo) => {
          this.setState({ isLoading: true }, () => {      
            this.props.tripCreate([{
              "trip_no": tripNo,
              "trip_from": this.state.tripFrom,
              "trip_to": this.state.tripTo,
              "trip_hdr_id": 0,
              "start_date": moment(this.state.dateStart).format("YYYY-MM-DD"),
              "end_date": moment(this.state.dateEnd).format("YYYY-MM-DD"),
              "trip_for": this.state.forId,
              "purpose": this.state.purposeId,
              "trip_creator_name": global.USER.userName,
              "trip_creator_userid": global.USER.userId,
              "details": this.state.details.length>0?this.state.details:null,
              "status_id": statusId,
              "status": statusId == "1"?"Create Trip/PJP - Saved":statusId == "2"?"Create Trip/PJP - Pending with Supervisor":null,
              "userid": global.USER.userId,
              "useremail": global.USER.userEmail,
              "username": global.USER.userName,
              "delete_status": "false",
              "pending_with_email": global.USER.supervisorEmail,
              "pending_with_name": global.USER.supervisorName,
              "pending_with": global.USER.supervisorId,
              "name": this.state.forId == "1" ? this.state.name 
                    : this.state.forId == "3" ? this.state.retainer_id
                    : this.state.forId == "5" ? ''
                    :'',
            }])
            .then(()=>{
              this.props.navigation.navigate('TripList');
              this.setState({ 
                error: false,
                isLoading: false
              });
              if(statusId == "1") {
                Toast.show('Trip Updated Successfuly', Toast.LONG);
              }
              if(statusId == "2") {
                Toast.show('Trip Submited Successfuly', Toast.LONG);
              }
            });
          });
          
        })
        .catch((Error) => {
          console.log(Error)
        });  
      })
    }
    Keyboard.dismiss();
  }

  componentWillUnmount() {
    this.getTripForResposnse();
    this.getTripLocationResponse();
    this.getTripPurposeResponse();
    this.getTravelersResponse();
    this.props.getTrips(global.USER.userId);
    this._isMounted = false;
  }

  render() {
    console.log(this.props.navigation.state.routeName);
    if(this.state.isLoading || this.props.tripCreate.isLoading){
      return(
        <Loader/>
      )
    }
    return (
      <Container style={styles.container}>
        <Content Style={styles.content}>
          <NavigationEvents onDidFocus={() => {}} />
          <Text style={styles.title}>Create Your New Trip</Text>
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
              minimumDate={new Date(this.state.dateStart)}
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
              {this.state.purposeList.length>0 ?
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
              </Picker>:
              <ActivityIndicator size="small" color="rgba(0,0,0,.35)" style={{marginRight:16}} />
              }
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Form:</Label>
              {this.state.locationList.length>0?
              <Picker
                //placeholder="Select a Location" 
                selectedValue = {this.state.tripFrom} 
                onValueChange = {this.onValueChangeFrom}                
                style={styles.formInput}>
                <Picker.Item label={'Select From Location'} value={'Select From Location'} />
                {this.state.locationList.map((item, index) => {
                return (
                  <Picker.Item label={item.city} value={item.city} key={index} />
                );
                })}
              </Picker>:
              <ActivityIndicator size="small" color="rgba(0,0,0,.35)" style={{marginRight:16}} />
              }
            </Item>
            {this.state.tripFromError.length>0 &&
              <Text style={styles.errorText}>{this.state.tripFromError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              {this.state.locationList.length>0?
              <Picker
                //placeholder="Select a Location" 
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
              </Picker>:
              <ActivityIndicator size="small" color="rgba(0,0,0,.35)" style={{marginRight:16}} />
              }
            </Item>
            {this.state.tripToError.length>0 &&
              <Text style={styles.errorText}>{this.state.tripToError}</Text>
            }
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:</Label>
              {this.state.tripForList.length>0 ?
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
              </Picker>:
              <ActivityIndicator size="small" color="rgba(0,0,0,.35)" style={{marginRight:16}} />
              }
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Traveler's Name:</Label>
              {this.state.forId == "1" ?
              <Text style={[styles.value,styles.readOnly]}>{this.state.name}</Text>
              : this.state.forId == "3" ?
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                //placeholder="Select Travelers"
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
              : this.state.forId == "5" ?
              <Text>&nbsp;</Text>
              :null}
            </Item>
            {this.state.travelsNameError.length>0 &&
              <Text style={styles.errorText}>{this.state.travelsNameError}</Text>
            }
            <Item stackedLabel style={[styles.formRow,styles.mb]}>
              <Label style={styles.formLabel}>Details:</Label>
              <Input 
                multiline
                numberOfLines={2}
                placeholder='Enter your comments'
                onChangeText={this.handleChangeDetails}
                style={styles.formInput}
                />
            </Item>
          </Form>         
        </Content>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.submitTrip(1)} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBg}>
              <Ficon name='save' style={[styles.ftrBtnIcon,{marginVertical:2}]} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
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
        </View>
      </Container>
    );
  }
};

const mapStateToProps = state => {
  return {
    tripCreate: state.tripCreate,
    trips: state.trips
  };
};

const mapDispatchToProps = {
  tripCreate : Actions.tripCreate,
  getTrips : Actions.getTrips
};

export default connect(mapStateToProps, mapDispatchToProps)(TripCreateScreen);