import React, { Component, } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Platform, Modal, 
  Keyboard, Alert, AsyncStorage, BackHandler, Picker } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"
import PickerModal from 'react-native-picker-modal-view'

import Loader from '../Components/Loader'
import styles from './Styles/SalesClaimReqScreen'
import { stat } from 'react-native-fs';


const CLASS = ['Sleeper', 'AC-2 tier', 'AC-3 tier', 'General',];
const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class SalesClaimReqScreen extends Component {

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
      locationList: [],
      fromItem: {"Name": (params.update && params.update.source_city_name) ? params.update.source_city_name : "Select From Location", 
                  "Value": "", "Code": "", 
                "Id": (params.update && params.update.source_city) ? params.update.source_city : 0},
      toItem: {"Name": (params.update && params.update.dest_city_name) ? params.update.dest_city_name : "Select To Location", 
                "Value": "", "Code": "", 
                "Id": (params.update && params.update.dest_city) ? params.update.dest_city : 0},
      tripFromError: '',
      tripToError: '',
      curDate: new Date,
      dateStart: new Date,
      mode: 'date',
      show: false,
      isLoading: false,
      hasError: false,
      error: false,
      statusName: '',
      subStatusName: '',
      lineitem: (params.update && params.update.lineitem)?params.update.lineitem:1,
      distance: (params.update && params.update.distance)?params.update.distance:'NA',
      rqAmnt: 0,
      commentsFk: (params.update && params.update.claimEmpcomment) ? params.update.claimEmpcomment :null,
      comments: (params.update && params.update.claimEmpcomment) ? params.update.claimEmpcomment :null,
      claimSupcomment: (params.update && params.update.claimSupcomment) ? params.update.claimSupcomment :null,
      through: (params.update && params.update.through) ? params.update.through : "Self",
      tclass: (params.update && params.update.ticket_class && (params.update.ticket_class == 'AC-2')) ? 'AC-2 tier'
              :(params.update && params.update.ticket_class && (params.update.ticket_class == 'AC-3')) ? 'AC-3 tier' 
              :(params.update && params.update.ticket_class) ? params.update.ticket_class 
              : CLASS[0],
      amount: (params.update && params.update.amount_mode) ? params.update.amount_mode :null,
      tStatus: (params.update && params.update.ticket_status) ? params.update.ticket_status : 'Availed',
      msg: (params.update && params.update.justification) ? params.update.justification :null,
      msgError: null,
      showCin: false,
      showCout: false,
      days: (params.update && params.update.noofdays) ? params.update.noofdays : 1,
      dateCin: new Date(),
      dateCout: new Date(),
      firstDay: new Date(),
      lastDay: new Date(),
      modalVisible: 0,
      modalFormVisible: 0,
      maxAmount: 0,
      cMinDate: new Date(),
      time: (params.update && params.update.travel_time) ? params.update.travel_time : SUIT_TIME[0],
      OOP: 'N',
      vendorId: (params.update && params.update.va_ta_id) ? params.update.va_ta_id :"0",
      aDistance: "0",
      timeCin: (params.update && params.update.claimdeparturetime) ?params.update.claimdeparturetime
                : '00:00',
      timeCout: (params.update && params.update.claimarrivaltime) ?params.update.claimarrivaltime
                : '00:00',
      fulltimeIn: 0,
      showcoutTime: false,
      modeTime: 'time',
      showTimeCin: false,
      showTimeCout: false,
      timeTotal: (params.update && params.update.claimtotaltime) ? params.update.claimtotaltime : '00:00',
      claimDays: '',
      cAmount: (params.update && params.update.claimamount) ? params.update.claimamount : '0.0',
      deductionAmount: '0.0',
      payableAmount: '0.0',
      invoiceAmnt: (params.update && params.update.invoice_amount) ? params.update.invoice_amount :null,
      invoiceAmntError: null,
      currency: (params.update && params.update.invoice_currency) ? params.update.invoice_currency :null,
      cgst: (params.update && params.update.vendor_CGST) ? params.update.vendor_CGST :null,
      sgst: (params.update && params.update.vendor_SGST) ? params.update.vendor_SGST :null,
      igst: (params.update && params.update.vendor_IGST) ? params.update.vendor_IGST :null,
      hsncode: (params.update && params.update.v_hsn_code) ? params.update.v_hsn_code :null,
      agntCgst: (params.update && params.update.ta_booking_CGST) ? params.update.ta_booking_CGST :null,
      agntSgst: (params.update && params.update.ta_booking_IGST) ? params.update.ta_booking_IGST :null,
      agntIgst: (params.update && params.update.ta_booking_SGST) ? params.update.ta_booking_SGST :null,
      agntHsncode: (params.update && params.update.ta_hsn_code) ? params.update.ta_hsn_code :null,
      vPan: (params.update && params.update.vendor_pan) ? params.update.vendor_pan : null,
      gstVClassification: (params.update && params.update.gst_vendor_classification) ? params.update.gst_vendor_classification : null,
      vCity: (params.update && params.update.vendor_city) ? params.update.vendor_city : null,
      vRg: (params.update && params.update.vendor_rg) ? params.update.vendor_rg : null,
      gstin: null,
      authority: null,
      invNumber: (params.update && params.update.invoice_no) ? params.update.invoice_no :null,
      hotelsList: [],
      hotelItem: {"Name": (params.update && params.update.hotel_name) ? params.update.hotel_name : "Select Hotel/Guest House", 
                  "Value":"", "Code": (params.update && params.update.hotel_gstin) ? params.update.hotel_gstin : "", 
                  "Id": (params.update && params.update.hotel) ? params.update.hotel : 0},      
      showInv: false,
      dateInv: (params.update && params.update.invoice_date) ? params.update.invoice_date :new Date(),
      htlAdrs: (params.update && params.update.hotel_address) ? params.update.hotel_address :null,
      showField : (params.item.category_id == '1' || params.item.category_id == '2' || params.item.category_id == '8' || 
                  params.item.category_id == '9' || params.item.category_id == '10' || params.item.category_id == '11' || 
                  params.item.category_id == '12' || params.item.category_id == '18' || params.item.category_id == '19')?false:true,
      tcktNumb: (params.update && params.update.hotel_address) ? params.update.ticket_number :null,
      uc: 'NA',
      hottelGenrateData: null
    };
  }
  
  componentDidMount() {
    const {params} = this.props.navigation.state;
    var year = parseInt(params.params.year);
    var month = moment().month(params.params.month).format("M");
    var pjpDate = 
    this.setState({
      firstDay: new Date(year, month - 1, 1),
      lastDay: new Date(year, month, 0),
      dateStart: (params.update && params.update.pjp_date) ? params.update.pjp_date : new Date(year, month - 1, 1),
      dateCin: (params.update && params.update.check_in_date) ? params.update.check_in_date : new Date(year, month - 1, 1),
      dateCout: (params.update && params.update.check_out_date) ? params.update.check_out_date : new Date(year, month - 1, 1),
      cMinDate: (params.update && params.update.pjp_date) ? params.update.pjp_date : new Date(year, month - 1, 1),
    });

    if(this.state.showField){
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
    }

    this.props.getStatus("20","NA")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getMaxAmnt(global.USER.designation,global.USER.grade,params.item.category_id)
    .then(()=>{
      this.setState({
        maxAmount: this.props.maxAmntState.dataSource[0].upper_limit,
      });
    })

    if(params.item.category_id == '3'){
      this.props.getVendor('Train')
      .then(()=>{
        if(this.props.vendorList.dataSource.length>0) {
          this.setState({
            authority: this.props.vendorList.dataSource[0].vendor_name,
            gstin: this.props.vendorList.dataSource[0].gstin,
            vendorId: this.props.vendorList.dataSource[0].vendor_id,
            vPan: this.props.vendorList.dataSource[0].vendor_pan,
            gstVClassification: this.props.vendorList.dataSource[0].gst_vendor_classification,
            vCity: this.props.vendorList.dataSource[0].vendor_city,
            vRg: this.props.vendorList.dataSource[0].vendor_rg,
          });
        }
      });
    }

    if(params.item.category_id == '7'){
      this.props.getVendor('Air Travel')
      .then(()=>{
        if(this.props.vendorList.dataSource.length>0) {
          this.setState({
            authority: this.props.vendorList.dataSource[0].vendor_name,
            gstin: this.props.vendorList.dataSource[0].gstin,
            vendorId: this.props.vendorList.dataSource[0].vendor_id,
            vPan: this.props.vendorList.dataSource[0].vendor_pan,
            gstVClassification: this.props.vendorList.dataSource[0].gst_vendor_classification,
            vCity: this.props.vendorList.dataSource[0].vendor_city,
            vRg: this.props.vendorList.dataSource[0].vendor_rg,
          });
        }
      });
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
        cMinDate: date,
        dateCin: date,
        dateCout: date,
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

  fromSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_FROM_KEY")
    .then(() => {
      this.setState({
        fromItem: value,
        tripFromError: '',
      })
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
  }

  handleChangeComments = (text) => {
    this.setState({ commentsFk: text })
  }

  modalCancel = () => {
    let prev = this.state.comments
    this.setState({ commentsFk: prev })
  }
  modalSubmit = () => {
    let prev = this.state.commentsFk
    this.setState({ comments: prev })
  }

  onValueChangeClass = (tclass) => {
    this.setState({
      tclass: tclass
    });
  }

  onValueChangeThrough = (value) => {
    this.setState({
      through: value
    });
  }

  handleADistance = (value) => {
    this.setState({ 
      aDistance: value,
    })
  }

  handleCAmount = (value) => {
    this.setState({ 
      cAmount: value,
    })
  }

  onValueChangeTstatus = (value) => {
    this.setState({
      tStatus: value
    });
  }
  
  handleMsg = (text) => {
    this.setState({ 
      msg: text,
      msgError:null
    })
  }

  setDateCin = (event, dateCin) => {
    if(dateCin != undefined) {
      dateCin = dateCin || this.state.dateCin; 
      this.setState({
        showCin: Platform.OS === 'ios' ? true : false,
        dateCin,
        dateCout: dateCin
      });    
      var newDays= moment(this.state.dateCout, "YYYY-MM-DD").diff(moment(this.state.dateCin, "YYYY-MM-DD"), 'days')
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

  setDateCout = (event, dateCout) => {
    if(dateCout != undefined) {
      dateCout = dateCout || this.state.dateCout; 
      this.setState({
        showCout: Platform.OS === 'ios' ? true : false,
        dateCout,
      });    
      var newDays= moment(this.state.dateCout, "YYYY-MM-DD").diff(moment(this.state.dateCin, "YYYY-MM-DD"), 'days')
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setModalFormVisible(visible) {
    this.setState({modalFormVisible: visible});
  }

  setTimeCin = (event, timeCin) => {
    if(timeCin != undefined) {
      timeCin = timeCin || this.state.timeCin; 
      this.setState({
        showTimeCin: Platform.OS === 'ios' ? true : false,
        timeCin: moment(timeCin).format('HH:mm'),
        timeCout: moment(timeCin).format('HH:mm'),
        fulltimeIn: timeCin,
        showcoutTime: true,
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

  setTimeCout = (event, timeCout) => {    
    let hr = moment(timeCout).diff(this.state.fulltimeIn, 'h')
    let mn = moment(timeCout).diff(this.state.fulltimeIn, 'm')
    if(timeCout != undefined) {
      timeCout = timeCout || this.state.timeCout;
      if(parseInt(mn)<=0 ){
        Alert.alert(
          "",
          "Arrival Time can not be less or equal then Depature Time.",
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
          timeCout: moment(timeCout).format('HH:mm'),
          timeTotal: hr+':'+(parseInt(mn))%60
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

  handleInvoiceAmnt = (amnt) => {
    this.setState({ 
      invoiceAmnt: amnt,
      invoiceAmntError: null
    })
  }

  handleCurrency = (text) => {
    this.setState({ 
      currency: text,
    })
  }

  handleCgst = (amnt) => {
    this.setState({ 
      cgst: amnt,
    })
  }

  handleSgst = (amnt) => {
    this.setState({ 
      sgst: amnt,
    })
  }

  handleIgst = (amnt) => {
    this.setState({ 
      igst: amnt,
    })
  }

  handleHsnCode = (text) => {
    this.setState({ 
      hsncode: text,
    })
  }

  handleAgntCgst = (amnt) => {
    this.setState({ 
      agntCcgst: amnt,
    })
  }

  handleAgntSgst = (amnt) => {
    this.setState({ 
      agntSgst: amnt,
    })
  }

  handleAgntIgst = (amnt) => {
    this.setState({ 
      agntIgst: amnt,
    })
  }

  handleAgntHsnCode = (text) => {
    this.setState({ 
      agntHsncode: text,
    })
  }
  
  handletcktNumb = (text) => {
    this.setState({ 
      tcktNumb: text,
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

  onValueChangeAuthority = (value) => {
    for(var i=0; i<this.props.vendorList.dataSource.length; i++) {
      if(this.props.vendorList.dataSource[i].vendor_name == value){
        this.setState({
          authority: value,
          gstin: this.props.vendorList.dataSource[i].gstin,
          vendorId: this.props.vendorList.dataSource[i].vendor_id,
          vPan: this.props.vendorList.dataSource[i].vendor_pan,
          gstVClassification: this.props.vendorList.dataSource[i].gst_vendor_classification,
          vCity: this.props.vendorList.dataSource[i].vendor_city,
          vRg: this.props.vendorList.dataSource[i].vendor_rg,
        });
      }
    }
  }  

  handleInvoiceNumber = (text) => {
    this.setState({ 
      invNumber: text,
    })
  }

  hotelSelected(value){
    this.setState({
      hotelItem: value,
    })
  }

  handleHtlAdrs = (text) => {
    this.setState({ 
      htlAdrs: text,
    })
  }

  formSubmit = () => {
    const {params} = this.props.navigation.state;
    if((this.state.showField && (!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location" ||
    !this.state.toItem.Name || this.state.toItem.Name == "Select To Location")) ||
    (params.item.category_id == '3' && !this.state.msg) ||
    (params.item.category_id == '7' && !this.state.invoiceAmnt)
    ){
      if(!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location") {
        this.setState({
          tripFromError: 'Please select From location'
        });
      }
      if(!this.state.toItem.Name || this.state.toItem.Name == "Select To Location") {
        this.setState({
          tripToError: 'Please select To location'
        });
      }
      if(params.item.category_id == '3' && !this.state.msg) {
        this.setState({
          msgError: 'Please enter proper Justification.',
        });
      }
      if(params.item.category_id == '7' && !this.state.invoiceAmnt) {
        this.setState({
          invoiceAmntError: 'Please enter Invoice Amount.',
        });
      }
    } else {
      this.postData();
    }
  }

  postData = () => {
    const {params} = this.props.navigation.state;
    this.setState({
      isLoading: true,
    });
    if(params.update){
      this.saveReq(params.update);
    }
    else if(this.state.hottelGenrateData) {
      this.setState({
        modalFormVisible: 1,
        isLoading: false,
      });
    } else {
      let newReqData = null;
      let index = 0
      this.props.ceateClaimReq(1,params.params.trip_hdr_id)
      .then(()=>{
        index = this.props.ceateClaimState.dataSource.length - 1
      })
      .then(()=>{
        newReqData = this.props.ceateClaimState.dataSource[index]
      })
      .then(()=>{
        this.saveReq(newReqData)
      })     
    }
    Keyboard.dismiss();
  }

  saveReq = (data) => {
    const {params} = this.props.navigation.state;
    let newReq = data;
    let newPJP = params.params;
    AsyncStorage.getItem("ASYNC_STORAGE_SAVE_KEY")
    .then(()=>{
      newReq.trip_no = params.params.trip_no;
      newReq.useremail = params.params.email;
      newReq.username = params.params.name;
      newReq.userid = params.params.userid;
      newReq.travel_grade = global.USER.grade;
      newReq.pending_with = global.USER.supervisorId;
      newReq.pending_with_name = global.USER.supervisorName;
      newReq.pending_with_email = global.USER.supervisorEmail;
      newReq.hq = params.params.hq;
      newReq.designation = params.params.designation;
      newReq.cost_center = global.USER.costCentre;
      newReq.pjp_date = moment(this.state.dateStart).format("YYYY-MM-DD");
      if(this.state.showField){
        newReq.source_city = this.state.fromItem.Id;
        newReq.dest_city = this.state.toItem.Id;
        newReq.source_city_name = this.state.fromItem.Name;
        newReq.dest_city_name = this.state.toItem.Name;
        newReq.claimdeparturetime = this.state.timeCin;
        newReq.claimarrivaltime = this.state.timeCout;
        newReq.claimactualdistance = this.state.aDistance;
        newReq.claimtotaltime = this.state.timeTotal;
      }
      newReq.mode = params.item.category_id;
      newReq.mode_name = params.item.category;
      newReq.status_id = 20;
      newReq.sub_status_id = "NA";
      newReq.status = this.state.statusName;
      newReq.sub_status = this.state.subStatusName;
      newReq.claimEmpcomment = this.state.comments;

      newReq.is_outof_policy = parseFloat(this.state.cAmount) > parseFloat(this.state.rqAmnt) ? 'Yes' : 'No';
      newReq.claimamount = this.state.cAmount;
      newReq.claimpaybleamount = this.state.cAmount;

      if(params.item.category_id == '3'){
        newReq.justification = this.state.msg;
        newReq.ticket_class = (this.state.tclass == 'AC-2 tier') ? 'AC-2'
                              : (this.state.tclass == 'AC-3 tier') ? 'AC-3'
                              : this.state.tclass; 
        newReq.ticket_status = this.state.tStatus;
        newReq.through = this.state.through;
        newReq.issuing_authorityName = this.state.authority;
        newReq.vendor_id = this.state.vendorId;
        newReq.invoice_amount = this.state.invoiceAmnt;
        newReq.invoice_no = this.state.invNumber;
        newReq.invoice_date = moment(this.state.dateInv).format("YYYY-MM-DD");
        newReq.invoice_currency = this.state.currency;
        newReq.v_hsn_code = this.state.hsncode;
        newReq.vendor_IGST = this.state.igst;
        newReq.vendor_SGST = this.state.sgst;
        newReq.vendor_CGST = this.state.cgst;
        newReq.gstin = this.state.gstin;
      }

      if((params.item.category_id == '14' || params.item.category_id == '22') && this.state.uc == "UC") {
        newReq.through = this.state.through;
        newReq.check_in_date = moment(this.state.dateCin).format("YYYY-MM-DD");
        newReq.check_out_date = moment(this.state.dateCout).format("YYYY-MM-DD");
        newReq.noofdays = this.state.days;        
        newReq.amount_mode = this.state.days * this.state.maxAmount;
        newReq.hotel = this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Id;
        newReq.hotel_name = this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Name;
        newReq.hotel_gstin = this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Code;
        newReq.invoice_amount = this.state.invoiceAmnt;
        newReq.invoice_no = this.state.invNumber;
        newReq.invoice_date = this.state.dateInv;
        newReq.hotel_outofpocket_currency = this.state.currency;
        newReq.hotel_address = this.state.htlAdrs;
        newReq.v_hsn_code = this.state.hsncode;
        newReq.vendor_IGST = this.state.igst;
        newReq.vendor_SGST = this.state.sgst;
        newReq.vendor_CGST = this.state.cgst;
      }

      if(params.item.category_id == '7'){
        newReq.travel_date = moment(this.state.dateStart).format("YYYY-MM-DD");
        newReq.travel_time = this.state.time;
        newReq.travel_from = this.state.fromItem.Name;
        newReq.travel_to = this.state.toItem.Name;
        newReq.through = this.state.through;
        newReq.amount_mode = this.state.maxAmount;
        newReq.comment = this.state.msg;          
        newReq.vendor_name = 'Not Defined';
        newReq.va_ta_id = 0;
        newReq.is_outof_policy = "N"
        newReq.v_hsn_code = this.state.hsncode;
        newReq.vendor_IGST = this.state.igst;
        newReq.vendor_SGST = this.state.sgst;
        newReq.vendor_CGST = this.state.cgst;
        newReq.ta_hsn_code = this.state.agntHsncode;
        newReq.ta_booking_SGST = this.state.agntIgst;
        newReq.ta_booking_IGST = this.state.agntSgst;
        newReq.ta_booking_CGST = this.state.agntCgst;
        newReq.invoice_amount = this.state.invoiceAmnt;
        newReq.invoice_no = this.state.invNumber;
        newReq.invoice_date = this.state.dateInv;
        newReq.issuing_authorityName = this.state.authority;
        newReq.vendor_id = this.state.vendorId;
        newReq.ticket_number = this.state.tcktNumb;
      }
    })
    .then(()=>{
      console.log(newReq)
      if(this.state.showField){
        let afterSetDistance = null;    
        this.props.generateExp([newReq])
        .then(()=>{
          afterSetDistance = this.props.generateExpState.dataSource[0];
          this.setState({
            hottelGenrateData: this.props.generateExpState.dataSource[0],
          });
        })
        .then(()=>{
          if ((params.item.category_id == '6' ||
          params.item.category_id == '23' ||
          params.item.category_id == '24' ||
          params.item.category_id == '25' ||
          params.item.category_id == '26' ||
          params.item.category_id == '27') && this.state.twoWay){
            afterSetDistance.distance = parseFloat(this.props.generateExpState.dataSource[0].distance)*2;
            afterSetDistance.amount_mode = parseFloat(this.props.generateExpState.dataSource[0].amount_mode)*2;
          }
        })
        .then(()=>{
          if((afterSetDistance.mode == "14" || afterSetDistance.mode == "22") 
              && afterSetDistance.place_of_work == 'UC' && this.state.uc == 'NA') {
            this.props.getHotels('Boarding and Lodging')
            .then(()=>{
              if(this.props.hotelList.isLoading) {
                this.setState({
                  isLoading: true,
                });
              } else if (this.props.hotelList.errorStatus) {
                this.setState({
                  hasError: true,
                });
              } else {
                for(var i=0; i<this.props.hotelList.dataSource.length; i++) {
                  this.state.hotelsList.push({
                    "Name": this.props.hotelList.dataSource[i].vendor_name,
                    "Value": this.props.hotelList.dataSource[i].vendor_city,
                    "Code": this.props.hotelList.dataSource[i].gstin,
                    "Id": this.props.hotelList.dataSource[i].vendor_id,
                  },)
                }
              }
            })
            .then(()=>{
              this.setState({
                isLoading: false,
                hasError: false,
                modalFormVisible: 1,
              });
            })
          } else {
            this.props.updtClaimReq([afterSetDistance])
            .then(()=>{
              newPJP.status_id = 20;
              newPJP.sub_status_id = "NA";
              newPJP.status = this.state.statusName;
              newPJP.sub_status = this.state.subStatusName;
              newPJP.estimated_cost = (params.update && params.update.amount_mode)
                    ?(parseInt(params.estCost) - (params.update.claimamount == 'On Actual')?0:parseInt(params.update.claimamount)) + parseInt(this.state.cAmount)
                    : parseInt(params.estCost) + parseInt(this.state.cAmount);
              newPJP.actual_claim_amount = (parseInt(params.actAmnt) - parseInt(params.update.claimamount)) + parseInt(this.state.cAmount);
            })
            .then(()=>{
              this.props.postPjpClaimTot([newPJP])
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
          }
        })
      } else {
        this.props.updtClaimReq([newReq])
          .then(()=>{
            newPJP.status_id = 20;
            newPJP.sub_status_id = "NA";
            newPJP.status = this.state.statusName;
            newPJP.sub_status = this.state.subStatusName;
            newPJP.estimated_cost = (params.update && params.update.amount_mode)
                  ?(parseInt(params.estCost) - (params.update.claimamount == 'On Actual')?0:parseInt(params.update.claimamount)) + parseInt(this.state.cAmount)
                  : parseInt(params.estCost) + parseInt(this.state.cAmount);
            newPJP.actual_claim_amount = (parseInt(params.actAmnt) - parseInt(params.update.claimamount)) + parseInt(this.state.cAmount);
          })
          .then(()=>{
            this.props.postPjpClaimTot([newPJP])
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
      }
    })
  }

  hotelDataSubmit(){
    AsyncStorage.getItem("ASYNC_HOTEL_SAVE_KEY")
    .then(()=>{
      this.setState({
        uc: 'UC'
      })
    })
    .then(()=>{
      this.saveReq(this.state.hottelGenrateData)
    }) 
  }

  render() {
    const {params} = this.props.navigation.state;
    console.log(params)
    if(this.state.isLoading || (this.state.showField && this.props.locations.isLoading) || this.props.statusResult.isLoading 
      || this.props.maxAmntState.isLoading ||
      (params.item.category_id == '3' && this.props.vendorList.isLoading)||
      (params.item.category_id == '7' && this.props.vendorList.isLoading)
      ){
      return(
        <Loader/>
      )
    } else if( (this.state.showField && this.props.locations.errorStatus) || this.props.statusResult.errorStatus
      || this.props.maxAmntState.errorStatus ||
      (params.item.category_id == '3' && this.props.vendorList.errorStatus) ||
      (params.item.category_id == '7' && this.props.vendorList.errorStatus) ||
      this.state.hasError
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    let mode = parseInt(params.item.category_id)
    let showField = this.state.showField;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.item.category}</Text>
        </View>
        <Form>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.show && 
          <DateTimePicker value={new Date(moment(this.state.dateStart).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={this.state.firstDay}
            maximumDate={this.state.lastDay}
            display="default"
            onChange={this.setDate} />
          }
          
          {showField ?<>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Form:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
          </>:null}
          {showField ?<>
          <Item fixedLabel style={styles.formRow}>
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
                //sortingLanguage={'tr'}
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
          </>:null}
          {showField ?
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Distance:</Label>
            <Text style={[styles.value,styles.readOnly]}>{this.state.distance}</Text>
          </Item> 
          :null}
          {showField ?                   
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Actual Distance:</Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aDistance}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onChangeText={this.handleADistance} />
          </Item>
          :null}
          {showField ?<>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Depature Time:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
          </>:null}
          {showField ?<>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Arrival Time:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            {this.state.showcoutTime ?
            <TouchableOpacity onPress={this.timepickerCout} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{this.state.timeCout}</Text>
              <Icon name="time" style={styles.datePickerIcon} />
            </TouchableOpacity>:null}
          </Item>
          { this.state.showTimeCout && 
          <DateTimePicker value={new Date()}
            mode={this.state.modeTime}
            is24Hour={true}
            display="default"
            onChange={this.setTimeCout} />
          }  
          </>:null}
          {showField ?        
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Total Time:</Label>
            <Text style={[styles.value,styles.readOnly]}>{this.state.timeTotal}</Text>
          </Item>
          :null}
          {/*showField ?
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Day:</Label>
            <Text style={[styles.value,styles.readOnly]}>{this.state.claimDays}</Text>
          </Item>
          :null*/}
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Requisition Amount:</Label>
            <Text style={[styles.value,styles.readOnly]}>{parseFloat(this.state.rqAmnt)}</Text>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Claim Amount:</Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.cAmount}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onChangeText={this.handleCAmount} />
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Deduction Amount:</Label>
            <Text style={[styles.value,styles.readOnly]}>{parseFloat(this.state.deductionAmount)}</Text>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Payable Amount:</Label>
            <Text style={[styles.value,styles.readOnly]}>{parseFloat(this.state.payableAmount)}</Text>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Out of Policy:</Label>
            <Text style={[styles.value,styles.readOnly]}>{
              parseFloat(this.state.cAmount) > parseFloat(this.state.rqAmnt) ? 'Yes' : 'No'
            }</Text>
          </Item>
          
          {params.item.category_id == '3' ?<>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Ticket Class:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <Picker
              placeholder="Select Class" 
              selectedValue = {this.state.tclass} 
              onValueChange = {this.onValueChangeClass}                
              style={styles.formInput}
              prompt="Select Class">
              {CLASS.map((item, index) => {
                return (
                <Picker.Item label={item} value={item} key={index} />
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Select Ticket Status:</Label>
            <Picker
              //mode="dropdown"
              placeholder="Select Ticket status"
              selectedValue={this.state.tStatus}
              onValueChange={this.onValueChangeTstatus}
              style={styles.formInput}
              prompt="Select Ticket status"
              >
                <Picker.Item label={"Availed"} value={"Availed"} />
                <Picker.Item label={"Cancelled"} value={"Cancelled"} />
            </Picker>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Amount:</Label>
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Currency:</Label>
            <TextInput 
              ref='curncyInput'
              onSubmitEditing={() => this.refs.cgst.focus()}
              placeholder='INR' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.currency}
              returnKeyType="next"
              onChangeText={this.handleCurrency} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Issuing Authority:</Label>
            <Picker
              placeholder="Issuing Authority"
              selectedValue={this.state.authority}
              onValueChange={this.onValueChangeAuthority}
              style={styles.formInput}
              prompt="Select Issuing Authority"
              >
                {this.props.vendorList.dataSource.map((item, index) => {
                return (
                  <Picker.Item label={item.vendor_name} value={item.vendor_name} key={index} />
                );
              })}
            </Picker>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>GSTIN:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>
              {this.state.gstin}
            </Text>
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>CGST:</Label>
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>SGST:</Label>
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>IGST:</Label>
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>HSN Code:</Label>
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
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Number:</Label>
            <TextInput 
              ref='invNumberInput'
              placeholder='Enter Invoice number' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.invNumber}
              returnKeyType="next"
              onChangeText={this.handleInvoiceNumber} />
          </Item>

          <Text style={[styles.formLabel,styles.inputLabel]}>Justification:<Text style={{color:'red',fontSize:13}}>*</Text></Text>
          <TextInput 
            placeholder='Enter your justification' 
            style={styles.textArea}
            underlineColorAndroid= "rgba(0,0,0,0)"
            value = {this.state.msg}
            returnKeyType="next"
            numberOfLines={4}
            onChangeText={this.handleMsg} />            
          {this.state.msgError &&
            <Text style={styles.errorText}>{this.state.msgError}</Text>
          }
          </>:null}

          {params.item.category_id == '7' ?<>
          <Item fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Eligible Amount @ Flight:</Label>
            <Text style={[styles.formInput,styles.readOnly,styles.formInputShot]}>
              {(params.item.upper_limit && params.item.upper_limit != 'On Actual')?params.item.upper_limit:0}
            </Text>
          </Item>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Amount:</Label>
            <TextInput 
              placeholder='0.0' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.invoiceAmnt}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onSubmitEditing={() => this.refs.tcktNumb.focus()}
              onChangeText={this.handleInvoiceAmnt} />
          </Item>
          {this.state.invoiceAmntError &&
            <Text style={styles.errorText}>{this.state.invoiceAmntError}</Text>
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Ticket Number:</Label>
            <TextInput 
              ref='tcktNumb'
              //placeholder='' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.tcktNumb}
              onSubmitEditing={() => this.refs.invNumberInput.focus()}
              onChangeText={this.handletcktNumb} />
          </Item>          
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Number:</Label>
            <TextInput 
              ref='invNumberInput'
              placeholder='Enter Invoice number' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.invNumber}
              returnKeyType="next"
              onChangeText={this.handleInvoiceNumber} />
          </Item>          
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Invoice Date:</Label>
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
            <Label style={styles.formLabel}>Issuing Authority:</Label>
            <Picker
              placeholder="Issuing Authority"
              selectedValue={this.state.authority}
              onValueChange={this.onValueChangeAuthority}
              style={styles.formInput}
              prompt="Select Issuing Authority"
              >
                {this.props.vendorList.dataSource.map((item, index) => {
                return (
                  <Picker.Item label={item.vendor_name} value={item.vendor_name} key={index} />
                );
              })}
            </Picker>
          </Item>

          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Vendor CGST Amount:</Label>
            <TextInput 
              ref='cgst'
              onSubmitEditing={() => this.refs.sgst.focus()}
              placeholder='0.0' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.cgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleCgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Vendor SGST Amount:</Label>
            <TextInput 
              ref='sgst'
              onSubmitEditing={() => this.refs.igst.focus()}
              placeholder='0.0' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.sgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleSgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Vendor IGST Amount:</Label>
            <TextInput 
              ref='igst'
              onSubmitEditing={() => this.refs.hsncode.focus()}
              placeholder='0.0'
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.igst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleIgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Vendor HSN Code:</Label>
            <TextInput 
              ref='hsncode'
              onSubmitEditing={() => this.refs.agntCgst.focus()}
              placeholder='HSN Code' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.hsncode}
              returnKeyType="next"
              //maxLength={6}
              onChangeText={this.handleHsnCode} />
          </Item>
          
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Travel Agent's CGST Amount:</Label>
            <TextInput 
              ref='agntCgst'
              onSubmitEditing={() => this.refs.agntSgst.focus()}
              placeholder='0.0' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.agntCgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleAgntCgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Travel Agent's SGST Amount:</Label>
            <TextInput 
              ref='agntSgst'
              onSubmitEditing={() => this.refs.agntIgst.focus()}
              placeholder='0.0' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.agntSgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleAgntSgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Travel Agent's IGST Amount:</Label>
            <TextInput 
              ref='agntIgst'
              onSubmitEditing={() => this.refs.agntHsncode.focus()}
              placeholder='0.0'
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.agntIgst}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={this.handleAgntIgst} />
          </Item>
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={[styles.formLabel,styles.formLabelLong]}>Travel Agent's HSN Code:</Label>
            <TextInput 
              ref='agntHsncode'
              onSubmitEditing={() => this.refs.msg.focus()}
              placeholder='HSN Code' 
              style={[styles.formInput,styles.formInputShot]}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.agntHsncode}
              returnKeyType="next"
              //maxLength={6}
              onChangeText={this.handleAgntHsnCode} />
          </Item>
          
          <Text style={[styles.formLabel,styles.inputLabel]}>Comments:</Text>
          <TextInput 
            ref='msg'
            placeholder='Enter comments' 
            style={styles.textArea}
            underlineColorAndroid= "rgba(0,0,0,0)"
            value = {this.state.msg}
            returnKeyType="next"
            numberOfLines={4}
            onChangeText={this.handleMsg} />
          </>:null}
        </Form>
        
        <TouchableOpacity onPress={() => this.formSubmit()} style={styles.ftrBtn}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#53c55c', '#33b8d6']} 
            style={styles.ftrBtnBg}>
            <Icon name='done-all' style={styles.ftrBtnIcon} />
            <Text style={styles.ftrBtnTxt}>Save Requisition</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        </ScrollView>

        <TouchableOpacity style={styles.addonBtn} onPress={() => this.setModalVisible(1)}>
          <Icon name='ios-chatbubbles' style={styles.addonBtnIcon} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalFormVisible===1}
          onRequestClose = {() => {this.setModalVisible(0)}}>
          <>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Require more Information</Text>
          </View>
          <ScrollView contentContainerStyle={[styles.modalBody,{backgroundColor:'#fff',paddingRight:0}]}>
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
              <Label style={styles.formLabel}>CheckIn Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerCin} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateCin).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showCin && 
            <DateTimePicker value={new Date(moment(this.state.dateCin).format('YYYY-MM-DD'))}
              mode={this.state.modeDate}
              minimumDate={this.state.cMinDate}
              maximumDate={this.state.lastDay}
              display="default"
              onChange={this.setDateCin} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckOut Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerCout} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateCout).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showCout && 
            <DateTimePicker value={new Date(moment(this.state.dateCout).format('YYYY-MM-DD'))}
              mode={this.state.modeDate}
              minimumDate={this.state.dateCin}
              maximumDate={this.state.lastDay}
              display="default"
              onChange={this.setDateCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>No of Days:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.days}</Text>
            </Item>

            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Hotel/Guest House:</Label>
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.hotelItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.hotelSelected.bind(this)}
                  onClosed={()=>{}}
                  items={this.state.hotelsList}
                  showToTopButton={true}
                  selected={this.state.hotelItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Select Hotel/Guest House'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search Hotel/Guest House'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Hotel/Guest House GSTIN:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {this.state.hotelItem.Code}
              </Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Amount:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Currency:</Label>
              <TextInput 
                ref='curncyInput'
                onSubmitEditing={() => this.refs.cgst.focus()}
                placeholder='INR' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.currency}
                returnKeyType="next"
                onChangeText={this.handleCurrency} />
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CGST:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>SGST:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>IGST:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>HSN Code:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Number:</Label>
              <TextInput 
                ref='invNumberInput'
                placeholder='Enter Invoice number' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.invNumber}
                returnKeyType="next"
                onChangeText={this.handleInvoiceNumber} />
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
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

            <Label style={[styles.formLabel,{marginLeft: 16}]}>Hotel/Guest House Address:</Label>
            <TextInput 
              placeholder='Enter Hotel/Guest House Address' 
              style={styles.addressInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.htlAdrs}
              returnKeyType="next"
              numberOfLines={4}
              onChangeText={this.handleHtlAdrs} />
          </ScrollView>
          <View style={[styles.modalFooter,{backgroundColor:'#f4f4f4'}]}>
          <TouchableOpacity style={styles.mdlFtrButton} 
            onPress={() => this.setState({modalFormVisible: 0}, () => this.modalCancel())}>
            <Text style={{color:'red'}}>B A C K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mdlFtrBUtton,styles.mdlFtrBtnSuccess]} 
            onPress={() => this.setState({modalFormVisible: 0, isLoading:true}, () => this.hotelDataSubmit())}>
            <Text style={{color:'#fff'}}>D O N E</Text>
          </TouchableOpacity>
          </View>
          </>
        </Modal>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible===1}
          onRequestClose = {() => {this.setModalVisible(0)}}>
          <>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.cmntHeader}>
              <Icon name='md-contact' style={[styles.cmntHeaderIcon,{color:'#7a7a7a', marginRight: 16,}]} />
              <Text style={[styles.cmntHeaderTtl,{color:'#7a7a7a'}]}>Supervisor comment</Text>
            </View>
            <View style={[styles.chartBlock,styles.chartBlockSecondary]}>
              <View style={[styles.chartCarot,styles.chartCarotSecondary]}></View>
              <Text style={styles.chartText}>{this.state.claimSupcomment}</Text>
            </View>
            <View style={[styles.cmntHeader,{justifyContent: 'flex-end'}]}>
              <Text style={[styles.cmntHeaderTtl,{color:'#0066b3'}]}>Employee comment</Text>
              <Icon name='ios-contact' style={[styles.cmntHeaderIcon,{color:'#0066b3', marginLeft:16}]} />
            </View>
            <View style={[styles.chartBlock,styles.chartBlockPrimary]}>
              <View style={[styles.chartCarot,styles.chartCarotPrimary]}></View>
              <TextInput 
                multiline
                numberOfLines={4}
                placeholder='Enter your comments'
                style={styles.chartText}
                underlineColorAndroid="transparent"
                onChangeText={this.handleChangeComments}
                value={this.state.comments}
                />
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
          <TouchableOpacity style={[styles.mdlFtrBtn,styles.mdlFtrBtnDanger]} 
            onPress={() => this.setState({modalVisible: 0}, () => this.modalCancel())}>
            <Icon name='md-close' style={styles.mdlFtrBtnIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mdlFtrBtn,styles.mdlFtrBtnSuccess]} 
            onPress={() => this.setState({modalVisible: 0}, () => this.modalSubmit())}>
            <Icon name='md-send' style={styles.mdlFtrBtnIcon} />
          </TouchableOpacity>
          </View>
          </>
        </Modal>
      </KeyboardAvoidingView>
    );
    }
  }
}

const mapStateToProps = state => {
  return {
    locations: state.locations,
    updtReqSaleState: state.updtReqSaleState,
    travelThroughState: state.travelThroughState,    
    statusResult: state.statusResult,
    ceateClaimState: state.ceateClaimState,
    reqListSales: state.reqListSales,
    generateExpState: state.generateExpState,
    maxAmntState: state.maxAmntState,
    vendorList: state.vendorList,
    hotelList: state.hotelList,
    pjpClaimTot: state.pjpClaimTot,
    updtClaimReqState: state.updtClaimReqState,
    pjpClaims: state.pjpClaims
  };
};

const mapDispatchToProps = {
  getReqLocations: Actions.getReqLocations,
  updtReqSale : Actions.updtReqSale,
  getTravelThrough: Actions.getTravelThrough,
  getStatus: Actions.getStatus,
  ceateClaimReq: Actions.ceateClaimReq,
  getReqSale : Actions.getReqSale,
  generateExp: Actions.generateExp,
  getMaxAmnt: Actions.getMaxAmnt,
  getVendor: Actions.getVendor,  
  getHotels: Actions.getHotels,
  postPjpClaimTot: Actions.postPjpClaimTot,
  updtClaimReq: Actions.updtClaimReq,
  getPjpClaim : Actions.getPjpClaim
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesClaimReqScreen);