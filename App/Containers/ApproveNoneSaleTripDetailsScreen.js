import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Keyboard,AsyncStorage, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import {API_URL} from '../config'
import RNFetchBlob from 'rn-fetch-blob'

import Loader from '../Components/Loader'
import {Purpose, For} from '../Components/GetValue'
import styles from './Styles/ApproveNoneSaleTripDetailsScreen'

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'
const STAT_IMG = 'https://qph.fs.quoracdn.net/main-qimg-2fbdde5788e73478a08dc4bf338eee02.webp'

class ApproveNoneSaleTripDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,    
      attachData: null,
      dataSource: null,
      SelectedDataList: [],
      updateParams: '',
      rejComment: '',
      isLoading: false,
      isError: false,
      hasOOP: false,
      aprvReqList: [],
      downloadLoading: false,
      reqDetails: null
    };
  }
  componentDidMount(props){
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      this.setState({dataSource: this.props.plans.dataSource});
      for(var i=0; i<this.props.plans.dataSource.length; i++) {
        if(this.props.plans.dataSource[i].is_outof_policy=="Y" || ((this.props.plans.dataSource[i].scenario == "2" 
        || this.props.plans.dataSource[i].scenario == "3") 
        && this.props.plans.dataSource[i].isApproved == null)) {
          this.setState({hasOOP: true});
        }
      }
    });
    this.props.getReqName(global.USER.designation,global.USER.grade);
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

  state = {
    modalVisible: false,    
    attachData: null,
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  attachModalVisible(value){
    this.setState({attachData: value});
  }
  press = (hey) => {
    this.props.plans.dataSource.map((item) => {
      if (item.req_hdr_id === hey.req_hdr_id) {
        item.check = !item.check
        if (item.check === true) {
          this.state.SelectedDataList.push(item);
        } else if (item.check === false) {
          const i = this.state.SelectedDataList.indexOf(item)
          if (1 != -1) {
            this.state.SelectedDataList.splice(i, 1);
            return this.state.SelectedDataList
          }
        }
      }
    })
    this.setState({dataSource: this.props.plans.dataSource})
  }

  approveTripNonReq() {
    
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem("ASYNC_STORAGE_APRV_TRIP_NON_REQ")
    .then(()=>{
      this.setState({ 
        isLoading: true,
        modalVisible: false
      });
      let newParams = params;
      if (params.status_id == "2") {
        newParams.status_id = "3";
        newParams.status = "Create Trip/PJP - Approved by Supervisor";
      } else if (params.status_id == "8" && params.sub_status_id == "8.1") {
        if(params.sub_status_id == "8.1") {
          newParams.status_id = "9";
          newParams.sub_status_id = "9.1";
          newParams.status = "Requisition - Approved by Supervisor";
        }
      }
      this.setState({
        updateParams:newParams,
      });
    })
    .then(()=>{
      this.props.aprvTripNonReq(this.state.updateParams)
      .then(()=>{         
        this.props.sendEmail({
          "mailId": params.email,
          "cc": 'chinmaymcc@gmail.com',
          "subject": params.status_id == "2"? 'trip #'+params.trip_no+' has been approved.'
                    : 'Requisition has been approved.',
          "tripNonSales": this.state.updateParams,
          "requisitionNonSales": null
        })
        .then(()=>{
          this.props.getApprovedTripPending(global.USER.personId)
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Trip approved Successfully', Toast.LONG);
            console.log('Approve Done');
          });
        })
      })      
    })
  }

  rejectTripNonReq() {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem("ASYNC_STORAGE_REJ_TRIP_NON_REQ")
    .then(()=>{
      this.setState({ 
        isLoading: true,
        modalVisible: false
      });
      let newParams = params;
      if (params.status_id == "2") {
        newParams.status_id = "5";
        newParams.status = "Create Trip/PJP - Rejected by Supervisor";
      } else if (params.status_id == "8" && params.sub_status_id == "8.1") {
        if(params.sub_status_id == "8.1") {
          newParams.status_id = "10";
          newParams.sub_status_id = "10.1";
          newParams.status = "Requisition - Rejected by Supervisor";
          newParams.req_comment = this.state.rejComment;
        }
      }    
      newParams.comment = this.state.rejComment;
      this.setState({
        updateParams:newParams,
      });
    })
    .then(()=>{
      this.props.aprvTripNonReq(this.state.updateParams)
      .then(()=>{         
        this.props.sendEmail({
          "mailId": params.email,
          "cc": 'chinmaymcc@gmail.com',
          "subject": params.status_id == "2"? 'trip #'+params.trip_no+' has been rejected.'
                    : 'Requisition has been rejected.',
          "tripNonSales": this.state.updateParams,
          "requisitionNonSales": null
        })
        .then(()=>{
          this.props.getApprovedTripPending(global.USER.personId)
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Trip is rejected successfully', Toast.LONG);
            console.log('Reject Done');
          });
        })
      })
    })
  }

  approveConfirmation(e) {
    
    Alert.alert(
      'Approve',
      'Do you want to approve the trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.approveTripNonReq()
        },
      ],
      {cancelable: true},
    )
  };

  downloadAttachment=(file)=> {
    this.downloadImage (file);
    this.setState({downloadLoading: true});
  }

  downloadImage = (file) => {
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
        path: PictureDir + "/Emami/image_" + Math.floor(date.getTime()
          + date.getSeconds() / 2) + ext,
        description: 'Image'
      }
    }
    config(options).fetch('GET', image_URL).then((res) => {
      Alert.alert("File Downloaded Successfully.");      
      this.attachModalVisible(null);
      this.setState({downloadLoading: false});
    });
  }
 
  getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }
  getFilename = (filename) => {
    return (/[/]/.exec(filename)) ? /[^/]+$/.exec(filename) :
      undefined;
  }

  rejectConfirmation() {
    if(this.state.rejComment.length<1) {
      Alert.alert(
        'Field Required',
        'Please enter rejection reason.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      Alert.alert(
        'Reject',
        'Do you want to reject the Trip?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.state.hasOOP?this.rejectWithReq():this.rejectTripNonReq()
          },
        ],
        {cancelable: true},
      )
    }
  };

  handleRejComment = (text) => {
    this.setState({ rejComment: text })
  }

  approveWithReqConfirm=()=>{
    if(this.state.SelectedDataList.length<1) {
      Alert.alert(
        '',
        'Please select atleast one Requisition',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      Alert.alert(
        'Approve',
        'Do you want to approve the trip?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => this.approveWithReq()
          },
        ],
        {cancelable: true},
      )
    }
  }

  approveWithReq(){
    //alert("hi");
    const {params} = this.props.navigation.state;
    let emergencyJustificationEntered = true;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY).then(value => {
      this.setState({ isLoading: true ,aprvReqList :[]}, () => {  

        // for(var i=0; i<this.state.SelectedDataList.length; i++) {
        //   if((this.state.SelectedDataList[i].scenario == "2" || this.state.SelectedDataList[i].scenario == "3") && this.state.SelectedDataList[i].req_type == "1"
        //  &&( this.state.SelectedDataList[i].emergencyJustification ==  null || this.state.SelectedDataList[i].emergencyJustification == "")){
       
        //   emergencyJustificationEntered = false;


        //  }
        // }

        if(emergencyJustificationEntered == true){
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newSelectedDataList = this.state.SelectedDataList[i];
          if (params.status_id == "24") {
              newSelectedDataList.status_id="25";
              newSelectedDataList.status="Expense Claim - Rejected by Finance";
              newSelectedDataList.email=params.pending_with_email;
              newSelectedDataList.pending_with_email=params.email;
              newSelectedDataList.pending_with_name=params.name;
              newSelectedDataList.pending_with=params.userid;
              newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;
          } else {
            newSelectedDataList.vendor_comment="Approved";
            newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;

           
            if (newSelectedDataList.status_id == "8") {

              if(newSelectedDataList.scenario == "2"  && newSelectedDataList.req_type == "1"){

                if(newSelectedDataList.through =="Travel Agent" && newSelectedDataList.isApproved == null){

                newSelectedDataList.status_id="7";
                newSelectedDataList.status="Plan Trip/PJP";
                newSelectedDataList.sub_status_id="7.1";
                newSelectedDataList.sub_status="Send to travel agent for options";
                newSelectedDataList.email=params.email;
                newSelectedDataList.pending_with_email=params.pending_with_email;
                newSelectedDataList.pending_with_name=params.pending_with_name;
                newSelectedDataList.pending_with=params.pending_with;
                newSelectedDataList.isApproved = 'yes';
                }else{
                  newSelectedDataList.status_id="9";
                  newSelectedDataList.status="Plan Trip/PJP";
                  newSelectedDataList.sub_status_id="9.1";
                  newSelectedDataList.sub_status="Requisition - Approved by Supervisor";
                  newSelectedDataList.email=params.email;
                  newSelectedDataList.pending_with_email=params.pending_with_email;
                  newSelectedDataList.pending_with_name=params.pending_with_name;
                  newSelectedDataList.pending_with=params.pending_with;
                  newSelectedDataList.isApproved = 'yes';
                }

              }else if(newSelectedDataList.scenario == "3"   && newSelectedDataList.req_type == "1"){
                if(newSelectedDataList.approverLevel == "1"){

                if(newSelectedDataList.through =="Travel Agent"  && newSelectedDataList.isApproved == null){
                  newSelectedDataList.status_id="7";
                  newSelectedDataList.status="Plan Trip/PJP";
                  newSelectedDataList.sub_status_id="7.1";
                  newSelectedDataList.sub_status="Send to travel agent for options";
                  newSelectedDataList.email=params.email;
                  newSelectedDataList.pending_with_email=params.pending_with_email;
                  newSelectedDataList.pending_with_name=params.pending_with_name;
                  newSelectedDataList.pending_with=params.pending_with;
                  newSelectedDataList.isApproved = 'yes';
                  }else{
                    newSelectedDataList.status_id="9";
                    newSelectedDataList.status="Plan Trip/PJP";
                    newSelectedDataList.sub_status_id="9.1";
                    newSelectedDataList.sub_status="Requisition - Approved by Supervisor";
                    newSelectedDataList.email=params.email;
                    newSelectedDataList.pending_with_email=params.pending_with_email;
                    newSelectedDataList.pending_with_name=params.pending_with_name;
                    newSelectedDataList.pending_with=params.pending_with;
                    newSelectedDataList.isApproved = 'yes';
                  }

                }else if(newSelectedDataList.approverLevel == null){
                  newSelectedDataList.status_id="8";
                  newSelectedDataList.status="Plan Trip/PJP";
                  newSelectedDataList.sub_status_id="8.1";
                  newSelectedDataList.sub_status="Requisition - Pending with Supervisor";
                  newSelectedDataList.email=params.email;
                  newSelectedDataList.pending_with_email=params.pending_with_email;
                  newSelectedDataList.pending_with_name=global.USER.supervisorName;
                  newSelectedDataList.pending_with= global.USER.supervisorId;
                  newSelectedDataList.approverLevel = '1';
                }

              }else{
              newSelectedDataList.status_id="9";
              newSelectedDataList.status="Plan Trip/PJP";
              newSelectedDataList.sub_status_id="9.1";
              newSelectedDataList.sub_status="Requisition - Approved by Supervisor";
              newSelectedDataList.email=params.email;
              newSelectedDataList.pending_with_email=params.pending_with_email;
              newSelectedDataList.pending_with_name=params.pending_with_name;
              newSelectedDataList.pending_with=params.pending_with;
              }
            } else {
              newSelectedDataList.status_id="11";
              newSelectedDataList.status="Plan Trip/PJP";
              newSelectedDataList.sub_status_id="11.2";
              newSelectedDataList.sub_status="Requisition Completed";
              newSelectedDataList.email=params.pending_with_email;
              newSelectedDataList.pending_with_email=params.email;
              newSelectedDataList.pending_with_name=params.name;
              newSelectedDataList.pending_with=params.userid;
            }
          }
        this.state.aprvReqList.push(newSelectedDataList);
          // alert(newSelectedDataList.approverLevel+ "   "+newSelectedDataList.isApproved+ " "
          // +newSelectedDataList.sub_status_id+ "   "+newSelectedDataList.emergencyJustification);
         
         //this.state.aprvReqList.push({});
        
                
        }
      }
      })      
    })
    .then(()=>{
      this.props.postAprvTripWithReq(this.state.aprvReqList)
      .then(()=>{  
        
      if(emergencyJustificationEntered == false){
        alert("Please enter justification for approving emergency Air Travel");
          
      }else{
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newaprvReqList = this.state.SelectedDataList[i];
          this.props.sendEmail({
            "mailId": params.email,
            "cc": 'chinmaymcc@gmail.com',
            "subject": newaprvReqList.status_id == "8"? 'Requisition has been approved.'
                      : 'Requisition has been completed.',
            "tripNonSales": params,
            "requisitionNonSales": newaprvReqList
          })
        }
      }
      })
      .then(()=> {

        if(emergencyJustificationEntered == false){
          this.setState({
            isLoading: false
          });
        }else{
        this.props.getApprovedTripPending(global.USER.personId)
        .then(()=>{          
          this.props.navigation.goBack();
          this.setState({
            isLoading: false
          });
          Toast.show('Requisition Approved Successfully', Toast.LONG);
        })
      }

      });
    })
  }

  rejectWithReqCheck=()=>{
    if(this.state.SelectedDataList.length<1) {
      Alert.alert(
        '',
        'Please select atleast one Requisition',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      this.setModalVisible(true);
    }
  }

  rejectWithReq=()=> {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY).then(value => {
      this.setState({ isLoading: true }, () => {  
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newSelectedDataList = this.state.SelectedDataList[i];
          newSelectedDataList.vendor_comment=this.state.rejComment;
          newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;
          if (newSelectedDataList.status_id == "8") {
            newSelectedDataList.status_id="10";
            newSelectedDataList.status="Plan Trip/PJP";
            newSelectedDataList.sub_status_id="10.1";
            newSelectedDataList.sub_status="Requisition - Rejected by Supervisor";
            newSelectedDataList.email=params.email;
            newSelectedDataList.pending_with_email=params.pending_with_email;
            newSelectedDataList.pending_with_name=params.pending_with_name;
            newSelectedDataList.pending_with=params.pending_with;
            newSelectedDataList.req_comment = this.state.rejComment;
          } else {
            newSelectedDataList.status_id="11";
            newSelectedDataList.status="Plan Trip/PJP";
            newSelectedDataList.sub_status_id="11.2";
            newSelectedDataList.sub_status="Requisition Completed";
            newSelectedDataList.email=params.pending_with_email;
            newSelectedDataList.pending_with_email=params.email;
            newSelectedDataList.pending_with_name=params.pending_with_name;
            newSelectedDataList.pending_with=params.userid;
          }
        this.state.aprvReqList.push(newSelectedDataList);
          
        }
      })      
    })
    .then(()=>{
      this.props.postAprvTripWithReq(this.state.aprvReqList)
      .then(()=>{         
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newaprvReqList = this.state.SelectedDataList[i];
          this.props.sendEmail({
            "mailId": params.email,
            "cc": 'chinmaymcc@gmail.com',
            "subject": newaprvReqList.status_id == "8"? 'Requisition has been rejected.'
                      : 'Requisition has been completed.',
            "tripNonSales": params,
            "requisitionNonSales": newaprvReqList
          })
        }
      })
      .then(()=> {
        this.props.getApprovedTripPending(global.USER.personId)
        .then(()=>{
          this.props.navigation.goBack();
          this.setState({
            isLoading: false
          });
          Toast.show('Requisition Rejected Successfully', Toast.LONG);
        })
      });
    })
  }

  setReqName=(value)=>{
    for(var i=0; i<this.props.reqName.dataSource.length; i++) {
      if(this.props.reqName.dataSource[i].sub_category_id == value) {
        return (
          this.props.reqName.dataSource[i].sub_category
        );
      }
    }
  }

  endDateConf(value) {
    if(value == 'A') {
      Alert.alert(
        'Confirm',
        'Do you want to Approve the changed end date?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.endDateAction('value')
          },
        ],
        {cancelable: true},
      )
    } else if(value == 'R') {
      
    }
  };

  endDateAction=(value)=>{

  }
  emergencyStatus(data){
    if(data.req_type == "1" && data.status_id == "8" && data.sub_status_id == "8.1" && (data.scenario == "2" || data.scenario == "3") && data.isApproved ==null){
      return "Requisition - Pending with Supervisor for Emergency";
    }else if(data.sub_status_id == null ||  data.sub_status_id == "") return data.status;
    else return data.sub_status;

  } 
  render(){
    console.log(this.props.aprvTripPend.Actions);
    const {params} = this.props.navigation.state;
    if(this.state.isLoading || this.props.plans.isLoading || this.props.reqName.isLoading){
      return(
        <Loader/>
      )
    } else if ( this.state.isError
      || this.props.plans.errorStatus 
      || this.props.aprvTripNonReq.errorStatus
      || this.props.aprvTripWithReq.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
      console.log(params)
    return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.gnTrpDtl}>
          <View style={styles.row}>
            <Text style={styles.label}>Trip ID:</Text>
            <Text style={[styles.value,styles.tripId]}>{params.trip_no}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{params.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Creation Date:</Text>
            <Text style={styles.value}>{params.creation_date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pupose:</Text>
            {params.purpose.length>0 ?
            <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            :null}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{params.trip_from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{params.trip_to}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Trip For:</Text>
            <Text style={styles.value}><For value={params.trip_for} /></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Traveler's Name:</Text>
            <Text style={styles.value}>{params.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Details:</Text>
            <Text style={styles.value}>{params.details}</Text>
          </View>
          {/*params.date_change_status == 'Y' ?<>
          <View style={styles.row}>
            <Text style={[styles.label,{flex:3}]}>Requested Changed Date:</Text>
            <Text style={[styles.value,{color:'red',textAlign:'right'}]}>{moment(params.changed_end_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.endBtnRow}>
            <TouchableOpacity 
              style={styles.endBtn}
              onPress={() => {this.endDateConf('R')}}
              >
              <LinearGradient 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                colors={['#e63826', '#fb4b7b']} 
                style={styles.endBtnBg}>
                <Text style={styles.endBtnTxt}>Reject End Date</Text>
                <Text>On Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.endBtn}
              onPress={() => {this.endDateConf('A')}}
              >
              <LinearGradient 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                colors={['#5ba11c', '#92d40a']} 
                style={styles.endBtnBg}>
                <Text style={styles.endBtnTxt}>Approved End Date</Text>
                <Text>On Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </>:null*/}
        </View>
        
        {(this.props.plans.dataSource.length && !this.props.plans.isLoading) ?
          <Text style={styles.reqTitle}>Requisition(s) List</Text>
        :null}
        { this.props.plans.isLoading ?
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
        : this.props.plans.dataSource.map((item, index) => {
            return (
              this.renderItem(item,index)
            );
          }
        )}

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.attachData? true : false}
          onRequestClose = {() => {this.attachModalVisible(null)}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Attachment</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modaCmntlBody}>
            {this.state.downloadLoading ?
              <Loader/>
            :<View>
            {(this.getExtention(this.state.attachData) == 'webp' ||
              this.getExtention(this.state.attachData) == 'png' ||
              this.getExtention(this.state.attachData) == 'jpg' ||
              this.getExtention(this.state.attachData) == 'jpeg' ||
              this.getExtention(this.state.attachData) == 'bmp' ||
              this.getExtention(this.state.attachData) == 'gif'
            ) ?
              <Image source={{uri:this.state.attachData}} 
                style={styles.atchMdlImg} 
                resizeMode='contain' />
            :<Icon name="ios-paper" style={styles.atchMdlImgIcon} />}
            <Text style={styles.atchMdlImgName}>{this.getFilename(this.state.attachData)}</Text>
            </View>}
          </ScrollView>
          <View style={styles.modalCmntFooter}>
            <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnDanger]}
              onPress={() => {this.attachModalVisible(null)}}>
              <Text style={styles.modaCmntlBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnPrimary]}
              onPress={() => {this.downloadAttachment(this.state.attachData)}}>
              <Text style={styles.modaCmntlBtnText}>Download</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </ScrollView>

      {(!this.props.plans.isLoading) ?
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={() => {this.state.hasOOP?this.rejectWithReqCheck():this.setModalVisible(true);}}
          >
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#e63826', '#fb4b7b']} 
            style={styles.btnBg}>
            <Text style={styles.btnTxt}>Reject</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>{this.state.hasOOP?this.approveWithReqConfirm():this.approveConfirmation(params)}}
          >
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#5ba11c', '#92d40a']} 
            style={styles.btnBg}>
            <Text style={styles.btnTxt}>Approve</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>:null}

      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {this.setModalVisible(false)}}>
        <View style={styles.modalBody}>
          <Text style={styles.modalLabel}>Rejection reason:</Text>
          <TextInput 
            multiline
            numberOfLines={4}
            placeholder='Enter reason'
            style={styles.modalInput}
            underlineColorAndroid="transparent"
            onChangeText={this.handleRejComment}
            />
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalBtn,styles.modalBtnDngr]}
              onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
              <Text style={[styles.mBtntxt,styles.mBtntxtDanger]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn,styles.modalBtnPrimary]}
              onPress={
                () => { this.setModalVisible(!this.state.modalVisible); },
                ()=>this.rejectConfirmation()
              }>
              <Text style={[styles.mBtntxt,styles.mBtntxtPrimary]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    );
  }
  }

  renderItem = (data,index) => {
    return <TouchableOpacity 
    key={index} 
    style={styles.cardItem} 
    onPress={() => { 


      var str = API_URL+'getRequisitionListNonSalesById?req_hdr_id='+data.req_hdr_id;
    
if((data.scenario == "2" || data.scenario == "3") && data.req_type == "1"){
      return fetch(str,{
        method: "GET",
        mode: "no-cors",
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json'
        }
      })
      .then((response)=> response.text() )
      .then((res) => {
       var arr =  JSON.parse(res)
       if(arr.length != 0)
              data = arr[0];
     
      })
      .then(() => {   
        this.props.navigation.navigate('ReqInfo',data); 
        
        // alert("Justification Sucessfully Submitted");
      })
      .catch((Error) => {
        console.log(Error)
      });
    }else{
      this.props.navigation.navigate('ReqInfo',data); 
    }
     }}>
    <View style={styles.cardItemHeader}>
      {/*data.is_outof_policy=="Y" 
      && data.status_id!="9" 
      && data.sub_status_id!="9.1"
      && data.status_id!="10" 
      && data.sub_status_id!="10.1" 
      && data.status_id!="11"
      && data.sub_status_id!="11.2"
      && data.status_id!="25"*/(data.sub_status_id == '8.1' && data.pending_with == global.USER.personId)?
      <TouchableOpacity 
        onPress={() => {this.press(data)}}
        style={[data.check ?styles.checkedBox :styles.unCheckedBox, styles.checkBox]}
        >
        {data.check
        ? (<Icon name="md-checkmark" style={styles.checkIcon} />)
        : (<Icon name="md-square-outline" style={styles.uncheckIcon} />)
        }
      </TouchableOpacity >:null}
      {data.req_type=='1' ?
      <Icon style={styles.cardTileIcon} name="ios-airplane" />
      : data.req_type=='10' ?
      <Icon style={styles.cardTileIcon} name="ios-car" />
      : data.req_type=='11' ?
      <Icon style={styles.cardTileIcon} name="md-car" />
      : data.req_type=='3' ?
      <Ficon style={styles.cardTileIcon} name="subway" />
      : data.req_type=='1BH' ?
      <Ficon style={styles.cardTileIcon} name="hotel" />
      : data.req_type=='1BM' ?
      <Icon style={styles.cardTileIcon} name="ios-train" />
      : data.req_type=='1BNM' ?
      <Ficon style={styles.cardTileIcon} name="road" />
      : null
      }
      <Text style={styles.cardTile}>{this.setReqName(data.req_type)}</Text>
    </View>
    <View style={styles.cardBody}>
      {data.travel_from ?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>From:</Text>
        <Text style={styles.cardValue}>{data.travel_from}</Text>
      </View>:null}
      {data.travel_to ?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>To:</Text>
        <Text style={styles.cardValue}>{data.travel_to}</Text>
      </View>:null}
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Status:</Text>
        <Text style={styles.cardValue}>{this.emergencyStatus(data)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Through:</Text>
        <Text style={styles.cardValue}>{data.through}</Text>
      </View>
      {data.is_outof_policy=="Y"?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Out Of Policy:</Text>
        <Text style={styles.cardValue}>{data.is_outof_policy=="Y"?"Yes":"No"}</Text>
      </View>
      :null}
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Approx Amount:</Text>
        <Text style={styles.cardValue}>{this.formatAmountForDisplay(data.amount)}</Text>
      </View>
    </View>    
  </TouchableOpacity>
    };

};

const mapStateToProps = state => {
  return {
    reqName: state.reqName,
    plans: state.plans,
    aprvTripNonReq: state.aprvTripNonReq,
    aprvTripWithReq: state.aprvTripWithReq,
    aprvTripPend: state.aprvTripPend,
    sendEmailState: state.sendEmailState,
    //statusResult: state.statusResult,
  };
};

const mapDispatchToProps = {
  getReqName: Actions.getReqName,
  getPlans : Actions.getPlans,
  aprvTripNonReq: Actions.aprvTripNonReq,
  postAprvTripWithReq: Actions.postAprvTripWithReq,
  getApprovedTripPending: Actions.getApprovedTripPending,
  sendEmail: Actions.sendEmail,
  //getStatus: Actions.getStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleTripDetailsScreen);