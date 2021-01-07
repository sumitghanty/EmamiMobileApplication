import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Platform, Modal, 
  Keyboard, Alert, AsyncStorage, BackHandler, ActivityIndicator, Image, Picker } from "react-native";
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
import styles from './Styles/OtherRequisitionScreen'

class OtherRequisitionScreen extends Component {

 
    static navigationOptions = ({ navigation }) => {
    
      const handleClearPress = navigation.getParam("handleBackPress", () => {});
      const edit = navigation.getParam('claim', false);
     
      if(edit == true){
        return {
          headerTitle: 'Expense Details',
          headerLeft: <HeaderBackButton onPress={handleClearPress} />
        };
      }else{
        return {
          headerTitle: 'Create Requisitions',
          headerLeft: <HeaderBackButton onPress={handleClearPress} />
        };
      }
  
      // return {
      //   //ltitle: "Create Requisition",
      //   headerLeft: <HeaderBackButton onPress={handleClearPress} />
      // };
    };

  constructor(props) {
    super(props);    
    const {params} = this.props.navigation.state;
    this.state = {
      curDate: new Date,
      dateStart: (params.update && params.update.start_date)?params.update.start_date:params.params.start_date,
      dateEnd: (params.update && params.update.end_date)?params.update.end_date:params.params.start_date,
      mode: 'date',
      show: false,
      showEnd: false,
      isLoading: false,
      error: false,
      aprxAmnt: params.item.category == 'DA'?params.item.upper_limit
                :(params.update && params.update.amount)?params.update.amount:'0',
      statusName: '',
      subStatusName: '',
      lineitem: (params.update && params.update.lineitem)?params.update.lineitem:null,
      days: 2,
      modalVisible: false,    
      attachFiles: [],
      uploadData: [{"type":"Approve Email","file":null,'action':null},{"type":"Other","file":null,'action':null}],
      curUploadType: 'Approve Email',
      flieSizeIssue: false,
      tripNo: params.params.trip_no,
      refresh: false,
      screenReady: params.update ? false : true,
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

  setDate = (event, date) => {
    const {params} = this.props.navigation.state;
    if(date != undefined) {
      date = date || this.state.dateStart; 
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
        dateStart: date,
        dateEnd: date
      });    
      var newDays= moment(this.state.dateEnd, "YYYY-MM-DD").diff(moment(this.state.dateStart, "YYYY-MM-DD"), 'days')
      this.setState({
        days: newDays == 0? 1: newDays,
        aprxAmnt: parseFloat(params.item.upper_limit) * (parseInt(newDays)+1)
      });
    } else {
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
      });
    }
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
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

  setEndDate = (event, date) => {
    const {params} = this.props.navigation.state;
    if(date != undefined) {
      date = date || this.state.dateEnd; 
      this.setState({
        showEnd: Platform.OS === 'ios' ? true : false,
        dateEnd: date,
      });    
      var newDays= moment(this.state.dateEnd, "YYYY-MM-DD").diff(moment(this.state.dateStart, "YYYY-MM-DD"), 'days')
      this.setState({
        days: newDays == 0? 1: newDays,
        aprxAmnt: parseFloat(params.item.upper_limit) * (parseInt(newDays)+1)
      });
    } else { 
      this.setState({
        showEnd: Platform.OS === 'ios' ? true : false,
      });
    }
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

  handleChangeAmount = (amount) => {
    var v= Math.sign(amount);
     if(v=== 1 || amount===''){
    this.setState({ 
      aprxAmnt: amount
    })
  }
  else if (amount === "0")
  {
      alert("Enter Correct Amount");
      
  }
  else {
      alert("Enter Correct Amount");
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
            "You have selected a large file. Please choose a file less than 3MB.",
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
        alert('You have not selected any file for attachment');
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
          "repositoryId": global.USER.repositoryId,
          "folderId": global.USER.folderId
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
    for(var i=0; i<this.state.uploadData.length; i++) {
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
        if(params.item.bill_required == 'Y') {
          newReq.is_billRequired = 'Y';
          newReq.invoice_amount = this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt);
        } else {
          newReq.amount = this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt);
        }
      })
      .then(()=>{
        this.props.reqUpdate([newReq])
        .then(()=>{
          //this.atchFiles();
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
          "amount": this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt),
          "status_id": "20",
          "sub_status_id": "NA",
          "status": this.state.statusName,
          "sub_status": this.state.subStatusName,
          "is_outof_policy": "N",
          "is_billRequired": params.item.bill_required == 'Y'?'Y':'N',
          "invoice_amount": params.item.bill_required == 'Y'?this.state.aprxAmnt:null,
          "delete_status" : "false",
          "pending_with": global.USER.supervisorId,
          "pending_with_name": global.USER.supervisorName,
          "pending_with_email": global.USER.supervisorEmail,
          "lineitem": this.state.lineitem,
          
          "gl": params.item.gl,
          "travel_heads": params.item.travel_heads,
          "creation_date": moment(this.state.curDate).format("YYYY-MM-DD"),          
        }]
        //alert(JSON.stringify(postData));
        this.props.reqCreate(postData)
        .then(()=>{
          //this.atchFiles();
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
    console.log(this.state.uploadData);
    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.statusResult.isLoading ||
      (params.update && this.props.attachmentList.isLoading) ||
      !this.state.screenReady
      ){
      return(
        <Loader/>
      )
    } 
    else if(
    ///  this.props.reqCreateState.errorStatus
    //  || this.props.reqUpdateState.errorStatus 
       this.props.plans.errorStatus 
      || this.props.statusResult.errorStatus ||
      (params.update && this.props.attachmentList.errorStatus)) {
      return(
        <Text>URL Error</Text>
      )
    } 
    else {
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
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.show && 
          <DateTimePicker value={new Date(moment(this.state.dateStart).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>End Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(params.params.end_date).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.showEnd && 
          <DateTimePicker value={new Date(moment(this.state.end_date).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setEndDate} />
          }
          {params.item.category == 'DA' &&
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>No of Days :</Label>
            <Text style={styles.readOnly}>{this.state.days}</Text>
          </Item>}
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Amount :</Label>
            {params.item.category != 'DA' ?
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aprxAmnt}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onChangeText={this.handleChangeAmount} />
            :<Text style={styles.readOnly}>{this.state.aprxAmnt}</Text>}
          </Item>
          {params.item.category == 'DA' &&
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Currency :</Label>
            <Text style={styles.readOnly}>{params.params.currency?params.params.currency:'INR'}</Text>
          </Item>}
        </Form>
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
}

const mapStateToProps = state => {
  return {
    reqCreateState: state.reqCreateState,
    plans: state.plans,
    statusResult: state.statusResult,
    reqUpdateState: state.reqUpdateState,
    updtReqNSBDState: state.updtReqNSBDState,
    attachmentState: state.attachmentState,
    //trpNSClmDtlUpdtState: state.trpNSClmDtlUpdtState,
    attachmentList: state.attachmentList
  };
};

const mapDispatchToProps = {
  reqCreate : Actions.reqCreate,
  getPlans : Actions.getPlans,
  getStatus: Actions.getStatus,
  reqUpdate: Actions.reqUpdate,
  updtReqNSBD: Actions.updtReqNSBD,
  attachment: Actions.attachment,
  //trpNSClmDtlUpdt: Actions.trpNSClmDtlUpdt,
  getAttachments: Actions.getAttachments
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherRequisitionScreen);