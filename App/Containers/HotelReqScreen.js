import React, { Component } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, Image,
  TextInput, AsyncStorage, Keyboard, Alert, BackHandler, Modal, ActivityIndicator, Linking } from "react-native"
import { Button, Icon, Text, Form, Item, Label } from 'native-base'
import DocumentPicker from 'react-native-document-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"
import PickerModal from 'react-native-picker-modal-view'
import RNFS from 'react-native-fs'


import styles from './Styles/HotelReqScreen.js'

class HotelReqScreen extends Component {
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
      showRejectionComment:false,
      curDate: new Date(),
      date: (params.update  && params.update.travel_date)?params.update.travel_date:params.params.start_date,
      dateCin: (params.update && params.update.check_in_date) ? params.update.check_in_date : params.params.start_date,
      timeCin: (params.update && params.update.check_in_time) ?params.update.check_in_time
                : moment(new Date()).format('HH:mm'),
      dateCout: (params.update && params.update.check_out_date) ? params.update.check_out_date : params.params.start_date,
      timeCout: (params.update && params.update.check_out_time) ?params.update.check_out_time
                : moment(new Date()).format('HH:mm'),
      isLoading: false,
      modeDate: 'date',
      modeTime: 'time',
      show: false,
      showCin: false,
      showTimeCin: false,
      showCout: false,
      showTimeCout: false,
      showInv: false,
      through: (params.update && params.update.through) ? params.update.through : "Self",
      attachFiles: [],
      stateList: [],
      stateItem: {"Name": (params.update && params.update.state) ? params.update.state : "Select State", "Value": "", "Code": "", "Id":0},
      curState: (params.update && params.update.state) ? params.update.state : null,
      stateError: null,
      fetchCityData: null,
      isCityLoading: false,
      cityList: [],
      cityItem: {"Name": (params.update && params.update.city) ? params.update.city : "Select Location", "Value": "", "Code": "", "Id":0},
      cityError: null,
      curCity: (params.update && params.update.city) ? params.update.city : null,
      hasCity: true,
      throughtList: [],
      createdReq: [],
      typeList: [],
      type: (params.update && params.update.state) ? params.update.state : '',
      maxAmt: params.item.upper_limit == "On Actual" ? "5000000"
              : params.item.upper_limit != "NA" ? params.item.upper_limit
              : '0.0',
      amount: (params.update && params.update.amount) ? params.update.amount :null,
      amntError: null,
      days: (params.update && params.update.days) ? params.update.days : 0,
      actualDays: 0,
      modalVisible: false,
      uploadData: [],
      curUploadType: 'Approve Email',
      statusNameOP: '',
      subStatusNameOP: '',
      statusName: '',
      subStatusName: '',
      statusClaimName:'',
      OOP: 'Y',
      vendorname: '',
      vendorId: '0',
      cityType: params.item.sub_category_id == "1BM" ? "Metro"
                :  params.item.sub_category_id == "1BH" ? "HillStation"
                :  "NonMetro",
      hotelsList: [],
      hotelItem: {"Name": (params.update && params.update.hotel_name) ? params.update.hotel_name : "Select Hotel/Guest House", 
                  "Value":"", "Code": (params.update && params.update.hotel_gstin) ? params.update.hotel_gstin : "", 
                  "Id": (params.update && params.update.hotel) ? params.update.hotel : 0},
      invoiceAmnt: (params.update && params.update.invoice_amount) ? params.update.invoice_amount :null,
      invoiceAmntError: null,
      currency: (params.update && params.update.invoice_currency) ? params.update.invoice_currency :'INR',
      currencyError: null,
      cgst: (params.update && params.update.vendor_CGST) ? params.update.vendor_CGST :null,
      cgstError:null,
      sgst: (params.update && params.update.vendor_SGST) ? params.update.vendor_SGST :null,
      sgstError:null,
      igst: (params.update && params.update.vendor_IGST) ? params.update.vendor_IGST :null,
      igstError:null,
      hsncode: (params.update && params.update.v_hsn_code) ? params.update.v_hsn_code :null,
      hsncodeError:null,
      invNumber: (params.update && params.update.invoice_no) ? params.update.invoice_no :null,
      invNumberError:null,
      dateInv: (params.update && params.update.invoice_date) ? params.update.invoice_date :new Date(),
      htlAdrs: (params.update && params.update.hotel_address) ? params.update.hotel_address :null,
      htlAdrsError:null,
      hotelNameError: null,
      lineitem: (params.update && params.update.lineitem)?params.update.lineitem:null,
      flieSizeIssue: false,
      tripNo: params.params.trip_no,
      refresh: false,
      screenReady: params.update ? false : true,
      uploading: false,
      trmName: params.claim?'claim_hotel_list':'ptf_hotel_list'
    };
  }

  formatDateForDisplay(date){
    try{
      return  date.split('/')[2] +"-"+date.split('/')[1] +"-"+date.split('/')[0];
    }catch(error){
    return "2020-05-01";
    }
    } 

  componentDidMount() {    
    const {params} = this.props.navigation.state;

    if(params.update.sub_status_id == "10.1")
     this.setState({ showRejectionComment: true })


    let cityType = params.item.sub_category_id == "1BM" ? "Metro"
                :  params.item.sub_category_id == "1BH" ? "HillStation"
                :  "NonMetro";

    this.props.getStates()
    .then(()=>{
      for(var i=0; i<this.props.stateList.dataSource.length; i++) {
        if(this.props.stateList.dataSource[i].type == this.state.cityType) {
          this.state.stateList.push({
            "Name": this.props.stateList.dataSource[i].state,
            "Value": this.props.stateList.dataSource[i].city,
            "Code": this.props.stateList.dataSource[i].type,
            "Id": this.props.stateList.dataSource[i].id,
          },)
        }
      }
    });

    this.props.getReqLocations()
    .then(()=>{
      this.setState({
        fetchCityData: this.props.locations.dataSource
      })
    })
    .then(() => {
      if(params.update && params.update.state){
        for(var i=0; i<this.state.fetchCityData.length; i++) {
          if(this.state.fetchCityData[i].state == params.update.state) {
            this.state.cityList.push({
              "Name": this.state.fetchCityData[i].city,
              "Value": this.state.fetchCityData[i].city,
              "Code": this.state.fetchCityData[i].type,
              "Id": this.state.fetchCityData[i].id,
            },)
          }
        }
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

    this.props.getTravelType()
    .then(()=>{
      this.setState({ 
        typeList: this.props.travelTypeState.dataSource,
        type: (params.update && params.update.travel_type) 
              ? params.update.travel_type 
              : this.props.travelTypeState.dataSource.length>0
                ?this.props.travelTypeState.dataSource[0].travel_type:''
      });
    })

    if(!params.claim){
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
    }

    if(params.claim){
      this.props.getStatus("20","NA")
      .then(()=>{
        this.setState({
          statusClaimName: this.props.statusResult.dataSource[0].trip_pjp_status,
        });
      });
      this.props.getHotels(params.item.category)
      .then(()=>{
        for(var i=0; i<this.props.hotelList.dataSource.length; i++) {
          this.state.hotelsList.push({
            "Name": this.props.hotelList.dataSource[i].vendor_name,
            "Value": this.props.hotelList.dataSource[i].vendor_city,
            "Code": this.props.hotelList.dataSource[i].gstin,
            "Id": this.props.hotelList.dataSource[i].vendor_id,
          },)
        }
      });
    }

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
      if(params.update){
        this.props.getAttachments(params.params.trip_hdr_id,this.state.tripNo,params.update.lineitem)
        .then(()=>{
          for(var i=0; i<this.props.attachmentList.dataSource.length; i++) {
            for(var j=0; j<this.state.uploadData.length; j++) {
              if(this.props.attachmentList.dataSource[i].doc_type == this.state.uploadData[j].type) {
                this.state.uploadData[j].file.push({
                  'size': null,
                  'name': this.props.attachmentList.dataSource[i].file_name,
                  'type': 'image/'+this.getExtention(this.props.attachmentList.dataSource[i].file_name),
                  'uri': this.props.attachmentList.dataSource[i].file_path
                })
              }         
            }
          }
        })
        .then(()=>{
          this.setState({screenReady: true});
        })
      }
      else {
        this.setState({screenReady: true});
      }
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
  
  stateSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_STATE_KEY")
    .then(() => {
      this.setState({
        stateItem: value,
        stateError: null,
        curState: value.Name,
        isCityLoading: true,
        cityItem: {"Name": "Select Location", "Value": "", "Code": "", "Id":0},
      })
      this.state.cityList=[];
    })
    .then(() => {
      for(var i=0; i<this.state.fetchCityData.length; i++) {
        if(this.state.fetchCityData[i].state == value.Name) {
          this.state.cityList.push({
            "Name": this.state.fetchCityData[i].city,
            "Value": this.state.fetchCityData[i].city,
            "Code": this.state.fetchCityData[i].type,
            "Id": this.state.fetchCityData[i].id,
          },)
        }
      }
    })
    .then(()=>{
      this.setState({
        isCityLoading: false,
        hasCity: this.state.cityList.length>0?true:false
      })
      console.log(this.state.cityList)
    })
  }

  citySelected(value){
    this.setState({
      cityItem: value,
      cityError: null,
      curCity: value.Name,
    })
  }

  hotelSelected(value){
    this.setState({
      hotelItem: value,
      hotelNameError: null
    })
  }

  setDate = (event, date) => {
    date = date || this.state.date; 
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      dateCin: date,
      dateCout: date
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

  onValueChangeThrough = (value) => {
    this.setState({
      through: value
    });
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
        days: newDays == 0? 1: newDays,
        actualDays: newDays,
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

  setTimeCin = (event, timeCin) => {
    if(timeCin != undefined) {
      timeCin = timeCin || this.state.timeCin; 
      this.setState({
        showTimeCin: Platform.OS === 'ios' ? true : false,
        timeCin: moment(timeCin).format('HH:mm'),
        timeCout: moment(timeCin).format('HH:mm')
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

  setDateCout = (event, dateCout) => {
    const {params} = this.props.navigation.state;
    if(dateCout != undefined) {      
      dateCout = dateCout || this.state.dateCout; 
      this.setState({
        showCout: Platform.OS === 'ios' ? true : false,
        dateCout,
      });    
      var newDays= moment(this.state.dateCout, "YYYY-MM-DD").diff(moment(this.state.dateCin, "YYYY-MM-DD"), 'days')
      this.setState({
        days: newDays == 0? 1: newDays,
        actualDays: newDays       
      });
      this.state.OOP=parseFloat(this.state.amount) > (parseFloat(parseFloat(this.state.days) * parseFloat(params.item.upper_limit))) ?'Y':'N'

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

  setTimeCout = (event, timeCout) => {
    if(timeCout != undefined) {
      timeCout = timeCout || this.state.timeCout;
      if(this.state.actualDays == 0 && (parseInt(moment(timeCout).format('HH:mm'))<=parseInt(this.state.timeCin))){
        Alert.alert(
          "",
          "CheckOut time cannot be less or same as CheckIn Time for same day.",
          [
            {
              text: "Ok",
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
        this.setState({
          showTimeCout: Platform.OS === 'ios' ? true : false,
        });
      } else {
        this.setState({
          showTimeCout: Platform.OS === 'ios' ? true : false,
          timeCout: moment(timeCout).format('HH:mm')
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

  onValueChangeType = (value) => {
    this.setState({
      type: value
    });
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
  
  handleChangeAmount = (amnt) => {
    const {params} = this.props.navigation.state;
    var v= Math.sign(amnt);
     if(v=== 1 || amnt===''){
    this.setState({ 
      amount: amnt,
      amntError: null,
      OOP: (((params.item.upper_limit == "NA") && parseFloat(amnt) >  parseFloat(parseFloat(this.state.days) * parseFloat(params.item.upper_limit))) 
            || parseFloat(amnt) >  parseFloat(parseFloat(this.state.days) * parseFloat(params.item.upper_limit))) ?'Y':'N'
      //OOP: (((params.item.upper_limit == "NA") && parseFloat(amnt) > parseFloat(this.state.maxAmt)) 
            //|| parseFloat(amnt) > parseFloat(this.state.maxAmt)) ?'Y':'N'
    })
  }
  else if (amnt === "0")
  {
      alert("Enter Correct Amount");
      
  }
  else {
      alert("Enter Correct Amount");
  } 
}

  handleInvoiceAmnt = (amnt) => {
    const {params} = this.props.navigation.state;
    this.setState({ 
      invoiceAmnt: amnt,
      invoiceAmntError:null,
      OOP: (((params.item.upper_limit == "NA") && parseFloat(amnt) >  parseFloat(parseFloat(this.state.days) * parseFloat(params.item.upper_limit))) 
            || parseFloat(amnt) >  parseFloat(parseFloat(this.state.days) * parseFloat(params.item.upper_limit))) ?'Y':'N'
    })
  }

  handleCurrency = (text) => {
    var letter = /^[a-zA-Z]+$/; ;
    if (letter.test(text) === true || text==='') {
        this.setState({
            currency: text,
            currencyError: null,
        })
        return true;
    }
    else {
        alert("Letters only!");
        return false;
    }
   
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

  setColor(item){
    if(item.fileRequired == 'Y' && item.file.length == 0)
    return "red";
    else return "black";
  }

  handleHtlAdrs = (text) => {
    this.setState({ 
      htlAdrs: text,
      htlAdrsError:null
    })
  }

  uploadRequest = ()=> {
   
    if(this.state.attachFiles.length<=0 
     ) {
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
    }
    else if( this.state.curUploadType == "Please select attachment type") {
      Alert.alert(
        "",
        "You have not selected document type. Please choose document type.",
        [
          {
            text: "cancel",
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }  
    else {
      this.setState({modalVisible: false});
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
    let existData = this.props.attachmentList.dataSource;
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
          this.props.attachmentDelete(
            global.USER.personId,
            global.PASSWORD,
            {
              "id":existData[i].id,
	            "fileEntryId":existData[i].fileId
            }
          )          
        .then(()=>{
          this.props.getAttachments(params.params.trip_hdr_id,this.state.tripNo,params.update.lineitem)
          .then(()=>{
            for(var i=0; i<this.props.attachmentList.dataSource.length; i++) {
              for(var j=0; j<this.state.uploadData.length; j++) {
                if(this.props.attachmentList.dataSource[i].doc_type == this.state.uploadData[j].type) {
                  this.state.uploadData[j].file.push({
                    'size': null,
                    'name': this.props.attachmentList.dataSource[i].file_name,
                    'type': 'image/'+this.getExtention(this.props.attachmentList.dataSource[i].file_name),
                    'uri': this.props.attachmentList.dataSource[i].file_path
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
                "flow_type": params.claim?'ECR':'PT',
                "base64Str":fileBase64,
              }
            })
            .then(()=>{
              this.props.attachment(global.USER.personId,global.PASSWORD,data)
            })
            .catch((err) => {
              console.log(err.message, err.code);
            })
          }
        }
      }
    }
  }

  reqCreate =() => {
    const {params} = this.props.navigation.state;
    console.log('OOP');
    console.log(this.state.OOP);
    var response = "";
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
        "travel_type": this.state.type,
        "amount": this.state.amount?this.state.amount:0,
        "check_in_date": moment(this.state.dateCin).format("YYYY-MM-DD"),
        "check_in_time": this.state.timeCin,
        "check_out_date": moment(this.state.dateCout).format("YYYY-MM-DD"),
        "check_out_time": this.state.timeCout,
        "days": this.state.days,
        "state": this.state.curState,
        "city": this.state.curCity,
        "status_id": params.claim?'20':"7",
        "sub_status_id": params.claim?'NA'
                         : this.state.OOP=="Y"?"7.5":"7.4",
        "status": params.claim?this.state.statusClaimName
                  : this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName,
        "sub_status": params.claim?'NA'
                  : this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName,
        "is_outof_policy": this.state.OOP,

        'hotel': this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Id,
        'hotel_name': this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Name,
        'hotel_gstin': this.state.hotelItem.Name == 'Select Hotel/Guest House'? null : this.state.hotelItem.Code,
        'invoice_amount': this.state.invoiceAmnt,
        'invoice_currency': this.state.currency,
        'vendor_CGST': this.state.cgst,
        'vendor_SGST': this.state.sgst,
        'vendor_IGST': this.state.igst,
        'v_hsn_code': this.state.hsncode,
        'invoice_no': this.state.invNumber,
        'invoice_date': params.claim?moment(this.state.dateInv).format("YYYY-MM-DD"):null,
        'hotel_address': this.state.htlAdrs,
        'hotel_outofpocket_currency':this.state.currency,
        'extra_amount': (params.claim && params.item.upper_limit == "On Actual" && parseFloat(this.state.amount)>5000000)? 
                        parseFloat( parseFloat(this.state.amount)-5000000):null
      }])
      .then(()=>{
        //alert(JSON.stringify(this.props.reqCreateState));
        //alert(JSON.stringify(this.props.reqCreateState.dataSource));
        response  = this.props.reqCreateState.dataSource.message;
        this.atchFiles()        
        .then(()=>{
          this.props.getPlans(params.params.trip_hdr_id)
          .then(()=>{
            this.setState({
              isLoading: false,
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            if(response == "success")
            Toast.show(params.claim?'Expense Created Successfully':'Requisition Created Successfully', Toast.LONG);
            else alert(response);
          })
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
      newReq.travel_type = this.state.type;
      newReq.amount = this.state.amount?this.state.amount:0;
      newReq.check_in_date = moment(this.state.dateCin).format("YYYY-MM-DD");
      newReq.check_in_time = this.state.timeCin;
      newReq.check_out_date = moment(this.state.dateCout).format("YYYY-MM-DD");
      newReq.check_out_time = this.state.timeCout;
      newReq.days = this.state.days;
      newReq.state = this.state.curState;
      newReq.city = this.state.curCity;
      newReq.status_id = params.claim?'20':"7";
      newReq.sub_status_id = params.claim?'NA'
                             : this.state.OOP=="Y"?"7.5":"7.4"
      newReq.status = params.claim?this.state.statusClaimName
                      : this.state.OOP=="Y"? this.state.statusNameOP :this.state.statusName;
      newReq.sub_status = params.claim?'NA'
                          : this.state.OOP=="Y"? this.state.subStatusNameOP :this.state.subStatusName;
      newReq.is_outof_policy = this.state.OOP;
      
      newReq.hotel = (this.state.hotelItem.Name == 'Select Hotel/Guest House')? null : this.state.hotelItem.Id;
      newReq.hotel_name = (this.state.hotelItem.Name == 'Select Hotel/Guest House')? null : this.state.hotelItem.Name;
      newReq.hotel_gstin = (this.state.hotelItem.Name == 'Select Hotel/Guest House')? null : this.state.hotelItem.Code;
      newReq.invoice_amount = this.state.invoiceAmnt;
      newReq.invoice_currency = this.state.currency;
      newReq.vendor_CGST = this.state.cgst;
      newReq.vendor_SGST = this.state.sgst;
      newReq.vendor_IGST = this.state.igst;
      newReq.v_hsn_code = this.state.hsncode;
      newReq.invoice_no = this.state.invNumber;
      newReq.invoice_date = params.claim?moment(this.state.dateInv).format("YYYY-MM-DD"):null;
      newReq.hotel_address = this.state.htlAdrs;
      newReq.hotel_outofpocket_currency = this.state.currency;
      newReq.extra_amount = (params.claim && params.item.upper_limit == "On Actual" && parseFloat(this.state.amount)>5000000)? 
                        parseFloat( parseFloat(this.state.amount)-5000000):null;
    })
    .then(()=>{
      this.props.reqUpdate([newReq])
      .then(()=>{
        this.atchFiles()
        .then(()=>{
          this.props.getPlans(params.params.trip_hdr_id)
          .then(()=>{
            this.setState({
              isLoading: false,
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show(params.claim?'Expense Updated Successfully':'Requisition Updated Successfully', Toast.LONG);
          });
        })
      })      
    });
  }  

  submitReq = () => {
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

  submitReqData = () => {
    const {params} = this.props.navigation.state;
    var response = "";
  
    var invoicedate = new Date(moment(this.state.dateInv).format("YYYY-MM-DD"));
    var creationdate=  params.params.creation_date;
    var arr = params.params.creation_date.split("/");
    var creationdate1=  new Date(moment(arr[2]+"-"+arr[1]+"-"+arr[0]).format("YYYY-MM-DD")); 
   
   
      
     
     if (invoicedate.getTime()< creationdate1.getTime())
     { 
     alert("The invoice date is smaller then trip creation date ")
     return;
    }
    //const {params} = this.props.navigation.state;
   else  if (!this.state.curState || !this.state.curCity || 
      (this.state.through=="Self" && !this.state.amount && !params.claim) ||
      (params.claim && this.state.hotelItem.Name == 'Select Hotel/Guest House') ||
      (params.claim && !this.state.invoiceAmnt) || (params.claim && !this.state.currency) ||
      (params.claim && !this.state.cgst) || (params.claim && !this.state.sgst) ||
      (params.claim && !this.state.igst) || (params.claim && !this.state.hsncode) ||
      (params.claim && !this.state.invNumber) || (params.claim && !this.state.htlAdrs)
      ) {
      if (!this.state.curState) {
        this.setState({
          stateError: 'Please select state.',
        });
      }
      if (!this.state.curCity) {
        this.setState({
          cityError: 'Please select Location/City.',
        });
      }
      if (this.state.through=="Self" && !this.state.amount && !params.claim) {
        this.setState({
          amntError: 'Please enter Approx amount.',
        });
      }
      if(params.claim && this.state.hotelItem.Name == 'Select Hotel/Guest House'){
        this.setState({
          hotelNameError: 'Please select hotel/guest house name.',
        });
      }
      if(params.claim && !this.state.invoiceAmnt) {
        this.setState({
          invoiceAmntError: 'Please enter invoice amount.',
        });
      }
      if(params.claim && !this.state.currency) {
        this.setState({
          currencyError: 'Please enter currency.',
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
      if(params.claim && !this.state.htlAdrs) {
        this.setState({
          htlAdrsError: 'Please enter hotel/guest house Address.',
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

  formatDate(date){
    try{
 return date.split('-')[2]+"/"+date.split('-')[1]+"/"+date.split('-')[0];
    }catch(error){
      return date;
    }
  }

  render() {
    //alert("check"+this.state.dateCin+ " "+this.state.date)

    const {params} = this.props.navigation.state;
    
    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.travelThroughState.isLoading ||
      this.props.travelTypeState.isLoading ||
      this.props.stateList.isLoading ||
      this.props.statusResult.isLoading ||
      this.props.locations.isLoading ||
      (params.update && this.props.attachmentList.isLoading) ||
      this.props.refernceList.isLoading ||
      !this.state.screenReady){
      return(
        <View style={{flax:1, flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', backgroundColor:'#fff'}}>
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
          {(this.state.uploading && this.state.attachFiles.length > 0&&this.props.attachmentState.dataSource=="File Already exists") ?
          <Text style={{marginTop: 30}}>File could not be uploaded:Filename Already exists</Text>:(this.state.uploading && this.state.attachFiles.length > 0)?<Text style={{marginTop: 30}}>Uploading Attachments</Text>
          :null}
        </View>
      )
    } else if(this.props.reqCreateState.errorStatus || 
      this.props.reqUpdateState.errorStatus || 
      this.props.plans.errorStatus ||
      this.props.travelThroughState.errorStatus ||
      this.props.travelTypeState.errorStatus ||
      this.props.stateList.errorStatus ||
      this.props.locations.errorStatus || 
      this.props.statusResult.errorStatus ||
      this.props.refernceList.errorStatus ||
      (params.update && this.props.attachmentList.errorStatus)) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>

        {this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
             value = {params.update.req_comment}
              />
                  </View>:null}

          <View style={styles.titleRow}>
            <Text style={styles.title}>{params.item.sub_category}</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>State:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.stateItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.stateSelected.bind(this)}
                  onClosed={()=>{}}
                  //onBackButtonPressed={()=>{}}
                  items={this.state.stateList}
                  //sortingLanguage={'tr'}
                  showToTopButton={true}
                  selected={this.state.stateItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search State'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
            </Item>
            {this.state.stateError &&
              <Text style={styles.errorText}>{this.state.stateError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Location/City:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              {this.state.isCityLoading ?
              <ActivityIndicator size="small" color="#ddd" style={{alignSelf:'flex-end',marginRight:16}} />:
              this.state.hasCity ?
              <View style={styles.pickerWraper}>
                <PickerModal
                  renderSelectView={(disabled, selected, showModal) =>
                    <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                      <Text style={styles.pickerBtnText}>{this.state.cityItem.Name}</Text>
                      <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                    </TouchableOpacity>
                  }
                  onSelected={this.citySelected.bind(this)}
                  onClosed={()=>{}}
                  //onBackButtonPressed={()=>{}}
                  items={this.state.cityList}
                  showToTopButton={true}
                  selected={this.state.cityItem}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={true}
                  selectPlaceholderText={'Choose one...'}
                  onEndReached={() => console.log('list ended...')}
                  searchPlaceholderText={'Search City'}
                  requireSelection={false}
                  autoSort={false}
                />
              </View>
              :
              <Text style={[styles.formInput,styles.readOnly,{fontSize:12,color:'orange'}]}>
                No city available for this State.
              </Text>}
            </Item>
            {this.state.cityError &&
              <Text style={styles.errorText}>{this.state.cityError}</Text>
            }

<Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput
                placeholder='0.00' 
                editable={false} selectTextOnFocus={false}
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.formatDate(this.state.date)}
                keyboardType="decimal-pad"
                autoCapitalize="words"
               />
            </Item>
            {/* <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={new Date(moment(this.state.date).format('YYYY-MM-DD'))}
              mode="date"
              enabled={false}
              minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDate} />
            } */}
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
                {this.state.typeList.map((item, index) => {
                return (
                  <Picker.Item label={item.travel_type} value={item.travel_type} key={index} />
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
            {this.state.through == "Self" &&
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {global.USER.userName}
              </Text>
            </Item>}
            {(this.state.through == "Self" && !params.claim) &&
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
            {(this.state.amntError && !params.claim) &&
              <Text style={styles.errorText}>{this.state.amntError}</Text>
            }
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
              minimumDate={new Date(this.state.date)}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDateCin} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckIn Time:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              minimumDate={new Date(this.state.dateCin)}
              maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
              display="default"
              onChange={this.setDateCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CheckOut Time:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.timepickerCout} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{this.state.timeCout}</Text>
                <Icon name="time" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showTimeCout && 
            <DateTimePicker value={new Date()}
              mode={this.state.modeTime}
              is24Hour={true}
              display="default"
              onChange={this.setTimeCout} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>No of Days:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.days}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Total Eligible Amount: </Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {this.state.days * params.item.upper_limit}
              </Text>
            </Item>

            {params.claim && <>

            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Hotel/Guest House:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
            {this.state.hotelNameError &&
              <Text style={styles.errorText}>{this.state.hotelNameError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Hotel/Guest House GSTIN:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {this.state.hotelItem.Code}
              </Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Amount:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                placeholder='0.00' 
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
              <Label style={[styles.formLabel]}> Invoice Currency:</Label>
              <Text style={[styles.formInput,styles.readOnly,{textAlign:'left'}]}>{this.state.currency}</Text>
            </Item>

            {this.state.currencyError &&
              <Text style={styles.errorText}>{this.state.currencyError}</Text>
            }
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                ref='cgst'
                onSubmitEditing={() => this.refs.sgst.focus()}
                placeholder='0.00' 
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
              <Label style={styles.formLabel}>SGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                ref='sgst'
                onSubmitEditing={() => this.refs.igst.focus()}
                placeholder='0.00' 
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
              <Label style={styles.formLabel}>IGST:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              <Label style={styles.formLabel}>HSN Code:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
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
              minimumDate={new Date(moment(this.formatDateForDisplay(params.params.creation_date)).format('YYYY-MM-DD'))}
              onChange={this.setDateInv} />
            }

            <Label style={[styles.formLabel,{marginLeft: 16}]}>Hotel/Guest House Address:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              placeholder='Enter Hotel/Guest House Address' 
              style={styles.addressInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.htlAdrs}
              returnKeyType="next"
              numberOfLines={4}
              onChangeText={this.handleHtlAdrs} />            
            {this.state.htlAdrsError &&
              <Text style={styles.errorText}>{this.state.htlAdrsError}</Text>
            }

            </>}

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

          <TouchableOpacity style={styles.ftrBtn} onPress={() => this.submitReq()}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity >

          {this.state.through != "Self" &&
          <Button full rounded bordered primary style={[styles.ftrBtn, styles.brdBtn]}
            onPress={() => {}}>
            <Icon name='md-paper-plane' style={styles.brdBtnTxt} />
            <Text style={styles.brdBtnTxt}>Send to Travel Agent</Text>
          </Button>}      
        </ScrollView>
      </KeyboardAvoidingView>
    );
    }
  }
}

const mapStateToProps = state => {
  return {
    reqCreateState: state.reqCreateState,
    reqUpdateState: state.reqUpdateState,
    plans: state.plans,
    travelThroughState: state.travelThroughState,
    travelTypeState: state.travelTypeState,
    stateList: state.stateList,
    locations: state.locations,
    statusResult: state.statusResult,
    hotelList: state.hotelList,
    attachmentState: state.attachmentState,
    attachmentList: state.attachmentList,
    attachmentDeleteState: state.attachmentDeleteState,
    refernceList: state.refernceList
  };
};

const mapDispatchToProps = {
  reqCreate: Actions.reqCreate,
  reqUpdate: Actions.reqUpdate,
  getPlans : Actions.getPlans,
  getTravelThrough: Actions.getTravelThrough,
  getTravelType: Actions.getTravelType,
  getStates: Actions.getStates,
  getReqLocations: Actions.getReqLocations,
  getStatus: Actions.getStatus,
  getHotels: Actions.getHotels,
  attachment: Actions.attachment,
  getAttachments: Actions.getAttachments,
  attachmentDelete: Actions.attachmentDelete,
  getRefernce: Actions.getRefernce
};

export default connect(mapStateToProps, mapDispatchToProps)(HotelReqScreen);