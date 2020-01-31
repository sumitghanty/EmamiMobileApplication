import React, { Component } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, Image,
  TextInput, AsyncStorage, Keyboard, Alert, BackHandler, Modal, ActivityIndicator } from "react-native"
import { Button, Icon, Text, Form, Item, Label } from 'native-base'
import DocumentPicker from 'react-native-document-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"
import PickerModal from 'react-native-picker-modal-view'

import Loader from '../Components/Loader'
import styles from './Styles/HotelReqScreen.js'

class HotelReqScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handleClearPress = navigation.getParam("handleBackPress", () => {});
    return {
      title: "Details!",
      headerLeft: <HeaderBackButton onPress={handleClearPress} />
    };
  };

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      curDate: new Date(),
      date: params.update?params.update.travel_date:params.params.start_date,
      dateCin: (params.update && params.update.check_in_date) ? params.update.check_in_date : params.params.start_date,
      timeCin: (params.update && params.update.check_in_time) ?params.update.check_in_time
                : moment(new Date()).format('HH:mm'),
      dateCout: (params.update && params.update.check_out_date) ? params.update.check_out_date : params.params.start_date,
      timeCout: (params.update && params.update.check_out_time) ?params.update.check_out_time
                : moment(new Date()).format('HH:mm'),
      isLoading: false,
      modeDate: 'date',
      modeTime: 'time',
      show: false,
      showCin: false,
      showTimeCin: false,
      showCout: false,
      showTimeCout: false,
      through: (params.update && params.update.through) ? params.update.through : "Self",
      attachFiles: [],
      stateList: [],
      stateItem: {"Name": (params.update && params.update.state) ? params.update.state : "Select State", "Value": "", "Code": "", "Id":0},
      curState: (params.update && params.update.state) ? params.update.state : null,
      stateError: null,
      fetchCityData: null,
      isCityLoading: false,
      cityList: [],
      cityItem: {"Name": (params.update && params.update.city) ? params.update.city : "Select Location", "Value": "", "Code": "", "Id":0},
      cityError: null,
      curCity: (params.update && params.update.city) ? params.update.city : null,
      hasCity: true,
      throughtList: [],
      createdReq: [],
      typeList: [],
      type: (params.update && params.update.state) ? params.update.state : '',
      maxAmt: params.item.upper_limit == "On Actual" ? "5000000"
              : params.item.upper_limit != "NA" ? params.item.upper_limit
              : '0.0',
      amount: (params.update && params.update.check_in_date) ? params.update.amount :null,
      amntError: null,
      days: 1,
      modalVisible: false,
      uploadData: [{"type":"Approve Email","file":[]},
                    {"type":"Other","file":[]},
                    {"type":"Hotel Booking confirmation document","file":[]},
                    {"type":"Hotel booking invoice","file":[]},
                    {"type":"Travel agent invoice","file":[]}],
      curUploadType: 'Approve Email',
      statusNameOP: '',
      subStatusNameOP: '',
      statusName: '',
      subStatusName: '',
      OOP: 'Y',
      vendorname: '',
      vendorId: '0',
      cityType: params.item.sub_category_id == "1BM" ? "Metro"
                :  params.item.sub_category_id == "1BH" ? "HillStation"
                :  "NonMetro",
    };
  }

  componentDidMount() {    
    const {params} = this.props.navigation.state;
    let cityType = params.item.sub_category_id == "1BM" ? "Metro"
                :  params.item.sub_category_id == "1BH" ? "HillStation"
                :  "NonMetro";

    this.props.getStates()
    .then(()=>{
      for(var i=0; i<this.props.stateList.dataSource.length; i++) {
        if(this.props.stateList.dataSource[i].type == this.state.cityType) {
          this.state.stateList.push({
            "Name": this.props.stateList.dataSource[i].state,
            "Value": this.props.stateList.dataSource[i].city,
            "Code": this.props.stateList.dataSource[i].type,
            "Id": this.props.stateList.dataSource[i].id,
          },)
        }
      }
    });

    this.props.getReqLocations()
    .then(()=>{
      this.setState({
        fetchCityData: this.props.locations.dataSource
      })
    })
    .then(() => {
      if(params.update && params.update.state){
        for(var i=0; i<this.state.fetchCityData.length; i++) {
          if(this.state.fetchCityData[i].state == params.update.state) {
            this.state.cityList.push({
              "Name": this.state.fetchCityData[i].city,
              "Value": this.state.fetchCityData[i].city,
              "Code": this.state.fetchCityData[i].type,
              "Id": this.state.fetchCityData[i].id,
            },)
          }
        }
      }
    });

    this.props.getTravelThrough()
    .then(()=>{
      this.setState({ 
        throughtList: this.props.travelThroughState.dataSource,
        through: (params.update && params.update.through) 
                  ? params.update.through 
                  :this.props.travelThroughState.dataSource.length>0
                    ?this.props.travelThroughState.dataSource[0].travel_through_type:''
      });
    })

    this.props.getTravelType()
    .then(()=>{
      this.setState({ 
        typeList: this.props.travelTypeState.dataSource,
        type: (params.update && params.update.travel_type) 
              ? params.update.travel_type 
              : this.props.travelTypeState.dataSource.length>0
                ?this.props.travelTypeState.dataSource[0].travel_type:''
      });
    })

    this.props.getStatus("7","7.5")
    .then(()=>{
      this.setState({
        statusNameOP: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusNameOP: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getStatus("7","7.4")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.navigation.setParams({
      handleBackPress: this._handleBackPress.bind(this)
    });
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this._handleBackPress();
      return true;
    });
  }

  componentWillUnmount() {
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onValueChangeUploadType = (value) => {
    this.setState({ curUploadType: value });
  }

  uploadRequest = ()=> {
    if(this.state.attachFiles.length<=0) {
      Alert.alert(
        "",
        "You have not selected any file. Please choose your file.",
        [
          {
            text: "cancel",
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } else {
      this.setState({modalVisible: false});
    }
  }

  removeAttach(type,e) {
    for(var i =0; i<this.state.uploadData.length; i++) {
      if(this.state.uploadData[i].type==type && e !== -1) {
        let newList = this.state.uploadData[i].file;
        newList.splice(e, 1);
        this.state.uploadData[i].file = newList;
        this.setState({attachFiles: newList});
      }
    }
  }

  async selectAttachFiles() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      if (results.length>1) {
        alert(results.length + ' fils are uploade successfully.');
      } else {
        alert(results.length + ' fil is uploade successfully.');
      }      
      for(var i=0; i<this.state.uploadData.length; i++) {
        if(this.state.uploadData[i].type == this.state.curUploadType) {
          this.state.uploadData[i].file = results
        }
      }
      this.setState({ 
        attachFiles: results 
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You have not select any file for attachment');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }
  
  stateSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_STATE_KEY")
    .then(() => {
      this.setState({
        stateItem: value,
        stateError: null,
        curState: value.Name,
        isCityLoading: true,
        cityItem: {"Name": "Select Location", "Value": "", "Code": "", "Id":0},
      })
      this.state.cityList=[];
    })
    .then(() => {
      for(var i=0; i<this.state.fetchCityData.length; i++) {
        if(this.state.fetchCityData[i].state == value.Name) {
          this.state.cityList.push({
            "Name": this.state.fetchCityData[i].city,
            "Value": this.state.fetchCityData[i].city,
            "Code": this.state.fetchCityData[i].type,
            "Id": this.state.fetchCityData[i].id,
          },)
        }
      }
    })
    .then(()=>{
      this.setState({
        isCityLoading: false,
        hasCity: this.state.cityList.length>0?true:false
      })
      console.log(this.state.cityList)
    })
  }

  citySelected(value){
    console.log('hi');
    this.setState({
      cityItem: value,
      cityError: null,
      curCity: value.Name,
    })
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
    if(dateCin != undefined) {
      dateCin = dateCin || this.state.dateCin; 
      this.setState({
        showCin: Platform.OS === 'ios' ? true : false,
        dateCin,
        dateCout: dateCin
      });    
      var newDays= moment(this.state.dateCout, "DD.MM.YYYY").diff(moment(this.state.dateCin, "DD.MM.YYYY"), 'days')
      this.setState({
        days: newDays+1
      });
    } else {
      this.setState({
        showCin: Platform.OS === 'ios' ? true : false,
      });
    }
    this.setState({
      showCin: Platform.OS === 'ios' ? true : false,
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
    if(timeCin != undefined) {
      timeCin = timeCin || this.state.timeCin; 
      this.setState({
        showTimeCin: Platform.OS === 'ios' ? true : false,
        timeCin: moment(timeCin).format('HH:mm'),
        timeCout: moment(timeCin).format('HH:mm')
      });
    } else {
      this.setState({
        showTimeCin: Platform.OS === 'ios' ? true : false,
      });
    }
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
    if(dateCout != undefined) {
      dateCout = dateCout || this.state.dateCout; 
      this.setState({
        showCout: Platform.OS === 'ios' ? true : false,
        dateCout,
      });    
      var newDays= moment(this.state.dateCout, "DD.MM.YYYY").diff(moment(this.state.dateCin, "DD.MM.YYYY"), 'days')
      this.setState({
        days: newDays+1
      });
    } else { 
      this.setState({
        showCout: Platform.OS === 'ios' ? true : false,
      });
    }
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
    if(timeCout != undefined) {
      timeCout = timeCout || this.state.timeCout;
      if(this.state.days == 1 && (parseInt(moment(timeCout).format('HH:mm'))<=parseInt(this.state.timeCin))){
        Alert.alert(
          "",
          "CheckOut time can not be less or equal then CheckIn Time for same day.",
          [
            {
              text: "Ok",
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      } else {
        this.setState({
          showTimeCout: Platform.OS === 'ios' ? true : false,
          timeCout: moment(timeCout).format('HH:mm')
        });
      }
    } else {
      this.setState({
        showTimeCout: Platform.OS === 'ios' ? true : false,
      });
    }
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
  
  handleChangeAmount = (amnt) => {
    const {params} = this.props.navigation.state;
    this.setState({ 
      amount: amnt,
      amntError: null,
      OOP: (((params.item.upper_limit == "NA") && amnt > this.state.maxAmt) || amnt > this.state.maxAmt) ?'Y':'N'
    })
  }

  reqCreate =() => {
    const {params} = this.props.navigation.state;
    this.props.getPlans(params.params.trip_hdr_id)
    .then(()=>{
      this.props.reqCreate([{
        "trip_hdr_id_fk": params.params.trip_hdr_id,          
        "trip_no": params.params.trip_no,
        "useremail": params.params.email,
        "username": params.params.name,
        "userid": params.params.userid,
        "is_billRequired": "N",
        "delete_status" : "false",
        "pending_with": global.USER.supervisorId,
        "pending_with_name": global.USER.supervisorName,
        "pending_with_email": global.USER.supervisorEmail,
        "financer_id": global.USER.financerId,
        "financer_email": global.USER.financerEmail,
        "financer_name": global.USER.financerName,
        "lineitem": this.props.plans.dataSource.length + 1,
        "start_date": params.params.start_date,
        "end_date": params.params.end_date,
        "creation_date": moment(this.state.curDate).format("YYYY-MM-DD"),
        "gl": params.item.gl,
        "travel_heads": params.item.travel_heads,
        "travel_date": moment(this.state.date).format("YYYY-MM-DD"),
        "req_type": params.item.sub_category_id,

        "through": this.state.through,
        "travel_type": this.state.type,
        "amount": this.state.amount?this.state.amount:0,
        "check_in_date": this.state.dateCin,
        "check_in_time": this.state.timeCin,
        "check_out_date": this.state.dateCout,
        "check_out_time": this.state.timeCout,
        "days": this.state.days,
        "state": this.state.curState,
        "city": this.state.curCity,
        "status_id": "7",
        "sub_status_id": this.state.OOP?"7.5":"7.4",
        "status": this.state.OOP? this.state.statusNameOP :this.state.statusName,
        "sub_status": this.state.OOP? this.state.subStatusNameOP :this.state.subStatusName,
        "is_outof_policy": this.state.OOP,
      }])
      .then(()=>{
        this.props.getPlans(params.params.trip_hdr_id)
        .then(()=>{
          this.setState({
            isLoading: false,
          });
        })
        .then(()=>{
          this.props.navigation.goBack();
          Toast.show('Requisition Created Successfully', Toast.LONG);
        })
      })
    });
  }

  reqUpdate = () => {
    const {params} = this.props.navigation.state;
    let newReq = params.update;
    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
    .then(()=>{
      newReq.travel_date = moment(this.state.date).format("YYYY-MM-DD");
      newReq.req_type = params.item.sub_category_id;

      newReq.through = this.state.through;
      newReq.travel_type = this.state.type;
      newReq.amount = this.state.amount?this.state.amount:0;
      newReq.check_in_date = this.state.dateCin;
      newReq.check_in_time = this.state.timeCin;
      newReq.check_out_date = this.state.dateCout;
      newReq.check_out_time = this.state.timeCout;
      newReq.days = this.state.days;
      newReq.state = this.state.curState;
      newReq.city = this.state.curCity;
      newReq.status_id = "7";
      newReq.sub_status_id = this.state.OOP?"7.5":"7.4";
      newReq.status = this.state.OOP? this.state.statusNameOP :this.state.statusName;
      newReq.sub_status = this.state.OOP? this.state.subStatusNameOP :this.state.subStatusName;
      newReq.is_outof_policy = this.state.OOP;
    })
    .then(()=>{
      this.props.reqUpdate([newReq])
      .then(()=>{
        this.props.getPlans(params.params.trip_hdr_id)
        .then(()=>{
          this.setState({
            isLoading: false,
          });
        })
        .then(()=>{
          this.props.navigation.goBack();
          Toast.show('Requisition Updated Successfully', Toast.LONG);
        });
      });
    });
  }

  submitReq = () => {
    if (!this.state.curState || !this.state.curCity || !this.state.amount) {
      if (!this.state.curState) {
        this.setState({
          stateError: 'Please select state.',
        });
      }
      if (!this.state.curCity) {
        this.setState({
          cityError: 'Please select Location/City.',
        });
      }
      if (!this.state.amount) {
        this.setState({
          amntError: 'Please enter Approx amount.',
        });
      }
    } else {      
      this.setState({
        isLoading: true,
      });
      const {params} = this.props.navigation.state;
      if(params.update){
        this.reqUpdate();
      } else {
        this.reqCreate();
      }
    }
  }

  render() {
    const {params} = this.props.navigation.state;
    
    if(this.state.isLoading || 
      this.props.reqUpdate.isLoading ||
      this.props.locations.isLoading){
      return(
        <Loader/>
      )
    } else {
    console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{params.item.sub_category}</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>State:</Label>
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.stateItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.stateSelected.bind(this)}
                  onClosed={()=>{}}
                  onBackButtonPressed={()=>{}}
                  items={this.state.stateList}
                  //sortingLanguage={'tr'}
                  showToTopButton={true}
                  selected={this.state.stateItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search State'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
            </Item>
            {this.state.stateError &&
              <Text style={styles.errorText}>{this.state.stateError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Location/City:</Label>
              {this.state.isCityLoading ?
              <ActivityIndicator size="small" color="#ddd" style={{alignSelf:'flex-end',marginRight:16}} />:
              this.state.hasCity ?
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.cityItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.citySelected.bind(this)}
                  onClosed={()=>{}}
                  onBackButtonPressed={()=>{}}
                  items={this.state.cityList}
                  showToTopButton={true}
                  selected={this.state.cityItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search City'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
              :
              <Text style={[styles.formInput,styles.readOnly,{fontSize:12,color:'orange'}]}>
                No city available for this State.
              </Text>}
            </Item>
            {this.state.cityError &&
              <Text style={styles.errorText}>{this.state.cityError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(
                  params.update? params.update.travel_date : this.state.date
                  ).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={new Date(moment(
              params.update? params.update.travel_date : this.state.date
              ).format('YYYY-MM-DD'))}
              mode="date"
              minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
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
                  <Picker.Item label={"Self"} value={"Self"} />
                {/*this.state.throughtList.map((item, index) => {
                  return (
                    <Picker.Item label={item.travel_through_type} value={item.travel_through_type} key={index} />
                  );
                })*/}
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
              <TextInput 
                placeholder='0.00' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.amount?this.state.amount:'0'}
                keyboardType="decimal-pad"
                autoCapitalize="words"
                onChangeText={this.handleChangeAmount} />
            </Item>
            {this.state.amntError &&
              <Text style={styles.errorText}>{this.state.amntError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckIn Date:</Label>
              <TouchableOpacity onPress={this.datepickerCin} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateCin).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showCin && 
            <DateTimePicker value={new Date(moment(this.state.dateCin).format('YYYY-MM-DD'))}
              mode={this.state.modeDate}
              minimumDate={new Date(this.state.date)}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDateCin} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckIn Time:</Label>
              <TouchableOpacity onPress={this.timepickerCin} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{this.state.timeCin}</Text>
                <Icon name="time" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showTimeCin && 
            <DateTimePicker value={new Date()}
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
            <DateTimePicker value={new Date(moment(this.state.dateCout).format('YYYY-MM-DD'))}
              mode={this.state.modeDate}
              minimumDate={new Date(this.state.dateCin)}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDateCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckOut Time:</Label>
              <TouchableOpacity onPress={this.timepickerCout} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{this.state.timeCout}</Text>
                <Icon name="time" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showTimeCout && 
            <DateTimePicker value={new Date()}
              mode={this.state.modeTime}
              is24Hour={true}
              display="default"
              onChange={this.setTimeCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>No of Days:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.days}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Eligible Amount:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {this.state.days * params.item.upper_limit}
              </Text>
            </Item>
            <View style={styles.attachRow}>
              <Text style={styles.formLabel}>Attachments:</Text>              
              <Button rounded bordered info onPress={() => { this.setModalVisible(true); }} style={styles.atchBtn}>                
                <Icon name='attach' style={{fontSize:16, marginRight:0}} />
                <Text style={{fontSize:12,textAlign:'center'}}>
                  Attach Documents
                </Text>
              </Button>
            </View>
          </Form>
          {this.state.uploadData.map((item, key) => (
            (item.file.length>0) ?
            <View key={key}>
            <Text style={styles.attachType}>{item.type}</Text>
            {item.file.map((file, index)=>(
              <View key={index} style={styles.atchFileRow}>
                {file.type == "image/webp" ||
                  file.type == "image/jpeg" ||
                  file.type == "image/jpg" ||
                  file.type == "image/png" ||
                  file.type == "image/gif" ?
                <Image
                  style={{width: 50, height: 50, marginRight:10}}
                  source={{uri: file.uri}}
                />:null}
                <Text style={styles.atchFileName}>{file.name ? file.name : ''}</Text>
                <Button bordered small rounded danger style={styles.actionBtn}
                  onPress={()=>this.removeAttach(item.type,index)}>
                  <Icon name='close' style={styles.actionBtnIco} />
                </Button>
              </View>
            ))}
            </View>
            :null
          ))}

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {this.setModalVisible(false)}}>
            <View style={styles.atchMdlHeader}>
              <Text style={styles.atchMdlHdrTtl}>Upload Document</Text>
            </View>
            <ScrollView contentContainerStyle={styles.atchMdlBody}>
              <Text style={styles.atchMdlLabel}>Select Document Type:</Text>
              <View style={styles.pickerHolder}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={styles.atchTypeSelect}
                  placeholder="Document Type"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.curUploadType}
                  onValueChange={this.onValueChangeUploadType}
                  >
                  {this.state.uploadData.map((item, index) => {
                    return (
                    <Picker.Item label={item.type} value={item.type} key={index} />
                    );
                  })}
                </Picker>
              </View>
              <TouchableOpacity onPress={this.selectAttachFiles.bind(this)} style={styles.chooseBtn}>                
                <Icon name='add-circle' style={styles.chooseBtnIcon} />
                <Text style={styles.chooseBtnText}>Choose File</Text>
              </TouchableOpacity>
              
              {this.state.uploadData.map((item, key) => (
                (item.type == this.state.curUploadType && item.file.length>0) ?
                <View key={key}>
                {item.file.map((file, index)=>(
                  <View key={index} style={styles.atchFileRow}>
                    {file.type == "image/webp" ||
                      file.type == "image/jpeg" ||
                      file.type == "image/jpg" ||
                      file.type == "image/png" ||
                      file.type == "image/gif" ?
                    <Image
                      style={{width: 50, height: 50, marginRight:10}}
                      source={{uri: file.uri}}
                    />:null}
                    <Text style={styles.atchFileName}>{file.name ? file.name : ''}</Text>
                    <Button bordered small rounded danger style={styles.actionBtn}
                      onPress={()=>this.removeAttach(item.type,index)}>
                      <Icon name='close' style={styles.actionBtnIco} />
                    </Button>
                  </View>
                ))}
                </View>
                :null
              ))}
            </ScrollView>
            <View style={styles.atchMdlFtr}>
              <TouchableOpacity 
                onPress={() => {this.setModalVisible(!this.state.modalVisible);}} 
                style={[styles.atchMdlFtrBtn,styles.atchMdlFtrBtnSecondary]}>
                <Text style={styles.atchMdlFtrBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {this.uploadRequest();}} 
                style={[styles.atchMdlFtrBtn,styles.atchMdlFtrBtnPrimary]}>
                <Text style={styles.atchMdlFtrBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <TouchableOpacity style={styles.ftrBtn} onPress={() => this.submitReq()}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity >

          {this.state.through != "Self" &&
          <Button full rounded bordered primary style={[styles.ftrBtn, styles.brdBtn]}
            onPress={() => {}}>
            <Icon name='md-paper-plane' style={styles.brdBtnTxt} />
            <Text style={styles.brdBtnTxt}>Send to Travel Agent</Text>
          </Button>}      
        </ScrollView>
      </KeyboardAvoidingView>
    );
    }
  }
}

const mapStateToProps = state => {
  return {
    reqCreate: state.reqCreate,
    reqUpdateState: state.reqUpdateState,
    plans: state.plans,
    travelThroughState: state.travelThroughState,
    travelTypeState: state.travelTypeState,
    stateList: state.stateList,
    locations: state.locations,
    statusResult: state.statusResult,
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
  getTravelThrough: Actions.getTravelThrough,
  getTravelType: Actions.getTravelType,
  getStates: Actions.getStates,
  getReqLocations: Actions.getReqLocations,
  getStatus: Actions.getStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(HotelReqScreen);