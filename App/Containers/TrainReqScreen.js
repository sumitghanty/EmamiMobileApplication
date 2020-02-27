import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, 
        AsyncStorage, BackHandler, Alert, Modal } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { HeaderBackButton } from "react-navigation-stack"
import PickerModal from 'react-native-picker-modal-view'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import Loader from '../Components/Loader'
import styles from './Styles/TrainReqScreen.js';

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'
const CLASS = ['Sleeper', 'AC-2tier', 'AC-3tier', 'General',];
const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class TrainReqScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handleClearPress = navigation.getParam("handleBackPress", () => {});
    return {
      title: "Create Requisition",
      headerLeft: <HeaderBackButton onPress={handleClearPress} />
    };
  };

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      curDate: new Date(),
      date: params.update?params.update.travel_date:params.params.start_date,
      through: (params.update && params.update.through) ? params.update.through : "Self",
      statusNameOP: '',
      subStatusNameOP: '',
      statusName: '',
      subStatusName: '',
      locationList: [],
      fromItem: {"Name": (params.update && params.update.travel_from) ? params.update.travel_from : "Select From Location", 
                "Value": "", "Code": "", "Id":0},
      toItem: {"Name": (params.update && params.update.travel_to) ? params.update.travel_to : "Select To Location", 
                "Value": "", "Code": "", "Id":0},
      tripFromError: '',
      tripToError: '',
      tclass: (params.update && params.update.ticket_class) ? params.update.ticket_class : CLASS[0],
      time: (params.update && params.update.travel_time) ? params.update.travel_time : SUIT_TIME[0],
      email: (params.update && params.update.email) ? params.update.email : null,
      emailError: false,
      amount: (params.update && params.update.amount) ? params.update.amount :null,
      amntError: null,
      maxAmt: params.item.upper_limit == "On Actual" ? "5000000"
              : params.item.upper_limit != "NA" ? params.item.upper_limit
              : '0.0',
      OOP: 'N',
      mode: 'date',
      show: false,
      attachFiles: [],
      isLoading: false,
      modalVisible: false,
      uploadData: [{"type":"Approve Email","file":[]},{"type":"Other","file":[]}],
      curUploadType: 'Approve Email',
    };
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;

    this.props.getReqLocations()
    .then(()=>{
      for(var i=0; i<this.props.locations.dataSource.length; i++) {
        this.state.locationList.push({
          "Name": this.props.locations.dataSource[i].city,
          "Value": this.props.locations.dataSource[i].city,
          "Code": this.props.locations.dataSource[i].type,
		      "Id": this.props.locations.dataSource[i].id,
        },)
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

  renderLocationAlert=()=> {
    return(
      Alert.alert(
        "Warning",
        "Station/Location From and To can not be same.",
        [
          {
            text: "Cancel",
            style: 'cancel',
          },
        ],
        { cancelable: false }
      )
    )
  }

  fromSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_FROM_KEY")
    .then(() => {
      this.setState({
        fromItem: value,
        tripFromError: '',
      })
    })
    .then(()=>{
      if(this.state.fromItem.Name == this.state.toItem.Name) {
        this.renderLocationAlert();
        this.setState({
          fromItem: {"Name": "Select From Location", "Value": "", "Code": "", "Id":0},
        })
      }
    })
  }
  
  toSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_TO_KEY")
    .then(() => {
      this.setState({
        toItem: value,
        tripToError: ''
      })
    })
    .then(()=>{
      if(this.state.fromItem.Name == this.state.toItem.Name) {
        this.renderLocationAlert();
        this.setState({
          toItem: {"Name": "Select To Location", "Value": "", "Code": "", "Id":0},
        })
      }
    })
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
      })
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

  handleChangeEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false)
    {
      this.setState({
        email:text,
        emailError: text.length>0?true: false
      })
      return false;
    }
    else {
      this.setState({
        email:text,
        emailError: false
      })
    }
  }

  onValueChangeThrough = (value) => {
    this.setState({
      through: value
    });
  }

  handleChangeAmount = (amnt) => {
    const {params} = this.props.navigation.state;
    this.setState({ 
      amount: amnt,
      amntError: null,
      OOP: (((params.item.upper_limit == "NA") && (parseFloat(amnt) > parseFloat(this.state.maxAmt))) || (parseFloat(amnt) > parseFloat(this.state.maxAmt))) ?'Y':'N'
    })
  }

  submitReq = () => {
    if (!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location" ||
        !this.state.toItem.Name || this.state.toItem.Name == "Select To Location" ||
        (this.state.emailError) || (this.state.through=="Self" && !this.state.amount)) {
      if(!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location") {
        this.setState({
          tripFromError: 'Please select Station/Location From'
        });
      }
      if(!this.state.toItem.Name || this.state.toItem.Name == "Select To Location") {
        this.setState({
          tripToError: 'Please select Station/Location To'
        });
      }
      if (this.state.emailError) {
        this.setState({
          emailError: 'Email is not valid.',
        });
      }
      if (this.state.through=="Self" && !this.state.amount) {
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
        "is_billRequired": params.item.bill_required,
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
        "amount": this.state.amount?this.state.amount:0,
        "travel_time": this.state.time,
        "ticket_class": this.state.tclass,
        "travel_from": this.state.fromItem.Name,
        "travel_to": this.state.toItem.Name,
        "email": this.state.email,
        "status_id": "7",
        "sub_status_id": this.state.OOP=="Y"?"7.5":"7.4",
        "status": this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName,
        "sub_status": this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName,        
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
      newReq.amount = this.state.amount?this.state.amount:0;      
      newReq.travel_time = this.state.time;
      newReq.ticket_class = this.state.tclass;
      newReq.travel_from = this.state.fromItem.Name;
      newReq.travel_to = this.state.toItem.Name;
      newReq.email = this.state.email;
      newReq.status_id = "7";
      newReq.sub_status_id = this.state.OOP=="Y"?"7.5":"7.4";
      newReq.status = this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName;
      newReq.sub_status = this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName;
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

  render() {
    const {params} = this.props.navigation.state;
    console.log(params)

    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.travelThroughState.isLoading ||
      this.props.locations.isLoading ||
      this.props.statusResult.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(this.props.reqCreateState.errorStatus || 
      this.props.reqUpdateState.errorStatus || 
      this.props.plans.errorStatus ||
      this.props.travelThroughState.errorStatus ||
      this.props.locations.errorStatus || 
      this.props.statusResult.errorStatus) {
      return(
        <Text>URL Error</Text>
      )
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Train Requisition {params.update?'Update':'Create'}</Text>
          </View>
          <Form>            
            <Item fixedLabel style={styles.formRow}>
              <Label style={[styles.formLabel,{flex:5}]}>Eligible Amount/Per Trip:</Label>
              <Text style={[styles.formInput,styles.readOnly,{textAlign:'right'}]}>{params.item.upper_limit}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={new Date(moment(this.state.date).format('YYYY-MM-DD'))}
              mode={this.state.mode}
              minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDate} />
            }
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Class:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              <Label style={styles.formLabel}>Suitable Time:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              <Label style={styles.formLabel}>Station/Location From:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.fromItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.fromSelected.bind(this)}
                  onClosed={()=>{}}
                  //onBackButtonPressed={()=>{}}
                  items={this.state.locationList}
                  //sortingLanguage={'tr'}
                  showToTopButton={true}
                  selected={this.state.fromItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search...'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
            </Item>
            {this.state.tripFromError.length>0 &&
              <Text style={styles.errorText}>{this.state.tripFromError}</Text>
            }
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Station/Location To:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.toItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.toSelected.bind(this)}
                  onClosed={()=>{}}
                  //onBackButtonPressed={()=>{}}
                  items={this.state.locationList}
                  showToTopButton={true}
                  selected={this.state.toItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search...'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
            </Item>
            {this.state.tripToError.length>0 &&
              <Text style={styles.errorText}>{this.state.tripToError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Personal Email:</Label>
              <TextInput 
                autoCompleteType="email" 
                type="email"
                value={this.state.email}
                style={[styles.formInput,styles.inputType]} 
                placeholder="Enter your email"
                keyboardType="email-address"
                underlineColorAndroid= "rgba(0,0,0,0)"
                onChangeText={this.handleChangeEmail} />
            </Item>
            {this.state.emailError &&
              <Text style={styles.errorText}>{this.state.emailError}</Text>
            }
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
            {this.state.through == "Self" &&
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Approx Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                placeholder='0.00' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.amount}
                keyboardType="decimal-pad"
                autoCapitalize="words"
                onChangeText={this.handleChangeAmount} />
            </Item>}
            {this.state.amntError &&
              <Text style={styles.errorText}>{this.state.amntError}</Text>
            }
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
          <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
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
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    reqCreateState: state.reqCreateState,
    reqUpdateState: state.reqUpdateState,
    plans: state.plans,
    travelThroughState: state.travelThroughState,
    locations: state.locations,
    statusResult: state.statusResult,
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
  getTravelThrough: Actions.getTravelThrough,
  getReqLocations: Actions.getReqLocations,
  getStatus: Actions.getStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainReqScreen);