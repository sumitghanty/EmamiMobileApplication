import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Picker, Platform, Modal, 
  Keyboard, Alert, AsyncStorage, BackHandler, ActivityIndicator, Image } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import Loader from '../Components/Loader'
import styles from './Styles/RailCommisionScreen'

class RailCommisionScreen extends Component {

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
      date: (params.update && params.update.vendor_invoice_date)?params.update.vendor_invoice_date:new Date,
      dateStart: (params.update && params.update.start_date)?params.update.start_date:new Date,
      dateEnd: (params.update && params.update.end_date)?params.update.end_date:new Date,
      mode: 'date',
      show: false,
      showStart: false,
      showEnd: false,
      isLoading: false,
      error: false,
      statusName: '',
      subStatusName: '',
      lineitem: (params.update && params.update.lineitem)?params.update.lineitem:null,
      tcktFare: (params.update && params.update.amount)?params.update.amount:null,
      tcktFareError: null,
      agntProcCharge: (params.update && params.update.ta_booking_commission_amount)?params.update.ta_booking_commission_amount:null,
      agntProcChargeError: null,
      aCGST: (params.update && params.update.ta_booking_CGST)?params.update.ta_booking_CGST:null,
      aCGSTError: null,
      aSGST: (params.update && params.update.ta_booking_SGST)?params.update.ta_booking_SGST:null,
      aSGSTError: null,
      aIGST: (params.update && params.update.ta_booking_IGST)?params.update.ta_booking_IGST:null,
      aIGSTError: null,
      vList: [],
      vName: (params.update && params.update.issuing_authorityName)?params.update.issuing_authorityName:null,
      AList: [],
      AName: (params.update && params.update.vendor_name)?params.update.vendor_name:null,
      aInvNo: (params.update && params.update.vendor_invoice_no)?params.update.vendor_invoice_no:null,
      aInvNoError: null,
      iCurrency: (params.update && params.update.invoice_amount_currency)?params.update.invoice_amount_currency:null,
      iCurrencyError: null,
      iAmnt: (params.update && params.update.invoice_amount)?params.update.invoice_amount:null,
      iAmntError: null,
      modalVisible: false,    
      attachFiles: [],
      uploadData: [{"type":"Approve Email","file":[]},{"type":"Other","file":[]}],
      curUploadType: 'Approve Email',
      flieSizeIssue: false
    };
  }
  
  componentDidMount() {
    const {params} = this.props.navigation.state;

    this.props.getStatus("20","NA")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getHotels('Train')
    .then(()=>{
      if(this.props.hotelList.dataSource.length>0) {        
        for(var i=0; i<this.props.hotelList.dataSource.length; i++) {
          this.state.vList.push(this.props.hotelList.dataSource[i]);
        }
        this.setState({
          vName: this.props.hotelList.dataSource[0].vendor_name,
        });
      }
    });

    this.props.getHotels('Train Agent')
    .then(()=>{
      if(this.props.hotelList.dataSource.length>0) {
        for(var i=0; i<this.props.hotelList.dataSource.length; i++) {
          this.state.AList.push(this.props.hotelList.dataSource[i]);
        }
        this.setState({
          AName: this.props.hotelList.dataSource[0].vendor_name,
        });
      }
    });

    if(params.update){
      this.props.getAttachments(params.params.trip_hdr_id,this.state.tripNo,params.update.lineitem)
      .then(()=>{
        for(var i=0; i<this.props.attachmentList.dataSource.length; i++) {
          for(var j=0; j<this.state.uploadData.length; j++) {
            if(this.props.attachmentList.dataSource[i].doc_type == this.state.uploadData[j].type) {
              this.state.uploadData[j].file={
                'size': null,
                'name': this.props.attachmentList.dataSource[i].file_name,
                'type': 'image/'+this.getExtention(this.props.attachmentList.dataSource[i].file_name),
                'uri': this.props.attachmentList.dataSource[i].file_path
              }
            }           
          }
        }
      })
      .then(()=>{
        this.setState({screenReady: true});
      })
    }

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

  setStartDate = (event, date) => {
    date = date || this.state.dateStart; 
    this.setState({
      showStart: Platform.OS === 'ios' ? true : false,
      dateStart: date,
    });
  }
  showStart = mode => {
    this.setState({
      showStart: true,
      mode,
    });
  } 
  datepickerStart = () => {
    this.showStart('date');
  }

  setEndDate = (event, date) => {
    date = date || this.state.dateEnd; 
    this.setState({
      showEnd: Platform.OS === 'ios' ? true : false,
      dateEnd: date,
    });
  } 
  showEnd = mode => {
    this.setState({
      showEnd: true,
      mode,
    });
  } 
  datepickerEnd = () => {
    this.showEnd('date');
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

  handleTcktFare = (amount) => {
    this.setState({ 
      tcktFare: amount,
      tcktFareError: null
    })
  }

  handleAgntProcCharge = (amount) => {
    this.setState({ 
      agntProcCharge: amount,
      agntProcChargeError: null
    })
  }

  handleACGST = (amount) => {
    this.setState({ 
      aCGST: amount,
      aCGSTError: null
    })
  }

  handleASGST = (amount) => {
    this.setState({ 
      aSGST: amount,
      aSGSTError: null
    })
  }

  handleAIGST = (amount) => {
    this.setState({ 
      aIGST: amount,
      aIGSTError: null
    })
  }

  handleAInvNo = (text) => {
    this.setState({ 
      aInvNo: text,
      aInvNoError: null
    })
  }

  handleIAmount = (amount) => {
    this.setState({ 
      iAmnt: amount,
      iAmntError: null
    })
  }

  handleCurrncy = (text) => {
    this.setState({ 
      iCurrency: text,
      iCurrencyError: null
    })
  }

  onValueChangeVendor = (value) => {
    for(var i=0; i<this.state.vList.length; i++) {
      if(this.state.vList[i].vendor_name == value){
        this.setState({
          vName: value,
        });
      }
    }
  }

  onValueChangeAgent = (value) => {
    for(var i=0; i<this.state.AList.length; i++) {
      if(this.state.AList[i].vendor_name == value){
        this.setState({
          AName: value,
        });
      }
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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

  removeAttach(type) {
    for(var i =0; i<this.state.uploadData.length; i++) {
      if(this.state.uploadData[i].type == type) {
        this.state.uploadData[i].file = null;
        this.state.attachFiles.splice(0,1);
        this.setState({ 
          refresh: true 
        })
      }
    }
  }
  async selectAttachFiles() {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      for(var i=0; i<results.length; i++) {
        if(results[i].size>3000000) {
          Alert.alert(
            "File Size issue",
            "You have selected a large file. Please choose the file less then 3MB.",
            [
              {
                text: "Ok",
                style: 'cancel',
              },
            ],
            { cancelable: true }
          );
          this.setState({ 
            flieSizeIssue: true 
          })
          break
        }
        else {
          this.setState({ 
            flieSizeIssue: false 
          })
        }
      }

      if(!this.state.flieSizeIssue) {
        alert('File uploaded successfully.');     
        for(var i=0; i<this.state.uploadData.length; i++) {
          if(this.state.uploadData[i].type == this.state.curUploadType) {
            this.state.uploadData[i].file = results;
          }
        }
        this.state.attachFiles.push(results);
        this.setState({ 
          refresh: true 
        })
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You have not select any file for attachment');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  async atchFiles() {
    const {params} = this.props.navigation.state;
    for(var i=0; i<this.state.uploadData.length; i++){
      let fileBase64 = null;
      let filePath = this.state.uploadData[i].file.uri;
      await RNFS.readFile(filePath, 'base64')
      .then(res =>{
        fileBase64 = res;
      })
      .then(()=>{
        this.props.attachment({
          "mimeType": this.state.uploadData[i].file.type,
          "tripNo": params.params.trip_no,
          "lineItem": this.state.lineitem,
          "docType": this.state.uploadData[i].type,
          "userId": params.params.userid,
          "trip_hdr_id_fk": params.params.trip_hdr_id,
          "name": this.state.uploadData[i].file.name,
          "flow_type": 'ECR',
          "base64Str":fileBase64,
        })
      })
      .catch((err) => {
        console.log(err.message, err.code);
      })
    }
  }

  downloadImage = (file,type) => {
    console.log(file);
    var date = new Date();
    var image_URL = file;
    var ext = this.getExtention(image_URL);
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: PictureDir + "/Emami/download_" + Math.floor(date.getTime()
          + date.getSeconds() / 2) + ext,
        description: 'Image'
      }
    }
    for(i=0; i<this.state.uploadData.length; i++) {
      if(this.state.uploadData[i].type == type) {
        this.state.uploadData[i].action = 'P';
        break;
      }
    }
    this.setState({
      refresh: true
    });
    config(options).fetch('GET', image_URL)
    .then((res) => {
      Alert.alert('The file saved to ', res.path());
    })
    .then(()=>{
      for(i=0; i<this.state.uploadData.length; i++) {
        if(this.state.uploadData[i].type == type) {
          this.state.uploadData[i].action = 'C';          
          this.setState({
            refresh: true
          });
          break;
        }
      }
    });
  }
 
  getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }

  submitReq = () => {
    if(!this.state.tcktFare || !this.state.agntProcCharge || !this.state.aCGST || !this.state.aSGST 
      || !this.state.aIGST || !this.state.aInvNo || !this.state.iCurrency || !this.state.iAmnt) {
      if(!this.state.tcktFare){
        this.setState({
          tcktFareError: 'Please Enter Ticket Fare',
        });
      }
      if(!this.state.agntProcCharge){
        this.setState({
          agntProcChargeError: 'Please Enter Agent Processing Charge',
        });
      }
      if(!this.state.aCGST){
        this.setState({
          aCGSTError: 'Please Enter Agent CGST',
        });
      }
      if(!this.state.aSGST){
        this.setState({
          aSGSTError: 'Please Enter Agent SGST',
        });
      }
      if(!this.state.aIGST){
        this.setState({
          aIGSTError: 'Please Enter Agent IGST',
        });
      }
      if(!this.state.aInvNo){
        this.setState({
          aInvNoError: 'Please Enter Agent Invoice Number',
        });
      }
      if(!this.state.iCurrency){
        this.setState({
          iCurrencyError: 'Please Enter Invoice Currency',
        });
      }
      if(!this.state.iAmnt){
        this.setState({
          iAmntError: 'Please Enter Agent Invoice Amount',
        });
      }
    } else {
      this.saveReq();
    }
  }

  saveReq = () => {
    const {params} = this.props.navigation.state;
    this.setState({
      isLoading: true,
    });
    if(params.update){
      let newReq = params.update;
      AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
      .then(()=>{
        newReq.req_type = params.item.sub_category_id;
        newReq.start_date = moment(this.state.dateStart).format('YYYY-MM-DD');
        newReq.end_date = moment(this.state.dateEnd).format('YYYY-MM-DD');
        newReq.gl = params.item.gl;
        newReq.travel_heads = params.item.travel_heads;  
        newReq.status_id = "20";
        newReq.sub_status_id = "NA";
        newReq.status = this.state.statusName;
        newReq.sub_status = this.state.subStatusName;
        newReq.amount = this.state.tcktFare.length<1?0:parseFloat(this.state.tcktFare);

        newReq.ta_booking_commission_amount = this.state.agntProcCharge;
        newReq.ta_booking_CGST = this.state.aCGST;
        newReq.ta_booking_SGST = this.state.aSGST;
        newReq.ta_booking_IGST = this.state.aIGST;
        newReq.issuing_authorityName = this.state.vName;
        newReq.vendor_name = this.state.AName;
        newReq.vendor_invoice_no = this.state.aInvNo;
        newReq.vendor_invoice_date = moment(this.state.date).format("YYYY-MM-DD");
        newReq.invoice_amount = this.state.iAmnt;
        newReq.invoice_amount_currency = this.state.iCurrency;
      })
      .then(()=>{
        this.props.reqUpdate([newReq])
        .then(()=>{
          this.atchFiles();
        })
        .then(()=>{
          this.setState({
            isLoading: false,
          });
        })
        .then(()=>{
          this.props.navigation.goBack();
          Toast.show('Expense Updated Successfully', Toast.LONG);
        });
      });

    } else {
      this.props.getPlans(params.params.trip_hdr_id)
      .then(()=>{
        this.setState({
          lineitem: this.props.plans.dataSource.length + 1,
        });
      })
      .then(()=>{
        let postData = [{
          "trip_hdr_id_fk": params.params.trip_hdr_id,          
          "trip_no": params.params.trip_no,
          "useremail": params.params.email,
          "username": params.params.name,
          "userid": params.params.userid,
          "start_date": moment(this.state.dateStart).format('YYYY-MM-DD'),
          "end_date": moment(this.state.dateEnd).format('YYYY-MM-DD'),
          "req_type": params.item.sub_category_id,
          "amount": this.state.tcktFare.length<1?0:parseFloat(this.state.tcktFare),
          "status_id": "20",
          "sub_status_id": "NA",
          "status": this.state.statusName,
          "sub_status": this.state.subStatusName,
          "is_outof_policy": "N",
          "is_billRequired": params.item.bill_required == 'Y'?'Y':'N',
          "delete_status" : "false",
          "pending_with": global.USER.supervisorId,
          "pending_with_name": global.USER.supervisorName,
          "pending_with_email": global.USER.supervisorEmail,
          "lineitem": this.state.lineitem,          
          "gl": params.item.gl,
          "travel_heads": params.item.travel_heads,
          "creation_date": moment(this.state.curDate).format("YYYY-MM-DD"),

          'ta_booking_commission_amount': this.state.agntProcCharge,
          'ta_booking_CGST': this.state.aCGST,
          'ta_booking_SGST': this.state.aSGST,
          'ta_booking_IGST': this.state.aIGST,
          'issuing_authorityName': this.state.vName,
          'vendor_name': this.state.AName,
          'vendor_invoice_no': this.state.aInvNo,
          'vendor_invoice_date': moment(this.state.date).format("YYYY-MM-DD"),
          'invoice_amount': this.state.iAmnt,
          'invoice_amount_currency': this.state.iCurrency,
        }]
        this.props.reqCreate(postData)
        .then(()=>{
          this.atchFiles();
        })
        .then(()=>{
          this.props.updtReqNSBD(postData)
          .then(()=>{
            this.setState({
              isLoading: false,
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Expense Created Successfully', Toast.LONG);
          })
        })
      });
    }
    Keyboard.dismiss();
  }

  render() {
    const {params} = this.props.navigation.state;
    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.hotelList.isLoading ||
      (params.update && this.props.attachmentList.isLoading) ||
      !this.state.screenReady
      ){
      return(
        <Loader/>
      )
    } else if(this.props.reqCreateState.errorStatus
      || this.props.reqUpdateState.errorStatus 
      || this.props.plans.errorStatus 
      || this.props.hotelList.errorStatus
      || this.props.statusResult.errorStatus ||
      (params.update && this.props.attachmentList.errorStatus)) {
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
            <Label style={styles.formLabel}>Start Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepickerStart} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.showStart && 
          <DateTimePicker value={new Date(moment(this.state.dateStart).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setStartDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>End Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateEnd).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.showEnd && 
          <DateTimePicker value={new Date(moment(this.state.dateEnd).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setEndDate} />
          }

          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Ticket Fare (Inclusive GST):<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.tcktFare}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => this.refs.pcharge.focus()}
              onChangeText={this.handleTcktFare} />
          </Item>
          {this.state.tcktFareError &&
            <Text style={styles.errorText}>{this.state.tcktFareError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent Processing Charges:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.agntProcCharge}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              ref='pcharge'
              returnKeyType="next"
              onSubmitEditing={() => this.refs.cgst.focus()}
              onChangeText={this.handleAgntProcCharge} />
          </Item>
          {this.state.agntProcChargeError &&
            <Text style={styles.errorText}>{this.state.agntProcChargeError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent CGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aCGST}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              ref='cgst'
              returnKeyType="next"
              onSubmitEditing={() => this.refs.sgst.focus()}
              onChangeText={this.handleACGST} />
          </Item>
          {this.state.aCGSTError &&
            <Text style={styles.errorText}>{this.state.aCGSTError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent SGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aSGST}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              ref='sgst'
              returnKeyType="next"
              onSubmitEditing={() => this.refs.igst.focus()}
              onChangeText={this.handleASGST} />
          </Item>
          {this.state.aSGSTError &&
            <Text style={styles.errorText}>{this.state.aSGSTError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent IGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aIGST}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              ref='igst'
              returnKeyType="next"
              onChangeText={this.handleAIGST} />
          </Item>
          {this.state.aIGSTError &&
            <Text style={styles.errorText}>{this.state.aIGSTError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Vendor Name:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <Picker
              placeholder="Select Vendor"
              selectedValue={this.state.vName}
              onValueChange={this.onValueChangeVendor}
              style={styles.formInput}
              prompt="Select Vendor Name"
              >
                {this.state.vList.map((item, index) => {
                return (
                  <Picker.Item label={item.vendor_name} value={item.vendor_name} key={index} />
                );
              })}
            </Picker>
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent Name:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <Picker
              placeholder="Select Agent"
              selectedValue={this.state.AName}
              onValueChange={this.onValueChangeAgent}
              style={styles.formInput}
              prompt="Select Agent Name"
              >
                {this.state.AList.map((item, index) => {
                return (
                  <Picker.Item label={item.vendor_name} value={item.vendor_name} key={index} />
                );
              })}
            </Picker>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent Invoice Number:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='Invoice Number' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aInvNo}
              onChangeText={this.handleAInvNo} />
          </Item>
          {this.state.aInvNoError &&
            <Text style={styles.errorText}>{this.state.aInvNoError}</Text>
          }        
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Agent Invoice Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
            <Label style={styles.formLabel}>Agent Invoice Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.iAmnt}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => this.refs.currency.focus()}
              onChangeText={this.handleIAmount} />
          </Item>
          {this.state.iAmntError &&
            <Text style={styles.errorText}>{this.state.iAmntError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Currency:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='INR' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.iCurrency}
              ref='currency'
              returnKeyType="next"
              onChangeText={this.handleCurrncy} />
          </Item>
          {this.state.iCurrencyError &&
            <Text style={styles.errorText}>{this.state.iCurrencyError}</Text>
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
            item.file ? 
            <View key={key}>
              <Text style={styles.attachType}>{item.type}</Text>
              <View style={styles.atchFileRow}>
                {item.file.type == "image/webp" ||
                  item.file.type == "image/jpeg" ||
                  item.file.type == "image/jpg" ||
                  item.file.type == "image/png" ||
                  item.file.type == "image/gif" ?
                <Image
                  style={{width: 50, height: 50, marginRight:10}}
                  source={{uri: item.file.uri}}
                />:null}
                <Text style={styles.atchFileName} numberOfLines = {1}>{item.file.name ? item.file.name : ''}</Text>
                {params.update &&
                <>
                {item.action == 'P' ?
                <ActivityIndicator size="small" color="#0066b3" />:              
                <Button bordered small rounded primary style={[styles.actionBtn, styles.actionBtnPrimary, item.action == 'C'?{borderColor:'green'}:null]}
                  onPress={() => {this.downloadImage(item.file.uri,item.type);}}>
                  {item.action == 'C' ?
                  <Icon name='md-checkmark' style={[styles.actionBtnIco,{color:'green'}]} />:                
                  <Icon name='md-download' style={[styles.actionBtnIco,styles.actionBtnIcoPrimary]} />}
                </Button>}
                </>}
                <Button bordered small rounded danger style={styles.actionBtn}
                  onPress={()=>this.removeAttach(item.type)}>
                  <Icon name='close' style={styles.actionBtnIco} />
                </Button>
              </View>
            </View>:null
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
              (item.type == this.state.curUploadType && item.file) ?
              <View key={key} style={styles.atchFileRow}>
                {item.file.type == "image/webp" ||
                  item.file.type == "image/jpeg" ||
                  item.file.type == "image/jpg" ||
                  item.file.type == "image/png" ||
                  item.file.type == "image/gif" ?
                <Image
                  style={{width: 50, height: 50, marginRight:10}}
                  source={{uri: item.file.uri}}
                />:null}
                <Text style={styles.atchFileName}>{item.file.name ? item.file.name : ''}</Text>
                <Button bordered small rounded danger style={styles.actionBtn}
                  onPress={()=>this.removeAttach(item.type)}>
                  <Icon name='close' style={styles.actionBtnIco} />
                </Button>
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
    reqUpdateState: state.reqUpdateState,
    updtReqNSBDState: state.updtReqNSBDState,
    hotelList: state.hotelList,
    attachmentState: state.attachmentState,
    attachmentList: state.attachmentList
  };
};

const mapDispatchToProps = {
  reqCreate : Actions.reqCreate,
  getPlans : Actions.getPlans,
  getStatus: Actions.getStatus,
  reqUpdate: Actions.reqUpdate,
  updtReqNSBD: Actions.updtReqNSBD,
  getHotels: Actions.getHotels,
  attachment: Actions.attachment,
  getAttachments: Actions.getAttachments
};

export default connect(mapStateToProps, mapDispatchToProps)(RailCommisionScreen);