import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, 
        AsyncStorage, BackHandler, Alert, Modal, Image, TouchableNativeFeedback, ActivityIndicator, Linking } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import PickerModal from 'react-native-picker-modal-view'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import { HeaderBackButton } from "react-navigation-stack"

import Loader from '../Components/Loader'
import styles from './Styles/AirRequisitionScreen';

class AirReqSalesClaimScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const handleClearPress = navigation.getParam("handleBackPress", () => {});
    return {
      title: "Air Requisition",
      headerLeft: <HeaderBackButton onPress={handleClearPress} />
    };
  };

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      isLoading: false,
      readOnly: params.update.sub_status_id == '7.3' ? true:false,
      ticketList: null,
      selectTicketData: null,
      acrdOneVisible: 0,
      acrdTwoVisible: 0,
      statusName: '',
      subStatusName: '',
      tcktClass: (params.update && params.update.ticket_class)?params.update.ticket_class:null,
      tcktClassError: null,
      tcktStatus: (params.update && params.update.ticket_status)?params.update.ticket_status:null,
      tcktStatusError: null,
      justification: (params.update && params.update.justification)?params.update.justification:null,
      justificationError: null,
      msg: (params.update && params.update.comment)?params.update.comment:null,

      uploading: false,
      uploadData: [],
      curUploadType: 'Approve Email',
      attachFiles: [],     
      flieSizeIssue: false,
      trmName: 'claim_airTravel_list',
      modalAttchVisible: 0,
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

    this.props.getTicketsSales(params.update.trip_no,params.update.lineitem,params.update.trip_hdr_id_fk)
    .then(()=>{
      if(this.props.ticketsSalesList.dataSource.length>0){
        this.setState({
          ticketList: this.props.ticketsSalesList.dataSource
        })
        for(var i=0; i<this.props.ticketsSalesList.dataSource.length; i++) {
          if(this.props.ticketsSalesList.dataSource[i].airline==params.update.flight) {
            this.setState({
              selectTicketData: this.props.ticketsSalesList.dataSource[i]
            });
          }
        }
      }
    })

    this.props.getRefernce(this.state.trmName)
    .then(()=>{
      this.setState({
        curUploadType: this.props.refernceList.dataSource[0].trm_value
      });
      for(var i=0; i<this.props.refernceList.dataSource.length; i++) {
        this.state.uploadData.push({"type":this.props.refernceList.dataSource[i].trm_value,
        "file":[],
        'action':null,
        'fileRequired':this.props.refernceList.dataSource[i].trm_mandatory})
      }
    })
    .then(()=>{
      this.props.getAttachmentsSales(params.params.trip_hdr_id,params.update.trip_no,params.update.lineitem)
      .then(()=>{
        for(var i=0; i<this.props.attachmentListSales.dataSource.length; i++) {
          for(var j=0; j<this.state.uploadData.length; j++) {
            if(this.props.attachmentListSales.dataSource[i].doc_type == this.state.uploadData[j].type) {
              this.state.uploadData[j].file.push({
                'size': null,
                'name': this.props.attachmentListSales.dataSource[i].file_name,
                'type': 'image/'+this.getExtention(this.props.attachmentListSales.dataSource[i].file_name),
                'uri': this.props.attachmentListSales.dataSource[i].file_path
              })
            }         
          }
        }
      })
      .then(()=>{
        this.setState({screenReady: true});
      })
    })

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
    const {params} = this.props.navigation.state;
    if ((params.update && params.update.sub_status_id == '11.1') ||
        (params.update && params.update.sub_status_id == '7.1') ||
        (params.update && params.update.sub_status_id == '7.3') ||
        (params.update && params.update.sub_status_id == '11.2') )
    {
      this.props.navigation.goBack();
    } else {
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
  }

  handleComment = (text) => {
    this.setState({ comments: text })
  }

  setAcrdOneVisible() {
    this.setState({
      acrdOneVisible: this.state.acrdOneVisible == 0?1:0
    });
  }

  setAcrdTwoVisible() {
    this.setState({
      acrdTwoVisible: this.state.acrdTwoVisible == 0?1:0
    });
  }

  handleClass = (text) => {
    this.setState({ 
      tcktClass: text,
      tcktClassError: null
    })
  }

  handleStatus = (text) => {
    this.setState({ 
      tcktStatus: text,
      tcktStatusError: null
    })
  }
  
  handleJustification = (text) => {
    this.setState({ 
      justification: text,
      justificationError: null
    })
  }

  handleMsg = (text) => {
    this.setState({ 
      msg: text,
    })
  }

  setColor(item){
    if(item.fileRequired == 'Y' && item.file.length == 0)
    return "red";
    else return "black";
  }

  onValueChangeUploadType = (value) => {
    this.setState({ curUploadType: value });
  }

  onValueChangeTicketStatus = (value) => {
    //alert('called')
    this.setState({
      tcktStatus:value,
      //alert(ticketStatus)
      tcktStatusError: null,
    });

    //alert(this.setState.ticketStatus)
  }

  onValueChangeTicketClass = (value) => {
    //alert('called')
    this.setState({
      tcktClass:value,
      //alert(ticketStatus)
      tcktClassError: null,
    });
  }

  setModalAttchVisible(visible) {
    this.setState({modalAttchVisible: visible});
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
      this.setState({modalAttchVisible: false});
    }
  }

  removeAttach(type,name) {
    for(var i = 0; i<this.state.uploadData.length; i++) {
      if(this.state.uploadData[i].type == type) {
        for(var j=0; j<this.state.uploadData[i].file.length; j++){
          if(this.state.uploadData[i].file[j].name == name) {
            this.state.uploadData[i].file.splice(j, 1);
            this.setState({ 
              refresh: true 
            })
          }
        }
      }
      for(var a=0; a<this.state.attachFiles.length; a++){
        if(this.state.attachFiles[a].name == name) {
          this.state.attachFiles.splice(a,1);
        }
      }
    }
  }
  
  async selectAttachFiles() {
    let results = null;    
    let flieSizeIssue = false;
    try {
      await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })
      .then(res =>{
        results = res;
      })
      .then(()=>{      
        if(results.size>3000000) {
          Alert.alert(
            "File Size issue",
            "You have selected a large file. Please choose a file less than 3MB.",
            [{text: "Ok", style: 'cancel',},],
            { cancelable: true }
          );
          flieSizeIssue= true ;
        }
        else { flieSizeIssue= false; }
      })
      .then(()=>{
        for(var u=0; u<this.state.uploadData.length; u++){
          for(var f=0; f<this.state.uploadData[u].file.length; f++){
            if(results.name == this.state.uploadData[u].file[f].name) {
              Alert.alert(
                "",
                "File "+results.name +" already exists",
                [{text: "Ok"}],
                { cancelable: true }
              );
              flieSizeIssue= true;
              break
            }
            else {flieSizeIssue= false}
          }
        }
      })
      .then(()=>{
        if(flieSizeIssue == false) {
          alert('File uploaded successfully.');     
          for(var i=0; i<this.state.uploadData.length; i++) {
            if(this.state.uploadData[i].type == this.state.curUploadType) {
              this.state.uploadData[i].file.push(results);
            }
          }
          this.state.attachFiles.push(results);
          this.setState({ 
            refresh: true 
          })
        }
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You have not selected any file for attachment');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  downloadImage = (file) => {
    Linking.canOpenURL(file).then(supported => {
      if (supported) {
        Linking.openURL(file);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }

  deleteAttachemnt = (name) => {
    const {params} = this.props.navigation.state;
    let existData = this.props.attachmentListSales.dataSource;
    AsyncStorage.getItem("ASYNC_STORAGE_DELETE_KEY")
    .then(()=>{
      this.setState({
        uploadData:  [],
        isLoading: true
      });
    })
    .then(()=>{
      for(var i=0; i<this.props.refernceList.dataSource.length; i++) {
        this.state.uploadData.push({"type":this.props.refernceList.dataSource[i].trm_value,
        "file":[],
        'action':null,
        'fileRequired':this.props.refernceList.dataSource[i].trm_mandatory})
      }
    })
    .then(()=>{
      for(var i=0; i<existData.length; i++) {
        if(existData[i].file_name == name) {
          this.props.attachmentDeleteSales(
            global.USER.personId,
            global.PASSWORD,
            {
              "id":existData[i].id,
	            "fileEntryId":existData[i].fileId
            }
          )          
        .then(()=>{
          this.props.getAttachmentsSales(params.params.trip_hdr_id,this.state.tripNo,params.update.lineitem)
          .then(()=>{
            for(var i=0; i<this.props.attachmentListSales.dataSource.length; i++) {
              for(var j=0; j<this.state.uploadData.length; j++) {
                if(this.props.attachmentListSales.dataSource[i].doc_type == this.state.uploadData[j].type) {
                  this.state.uploadData[j].file.push({
                    'size': null,
                    'name': this.props.attachmentListSales.dataSource[i].file_name,
                    'type': 'image/'+this.getExtention(this.props.attachmentListSales.dataSource[i].file_name),
                    'uri': this.props.attachmentListSales.dataSource[i].file_path
                  })
                }         
              }
            }
          })
          .then(()=>{
            this.setState({isLoading: false});
          })
        })
        }
      }
    })
  }
 
  getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }

  async atchFiles() {
    const {params} = this.props.navigation.state;
    this.setState({
      uploading: true,
    });
    for(var i=0; i<this.state.uploadData.length; i++){
      for(var f=0; f<this.state.uploadData[i].file.length; f++){
        for(var j=0; j<this.state.attachFiles.length; j++){
          if(this.state.uploadData[i].file[f].name == this.state.attachFiles[j].name){
            let fileBase64 = null;
            let filePath = this.state.uploadData[i].file[f].uri;
            let data = null;
            await RNFS.readFile(filePath, 'base64')
            .then(res =>{
              fileBase64 = res;
            })
            .then(()=>{
              data = {
                "repositoryId": global.USER.repositoryId,
                "folderId": global.USER.folderId,
                "mimeType": this.state.uploadData[i].file[f].type,
                "tripNo": params.params.trip_no,
                "lineItem": this.state.lineitem,
                "docType": this.state.uploadData[i].type,
                "userId": params.params.userid,
                "trip_hdr_id_fk": params.params.trip_hdr_id,
                "name": this.state.uploadData[i].file[f].name,
                "flow_type": 'ECR',
                "base64Str":fileBase64,
              }
            })
            .then(()=>{
              this.props.attachmentSales(global.USER.personId,global.PASSWORD,data)
            })
            .catch((err) => {
              console.log(err.message, err.code);
            })
          }
        }
      }
    }
  }

  submitReq = () => {
    const {params} = this.props.navigation.state;
    if(params.item.category_id == '7') {
      let shouldSubmit = true;
      AsyncStorage.getItem("ASYNC_STORAGE_SUBMIT_KEY")
      .then(()=>{
        for(var i=0; i<this.state.uploadData.length; i++) {
          if(this.state.uploadData[i].fileRequired == 'Y' && (this.state.uploadData[i].file.length<1)) {
            shouldSubmit = false;
            Alert.alert(
              "Required Attachment",
              "Please upload file for "+this.state.uploadData[i].type,
              [{ text: "Ok", style: 'cancel' }],
              { cancelable: true }
            );
            break;
          } else {
            shouldSubmit = true;
          }
        }
      })
      .then(()=>{
        if(shouldSubmit) {
          this.submitReqData()
        }
      })
    }
  }

  submitReqData = () => { 
    this.setState({
      isLoading: true
    });   
    const {params} = this.props.navigation.state;
    if ( !this.state.tcktClass || !this.state.tcktStatus || !this.state.justification ){      
      if(!this.state.tcktClass) {
        this.setState({
          tcktClassError: 'Please enter Ticket class'
        });
      }
      if(!this.state.tcktStatus) {
        this.setState({
          tcktStatusError: 'Please enter Ticket status.',
        });
      }
      if(!this.state.justification) {
        this.setState({
          justificationError: 'Please enter proper justification.',
        });
      }
    } else {      
      this.reqUpdate();
    }
  }

  reqUpdate = () => {
    const {params} = this.props.navigation.state;
    let newReq = params.update;
    let newPJP = params.params;
    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
    .then(()=>{
      newReq.ticket_class = this.state.tcktClass;
      newReq.ticket_status = this.state.tcktStatus;
      newReq.justification = this.state.justification;
      newReq.comment = this.state.msg;
      newReq.status_id = '20';
      newReq.status = this.state.statusName;
    })
    .then(()=>{
      newPJP.status_id = '20';
      newPJP.status = this.state.statusName;
      newPJP.sub_status_id = 'NA';
      newPJP.sub_status = this.state.subStatusName;
    })
    .then(()=>{
        this.props.updtReqSale([newReq])
        .then(()=>{
          this.props.postPjpClaimTot([newPJP])
          .then(()=>{
            this.atchFiles()
            .then(()=>{
              this.props.getReqSale(params.params.trip_hdr_id)
              .then(()=>{
                this.props.getPjpClaim(global.USER.userId,[9, 11, 19, 20, 21, 22, 23, 24, 25])
                .then(()=>{
                  this.setState({
                    isLoading: false,
                  });
                })
                .then(()=>{
                  this.props.navigation.goBack();
                  Toast.show('Requisition Saved Successfully', Toast.LONG);
                });
              })
            })
          })
        })
    });
  }

  render() {
    const {params} = this.props.navigation.state;
    console.log(this.state.selectTicketData)
    console.log(params.item.category_id);
    console.log(this.props.attachmentSalesState);
    if(this.state.isLoading ||
      this.props.ticketsSalesList.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.attachmentListSales.isLoading
      ){
      return(
        <View style={{flax:1, flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', backgroundColor:'#fff'}}>
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
          {(this.state.uploading && this.state.attachFiles.length > 0&&this.props.attachmentSalesState.dataSource=="File Already exists") ?
          <Text style={{marginTop: 30}}>File could not be uploaded:Filename Already exists</Text>:(this.state.uploading && this.state.attachFiles.length > 0)?<Text style={{marginTop: 30}}>Uploading Attachments</Text>
          :null}  
        </View>
      )
    } else if(
      this.props.ticketsSalesList.errorStatus ||
      this.props.statusResult.errorStatus ||
      this.props.attachmentListSales.errorStatus
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
      console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAcrdOneVisible()}}>
            <Text style={styles.acrdTitle}>Tour Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdOneVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:(this.state.acrdOneVisible==0)?'none':'flex'}}>
            {params.update.travel_date ?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.travel_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            {params.item.upper_limit ?
            <Item fixedLabel style={styles.formRow}>
              <Label style={[styles.formLabel,{flex:5}]}>Eligible Amount/Per Flight:</Label>              
              <Text style={[styles.formInput,styles.readOnly]}>{params.item.upper_limit}</Text>
            </Item>:null}
            {params.update.travel_time?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Suitable Time:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_time}</Text>
            </Item>:null}
            {params.update.travel_type?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Type:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_type}</Text>
            </Item>:null}
            {params.update.travel_from?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_from}</Text>
            </Item>:null}
            {params.update.travel_to?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_to}</Text>
            </Item>:null}
            {params.update.email?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Email:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.email}</Text>
            </Item>:null}
            {params.update.through?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Through:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.through}</Text>
            </Item>:null}
            {params.update.vendor_name ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>:null}
            {params.update.vendor_comment?<>
            <Label style={[styles.formLabel,{marginLeft:16, marginBottom:4}]}>Comments:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_comment}</Text>
            </>:null}
          </Form>
          
          <TouchableOpacity style={[styles.accordionHeader,styles.mt]}
            onPress={()=>{this.setAcrdTwoVisible()}}>
            <Text style={styles.acrdTitle}>Travel Agent Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdTwoVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:(this.state.acrdTwoVisible==0)?'none':'flex'}}>
            {params.update.invoice_date ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.gstin}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_CGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>SGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_SGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>IGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_IGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Processing Charges:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>&nbsp;</Text>
            </Item>
          </Form>
          
          {this.state.selectTicketData ?<>
          <View style={[styles.accordionHeader,styles.mt]}>
            <Text style={styles.acrdTitle}>Flight Informations</Text>
          </View>
          <Form style={{marginBottom:16}}>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Vendor:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor Invoice Amount:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.price}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Out of policy:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.type}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vender CGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_CGST_percent}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor SGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_SGST_percent}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor IGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_IGST_percent}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Number/PNR Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.ticket_number}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline_invoice_number}</Text>
            </Item>
            {this.state.selectTicketData.airline_invoice_date ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(this.state.selectTicketData.airline_invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Vendor:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline_vendor}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.gstin}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Class:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker 
                mode="dropdown"
                placeholder='Enter Ticket class' 
                selectedValue={this.state.tcktClass}
                style={styles.formInput}
                onValueChange={this.onValueChangeTicketClass}
                prompt="Select Ticket Class"
                //onChangeText={this.handleClass}
                 >
                   <Picker.Item label="Economy" value="Economy" />
                  <Picker.Item label="Business" value="Business" />
              </Picker>
            </Item>
            {this.state.tcktClassError &&
              <Text style={styles.errorText}>{this.state.tcktClassError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Status:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                //ref='tcktStatus'
               // onSubmitEditing={() => this.refs.justification.focus()}
                mode="dropdown"
                placeholder='Enter ticket status' 
                selectedValue={this.state.tcktStatus}
                onValueChange={this.onValueChangeTicketStatus}
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                //onChangeText={this.handleStatus} 
                >
                  <Picker.Item label="Select Ticket Status" value="Select Ticket status" />
                  <Picker.Item label="Availed" value="Availed" />
              </Picker>
            </Item>
            {this.state.tcktStatusError &&
              <Text style={styles.errorText}>{this.state.tcktStatusError}</Text>
            }
            <Label style={[styles.formLabel,styles.inputLabel]}>Justification:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='justification'
              placeholder='Enter your justification' 
              style={styles.textArea}
              numberOfLines={4}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.justification}
              onChangeText={this.handleJustification} />
            {this.state.justificationError &&
              <Text style={styles.errorText}>{this.state.justificationError}</Text>
            }
          </Form>
          
          <Text style={styles.flightTitle}>Flight Details</Text>
          <View style={styles.ticketItem}>
            <View style={[
              styles.ticketColumn,
              styles.ticketLeft,
              styles.selectedTicket,
              styles.selectedTicketLeft
              ]}>
              <View style={[styles.circle, styles.circleLeft]}></View>
              <Text style={styles.nameLabel}>Flight Name:</Text>
              <Text style={styles.flightName}>{this.state.selectTicketData.airline}</Text>
              <Text style={styles.ticketLabel}>Departure Time &amp; Place:</Text>
              <Text style={styles.ticketValue}>{this.state.selectTicketData.departure}</Text>
              <Text style={styles.ticketLabel}>Arival Time &amp; Place</Text>
              <Text style={styles.ticketValue}>{this.state.selectTicketData.arrival}</Text>
            </View>
            <View style={[
              styles.ticketColumn,
              styles.ticketRight,          
              styles.selectedTicket,
              styles.selectedTicketRight
              ]}>
              <View style={[styles.circle, styles.circleRight]}></View>
              <View style={styles.checkBox}>
                <Icon name='md-checkmark' style={styles.checkIcon} />
              </View>
              <Text style={styles.price}>{this.state.selectTicketData.price}</Text>
              <Text style={styles.currency}>{this.state.selectTicketData.currency}</Text>        
              <Text style={styles.oop}>Out of Policy:</Text>
              <Text style={styles.oopValue}>{this.state.selectTicketData.type}</Text>
            </View>
          </View>
          
          </>:null}

          <Text style={[styles.formLabel,styles.inputLabel]}>Comments:</Text>
          <TextInput 
            placeholder='Enter comments' 
            style={styles.textArea}
            underlineColorAndroid= "rgba(0,0,0,0)"
            value = {this.state.msg}
            returnKeyType="next"
            numberOfLines={4}
            onChangeText={this.handleMsg} />

          <View style={styles.attachRow}>
            <Text style={styles.formLabel}>Attachments:</Text>  
            {(params.update.sub_status_id != '7.1' && params.update.sub_status_id != '7.3') ?            
            <Button rounded bordered info onPress={() => { this.setModalAttchVisible(true); }} style={styles.atchBtn}>                
              <Icon name='attach' style={{fontSize:16, marginRight:0}} />
              <Text style={{fontSize:12,textAlign:'center'}}>
                Attach Documents
              </Text>
            </Button>:null}
          </View>
          {this.state.uploadData.map((item, key) => (
            (item.file.length>0) ?
            <View key={key}>
              <Text style={styles.attachType}>{item.type}</Text>
              {item.file.map((file, index)=>(
              <View style={styles.atchFileRow} key={index}>
                <Text style={styles.atchFileName} numberOfLines = {1}>{file.name ? file.name : ''}</Text>
                {(params.update && file.uri.includes('http')) &&
                <>
                {item.action == 'P' ?
                <ActivityIndicator size="small" color="#0066b3" />:              
                <Button bordered small rounded primary style={[styles.actionBtn, styles.actionBtnPrimary, item.action == 'C'?{borderColor:'green'}:null]}
                  onPress={() => {this.downloadImage(file.uri);}}
                  >
                  <Icon name='md-download' style={[styles.actionBtnIco,styles.actionBtnIcoPrimary]} />
                </Button>}
                </>}
                <Button bordered small rounded danger style={styles.actionBtn}
                  onPress={(file.uri.includes('http'))
                          ?()=>this.deleteAttachemnt(file.name)
                          :()=>this.removeAttach(item.type,file.name)
                        }
                  >
                  <Icon name={file.uri.includes('http')?'trash':'close'} style={styles.actionBtnIco} />
                </Button>
              </View>
              ))}
            </View>:null
          ))}

          {(params.update.sub_status_id != '7.1' && params.update.sub_status_id != '7.3') ?
          <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save Requisition</Text>
            </LinearGradient>
          </TouchableOpacity>
          :null}

        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalAttchVisible}
          onRequestClose={() => {this.setModalAttchVisible(false)}}>
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
                  <Picker.Item label={item.type} value={item.type} key={index} color={this.setColor(item)} />
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
              <View key={key}>
              {item.file.map((file, index)=>(
                <View key={index} style={[styles.atchFileRow,{minHeight:32}]}>
                  <Text style={styles.atchFileName} numberOfLines = {1}>{file.name ? file.name : ''}</Text>
                  {(!file.uri.includes('http')) ?
                  <Button bordered small rounded danger style={styles.actionBtn}
                    onPress={()=>this.removeAttach(item.type,file.name)}>
                    <Icon name='close' style={styles.actionBtnIco} />
                  </Button>
                  :null
                  }
                </View>
              ))}
              </View>
              :null
            ))}
          </ScrollView>
          <View style={styles.atchMdlFtr}>
            <TouchableOpacity 
              onPress={() => {this.setModalAttchVisible(!this.state.modalAttchVisible);}} 
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

  selectTicket=(data)=>{
    this.setState({ 
      selectTicketData: data,
      amount: data.price,
      OOP: data.type == 'YES'?'Y':'N'
    })
    console.log(this.state.selectTicketData);
    console.log(this.state.OOP);
  }
}

const mapStateToProps = state => {
  return {
    updtReqSaleState: state.updtReqSaleState,
    statusResult: state.statusResult,
    reqListSales: state.reqListSales,
    generateExpState: state.generateExpState,
    ticketsSalesList: state.ticketsSalesList,
    pjpClaimTot: state.pjpClaimTot,
    pjpClaims: state.pjpClaims,
    attachmentSalesState: state.attachmentSalesState,
    attachmentListSales: state.attachmentListSales,
    attachmentDeleteSalesState: state.attachmentDeleteSalesState,
    refernceList: state.refernceList
  };
};

const mapDispatchToProps = {
  updtReqSale: Actions.updtReqSale,
  getStatus: Actions.getStatus,
  getReqSale : Actions.getReqSale,
  generateExp: Actions.generateExp,
  getTicketsSales: Actions.getTicketsSales,
  postPjpClaimTot: Actions.postPjpClaimTot,
  getPjpClaim : Actions.getPjpClaim,
  attachmentSales: Actions.attachmentSales,
  getAttachmentsSales: Actions.getAttachmentsSales,
  attachmentDeleteSales: Actions.attachmentDeleteSales,
  getRefernce: Actions.getRefernce
};

export default connect(mapStateToProps, mapDispatchToProps)(AirReqSalesClaimScreen);