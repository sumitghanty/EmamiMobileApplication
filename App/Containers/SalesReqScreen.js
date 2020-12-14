import React, { Component, } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Platform, Modal, 
  Keyboard, Alert, AsyncStorage, BackHandler, Switch, Picker, ActivityIndicator, Linking } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"
import PickerModal from 'react-native-picker-modal-view'
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'

import Loader from '../Components/Loader'
import styles from './Styles/SalesReqScreen'


const CLASS = ['Sleeper', 'AC-2 tier', 'AC-3 tier', 'General',];
const SUIT_TIME = ['Morning', 'Afternoon', 'Evening', 'Night'];

class SalesReqScreen extends Component {

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
      flightFromItem: {"Name": (params.update && params.update.travel_from) ? params.update.travel_from : "Select From Location", 
                  "Value": "", "Code": "", 
                "Id": (params.update && params.update.source_city) ? params.update.source_city : 0},
      flightToItem: {"Name": (params.update && params.update.travel_to) ? params.update.travel_to : "Select To Location", 
                "Value": "", "Code": "", 
                "Id": (params.update && params.update.dest_city) ? params.update.dest_city : 0},
      flightFromError: '',
      flightToError: '',
      curDate: new Date,
      dateStart: new Date,
      mode: 'date',
      show: false,
      travelDate: new Date,
      travelDateShow: false,
      isLoading: false,
      error: false,
      statusName: '',
      subStatusName: '',
      statusNameSTA: '',
      subStatusNameSTA: '',
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
      amntError: null,
      tStatus: (params.update && params.update.ticket_status) ? params.update.ticket_status : 'Availed',
      msg: (params.update && params.update.justification) ? params.update.justification :null,
      msgError: null,
      showCin: false,
      showCout: false,
      days: (params.update && params.update.noofdays) ? params.update.noofdays : 1,
      dateCin: new Date(),
      dateCout: new Date(),
      twoWay: (params.update && (params.update.twoWay == "true")) ? true : false,
      firstDay: new Date(),
      lastDay: new Date(),
      modalVisible: 0,
      modalFormVisible: 0,
      modalAttchVisible: 0,
      maxAmount: 0,
      cMinDate: new Date(),
      time: (params.update && params.update.travel_time) ? params.update.travel_time : SUIT_TIME[0],
      OOP: 'N',
      type: (params.update && params.update.travel_type) ? params.update.travel_type : '',
      email: (params.update && params.update.email) ? params.update.email : null,
      emailError: false,
      agent: (params.update && params.update.vendor_name) ? params.update.vendor_name : "",
      vendorId: (params.update && params.update.va_ta_id) ? params.update.va_ta_id :"0",
      vendorEmail: null,
      uc: 'NA',
      hottelGenrateData: null,

      uploading: false,
      uploadData: [],
      curUploadType: 'Approve Email',
      attachFiles: [],
      flieSizeIssue: false,
      trmName: params.item.category_id == '7'?'ptf_airTravel_list'
              :'ptf_list'
    };
  }
  formatYear(year,month){
    if(month==="January" || month==="February" || month==="March")
    {
      return parseInt(year)+1;
    }else return year;
     }
  componentDidMount() {
    const {params} = this.props.navigation.state;
    console.log(params)
    var year = parseInt(params.params.year);
    var month = moment().month(params.params.month).format("M");
    this.setState({
      firstDay: new Date(this.formatYear(year,params.params.month), month - 1, 1),
      lastDay: new Date(this.formatYear(year,params.params.month), month, 0),
      dateStart: (params.update && params.update.pjp_date) ? new Date(params.update.pjp_date) : new Date(this.formatYear(year,params.params.month), month - 1, 1),
      travelDate: (params.update && params.update.travel_date) ? new Date(params.update.travel_date) : new Date(this.formatYear(year,params.params.month), month - 1, 1),
      dateCin: (params.update && params.update.check_in_date) ? new Date(params.update.check_in_date) : new Date(this.formatYear(year,params.params.month), month - 1, 1),
      dateCout: (params.update && params.update.check_out_date) ? new Date(params.update.check_out_date) : new Date(this.formatYear(year,params.params.month), month - 1, 1),
      cMinDate: (params.update && params.update.pjp_date) ? new Date(params.update.pjp_date) : new Date(this.formatYear(year,params.params.month), month - 1, 1),
    });

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

    this.props.getStatus("7","7.4")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getMaxAmnt(global.USER.grade,params.item.category_id)
    .then(()=>{
      this.setState({
        maxAmount: this.props.maxAmntState.dataSource[0].upper_limit,
      });
    })

    if(params.item.category_id == '7'){
      this.props.getTravelType()
      .then(()=>{
        this.setState({
          type: (params.update && params.update.travel_type) 
                ? params.update.travel_type 
                : this.props.travelTypeState.dataSource.length>0
                  ?this.props.travelTypeState.dataSource[0].travel_type:''
        });
      })

      this.props.getVendor("Travel Agent")
      .then(()=>{
        this.setState({
          agent: (params.update && params.update.vendor_name) 
                    ? params.update.vendor_name 
                    :this.props.vendorList.dataSource.length>0
                      ?this.props.vendorList.dataSource[0].vendor_name
                      :'Not Defined',
          vendorId: (params.update && params.update.va_ta_id) 
                    ? params.update.va_ta_id 
                    :this.props.vendorList.dataSource.length>0
                      ?this.props.vendorList.dataSource[0].vendor_id
                      :0,
          vendorEmail: this.props.vendorList.dataSource[0].email
        });
      })

      this.props.getStatus("7","7.1")
      .then(()=>{
        this.setState({
          statusNameSTA: this.props.statusResult.dataSource[0].trip_pjp_status,
          subStatusNameSTA: this.props.statusResult.dataSource[0].sub_status
        });
      });

      this.props.getRefernce(this.state.trmName)
      .then(()=>{
        console.log('sdfghj');
        console.log(this.state.trmName);
        this.setState({
          curUploadType: this.props.refernceList.dataSource[0].trm_value
        });
        for(var i=0; i<this.props.refernceList.dataSource.length; i++) {
          console.log('mandatory..... check......');
          console.log(this.props.refernceList);
          this.state.uploadData.push({"type":this.props.refernceList.dataSource[i].trm_value,
          "file":[],
          'action':null,
          'fileRequired':this.props.refernceList.dataSource[i].trm_mandatory})
        }
      })
      .then(()=>{
        if(params.update){
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
        }
        else {
          this.setState({screenReady: true});
        }
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

  setTravelDate = (event, date) => { 
    const {params} = this.props.navigation.state;
    if(date != undefined) {
      date = date || this.state.travelDate; 
      this.setState({
        travelDateShow: Platform.OS === 'ios' ? true : false,
        travelDate: date,
      });
    } else {
      this.setState({
        travelDateShow: Platform.OS === 'ios' ? true : false,
      });
    }
    this.setState({
      travelDateShow: Platform.OS === 'ios' ? true : false,
    });
  }

  travelDateShow = mode => {
    this.setState({
      travelDateShow: true,
      mode,
    });
  } 
  travelDatepicker = () => {
    this.travelDateShow('date');
  }

  renderLocationAlert=()=> {
    return(
      Alert.alert(
        "Warning",
        "From and To can not be same.",
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
    /*.then(()=>{
      if(this.state.fromItem.Name == this.state.toItem.Name) {
        this.renderLocationAlert();
        this.setState({
          fromItem: {"Name": "Select From Location", "Value": "", "Code": "", "Id":0},
        })
      }
    })*/
  }

  toSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_TO_KEY")
    .then(() => {
      this.setState({
        toItem: value,
        tripToError: ''
      })
    })
    /*.then(()=>{
      if(this.state.fromItem.Name == this.state.toItem.Name) {
        this.renderLocationAlert();
        this.setState({
          toItem: {"Name": "Select To Location", "Value": "", "Code": "", "Id":0},
        })
      }
    })*/
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

  handleChangeAmount = (amnt) => {
    const {params} = this.props.navigation.state;
    this.setState({ 
      amount: amnt,
      amntError: null,
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
        days: newDays == 0? 1: newDays
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
        days: newDays == 0? 1: newDays
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

  setModalAttchVisible(visible) {
    this.setState({modalAttchVisible: visible});
  }

  onValueChangeTime = (time) => {
    this.setState({
      time: time
    });
  } 

  onValueChangeType = (value) => {
    this.setState({
      type: value
    });
  }

  flightFromSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_FROM_KEY")
    .then(() => {
      this.setState({
        flightFromItem: value,
        flightFromError: '',
      })
    })
    .then(()=>{
      if(this.state.flightFromItem.Name == this.state.flightToItem.Name) {
        this.setState({
          flightFromItem: {"Name": "Select From Location", "Value": "", "Code": "", "Id":0},
        })
        this.renderLocationAlert();
      }
    })
  }
  
  flightToSelected(value){
    AsyncStorage.getItem("ASYNC_STORAGE_TO_KEY")
    .then(() => {
      this.setState({
        flightToItem: value,
        flightToError: ''
      })
    })
    .then(()=>{
      if(this.state.flightFromItem.Name == this.state.flightToItem.Name) {
        this.setState({
          flightToItem: {"Name": "Select To Location", "Value": "", "Code": "", "Id":0},
        })
        this.renderLocationAlert();
      }
    })
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

  onValueChangeAgent = (value) => {
    this.setState({
      agent: value
    });
    for (var i=0; i<this.props.vendorList.dataSource.length; i++) {
      if(this.props.vendorList.dataSource[i].vendor_name == value) {
        this.setState({
          vendorId: this.props.vendorList.dataSource[i].vendor_id,
          vendorEmail: this.props.vendorList.dataSource[i].email
        });
      }
    }
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
            "You have selected a large file. Please choose the file less then 3MB.",
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
        alert('You have not select any file for attachment');
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
              console.log(data);
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
    } else {
      this.submitReqData()
    }
  }

  submitReqData = () => {
    const {params} = this.props.navigation.state;
    if(!this.state.fromItem.Name || this.state.fromItem.Name == "Select From Location" ||
    !this.state.toItem.Name || this.state.toItem.Name == "Select To Location" ||
    (params.item.category_id == '3' && this.state.through=="Self" && !this.state.amount) ||
    (params.item.category_id == '3' && !this.state.msg) ||
    (params.item.category_id == '7' && (!this.state.flightFromItem.Name || this.state.flightFromItem.Name == "Select From Location" ||
    !this.state.flightToItem.Name || this.state.flightToItem.Name == "Select To Location" || this.state.emailError))    
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
     if (params.item.category_id == '3' && this.state.through=="Self" && !this.state.amount) {
        this.setState({
         amntError: 'Please enter Approx amount.',
        });
      }
      if(params.item.category_id == '3' && !this.state.msg) {
        this.setState({
          msgError: 'Please enter proper Justification.',
        });
      }
      if(params.item.category_id == '7' && (!this.state.flightFromItem.Name || this.state.flightFromItem.Name == "Select From Location")) {
        this.setState({
          flightFromError: 'Please select flight From'
        });
      }
      if(params.item.category_id == '7' && (!this.state.flightToItem.Name || this.state.flightToItem.Name == "Select To Location")) {
        this.setState({
          flightToError: 'Please select flight To'
        });
      }
      if (params.item.category_id == '7' && this.state.emailError) {
        this.setState({
          emailError: 'Email is not valid.',
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
      this.saveReq(params.update)
    }
    else if(this.state.hottelGenrateData) {
      this.setState({
        modalFormVisible: 1,
        isLoading: false,
      });
    }
    else {
      let newReq = null;
      let index = 0
      this.props.createReqSale(1,params.params.trip_hdr_id)
      .then(()=>{
        index = this.props.createReqSaleState.dataSource.length - 1
      })
      .then(()=>{
        newReq = this.props.createReqSaleState.dataSource[index]
      })
      .then(()=>{
        this.saveReq(newReq)
      })      
    }
    Keyboard.dismiss();
  }
   parseDate(str) {
    
    var mdy = str.split('-');
   
    return new Date(mdy[0], mdy[1]-1, mdy[2]);
}
formatCurrntDate() {
  var d = new Date()
   var    month = '' + (d.getMonth() + 1);
   var    day = '' + d.getDate();
    var   year = d.getFullYear()

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
 datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
  var noOfDaysBetween =  Math.round((second-first)/(1000*60*60*24));
  var scenario = "1";
  if(noOfDaysBetween > 14) {
   
    scenario = "1";
  }
  else if (noOfDaysBetween <= 14 && noOfDaysBetween >5) {
   
    scenario = "2";
  }
  else {
  
    scenario = "3";
  }
  return scenario;
}
  saveReq = (data) => {
    const {params} = this.props.navigation.state;
    let newReq = data;
    let newPJP = params.params;

var pjpDay = moment(this.state.dateStart).format("YYYY-MM-DD");

    var scenario  = this.datediff(this.parseDate(this.formatCurrntDate()), this.parseDate(pjpDay));
    AsyncStorage.getItem("ASYNC_STORAGE_SAVE_KEY")
    .then(()=>{
      newReq.trip_no = params.params.trip_no;
      newReq.scenario = scenario;
      newReq.useremail = params.params.email;
      newReq.username = params.params.name;
      newReq.userid = params.params.userid;
      newReq.travel_grade = global.USER.grade;
      newReq.pending_with = global.USER.supervisorId;
      newReq.pending_with_name = global.USER.supervisorName;
      newReq.pending_with_email = global.USER.supervisorEmail;
      newReq.hq = params.params.hq;
      newReq.pjp_date = moment(this.state.dateStart).format("YYYY-MM-DD");
      newReq.source_city = this.state.fromItem.Id;
      newReq.dest_city = this.state.toItem.Id;
      newReq.source_city_name = this.state.fromItem.Name;
      newReq.dest_city_name = this.state.toItem.Name;
      newReq.mode = params.item.category_id;
      newReq.mode_name = params.item.category;
      newReq.status_id = 7;
      if(params.item.category_id == '7' && this.state.through == "Travel Agent" ){
        if((scenario == "2" || scenario == "3") && newReq.isApproved == null){
          newReq.sub_status_id = "7.4";
          newReq.sub_status =  "Requisition - Emergency Out of Policy";
        } 
        else {newReq.sub_status_id = "7.1";
        newReq.sub_status =   this.state.subStatusNameSTA;
      }
      }else{
        newReq.sub_status_id = "7.4";
        newReq.sub_status =  this.state.subStatusName;
      }
      //newReq.sub_status_id = (params.item.category_id == '7' && this.state.through == "Travel Agent" && scenario != "2" && scenario !="3" && newReq.isApproved == null )?"7.1":"7.4";
      newReq.status = this.state.statusName;
     
     // newReq.sub_status = (params.item.category_id == '7' && this.state.through == "Travel Agent" && (scenario == "2" || scenario =="3") && newReq.isApproved == null )?this.state.subStatusNameSTA:this.state.subStatusName;
      newReq.claimEmpcomment = this.state.comments;
      newReq.twoWay = (this.state.twoWay == true) ? 'true' : 'false';
      newReq.cost_center = global.USER.costCentre;

      if(params.item.category_id == '3'){
        console.log(this.state.amount);
        newReq.justification = this.state.msg;
        newReq.ticket_class = (this.state.tclass == 'AC-2 tier') ? 'AC-2'
                              : (this.state.tclass == 'AC-3 tier') ? 'AC-3'
                              : this.state.tclass; 
        newReq.ticket_status = this.state.tStatus;
        newReq.through = this.state.through;
        newReq.amount_mode = this.state.amount;
      }

      if((params.item.category_id == '14' || params.item.category_id == '22') && this.state.uc == "UC") {
        newReq.through = this.state.through;
        newReq.check_in_date = moment(this.state.dateCin).format("YYYY-MM-DD");
        newReq.check_out_date = moment(this.state.dateCout).format("YYYY-MM-DD");
        newReq.noofdays = this.state.days;        
        newReq.amount_mode = this.state.days * this.state.maxAmount;
      }

      if(params.item.category_id == '7'){
        newReq.travel_date = (this.state.travelDate);
        newReq.travel_type = this.state.type;
        newReq.travel_time = this.state.time;
        newReq.travel_from = this.state.flightFromItem.Name;
        newReq.travel_to = this.state.flightToItem.Name;
        newReq.email = this.state.email;
        newReq.through = this.state.through;
        newReq.amount_mode = this.state.maxAmount;
        newReq.comment = this.state.msg;          
        newReq.vendor_name = this.state.through == "Self" ? params.params.name
                            : this.props.vendorList.dataSource.length>0 ? this.state.agent
                            :'Not Defined';
        newReq.va_ta_id = (this.state.through == "Travel Agent" && this.props.vendorList.dataSource.length>0) ? this.state.vendorId
                            : 0;
        if(this.state.through == "Self") {
          newReq.is_outof_policy = "N"
        }
      }
    })
    .then(()=>{
      let afterSetDistance = null;
      this.props.generateExp([newReq])
      .then(()=>{
        afterSetDistance = this.props.generateExpState.dataSource[0];
        this.setState({
          hottelGenrateData: this.props.generateExpState.dataSource[0],
        })
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
          this.setState({
            modalFormVisible: 1,
            isLoading: false,
          });
        } else {
          this.props.updtReqSale([afterSetDistance])
          .then(()=>{
            newPJP.status_id = 7;
            newPJP.sub_status_id = "7.4";
            newPJP.status = this.state.statusName;
            newPJP.sub_status = this.state.subStatusName;
            newPJP.estimated_cost = (parseInt(params.estCost) - parseInt(params.update.amount_mode == "On Actual"?0:params.update.amount_mode)) 
                                    + parseInt(newReq.amount_mode == "On Actual"?0:newReq.amount_mode);
          })
          .then(()=>{
            this.props.pjpTotal([newPJP])
            .then(()=>{
              this.atchFiles()
              .then(()=>{
                if(this.state.through == "Travel Agent"){
                  this.props.sendEmailSales({
                    "mailId": this.state.vendorEmail,
                    "cc": 'chinmaymcc@gmail.com',
                    "subject": 'Kindly provide flight options.',
                    "tripSales": newPJP,
                    "pjpRequest": afterSetDistance
                  })
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
                } else {
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
                }
              })
            })
          })
        }        
      })
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
    console.log(this.state.twoWay?'Twoday':'Singleway');
    const {params} = this.props.navigation.state;
    console.log(params)
    console.log('oye oye');
    console.log(this.props.attachmentSalesState);
    if(this.state.isLoading || this.props.locations.isLoading || this.props.statusResult.isLoading 
      || this.props.maxAmntState.isLoading||
      (params.item.category_id == '7' && (
        this.props.vendorList.isLoading || this.props.travelTypeState.isLoading||
        this.props.refernceList.isLoading ||
        (params.update && this.props.attachmentListSales.isLoading)
      ) )
    ){   
      console.log('jasjga');
    console.log(this.props.attachmentSalesState);

      return(
        <View style={{flax:1, flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', backgroundColor:'#fff'}}>
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
          {(this.state.uploading && params.item.category_id == '7' && this.state.attachFiles.length > 0&&this.props.attachmentSalesState.dataSource=="File Already exists") ?
          <Text style={{marginTop: 30}}>File could not be uploaded:Filename Already exists</Text>:(this.state.uploading && params.item.category_id == '7' && this.state.attachFiles.length > 0) ?
          <Text style={{marginTop: 30}}>Uploading Attachments</Text>
          :null}
        </View>
      )
    } else if( this.props.locations.errorStatus || this.props.statusResult.errorStatus
      || this.props.maxAmntState.errorStatus ||
      (params.item.category_id == '7' && (this.props.vendorList.errorStatus || this.props.travelTypeState.errorStatus) )||
      (params.update && this.props.attachmentListSales.errorStatus) ||
      this.props.refernceList.errorStatus
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
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
              <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format("DD/MM/YYYY")}</Text>
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
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Distance:</Label>
            <Text style={[styles.value,styles.readOnly]}>{this.state.distance}</Text>
          </Item>
          {(params.item.category_id == '6' ||
            params.item.category_id == '23' ||
            params.item.category_id == '24' ||
            params.item.category_id == '25' ||
            params.item.category_id == '26' ||
            params.item.category_id == '27') ?
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Two way Trip:</Label>
            <Switch
              trackColor={{ false: "#767577", true: "#4cb2ff" }}
              thumbColor={this.state.twoWay == true ? "#29b133" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange ={(twoWay)=>this.setState({twoWay})}
              value={this.state.twoWay}
            />
          </Item>:null}
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Requisition Amount:</Label>
            <Text style={[styles.value,styles.readOnly]}>{parseFloat(this.state.rqAmnt)}</Text>
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
          {(this.state.through == "Self")?
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
          </Item>:null}
          {(this.state.amntError && this.state.through == "Self") &&
            <Text style={styles.errorText}>{this.state.amntError}</Text>
          }
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
            <Label style={styles.formLabel}>Travel Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.travelDatepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.travelDate).format("DD/MM/YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.travelDateShow && 
          <DateTimePicker value={new Date(moment(this.state.travelDate).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={this.state.firstDay}
            maximumDate={this.state.lastDay}
            display="default"
            onChange={this.setTravelDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Eligible Amount @ Flight:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>
              {this.state.maxAmount}
            </Text>
          </Item>
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
            <Label style={styles.formLabel}>Flight From:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <View style={styles.pickerWraper}>
              <PickerModal
                renderSelectView={(disabled, selected, showModal) =>
                  <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                    <Text style={styles.pickerBtnText}>{this.state.flightFromItem.Name}</Text>
                    <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                  </TouchableOpacity>
                }
                onSelected={this.flightFromSelected.bind(this)}
                onClosed={()=>{}}
                //onBackButtonPressed={()=>{}}
                items={this.state.locationList}
                //sortingLanguage={'tr'}
                showToTopButton={true}
                selected={this.state.flightFromItem}
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
          {this.state.flightFromError.length>0 &&
            <Text style={styles.errorText}>{this.state.flightFromError}</Text>
          }
          <Item picker fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Flight To:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <View style={styles.pickerWraper}>
              <PickerModal
                renderSelectView={(disabled, selected, showModal) =>
                  <TouchableOpacity style={styles.pickerBtn} onPress={showModal}>
                    <Text style={styles.pickerBtnText}>{this.state.flightToItem.Name}</Text>
                    <Icon name="arrow-dropdown" style={styles.pickerBtnIcon} />
                  </TouchableOpacity>
                }
                onSelected={this.flightToSelected.bind(this)}
                onClosed={()=>{}}
                //onBackButtonPressed={()=>{}}
                items={this.state.locationList}
                showToTopButton={true}
                selected={this.state.flightToItem}
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
          {this.state.flightToError.length>0 &&
            <Text style={styles.errorText}>{this.state.flightToError}</Text>
          }          
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Email:</Label>
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
          </Item>:
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Name:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>{params.params.name}</Text>
          </Item>
          }
          <Text style={[styles.formLabel,styles.inputLabel]}>Justification:</Text>
          <TextInput 
            placeholder='Enter your justification' 
            style={styles.textArea}
            underlineColorAndroid= "rgba(0,0,0,0)"
            value = {this.state.msg}
            returnKeyType="next"
            numberOfLines={4}
            onChangeText={this.handleMsg} />
          <View style={styles.attachRow}>
            <Text style={styles.formLabel}>Attachments:</Text>
            <Button rounded bordered info onPress={() => { this.setModalAttchVisible(true); }} style={styles.atchBtn}>                
              <Icon name='attach' style={{fontSize:16, marginRight:0}} />
              <Text style={{fontSize:12,textAlign:'center'}}>
                Attach Documents
              </Text>
            </Button>
          </View>
          </>:null}
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

        <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
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
          onRequestClose = {() => {this.setModalFormVisible(0)}}>
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
            {/*<Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Eligible Amount:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>
                {this.state.days * this.state.maxAmount}
              </Text>
            </Item>*/}
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
}

const mapStateToProps = state => {
  return {
    locations: state.locations,
    updtReqSaleState: state.updtReqSaleState,
    travelThroughState: state.travelThroughState,    
    statusResult: state.statusResult,
    createReqSaleState: state.createReqSaleState,
    reqListSales: state.reqListSales,
    generateExpState: state.generateExpState,
    maxAmntState: state.maxAmntState,
    pjpTotalState: state.pjpTotalState,
    travelTypeState: state.travelTypeState,
    vendorList: state.vendorList,
    pjp : state.pjp,
    attachmentSalesState: state.attachmentSalesState,
    attachmentListSales: state.attachmentListSales,
    attachmentDeleteSalesState: state.attachmentDeleteSalesState,
    refernceList: state.refernceList,
    sendEmailSalesState: state.sendEmailSalesState,
  };
};

const mapDispatchToProps = {
  getReqLocations: Actions.getReqLocations,
  updtReqSale : Actions.updtReqSale,
  getTravelThrough: Actions.getTravelThrough,
  getStatus: Actions.getStatus,
  createReqSale: Actions.createReqSale,
  getReqSale : Actions.getReqSale,
  generateExp: Actions.generateExp,
  getMaxAmnt: Actions.getMaxAmnt,
  pjpTotal: Actions.pjpTotal,
  getTravelType: Actions.getTravelType,
  getVendor: Actions.getVendor,
  getPjp : Actions.getPjp,
  attachmentSales: Actions.attachmentSales,
  getAttachmentsSales: Actions.getAttachmentsSales,
  attachmentDeleteSales: Actions.attachmentDeleteSales,
  getRefernce: Actions.getRefernce,
  sendEmailSales: Actions.sendEmailSales
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesReqScreen);