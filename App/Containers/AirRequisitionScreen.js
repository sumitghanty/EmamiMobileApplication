import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, 
        AsyncStorage, BackHandler, Alert, Modal, Image, TouchableNativeFeedback, ActivityIndicator } from "react-native";
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
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import Loader from '../Components/Loader'
import styles from './Styles/AirRequisitionScreen';

const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class AirRequisitionScreen extends Component {
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
      agent: (params.update && params.update.vendor_name) ? params.update.vendor_name : "",
      vendorId: (params.update && params.update.va_ta_id) ? params.update.va_ta_id :"0",
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
      time: (params.update && params.update.travel_time) ? params.update.travel_time : SUIT_TIME[0],
      email: (params.update && params.update.email) ? params.update.email : null,
      emailError: false,
      amount: (params.update && params.update.amount) ? params.update.amount :null,
      amntError: null,
      maxAmt: params.item.upper_limit == "On Actual" ? "5000000"
              : params.item.upper_limit != "NA" ? params.item.upper_limit
              : '0.0',
      OOP: 'N',
      type: (params.update && params.update.travel_type) ? params.update.travel_type : '',
      mode: 'date',
      show: false,
      attachFiles: [],
      isLoading: false,
      modalVisible: false,
      uploadData: [{"type":"Approve Email","file":null,'action':null},{"type":"E-Ticket","file":null,'action':null},{"type":"Other","file":null,'action':null}],
      curUploadType: 'Approve Email',      
      flieSizeIssue: false,
      comments: (params.update && params.update.justification) ? params.update.justification :null,
      flight: (params.update && params.update.flight) ? params.update.flight :null,
      readOnly: (params.update && (params.update.sub_status_id == '7.2' || 
                  params.update.sub_status_id == '7.3' ||
                  params.update.sub_status_id == '11.1')) ? true:false,
      ticketList: null,
      selectTicketData: null,
      acrdOneVisible: params.update.sub_status_id =='7.1'?1:0,
      acrdTwoVisible: 0,
      acrdThreeVisible: 0,
      sendVenderData: [],

      tcktNo: (params.update && params.update.ticket_number) ? params.update.ticket_number : null,
      tcktNoError:null,
      invNumber: (params.update && params.update.invoice_no) ? params.update.invoice_no :null,
      invNumberError:null,
      invoiceAmnt: (params.update && params.update.invoice_amount) ? params.update.invoice_amount :null,
      invoiceAmntError: null,
      dateInv: (params.update && params.update.invoice_date) ? params.update.invoice_date :new Date(),
      cgst: (params.update && params.update.vendor_CGST) ? params.update.vendor_CGST :null,
      cgstError:null,
      sgst: (params.update && params.update.vendor_SGST) ? params.update.vendor_SGST :null,
      sgstError:null,
      igst: (params.update && params.update.vendor_IGST) ? params.update.vendor_IGST :null,
      igstError:null,
      hsncode: (params.update && params.update.v_hsn_code) ? params.update.v_hsn_code :null,
      hsncodeError:null,
      showInv: false,
      authority: null,
      gstin: null,
      statusClaimName: '',
      flightVendorList: [],
      flightVendor: {"Name": (params.update && params.update.issuing_authorityName) ? params.update.issuing_authorityName : "Select Vendor", 
                "Value": (params.update && params.update.gstin) ? params.update.gstin : "", 
                "Code": "", 
                "Id":0,},
      flightVendorError: '',
      lineitem: (params.update && params.update.lineitem)?params.update.lineitem:null,
      tripNo: params.params.trip_no,
      refresh: false,
      screenReady: params.update ? false : true,
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
        through: (params.update && params.update.through) 
                  ? params.update.through 
                  :this.props.travelThroughState.dataSource.length>0
                    ?this.props.travelThroughState.dataSource[0].travel_through_type:''
      });
    })

    this.props.getVendor("Travel Agent")
    .then(()=>{
      this.setState({
        agent: (params.update && params.update.vendor_name) 
                  ? params.update.vendor_name 
                  :this.props.vendorList.dataSource.length>0
                    ?this.props.vendorList.dataSource[0].vendor_name
                  :'',
        vendorId: (params.update && params.update.va_ta_id) 
                  ? params.update.va_ta_id 
                  :this.props.vendorList.dataSource.length>0
                    ?this.props.vendorList.dataSource[0].vendor_id
                  :''
      });
    })

    this.props.getTravelType()
    .then(()=>{
      this.setState({
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

    if(params.update) {
      this.setState({
        isLoading: true
      })
      this.props.getTickets(params.update.trip_no,params.update.lineitem,params.update.trip_hdr_id_fk)
      .then(()=>{
        if(this.props.ticketsList.dataSource.length>0){
          this.setState({
            ticketList: this.props.ticketsList.dataSource
          })
          for(var i=0; i<this.props.ticketsList.dataSource.length; i++) {
            if(this.props.ticketsList.dataSource[i].flight_selected=='Y') {
              this.setState({
                selectTicketData: this.props.ticketsList.dataSource[i]
              });
            }
          }
        }
      })
      .then(()=>{
        this.setState({
          isLoading: false
        })
      });
    }

    this.props.navigation.setParams({
      handleBackPress: this._handleBackPress.bind(this)
    });

    if(params.claim){
      this.props.getStatus("20","NA")
      .then(()=>{
        this.setState({
          statusClaimName: this.props.statusResult.dataSource[0].trip_pjp_status,
        });
      });
      
      this.props.getHotels(params.item.sub_category)
      .then(()=>{
        for(var i=0; i<this.props.hotelList.dataSource.length; i++) {
          this.state.flightVendorList.push({
            "Name": this.props.hotelList.dataSource[i].vendor_name,
            "Value": this.props.hotelList.dataSource[i].gstin,
            "Code": this.props.hotelList.dataSource[i].vendor_city,
            "Id": this.props.hotelList.dataSource[i].vendor_id,
          },)
        }
      });
    }

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
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onValueChangeUploadType = (value) => {
    this.setState({ curUploadType: value });
  }

  handleComment = (text) => {
    this.setState({ comments: text })
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

  onValueChangeType = (value) => {
    this.setState({
      type: value
    });
  }

  onValueChangeThrough = (value) => {
    this.setState({
      through: value,
      flight: value == "Travel Agent" ? "flight": null
    });
  }

  onValueChangeAgent = (value) => {
    this.setState({
      agent: value
    });
    for (var i=0; i<this.props.vendorList.dataSource.length; i++) {
      if(this.props.vendorList.dataSource[i].vendor_name == value) {
        this.setState({
          vendorId: this.props.vendorList.dataSource[i].vendor_id
        });
      }
    }
  }

  handleChangeAmount = (amnt) => {
    const {params} = this.props.navigation.state;
    this.setState({ 
      amount: amnt,
      amntError: null,
      OOP: (((params.item.upper_limit == "NA") && amnt > this.state.maxAmt) || amnt > this.state.maxAmt) ?'Y':'N'
    })
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

  handleInvoiceAmnt = (amnt) => {
    this.setState({ 
      invoiceAmnt: amnt,
      invoiceAmntError:null
    })
  }

  handleCgst = (amnt) => {
    this.setState({ 
      cgst: amnt,
      cgstError:null
    })
  }

  handleSgst = (amnt) => {
    this.setState({ 
      sgst: amnt,
      sgstError:null
    })
  }

  handleIgst = (amnt) => {
    this.setState({ 
      igst: amnt,
      igstError:null
    })
  }

  handleHsnCode = (text) => {
    this.setState({ 
      hsncode: text,
      hsncodeError:null
    })
  }

  handleInvoiceNumber = (text) => {
    this.setState({ 
      invNumber: text,
      invNumberError:null
    })
  }

  handleTicketNo = (text) => {
    this.setState({ 
      tcktNo: text,
      tcktNoError: null
    })
  }

  datepickerInv = () => {
    this.showInvDate('date');
  }

  showInvDate = mode => {
    this.setState({
      showInv: true,
      mode,
    });
  }

  setDateInv = (event, dateInv) => {
    dateInv = dateInv || this.state.dateInv; 
    this.setState({
      showInv: Platform.OS === 'ios' ? true : false,
      dateInv,
    });
  }

  fvSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_FROM_KEY")
    .then(() => {
      this.setState({
        flightVendor: value,
        flightVendorError: '',
      })
    })
  }

  submitReq = () => {    
    const {params} = this.props.navigation.state;
    if (!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location" ||
        !this.state.toItem.Name || this.state.toItem.Name == "Select To Location" ||
        (this.state.emailError) || (this.state.through=="Self" && !this.state.amount) ||
        (this.state.readOnly && this.state.ticketList && !this.state.selectTicketData) ||
        (this.props.ticketsList.dataSource.length>0 && !this.state.selectTicketData && 
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
      if(this.props.ticketsList.dataSource.length>0 && !this.state.selectTicketData && 
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
      this.setState({
        isLoading: true,
      });
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
      this.setState({
        lineitem: this.props.plans.dataSource.length + 1,
      });
    })
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
        "lineitem": this.state.lineitem,
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
        "travel_type": this.state.type,
        "travel_from": this.state.fromItem.Name,
        "travel_to": this.state.toItem.Name,
        "email": this.state.email,
        "vendor_name": this.state.through == "Travel Agent"? 
                        this.props.vendorList.dataSource.length>0 ? this.state.agent:'Not Defined'
                        :null,
        "va_ta_id": this.state.through == "Travel Agent"? 
                        this.props.vendorList.dataSource.length>0 ? this.state.vendorId:'0'
                        :null,
        "status_id": "7",
        "sub_status_id": this.state.OOP=="Y"?"7.5":"7.4",
        "status": this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName,
        "sub_status": this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName,        
        "is_outof_policy": this.state.OOP,
        "justification": this.state.comments,
      }])
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
      newReq.travel_type = this.state.type;
      newReq.travel_from = this.state.fromItem.Name;
      newReq.travel_to = this.state.toItem.Name;
      newReq.email = this.state.email;
      newReq.vendor_name = this.state.through == "Travel Agent"? 
                          this.props.vendorList.dataSource.length>0 ? this.state.agent:'Not Defined'
                          :null;                            
      newReq.va_ta_id = this.state.through == "Travel Agent"? 
                        this.props.vendorList.dataSource.length>0 ? this.state.vendorId:'0'
                        :null;
      
      newReq.status_id = params.claim?'20':"7";
      newReq.is_outof_policy = this.state.OOP;
      newReq.is_billRequired = params.item.bill_required;
      newReq.justification = this.state.comments;
      newReq.extra_amount = (params.claim && params.item.upper_limit == "On Actual" && parseFloat(this.state.amount)>5000000)? 
                      parseFloat( parseFloat(this.state.amount)-5000000):null

      if(params.claim) {
        newReq.sub_status_id = 'NA';
        newReq.status = this.state.statusClaimName;
        newReq.sub_status = 'NA';
        newReq.gstin = this.state.flightVendor.Code;
        newReq.ticket_number = this.state.tcktNo;
        newReq.invoice_no = this.state.invNumber;
        newReq.invoice_date = moment(this.state.dateInv).format("YYYY-MM-DD");
        newReq.issuing_authorityName = this.state.flightVendor.Name;
        newReq.invoice_amount = this.state.invoiceAmnt;
        newReq.vendor_CGST = this.state.cgst;
        newReq.vendor_SGST = this.state.sgst;
        newReq.vendor_IGST = this.state.igst;
        newReq.v_hsn_code = this.state.hsncode;
        newReq.v_hsn_code = this.state.hsncode;
      } else {
        if(!this.state.selectTicketData) {
          newReq.sub_status_id = this.state.OOP=="Y"?"7.5":"7.4";
          newReq.status = this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName;
          newReq.sub_status = this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName;
        } else {
          newReq.flight = this.state.selectTicketData.airline;
          newReq.flight_type = this.state.selectTicketData.type;
          newReq.vendor_comment = this.state.selectTicketData.comment;
          newReq.flight_selected = 'Y';
          newReq.gstin = this.state.selectTicketData.gstin;
          newReq.vendor_pan = this.state.selectTicketData.vendor_pan;
          newReq.gst_vendor_classification = this.state.selectTicketData.gst_vendor_classification;
          newReq.vendor_city = this.state.selectTicketData.vendor_city;
          newReq.vendor_rg = this.state.selectTicketData.vendor_rg;
          if(params.update.sub_status_id == '7.2') {
            newReq.status_id = '7'
            newReq.sub_status_id = '7.4'
            newReq.status = this.state.statusName;
            newReq.sub_status = this.state.subStatusName;
          }
        }
      }
    })
    .then(()=>{
      if(newReq.sub_status_id == '7.4' && this.props.ticketsList.dataSource.length>0 && this.state.selectTicketData){
        let sendVendData = this.props.ticketsList.dataSource;
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
      if((newReq.sub_status_id == '7.2' || newReq.sub_status_id == '7.4') && this.props.ticketsList.dataSource.length>0 
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
      this.props.plans.isLoading ||
      this.props.travelThroughState.isLoading ||
      this.props.locations.isLoading ||      
      this.props.travelTypeState.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.vendorList.isLoading ||
      (params.update && this.props.attachmentList.isLoading) ||
      (params.claim && this.props.hotelList.isLoading) ||
      !this.state.screenReady
      ){
      return(
        <Loader/>
      )
    } else if(this.props.reqCreateState.errorStatus || 
      this.props.reqUpdateState.errorStatus || 
      this.props.plans.errorStatus ||
      this.props.travelThroughState.errorStatus ||
      this.props.locations.errorStatus || 
      this.props.travelTypeState.errorStatus ||
      this.props.statusResult.errorStatus ||
      this.props.vendorList.errorStatus ||
      (params.update && this.props.attachmentList.errorStatus) ||
      (params.claim && this.props.hotelList.errorStatus)
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          {(!this.state.readOnly && params.update.sub_status_id !='11.1' && params.update.sub_status_id !='7.1' 
          && params.update.sub_status_id !='7.3' && params.update.sub_status_id !='11.2' && !this.state.ticketList && !params.claim) ?<>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Air Requisition {params.update?'Update':'Create'}</Text>
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
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Type:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                mode="dropdown"
                placeholder="Travel Type"
                selectedValue={this.state.type}
                onValueChange={this.onValueChangeType}                
                style={styles.formInput}
                prompt="Select Travel Type"
                >
                {this.props.travelTypeState.dataSource.map((item, index) => {
                return (
                  <Picker.Item label={item.travel_type} value={item.travel_type} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              <Label style={styles.formLabel}>To:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              <Label style={styles.formLabel}>Through:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                mode="dropdown"
                placeholder="Select Through"
                selectedValue={this.state.through}
                onValueChange={this.onValueChangeThrough}
                style={styles.formInput}
                prompt="Select Through"
                >
                  <Picker.Item label="Self" value="Self" />
                  <Picker.Item label="Travel Agent" value="Travel Agent" />
                {/*this.props.travelThroughState.dataSource.map((item, index) => {
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
            {(this.state.through && this.state.amntError) &&
              <Text style={styles.errorText}>{this.state.amntError}</Text>
            }
            {this.state.through == "Travel Agent" ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                //mode="dropdown"
                placeholder="Select Travel Agent Name"
                selectedValue={this.state.agent}
                onValueChange={this.onValueChangeAgent}
                style={styles.formInput}
                prompt="Select Travel Agent Name"
                >
                {this.props.vendorList.dataSource.map((item, index) => {
                  return (
                    <Picker.Item label={item.vendor_name} value={item.vendor_name} key={index} />
                  );
                })}
              </Picker>
            </Item>
            :<Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.params.name}</Text>
            </Item>
            }
            <Label style={[styles.formLabel,{marginLeft:16, marginBottom:4}]}>Comments:</Label>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder='Enter Comments'
              style={[styles.formInput,{marginHorizontal:16, backgroundColor:'#f8f8f8',borderRadius:4,padding: 8, borderWidth:1,borderColor:'rgba(0,0,0,.1)'}]}
              underlineColorAndroid="transparent"
              onChangeText={this.handleComment} />
            {(params.update.sub_status_id !='11.1' && params.update.sub_status_id !='7.1'
             && params.update.sub_status_id !='7.3' && params.update.sub_status_id !='11.2') ?
            <View style={styles.attachRow}>
              <Text style={styles.formLabel}>Attachments:</Text>
              <Button rounded bordered info onPress={() => { this.setModalVisible(true); }} style={styles.atchBtn}>                
                <Icon name='attach' style={{fontSize:16, marginRight:0}} />
                <Text style={{fontSize:12,textAlign:'center'}}>
                  Attach Documents
                </Text>
              </Button>
            </View>:null}
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
                {(params.update && item.file.uri.includes('http')) &&
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
          </>:null}
            
          {(this.state.readOnly || params.update.sub_status_id =='11.1' || params.update.sub_status_id =='7.1' || 
          params.update.sub_status_id =='7.3' || params.update.sub_status_id =='11.2' || this.state.ticketList || params.claim) ?<>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAcrdOneVisible()}}>
            <Text style={styles.acrdTitle}>Trip Details</Text>
            {params.update.sub_status_id !='7.1' &&
            <Icon style={styles.acrdIcon} name={this.state.acrdOneVisible==0?"add-circle":"remove-circle"} />}
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:(this.state.acrdOneVisible==0)?'none':'flex'}}>
            <Item fixedLabel style={styles.formRow}>
              <Label style={[styles.formLabel,{flex:5}]}>Eligible Amount/Per Trip:</Label>              
              <Text style={[styles.formInput,styles.readOnly,{textAlign:'right'}]}>{params.item.upper_limit}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.travel_date).format(global.DATEFORMAT)}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Suitable Time:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_time}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Type:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_type}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_from}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_to}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Personal Email:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.email}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Through:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.through}</Text>
            </Item>
            {params.update.vendor_name &&
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>}
            {!params.claim && <>
            <Label style={[styles.formLabel,{marginLeft:16, marginBottom:4}]}>Comments:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_comment}</Text>
            </>}
          </Form>
          
          {(params.update.sub_status_id =='11.1' || params.update.sub_status_id =='11.1') ? <>
          <TouchableOpacity style={[styles.accordionHeader,styles.mt]}
            onPress={()=>{this.setAcrdTwoVisible()}}>
            <Text style={styles.acrdTitle}>Travel Agent Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdTwoVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:this.state.acrdTwoVisible==0?'none':'flex'}}>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.gstin}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.ta_booking_CGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>SGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.ta_booking_SGST}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>IGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.ta_booking_IGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Processing Charges:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.ta_booking_commission_amount}</Text>
            </Item>
          </Form>

          {this.state.selectTicketData && <>
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
          </Form></>}

          </>:null}

          </>:null}

          {this.state.ticketList && <>
          <Text style={styles.flightTitle}>Flight Details</Text>
          {params.update.sub_status_id !='11.1' &&
          <Text style={styles.flightSubTitle}>Please select an Option<Text style={{color:'red',fontSize:13}}>*</Text></Text>}
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
          </>}

          {params.claim && <Form>

          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Ticket Number:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput
              placeholder='Enter Ticket Numbaer' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.tcktNo}
              returnKeyType="next"
              onChangeText={this.handleTicketNo} />
          </Item>
          {this.state.tcktNoError &&
            <Text style={styles.errorText}>{this.state.tcktNoError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Number:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='invNumberInput'
              placeholder='Enter Invoice number' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.invNumber}
              returnKeyType="next"
              onChangeText={this.handleInvoiceNumber} />
          </Item>
          {this.state.invNumberError &&
            <Text style={styles.errorText}>{this.state.invNumberError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='0.0' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.invoiceAmnt}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onSubmitEditing={() => this.refs.curncyInput.focus()}
              onChangeText={this.handleInvoiceAmnt} />
          </Item>
          {this.state.invoiceAmntError &&
            <Text style={styles.errorText}>{this.state.invoiceAmntError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepickerInv} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateInv).format(global.DATEFORMAT)}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.showInv && 
          <DateTimePicker value={new Date(moment(this.state.dateInv).format('YYYY-MM-DD'))}
            mode={this.state.modeDate}
            display="default"
            onChange={this.setDateInv} />
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Flight Vendor:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <View style={styles.pickerWraper}>
              <PickerModal
                renderSelectView={(disabled, selected, showModal) =>
                  <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                    <Text style={styles.pickerBtnText}>{this.state.flightVendor.Name}</Text>
                    <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                  </TouchableOpacity>
                }
                onSelected={this.fvSelected.bind(this)}
                onClosed={()=>{}}
                //onBackButtonPressed={()=>{}}
                items={this.state.flightVendorList}
                //sortingLanguage={'tr'}
                showToTopButton={true}
                selected={this.state.flightVendor}
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
          {this.state.flightVendorError ?
            <Text style={styles.errorText}>{this.state.flightVendorError}</Text>:null
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Vendor CGST Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='cgst'
              onSubmitEditing={() => this.refs.sgst.focus()}
              placeholder='0.0' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.cgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleCgst} />
          </Item>
          {this.state.cgstError &&
            <Text style={styles.errorText}>{this.state.cgstError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Vendor SGST Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='sgst'
              onSubmitEditing={() => this.refs.igst.focus()}
              placeholder='0.0' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.sgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleSgst} />
          </Item>
          {this.state.sgstError &&
            <Text style={styles.errorText}>{this.state.sgstError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Vendor IGST Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='igst'
              onSubmitEditing={() => this.refs.hsncode.focus()}
              placeholder='0.0'
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.igst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleIgst} />
          </Item>
          {this.state.igstError &&
            <Text style={styles.errorText}>{this.state.igstError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Vendor HSN Code:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='hsncode'
              onSubmitEditing={() => this.refs.invNumberInput.focus()}
              placeholder='Enter HSN Code' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.hsncode}
              returnKeyType="next"
              //maxLength={6}
              onChangeText={this.handleHsnCode} />
          </Item>
          {this.state.hsncodeError &&
            <Text style={styles.errorText}>{this.state.hsncodeError}</Text>
          }

          <Label style={[styles.formLabel,{marginLeft:16, marginBottom:4}]}>Comments:</Label>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder='Enter Comments'
            style={[styles.formInput,{marginHorizontal:16, backgroundColor:'#f8f8f8',borderRadius:4,padding: 8, borderWidth:1,borderColor:'rgba(0,0,0,.1)'}]}
            underlineColorAndroid="transparent"
            onChangeText={this.handleComment} />

          </Form>}
        
          {((params.update.sub_status_id !='11.1' && params.update.sub_status_id !='7.1' 
            && params.update.sub_status_id !='7.3' && (params.update.sub_status_id !='11.2')) || params.claim) &&
          <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>}

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

  _ticketItem = (data,index, params) => {
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
    travelThroughState: state.travelThroughState,
    travelTypeState: state.travelTypeState,
    locations: state.locations,
    statusResult: state.statusResult,
    vendorList: state.vendorList,
    ticketsList: state.ticketsList,
    updateVndAirResState: state.updateVndAirResState,
    hotelList: state.hotelList,
    attachmentState: state.attachmentState,
    attachmentList: state.attachmentList
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
  getTravelThrough: Actions.getTravelThrough,
  getReqLocations: Actions.getReqLocations,
  getStatus: Actions.getStatus,  
  getTravelType: Actions.getTravelType,
  getVendor: Actions.getVendor,
  getTickets: Actions.getTickets,
  updateVndAirRes: Actions.updateVndAirRes,
  getHotels: Actions.getHotels,
  attachment: Actions.attachment,
  getAttachments: Actions.getAttachments
};

export default connect(mapStateToProps, mapDispatchToProps)(AirRequisitionScreen);