import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, 
        AsyncStorage, BackHandler, Alert, Modal, Image, TouchableNativeFeedback, ActivityIndicator } from "react-native";
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

import Loader from '../Components/Loader'
import styles from './Styles/AirRequisitionScreen';

const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class AirReqSalesScreen extends Component {

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      readOnly: params.update.sub_status_id == '7.3' ? true:false,
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
      
      attachFiles: [],
      isLoading: false,
      modalVisible: false,
      uploadData: [{"type":"Approve Email","file":null,'action':null},{"type":"E-Ticket","file":null,'action':null},{"type":"Other","file":null,'action':null}],
      curUploadType: 'Approve Email',      
      flieSizeIssue: false,
    };
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;

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
          if(this.props.ticketsSalesList.dataSource[i].flight_selected=='Y') {
            this.setState({
              selectTicketData: this.props.ticketsSalesList.dataSource[i]
            });
          }
        }
      }
    })

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

    if(params.claim){
      this.props.getStatus("20","NA")
      .then(()=>{
        this.setState({
          statusClaimName: this.props.statusResult.dataSource[0].trip_pjp_status,
        });
      });
    }

  }

  handleComment = (text) => {
    this.setState({ comments: text })
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
          "flow_type": params.claim?'ECR':'PT',
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

  setAcrdThreeVisible() {
    this.setState({
      acrdThreeVisible: this.state.acrdThreeVisible == 0?1:0
    });
  }

  submitReq = () => {    
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
    }
    if (!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location" ||
        !this.state.toItem.Name || this.state.toItem.Name == "Select To Location" ||
        (this.state.emailError) || (this.state.through=="Self" && !this.state.amount) ||
        (this.state.readOnly && this.state.ticketList && !this.state.selectTicketData) ||
        (this.props.ticketsSalesList.dataSource.length>0 && !this.state.selectTicketData && 
          (params.update.sub_status_id == '7.2' || params.update.sub_status_id == '7.4')) ||
        (params.claim && !this.state.flightVendor.Name) || (params.claim && this.state.flightVendor.Name == "Select Vendor") ||
        (params.claim && !this.state.invoiceAmnt) || (params.claim && !this.state.tcktNo) ||
        (params.claim && !this.state.cgst) || (params.claim && !this.state.sgst) ||
        (params.claim && !this.state.igst) || (params.claim && !this.state.hsncode) ||
        (params.claim && !this.state.invNumber)
    ){
      if(!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location") {
        this.setState({
          tripFromError: 'Please select travel From'
        });
      }
      if(!this.state.toItem.Name || this.state.toItem.Name == "Select To Location") {
        this.setState({
          tripToError: 'Please select travel To'
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
      if (this.state.readOnly && this.state.ticketList && !this.state.selectTicketData) {
        Alert.alert(
          "Please Select one Ticket",
          [
            {
              text: "Ok",
              style: 'cancel',
            }
          ],
          { cancelable: true }
        );
      }
      
      if((params.claim && !this.state.flightVendor.Name) || (params.claim && this.state.flightVendor.Name == "Select Vendor")) {
        this.setState({
          flightVendorError: 'Please select a vendor'
        });
      }
      if(params.claim && !this.state.invoiceAmnt) {
        this.setState({
          invoiceAmntError: 'Please enter invoice amount.',
        });
      }
      if(params.claim && !this.state.tcktNo) {
        this.setState({
          tcktNoError: 'Please enter Ticket Number.',
        });
      }
      if(params.claim && !this.state.cgst) {
        this.setState({
          cgstError: 'Please enter CGST.',
        });
      }
      if(params.claim && !this.state.sgst) {
        this.setState({
          sgstError: 'Please enter SGST.',
        });
      }
      if(params.claim && !this.state.igst) {
        this.setState({
          igstError: 'Please enter IGST.',
        });
      }
      if(params.claim && !this.state.hsncode) {
        this.setState({
          hsncodeError: 'Please enter HSN code.',
        });
      }
      if(params.claim && !this.state.invNumber) {
        this.setState({
          invNumberError: 'Please enter invoice number.',
        });
      }
    } else {      
      this.reqUpdate();
    }
  }

  reqUpdate = () => {
    const {params} = this.props.navigation.state;
    let newReq = params.update;
    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
    .then(()=>{
      newReq.flight_selected = 'Y';
      newReq.flight = this.state.selectTicketData.airline;
      newReq.flight_type = this.state.selectTicketData.type;
      newReq.vendor_comment = this.state.selectTicketData.comment;
    })
    .then(()=>{
      if(newReq.sub_status_id == '7.4' && this.props.ticketsSalesList.dataSource.length>0 && this.state.selectTicketData){
        let sendVendData = this.props.ticketsSalesList.dataSource;
        for(var i=0; i<sendVendData.length; i++) {
          if(sendVendData[i].id == this.state.selectTicketData.id) {
            sendVendData[i].flight_selected = 'Y';
          } else {
            sendVendData[i].flight_selected = '';
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
        this.props.updateVndAirRes(this.state.sendVenderData)
        .then(()=>{
          this.props.reqUpdate([newReq])
          .then(()=>{
            this.atchFiles();
          })
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
        })
      } else {
        this.props.reqUpdate([newReq])
        .then(()=>{
          this.atchFiles();
        })
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
      }
    });
  }

  render() {
    const {params} = this.props.navigation.state;

    if(this.state.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.attachmentList.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(
      this.props.statusResult.errorStatus ||
      this.props.attachmentList.errorStatus
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
          
          {this.state.selectTicketData ? <>
          <TouchableOpacity style={[styles.accordionHeader,styles.mt]}
            onPress={()=>{this.setAcrdThreeVisible()}}>
            <Text style={styles.acrdTitle}>Flight Informations</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdThreeVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:this.state.acrdThreeVisible==0?'none':'flex'}}>
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
              <Label style={styles.formLabel}>Ticket Number:</Label>
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


          {(this.state.ticketList && this.state.ticketList.length>0) ? <>
          <Text style={styles.flightTitle}>Flight Details</Text>
          {(params.update.sub_status_id =='7.2')?
            <Text style={styles.flightSubTitle}>Please select an Option<Text style={{color:'red',fontSize:13}}>*</Text></Text>
          :null}
          {this.state.ticketList.map((item, index) => {
            return (
            (params.sub_status_id == '11.1' || params.sub_status_id == '7.3' || params.sub_status_id == '11.2') ?
              <View key={index} style={styles.ticketItemWraper}>
                {this._ticketItem(item, params.update)}
              </View>
            : Platform.OS === 'Android' ?
              <TouchableNativeFeedback
                useForeground={true}
                onPress={()=>{this.selectTicket(data)}} 
                key={index}
                style={styles.ticketItemWraper}>
                {this._ticketItem(item, params.update)}
              </TouchableNativeFeedback>
            :
              <TouchableOpacity 
                onPress={()=>{this.selectTicket(data)}} 
                key={index}
                style={styles.ticketItemWraper}>
                {this._ticketItem(item, params.update)}
              </TouchableOpacity>
          )
          })}
          </>:null}

          <TouchableOpacity /*onPress={() => this.submitReq()} style={styles.ftrBtn}*/>
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
      
      </KeyboardAvoidingView>
    );
    }
  }

  _ticketItem = (data, params) => {
    return
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
    reqCreateState: state.reqCreateState,
    reqUpdateState: state.reqUpdateState,
    plans: state.plans,
    statusResult: state.statusResult,
    ticketsSalesList: state.ticketsSalesList,
    updateVndAirResState: state.updateVndAirResState,
    attachmentState: state.attachmentState,
    attachmentList: state.attachmentList
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
  getStatus: Actions.getStatus,
  getTicketsSales: Actions.getTicketsSales,
  updateVndAirRes: Actions.updateVndAirRes,
  attachment: Actions.attachment,
  getAttachments: Actions.getAttachments
};

export default connect(mapStateToProps, mapDispatchToProps)(AirReqSalesScreen);