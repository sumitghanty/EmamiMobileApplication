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

const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class AirReqSalesScreen extends Component {

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
      readOnly: (params.update.sub_status_id == '7.3' || params.update.sub_status_id == '9.1' || 
      params.update.sub_status_id == '8.1') ? true:false,
      ticketList: null,
      selectTicketData: null,
      acrdOneVisible: params.update.sub_status_id =='7.1'?1:0,
      acrdTwoVisible: 0,
      acrdThreeVisible: 0,
      sendVenderData: [],
      tcktNo: (params.update && params.update.ticket_number) ? params.update.ticket_number : null,
      tcktNoError:null,      
      refresh: false,
      statusNameOP: '',
      subStatusNameOP: '',
      statusName: '',
      subStatusName: '',      
      statusClaimName: '',
      isLoading: false,
      modalVisible: false,

      uploading: false,
      uploadData: [],
      curUploadType: 'Approve Email',
      attachFiles: [],     
      flieSizeIssue: false,
      trmName: 'ptf_airTravel_list',
      modalAttchVisible: 0,
    };
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    console.log(params)

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

  setAcrdThreeVisible() {
    this.setState({
      acrdThreeVisible: this.state.acrdThreeVisible == 0?1:0
    });
  }

  onValueChangeUploadType = (value) => {
    this.setState({ curUploadType: value });
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
                "flow_type": 'PT',
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
    if(this.props.ticketsSalesList.dataSource.length>0 && !this.state.selectTicketData && 
      (params.update.sub_status_id == '7.2' || params.update.sub_status_id == '7.4')) {
      Alert.alert(
        "Warning",
        "Please select an option for Ticket",
        [
          {
            text: "Ok",
            style: 'cancel',
          }
        ],
        { cancelable: false }
      );
      this.setState({
        isLoading: false
      });
    }
    else {      
      this.reqUpdate();
    }
  }

  reqUpdate = () => {
    const {params} = this.props.navigation.state;
    let newReq = params.update;
    let newPJP = params.params;
    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
    .then(()=>{
      newReq.flight_selected = 'Y';
      newReq.flight = this.state.selectTicketData.airline;
      newReq.flight_type = this.state.selectTicketData.type;
      newReq.vendor_comment = this.state.selectTicketData.comment;
      newReq.is_outof_policy = this.state.selectTicketData.type == 'NO'?'N':'Y';
      newReq.status_id = 7;
      newReq.sub_status_id = this.state.selectTicketData.type == 'NO'?'7.4':"7.5";
      newReq.status = this.state.selectTicketData.type == 'NO'?this.state.statusName:this.state.statusNameOP;
      newReq.sub_status = this.state.selectTicketData.type == 'NO'?this.state.subStatusName:this.state.subStatusNameOP;
      newReq.amount_mode = this.state.selectTicketData.price
    })
    .then(()=>{
      if((newReq.sub_status_id == '7.2' || newReq.sub_status_id == '7.4') && this.props.ticketsSalesList.dataSource.length>0 && this.state.selectTicketData){
        let sendVendData = this.props.ticketsSalesList.dataSource;
        for(var i=0; i<sendVendData.length; i++) {
          if(sendVendData[i].id == this.state.selectTicketData.id) {
            sendVendData[i].flight_selected = 'Y';
          } else {
            sendVendData[i].flight_selected = null;
          }
          this.state.sendVenderData.push(sendVendData[i]);
        }
      } else {
        console.log('Not send to Vendor');
      }
    })
    .then(()=>{
      if((newReq.sub_status_id == '7.2' || newReq.sub_status_id == '7.4') && this.props.ticketsSalesList.dataSource.length>0 
      && this.state.selectTicketData && this.state.sendVenderData.length>0){
        this.props.updateVndAirResSales(this.state.sendVenderData)
        .then(()=>{
          this.props.updtReqSale([newReq])
          .then(()=>{
            this.atchFiles()
            /*.then(()=>{
            newPJP.status_id = 7;
            newPJP.sub_status_id = "7.3";
            newPJP.status = this.state.statusName;
            newPJP.sub_status = this.state.subStatusName;
            })*/
            .then(()=>{
              this.props.pjpTotal([newPJP])
              .then(()=>{
                this.props.getReqSale(params.params.trip_hdr_id)
                .then(()=>{
                  this.props.getPjp(global.USER.userId)
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
        })
      } else {
        this.props.updtReqSale([newReq])
        .then(()=>{
          this.atchFiles()
          .then(()=>{
            this.props.pjpTotal([newPJP])
            .then(()=>{
              this.props.getReqSale(params.params.trip_hdr_id)
              .then(()=>{
                this.props.getPjp(global.USER.userId)
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
      }
    });
  }

  render() {
    const {params} = this.props.navigation.state;    
    if(this.state.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.attachmentListSales.isLoading
      ){
      console.log(this.props.attachmentSalesState);
      return(
        <View style={{flax:1, flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', backgroundColor:'#fff'}}>
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
          {(this.state.uploading && this.state.attachFiles.length > 0&&this.props.attachmentSalesState.dataSource=="File Already exists") ?
          <Text style={{marginTop: 30}}>File could not be uploaded:Filename Already exists</Text>:(this.state.uploading && this.state.attachFiles.length > 0)?<Text style={{marginTop: 30}}>Uploading Attachments</Text>
          :null}         
        </View>
      )
    } else if(
      this.props.statusResult.errorStatus ||
      this.props.attachmentListSales.errorStatus
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
      console.log(params);
      console.log(this.state.readOnly?'Y':'N')
      console.log(this.state.ticketList);
      console.log(this.state.selectTicketData);
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
          
          {(params.update.sub_status_id == '11' && this.state.ticketList) ? <>
          <View style={[styles.accordionHeader,styles.mt]}>
            <Text style={styles.acrdTitle}>Flight Informations</Text>
          </View>
          <Form style={{marginBottom:16}}>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Name:</Label>
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
              <Label style={styles.formLabel}>VendorIGST:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(this.state.selectTicketData.airline_invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Vendor:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline_vendor}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.gstin}</Text>
            </Item>
          </Form>
          </>:null}


          {(!this.state.readOnly && this.state.ticketList) ? <>
          <Text style={styles.flightTitle}>Flight Details</Text>
          {(params.update.sub_status_id =='7.2')?
            <Text style={styles.flightSubTitle}>Please select an Option<Text style={{color:'red',fontSize:13}}>*</Text></Text>
          :null}
          {this.state.ticketList.map((item, index) => {
            return (
            ( (params.update.sub_status_id == '11.1' || params.update.sub_status_id == '7.3' || 
              params.update.sub_status_id == '11.2') && this.state.selectTicketData) ?
              <View key={index} style={styles.ticketItemWraper}>
                {this._ticketItem(item, params.update)}
              </View>
            : <TouchableOpacity 
                onPress={()=>{this.selectTicket(item)}} 
                key={index}
                style={styles.ticketItemWraper}>
                {this._ticketItem(item, params.update)}
              </TouchableOpacity>
          )
          })}
          </>:null}

          {(this.state.readOnly && this.state.ticketList && this.state.selectTicketData) ? <>
          <Text style={styles.flightTitle}>Flight Details</Text>
          {this.state.ticketList.map((item, index) => {
            return (
              <View key={index} style={[
                styles.ticketItemWraper,
                {display:((this.state.selectTicketData.id != item.id) && (params.update.sub_status_id == '11.1' || params.update.sub_status_id == '11.2')) ?'none':'flex'}
              ]}>
                {this._ticketItem(item, params.update)}
              </View>
          )
          })}
          </>:null}

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

  _ticketItem = (data, params) => {
    return(
    <View style={styles.ticketItem}>
      <View style={[
        styles.ticketColumn,
        styles.ticketLeft,
        (data.type == 'YES') && styles.dangerTicket,
        (data.type == 'YES') && styles.dangerTicketLeft,
        (this.state.selectTicketData && this.state.selectTicketData.id == data.id) && styles.selectedTicket,
        (this.state.selectTicketData && this.state.selectTicketData.id == data.id) && styles.selectedTicketLeft
        ]}>
        <View style={[styles.circle, styles.circleLeft]}></View>
        <Text style={styles.nameLabel}>Flight Name:</Text>
        <Text style={styles.flightName}>{data.airline}</Text>
        <Text style={styles.ticketLabel}>Departure Time &amp; Place:</Text>
        <Text style={styles.ticketValue}>{data.departure}</Text>
        <Text style={styles.ticketLabel}>Arival Time &amp; Place</Text>
        <Text style={styles.ticketValue}>{data.arrival}</Text>
      </View>
      <View style={[
        styles.ticketColumn,
        styles.ticketRight,          
        (data.type == 'YES') && styles.dangerTicket,
        (data.type == 'YES') && styles.dangerTicketRight,
        (this.state.selectTicketData && this.state.selectTicketData.id == data.id) && styles.selectedTicket,
        (this.state.selectTicketData && this.state.selectTicketData.id == data.id) && styles.selectedTicketRight
        ]}>
        <View style={[styles.circle, styles.circleRight]}></View>
        <View style={styles.checkBox}>
          {this.state.selectTicketData && this.state.selectTicketData.id == data.id &&
          <Icon name='md-checkmark' style={styles.checkIcon} />
          }
        </View>
        <Text style={styles.price}>{data.price}</Text>
        <Text style={styles.currency}>{data.currency}</Text>        
        <Text style={styles.oop}>Out of Policy:</Text>
        <Text style={styles.oopValue}>{data.type}</Text>
      </View>
    </View>
    )
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
    ticketsSalesList: state.ticketsSalesList,
    updateVndAirResSalesState: state.updateVndAirResSalesState,
    attachmentState: state.attachmentState,
    pjpTotalState: state.pjpTotalState,
    reqListSales: state.reqListSales,
    pjp : state.pjp,
    attachmentSalesState: state.attachmentSalesState,
    attachmentListSales: state.attachmentListSales,
    attachmentDeleteSalesState: state.attachmentDeleteSalesState,
    refernceList: state.refernceList,
    sendEmailSalesState: state.sendEmailSalesState,
  };
};

const mapDispatchToProps = {
  updtReqSale: Actions.updtReqSale,
  getStatus: Actions.getStatus,
  getTicketsSales: Actions.getTicketsSales,
  updateVndAirResSales: Actions.updateVndAirResSales,
  pjpTotal: Actions.pjpTotal,
  getReqSale : Actions.getReqSale,
  getPjp : Actions.getPjp,
  attachmentSales: Actions.attachmentSales,
  getAttachmentsSales: Actions.getAttachmentsSales,
  attachmentDeleteSales: Actions.attachmentDeleteSales,
  getRefernce: Actions.getRefernce,
  sendEmailSales: Actions.sendEmailSales
};

export default connect(mapStateToProps, mapDispatchToProps)(AirReqSalesScreen);