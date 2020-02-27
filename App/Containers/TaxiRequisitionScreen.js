import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Platform, Modal, 
  Keyboard, Picker, Image, Alert, AsyncStorage, BackHandler } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"

import Loader from '../Components/Loader'
import styles from './Styles/TaxiRequisitionScreen'

class TaxiRequisitionScreen extends Component {

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
      curDate: new Date,
      date: (params.update && params.update.travel_date)?params.update.travel_date:params.params.start_date,
      mode: 'date',
      show: false,     
      attachFiles: [],
      isLoading: false,
      error: false,
      tripFromError: null,
      tripToError: null,
      aprxAmnt: (params.update && params.update.amount)?params.update.amount:null,
      aprxAmntError: null,
      fromLocation: (params.update && params.update.travel_from)?params.update.travel_from:'',
      toLocation: (params.update && params.update.travel_to)?params.update.travel_to:'',
      statusName: '',
      subStatusName: '',
      modalVisible: false,
      uploadData: [{"type":"Approve Email","file":[]},{"type":"Other","file":[]}],
      curUploadType: 'Approve Email',
      currency: (params.update && params.updateinvoice_amount_currency)?params.updateinvoice_amount_currency:null,
      currencyError: null,
      oop: 'Y',
      maxAmount: 0,
    };
  }
  
  componentDidMount() {
    const {params} = this.props.navigation.state;

    this.props.getStatus("7","7.5")
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
  handleChangeAmount = (amount) => {
    this.setState({ 
      aprxAmnt: amount,
      aprxAmntError: null,
      maxAmount: (params.item.upper_limit != "On Actual")  && 5000000
                      (params.item.upper_limit != null && params.item.upper_limit == "NA") && amount
    })
  }
  handleCurrency = (text) => {
    this.setState({ 
      currency: amount,
      currencyError: null
    })
  }
  handleFromLocation = (text) => {
    this.setState({ 
      fromLocation: text,
      tripFromError: null
    })
  }
  handleToLocation = (text) => {
    this.setState({ 
      toLocation: text,
      tripToError: null
    })
  }

  submitReq = () => {
    const {params} = this.props.navigation.state;
    if( this.state.fromLocation.length < 1 || this.state.toLocation.length < 1 || 
      this.state.aprxAmnt == null || (!this.state.aprxAmnt) || (params.claim && !this.state.currency) ) {
      if(this.state.fromLocation.length < 1) {
        this.setState({
          tripFromError: 'Please enter Destination From',
          error: true,
        });
      }
      if(this.state.toLocation.length < 1) {
        this.setState({
          tripToError: 'Please enter Destination To',
          error: true,
        });
      }
      if(this.state.aprxAmnt == null || (!this.state.aprxAmnt)) {
        this.setState({
          aprxAmntError: 'Please enter approx amount ',
          error: true,
        });
      }
      if(params.claim && !this.state.currency) {
        this.setState({
          currencyError: 'Please enter Currency',
          error: true,
        });
      }
      console.log('There are some eroor.');
    } else {
      this.setState({
        isLoading: true,
        maxAmount: (params.item.upper_limit != "On Actual")
                    ?5000000
                      //(params.item.upper_limit != null && params.item.upper_limit == "NA")
                    : '0'
      });
      if (params.item.upper_limit != "On Actual") {maxAmount
        this.setState({
          maxAmount: '5000000',
        });
      }
      if(params.update){
        let newReq = params.update;
        AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
        .then(()=>{
          newReq.req_type = params.item.sub_category_id;
          newReq.start_date = params.params.start_date;
          newReq.end_date = params.params.end_date;
          newReq.amount = this.state.aprxAmnt?this.state.aprxAmnt:0;
          newReq.gl = params.item.gl;
          newReq.travel_heads = params.item.travel_heads;
          newReq.through = "Self";

          newReq.travel_date = moment(this.state.date).format("YYYY-MM-DD");
          newReq.travel_from = this.state.fromLocation;
          newReq.travel_to = this.state.toLocation;
          newReq.creation_date = moment(this.state.curDate).format("YYYY-MM-DD");
          newReq.status_id = "7";
          newReq.sub_status_id = "7.5";
          newReq.status = this.state.statusName;
          newReq.sub_status = this.state.subStatusName;
          newReq.is_outof_policy = this.state.oop;
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

      } else {
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

            "req_type": params.item.sub_category_id,
            "start_date": params.params.start_date,
            "end_date": params.params.end_date,
            "amount": this.state.aprxAmnt?this.state.aprxAmnt:0,
            "gl": params.item.gl,
            "travel_heads": params.item.travel_heads,
            "through": "Self",

            "travel_date": moment(this.state.date).format("YYYY-MM-DD"),
            "travel_from": this.state.fromLocation,
            "travel_to": this.state.toLocation,
            "creation_date": moment(this.state.curDate).format("YYYY-MM-DD"),
            "status_id": "7",
            "sub_status_id": "7.5",
            "status": this.state.statusName,
            "sub_status": this.state.subStatusName,
            "is_outof_policy": this.state.oop,
            "invoice_amount_currency": this.state.currency
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
    }
    Keyboard.dismiss();
  }

  render() {
    const {params} = this.props.navigation.state;
    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.statusResult.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(this.props.reqCreateState.errorStatus
      || this.props.reqUpdateState.errorStatus 
      || this.props.plans.errorStatus 
      || this.props.statusResult.errorStatus) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.item.sub_category}</Text>
        </View>
        <Form>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Travel Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.date).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.show && 
          <DateTimePicker value={new Date(moment(this.state.date).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Approx Amount :<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aprxAmnt}
              returnKeyType="next"
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onSubmitEditing={() => this.refs.curncyInput.focus()}
              onChangeText={this.handleChangeAmount} />
          </Item>
          {this.state.aprxAmntError &&
            <Text style={styles.errorText}>{this.state.aprxAmntError}</Text>
          }
          {params.claim &&
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Currency:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='curncyInput'
              onSubmitEditing={() => this.refs.fromInput.focus()}
              placeholder='Enter Currency' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.currency}
              returnKeyType="next"
              onChangeText={this.handleCurrency} />
          </Item>}
          {(this.state.tripFromError && params.claim) ?
            <Text style={styles.errorText}>{this.state.currencyError}</Text>
          :null}
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Destination From:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='fromInput'
              onSubmitEditing={() => this.refs.toInput.focus()}
              placeholder='Enter From destination' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {params.update?this.state.fromLocation:null}
              returnKeyType="next"
              onChangeText={this.handleFromLocation} />
          </Item>
          {this.state.tripFromError &&
            <Text style={styles.errorText}>{this.state.tripFromError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Destination To:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='toInput'
              placeholder='Enter To destination' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {params.update?this.state.toLocation:null}
              returnKeyType="next"
              onChangeText={this.handleToLocation} />
          </Item>
          {this.state.tripToError &&
            <Text style={styles.errorText}>{this.state.tripToError}</Text>
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
}

const mapStateToProps = state => {
  return {
    reqCreateState: state.reqCreateState,
    plans: state.plans,
    statusResult: state.statusResult,
    reqUpdateState: state.reqUpdateState
  };
};

const mapDispatchToProps = {
  reqCreate : Actions.reqCreate,
  getPlans : Actions.getPlans,
  getStatus: Actions.getStatus,
  reqUpdate: Actions.reqUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(TaxiRequisitionScreen);