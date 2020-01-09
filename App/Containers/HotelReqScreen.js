import React, { Component } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, AsyncStorage, Keyboard, Alert, BackHandler } from "react-native"
import { Button, Icon, Text, Form, Item, Label, Input } from 'native-base'
import DocumentPicker from 'react-native-document-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack";

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/HotelReqScreen.js'
import StateDist from '../Assets/json/stateDist.json'

const LOCATION_KEY = 'LOCATION_STRING'
const THROUGH_KEY = 'THROUGH_STRING'
const TYPE_KEY = 'TYPE_STRING'

class HotelReqScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handleClearPress = navigation.getParam("handleBackPress", () => {});
    return {
      title: "Details!",
      headerLeft: <HeaderBackButton onPress={handleClearPress} />
    };
  };

  UNSAFE_componentWillMount() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.setState({
      curDate: year+'-'+month+'-'+date,
      date: new Date(year+'-'+month+'-'+date),
      dateCin: new Date(year+'-'+month+'-'+date),
      timeCin: new Date('0000'),
      dateCout: new Date(year+'-'+month+'-'+date),
      timeCout: new Date('0000'),
      tState: StateDist.states[0].state,
      cityList: StateDist.states[0].districts,
      tcity: StateDist.states[0].districts[0],
      lineitem: this.props.plans.dataSource.length+1
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      date: '0000-00-00',
      dateCin: '0000-00-00',
      timeCin: '00:00',
      dateCout: '0000-00-00',
      timeCout: '00:00',
      stateList: [],
      tState: '',
      cityList: [],
      tcity: '',
      modeDate: 'date',
      modeTime: 'time',
      show: false,
      showCin: false,
      showTimeCin: false,
      showCout: false,
      showTimeCout: false,
      through: "Self",
      attachFiles: [],
      locationList: [],
      throughtList: [],
      createdReq: [],
      typeList: [],
      type: '',
      amount: '0.0',
      days: 0,
      tempReq: null,
      lineitem: 0,
      planList: [],
      vanderName: ''
    };
  }

  getTripLocationResponse() {
    const {params} = this.props.navigation.state;
    var cityType = params.item.sub_category_id=="1BM"?"Metro"
      :params.item.sub_category_id=="1BNM"?"NonMetro"
      :params.item.sub_category_id=="1BH"?"HillStation":"";
    this.setState({ isLoading: true }, () => {
      AsyncStorage.getItem(LOCATION_KEY ).then(value => {
        return fetch(API_URL+'getLocationListForHotel?cityType='+cityType)
        .then((response)=> response.json() )
        .then((responseJson) => {
          this.setState({ 
            locationList: responseJson, 
            isLoading: false,
          });
        })
        .catch((Error) => {
          console.log(Error)
        });  
      });
    });
  };

  getTripThrough() {
    this.setState({ isLoading: true }, () => {
      AsyncStorage.getItem(THROUGH_KEY ).then(value => {
        return fetch(API_URL+'getTravelThroughList')
        .then((response)=> response.json() )
        .then((responseJson) => {
          this.setState({ 
            throughtList: responseJson,
            through: responseJson[0].travel_through_type,
            isLoading: false,
          });
        })
        .catch((Error) => {
          console.log(Error)
        });  
      });
    });
  };

  getTripType() {
    this.setState({ isLoading: true }, () => {
      AsyncStorage.getItem(TYPE_KEY ).then(value => {
        return fetch(API_URL+'getTravelNameList')
        .then((response)=> response.json() )
        .then((responseJson) => {
          this.setState({ 
            typeList: responseJson,
            type: responseJson[0].travel_type,
            isLoading: false,
          });
        })
        .catch((Error) => {
          console.log(Error)
        });  
      });
    });
  };

  reqCreate =() => {
    this.setState({ isLoading: true }, () => {
      const {params} = this.props.navigation.state;
      this.props.reqCreate([{
        "trip_hdr_id_fk": params.params.trip_hdr_id,
        "trip_no": params.params.trip_no,
        "status_id": "6",
        "status": "Plan Trip/PJP",
        "sub_status_id": "6.1",
        "sub_status": "Requisition Initiated",
        "userid": params.params.userid,
        "username": params.params.username,
        "useremail": params.params.useremail,
        "is_outof_policy": "N",
        "is_billRequired": "N",
        "delete_status": "false",
        "pending_with": params.params.pending_with,
        "pending_with_email": params.params.pending_with_email,
        "pending_with_name": params.params.pending_with_name,
        "lineitem": this.state.lineitem
      }])
      .then(() => {
        fetch(API_URL+'getRequisitionListNonSales?triphdrId='+params.params.trip_hdr_id)
          .then((response)=> response.json() )
          .then((responseJson) => {
            this.setState({ 
              planList: responseJson,
            });
          })
          .then(()=>{
            {this.state.planList.map((item, index) => {
              if (item.lineitem == this.state.lineitem) {
                this.setState({tempReq: item })
              }
            })}
          })
          .then(() => {
            let newTempReq = this.state.tempReq;
            newTempReq.trip_hdr_id_fk = params.params.trip_hdr_id;
            newTempReq.req_type = params.item.sub_category_id;
            newTempReq.start_date = params.params.start_date;
            newTempReq.end_date = params.params.end_date;
            newTempReq.amount = this.state.amount;
            newTempReq.through = this.state.through;
            newTempReq.creation_date = this.state.curDate;
            newTempReq.username = params.params.username;
            newTempReq.useremail = params.params.useremail;
            newTempReq.upper_limit = params.item.upper_limit;

            /* Requisition Secific*/
            newTempReq.travel_date = moment(this.state.date).format("YYYY-MM-DD");
            newTempReq.travel_type = this.state.type;
            newTempReq.check_in_date = moment(this.state.dateCin).format("YYYY-MM-DD");
            newTempReq.check_out_date = moment(this.state.dateCout).format("YYYY-MM-DD");
            newTempReq.check_in_time = moment(this.state.timeCin).format('HH:mm');
            newTempReq.check_out_time = moment(this.state.timeCout).format('HH:mm');
            newTempReq.days = this.state.days;
            newTempReq.state = this.state.tState;
            newTempReq.city = this.state.tcity;
            newTempReq.va_ta_id = this.state.through == "Self" ? "0" : this.state.vanderName

            this.setState({
              tempReq : newTempReq,
            })
          })
          .then(() => {
            this.props.reqUpdate([this.state.tempReq])
            .then(() => {
              this.props.getPlans(params.params.trip_hdr_id);
            });
          })          
          .then(()=>{
            this.props.navigation.goBack()
            /*this.setState({
              isLoading: false
            });*/
            Toast.show('Requisition Created Successfuly.', Toast.LONG);
            console.log('Requisition create successfuly.');
          })
          .catch((Error) => {
            console.log(Error)
          });       
      })
    });
    Keyboard.dismiss();
  }
  
  componentDidMount() {
    this.getTripLocationResponse();
    this.getTripThrough();
    this.getTripType();
    this.props.navigation.setParams({
      handleBackPress: this._handleBackPress.bind(this)
    });
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this._handleBackPress();
      return true;
    });
  }
  componentWillUnmount() {
    this.getTripLocationResponse();
    this.getTripThrough();
    this.getTripType();
    this.backHandler.remove();
  }

  _handleBackPress() {
    Alert.alert(
      "Discard changes?",
      "Are you sure to go back?",
      [
        {
          text: "No",
          style: 'cancel',
        },
        {
          text: "Yes",
          onPress: () => this.props.navigation.goBack(),
        }
      ],
      { cancelable: false }
    );
  }
  
  onValueChangeState = (value) => {
    this.setState({
      tState: value
    });    
    var newStateList = Array.from(StateDist.states);
    for( var i = 0; i < newStateList.length; i++){ 
      if ( newStateList[i].state.toLowerCase(value) === value.toLowerCase(value)) {
        var newCityList = newStateList[i].districts
      }
    }
    this.setState({
      cityList: newCityList
    });
  }

  onValueChangeCity = (value) => {
    this.setState({
      tcity: value
    });
  }

  setDate = (event, date) => {
    date = date || this.state.date; 
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      dateCin: date,
      dateCout: date
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
  onValueChangeThrough = (value) => {
    this.setState({
      through: value
    });
  }

  setDateCin = (event, dateCin) => {
    dateCin = dateCin || this.state.dateCin; 
    this.setState({
      showCin: Platform.OS === 'ios' ? true : false,
      dateCin,
      dateCout: dateCin
    });    
    var newDays= moment(this.state.dateCout, "DD.MM.YYYY").diff(moment(this.state.dateCin, "DD.MM.YYYY"), 'days')
    this.setState({
      days: newDays
    });
  } 
  showCin = mode => {
    this.setState({
      showCin: true,
      mode,
    });
  } 
  datepickerCin = () => {
    this.showCin('date');
  }

  setTimeCin = (event, timeCin) => {
    timeCin = timeCin || this.state.timeCin; 
    this.setState({
      showTimeCin: Platform.OS === 'ios' ? true : false,
      timeCin
    });
  } 
  showTimeCin = mode => {
    this.setState({
      showTimeCin: true,
      mode,
    });
  } 
  timepickerCin = () => {
    this.showTimeCin('time');
  }

  setDateCout = (event, dateCout) => {
    dateCout = dateCout || this.state.dateCout; 
    this.setState({
      showCout: Platform.OS === 'ios' ? true : false,
      dateCout,
    });    
    var newDays= moment(this.state.dateCout, "DD.MM.YYYY").diff(moment(this.state.dateCin, "DD.MM.YYYY"), 'days')
    this.setState({
      days: newDays
    });
  } 
  showCout = mode => {
    this.setState({
      showCout: true,
      mode,
    });
  } 
  datepickerCout = () => {
    this.showCout('date');
  }

  setTimeCout = (event, timeCout) => {
    timeCout = timeCout || this.state.timeCout; 
    this.setState({
      showTimeCout: Platform.OS === 'ios' ? true : false,
      timeCout
    });
  } 
  showTimeCout = mode => {
    this.setState({
      showTimeCout: true,
      mode,
    });
  } 
  timepickerCout = () => {
    this.showTimeCout('time');
  }

  onValueChangeType = (value) => {
    this.setState({
      type: value
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
  
  handleChangeAmount = (amnt) => {
    this.setState({ amount: amnt })
  }

  render() {
    const {params} = this.props.navigation.state;
    
    if(this.state.isLoading || this.props.reqCreate.isLoading || this.props.reqUpdate.isLoading){
      return(
        <Loader/>
      )
    }
    console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>{params.item.sub_category}</Text>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>State:</Label>
              <Picker
                mode="popup"
                placeholder="State:" 
                selectedValue = {this.state.tState} 
                onValueChange = {this.onValueChangeState}                
                style={styles.formInput}
                prompt="Select State">
                {StateDist.states.map((item, index) => {
                return (
                  <Picker.Item label={item.state} value={item.state} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Location/City:</Label>
              <Picker
                mode="popup"
                placeholder="Location/City:" 
                selectedValue = {this.state.tcity} 
                onValueChange = {this.onValueChangeCity}
                style={styles.formInput}
                prompt="Select Location/City">
                {this.state.cityList.map((item, index) => {
                return (
                  <Picker.Item label={item} value={item} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Eligible Amount/Per Day:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {params.item.upper_limit}
              </Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={this.state.date}
              mode={this.state.modeDate}
              minimumDate={new Date(this.state.curDate)}
              display="default"
              onChange={this.setDate} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Type:</Label>
              <Picker
                mode="dropdown"
                placeholder="Travel Type"
                selectedValue={this.state.type}
                onValueChange={this.onValueChangeType}                
                style={styles.formInput}
                prompt="Select Travel Type"
                >
                {this.state.typeList.map((item, index) => {
                return (
                  <Picker.Item label={item.travel_type} value={item.travel_type} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Through:</Label>
              <Picker
                mode="dropdown"
                placeholder="Select Through"
                selectedValue={this.state.through}
                onValueChange={this.onValueChangeThrough}
                style={styles.formInput}
                prompt="Select Through"
                >
                {this.state.throughtList.map((item, index) => {
                  return (
                    <Picker.Item label={item.travel_through_type} value={item.travel_through_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {global.USER.userName}
              </Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Approx Amount:</Label>
              <Input 
                style={styles.formInput}
                value= {this.state.amount}
                keyboardType = "number-pad"
                onChangeText={this.handleChangeAmount}
                />
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckIn Date:</Label>
              <TouchableOpacity onPress={this.datepickerCin} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateCin).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showCin && 
            <DateTimePicker value={this.state.dateCin}
              mode={this.state.modeDate}
              minimumDate={new Date(this.state.date)}
              display="default"
              onChange={this.setDateCin} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckIn Time:</Label>
              <TouchableOpacity onPress={this.timepickerCin} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.timeCin).format('HH:mm')}</Text>
                <Icon name="time" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showTimeCin && 
            <DateTimePicker value={this.state.timeCin}
              //timeZoneOffsetInMinutes={0}
              mode={this.state.modeTime}
              is24Hour={true}
              display="default"
              onChange={this.setTimeCin} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckOut Date:</Label>
              <TouchableOpacity onPress={this.datepickerCout} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateCout).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showCout && 
            <DateTimePicker value={this.state.dateCout}
              mode={this.state.modeDate}
              minimumDate={new Date(this.state.dateCin)}
              display="default"
              onChange={this.setDateCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckOut Time:</Label>
              <TouchableOpacity onPress={this.timepickerCout} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.timeCout).format('HH:mm')}</Text>
                <Icon name="time" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showTimeCout && 
            <DateTimePicker value={this.state.timeCout}
              //timeZoneOffsetInMinutes={0}
              mode={this.state.modeTime}
              is24Hour={true}
              display="default"
              onChange={this.setTimeCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>No of Days:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.days}</Text>
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
          <TouchableOpacity style={styles.ftrBtn} onPress={
            params.update?() => this.reqUpdate()
            : () => this.reqCreate()
            }>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity >
          {this.state.through != 1 &&
          <Button full rounded bordered primary style={[styles.ftrBtn, styles.brdBtn]}
            onPress={() => this.props.navigation.goBack()}>
            <Icon name='md-paper-plane' style={styles.brdBtnTxt} />
            <Text style={styles.brdBtnTxt}>Send to Travel Agent</Text>
          </Button>}      
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    reqCreate: state.reqCreate,
    reqUpdate: state.reqUpdate,
    plans: state.plans,
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
};

export default connect(mapStateToProps, mapDispatchToProps)(HotelReqScreen);