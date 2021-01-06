import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Picker, Platform, Keyboard, TextInput, BackHandler, Alert, AsyncStorage,FlatList } from "react-native"
import { Container, Content, Icon, Form, Item, Label,Card,CardItem } from 'native-base'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { NavigationEvents } from 'react-navigation'
import PickerModal from 'react-native-picker-modal-view'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/TripCreateScreen'

//addition
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
//import moment from 'moment'
//import styles from './Styles/TripListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status'];

class TripCreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

      
        searchTerm: '',
    
      curDate: new Date(),
      dateStart: new Date(),
      dateEnd: new Date(),
      modeStart: 'date',
      showStart: false,
      modeEnd: 'date',
      showEnd: false,
      purpose: undefined,
      purposeId: "1",
      for: undefined,
      travelsName: null,
      travelsNameError: '',
      forId: "1",
      serchLocationList: [],
      isLoading: false,
      tripNo: null,
      details: '',
      error: false,
      tripFromError: '',
     //souvik//
    //  date1:new Date(),
    //  date2:new Date(),
    //  Difference_In_Time:null,
    //  Difference_In_Days:null,
     endError: '',
      tripToError: '',
      name: global.USER.userName,
      fromItem: {"Name": "Select From Location", "Value": "", "Code": "", "Id":0},
      toItem: {"Name": "Select To Location", "Value": "", "Code": "", "Id":0},
      saveStatusName: '',
      saveSubStatusName: '',
      createStatusName: '',
      createSubStatusName: '',
      monthcount:0,
      newa:'',
      dateErrorh:null
    };
    this._handleBackPress = this._handleBackPress.bind(this);
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount() {
    //souvik
    
    this.props.getReqLocations()
    .then(()=>{
      for(var i=0; i<this.props.locations.dataSource.length; i++) {
        this.state.serchLocationList.push({
          "Name": this.props.locations.dataSource[i].city,
          "Value": this.props.locations.dataSource[i].city,
          "Code": this.props.locations.dataSource[i].type,
		      "Id": this.props.locations.dataSource[i].id,
        },)
      }
    });
    this.props.getTrips(global.USER.userId);   
    this.props.getTripFor();
    this.props.getPurpose('B');
    this.props.getRetainer();

    this.props.getStatus("1","NA")
    .then(()=>{
      this.setState({
        saveStatusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        saveSubStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });
    this.props.getStatus("2","NA")
    .then(()=>{
      this.setState({
        createStatusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        createSubStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }
  setAge = (date) => {
    var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
    var curDate = moment(new Date()).format('DD/MM/YYYY')
    var diff = moment(newDate, "DD/MM/YYYY").diff(moment(curDate, "DD/MM/YYYY"), 'days');
    return(
      diff
    );
  }
  
  _handleBackPress() {
    if (this.props.navigation.isFocused()) {
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
      return true;
    }
  }

  onValueChangePurpose = (value) => {
    this.setState({ purpose: value });
    this.props.purpose.dataSource.map((item) => {
      if (item.purpose_type == value) {
        this.setState({ purposeId: item.purpose_type_id });
        console.log(item.purpose_type_id);
      }      
    })
  }
  onValueChangeFor = (value) => {
    this.setState({ for: value });
    this.props.tripFor.dataSource.map((item) => {
      if (item.tripFor_type == value) {
        this.setState({ forId: item.tripFor_type_id });
      }      
    })
  }
  onValueChangeTraveler = (value) => {
    this.setState({ 
      travelsName: value,
      travelsNameError: value=='Select Travelers'?'Please select a Traveler':'',
    });
  }
 
  setDateEnd = (event, dateEnd) => {
    //alert('in fun')
    dateEnd = dateEnd || this.state.dateEnd; 
    this.setState( {
      showEnd: Platform.OS === 'ios' ? true : false,
      dateEnd,
      }
       ).then(()=>{
      
      if(this.state.a >'04') {
        
        this.renderDateAlert();
        this.setState({
          dateEnd: dateStart,
        } )
      }
      else{
        alert(parseInt(this.state.a));
      }
    });
  //souvik
  }

  showEnd = modeEnd => {
    this.setState({
      showEnd: true,
      modeEnd,
    });
  } 
  datepickerEnd = () => {
    this.showEnd('dateEnd');
  }
  setDateStart = (event, dateStart) => {
    dateStart = dateStart || this.state.dateStart; 
    this.setState({
      showStart: Platform.OS === 'ios' ? true : false,
      dateStart,
      dateEnd: dateStart,
      
    })
   
  } 
  showStart = mode => {
    this.setState({
      showStart: true,
      mode,
    });
  } 
  datepickerStart = () => {
    this.showStart('dateStart');
  }
  
  handleChangeDetails = (text) => {
    this.setState({ details: text })
  }
  
  confirmation = (statusId) => {
   // alert( moment(this.state.dateStart).format("MM-DD-YYYY"))
   // alert( moment(this.state.dateEnd).format("MM-DD-YYYY"))

//to check if the trip is for more than 90  days

if(this.props.trips.isLoading){
  return(
      <Loader/>
  )
} else if(this.props.trips.errorStatus){
  return(
      <Text>URL Error</Text>
  )
}
var flag="0";
const listData = this.props.trips.dataSource;
const filteredData = listData?listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)):[]
var sortList = filteredData;
// alert(sortList.length)
sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
//alert(JSON.stringify(sortList[0]))
var count=0;
var startdatearray=[];
var enddatearray=[];
var j=0;
for(i=0;i<sortList.length;i++)
{
if((sortList[i].status_id !="0") && (sortList[i].status_id != "1") && (sortList[i].status_id !="2")&&(sortList[i].status_id !="5"))
//if(sortList[i].status_id=="3")
{
     startdatearray[j]=sortList[i].start_date;
     enddatearray[j]=sortList[i].end_date;
   
     j++;
   }
  
}


for(i=0;i<startdatearray.length;i++)
{
startdatearray[i]= new Date(moment(startdatearray[i]).format("MM/DD/YYYY"));
enddatearray[i]= new Date(moment(enddatearray[i]).format("MM/DD/YYYY"));      
}

var checkstart =  new Date(moment(this.state.dateStart).format("MM/DD/YYYY")); 
var checkend=  new Date(moment(this.state.dateEnd).format("MM/DD/YYYY")); 




for(i=0;i<startdatearray.length;i++)
{
    var dateFrom = startdatearray[i].getTime();
    var dateTo = enddatearray[i].getTime();
   // var from = Date.parse(dateFrom);
   // var to   = Date.parse(dateTo);
    var from = dateFrom;
    var to   = dateTo;

    var checks = checkstart.getTime();
    var checke=checkend.getTime();
   //var checks = Date.parse(checkstart);
   // var checke=Date.parse(checkend);

   if(checks >= from && checks < to) {
     this.setState({
       dateErrorh: 'Please select correct date',
       error: true,
       flag:'1'
     });
     //this.state.flag="1"
     //alert("contained")
     // alert("error"+this.state.error)
     return;
     }
     
   else  if(checke > from && checke <= to) {
     this.setState({
       dateErrorh: 'Please select correct date',
       flag:"1",
       error: true,
     });
     //this.state.flag="1"
     //alert("contained");
     return;
     }
     else if(from >= checks && from < checke) {
       this.setState({
         dateErrorh: 'Please select correct date',
         error: true,
         flag:"1"
       });
       //this.state.flag="1"
       alert("contained")
     return;
     }
     
    else  if(to > checks && to <= checke) {
     this.setState({
       dateErrorh: 'Please select correct date',
       error: true,
       flag:"1"
     });
     //this.state.flag="1"
     //alert("contained")
     return;
     }
     else if(checks == from && checke == from) {
       this.setState({
         dateErrorh: 'Please select correct date',
         error: true,
         flag:"1"
       }); 
       //this.state.flag="1"         
     //alert("contained")
     return;
     }

}
 
var date1 = new Date(moment(this.state.dateStart).format("MM/DD/YYYY")); 
var date2 = new Date(moment(this.state.dateEnd).format("MM/DD/YYYY")); 

// To calculate the time difference of two dates 
 var Difference_In_Time = date2.getTime() - date1.getTime(); 


  
// // To calculate the no. of days between two dates 
 var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
 
if(Difference_In_Days >90){
 
 this.setState({
    error: true,
    dateErrorh: 'Please select correct date'
  });
  alert("Trip duration cannot be more than 90 days");
 return;
}
 
 
 
 
 



   if(
      this.state.fromItem.Name == null || this.state.fromItem.Name == "Select From Location" ||
      this.state.toItem.Name == null || this.state.toItem.Name == "Select To Location" ||
      ((this.state.travelsName == null || this.state.travelsName == "Select Travelers") && this.state.forId == "3" )
    ) {
      if(this.state.fromItem.Name == null || this.state.fromItem.Name == "Select From Location") {
        this.setState({
          tripFromError: 'Please select Trip From Location',
          error: true,
        });
      }

      // if(this.state.newa >'4') {
      //   this.setState({
      //     endError: 'Trip date limit exceed',
      //     error: true,
      //   });
      // }
      if(this.state.toItem.Name == null || this.state.toItem.Name == "Select To Location") {
        this.setState({
          tripToError: 'Please select Trip To Location',
          error: true,
        });
      }
      if((this.state.travelsName == null || this.state.travelsName == "Select Travelers") && this.state.forId == "3") {
        this.setState({
          travelsNameError: 'Please select a Traveler',
          error: true,
        });
      }
      console.log('There are some eroor.');
    } else {
      if (statusId == '1') {
        Alert.alert(
          "Save",
          "Do you want to Save this Trip?",
          [
            {
              text: "No",
              style: 'cancel',
            },
            {
              text: "Yes",
              onPress: () => this.submitTrip(statusId),
            }
          ],
          { cancelable: true }
        );
      } else if(statusId == '2') {
        Alert.alert(
          "Submit",
          "Do you want to Submit this Trip?",
          [
            {
              text: "No",
              style: 'cancel',
            },
            {
              text: "Yes",
              onPress: () => this.submitTrip(statusId),
            }
          ],
          { cancelable: true }
        );
      } else {
        console.log('Status ID not matched')
      }
    }
  }

  submitTrip = (statusId) => {
    this.setState({
      isLoading: true
    });
    var generatedData= null;
    return fetch(API_URL+'getLatestTripNumber',{
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
      },
      body: "TRIP"
    })
    .then((response)=> response.text() )
    .then((responseJson)=>{
      //alert("hi"+responseJson);
      this.setState({
        tripNo: responseJson
      });
    })
    .then(() => {    
        this.props.tripCreate([{
          "trip_no": this.state.tripNo,
          "trip_from": this.state.fromItem.Name,
          "trip_to": this.state.toItem.Name,
          "trip_hdr_id": 0,
          "start_date": moment(this.state.dateStart).format("YYYY-MM-DD"),
          "end_date": moment(this.state.dateEnd).format("YYYY-MM-DD"),
          "trip_for": this.state.forId,
          "purpose": this.state.purposeId,
          "trip_creator_name": global.USER.userName,
          "trip_creator_userid": global.USER.userId,
          "details": this.state.details.length>0?this.state.details:null,
          "status_id": statusId,
          "status": statusId == "1"?this.state.saveStatusName:statusId == "2"?this.state.createStatusName:'',
          "userid": global.USER.userId,
          "useremail": global.USER.userEmail,
          "username": global.USER.userName,
          "delete_status": "false",
          "pending_with_email": global.USER.supervisorEmail,
          "pending_with_name": global.USER.supervisorName,
          "pending_with": global.USER.supervisorId,
          "name": this.state.forId == "1" ? this.state.name 
                : this.state.forId == "3" ? this.state.travelsName
                : this.state.forId == "5" ? ''
                :'',
        }])
        .then(()=>{
          this.props.getTrips(global.USER.userId)
          .then(()=>{
            if(statusId == 2) {
              for(var i=this.props.trips.dataSource.length; i>0; i--) {
                if(this.props.trips.dataSource[i-1].trip_no == this.state.tripNo) {
                  generatedData = this.props.trips.dataSource[i-1];                
                  break;
                }
              }
            } else {
              console.log('Trip Saved')
            }
          })
          .then(()=>{
            if(statusId == 2) {
              this.props.sendEmail({
                "mailId": global.USER.supervisorEmail,
                "cc": global.USER.userEmail,
                "subject": 'Kindly provide approval for trip #'+this.state.tripNo,
                "tripNonSales": generatedData,
                "requisitionNonSales": null
              })
              .then(()=>{
                console.log('ready to navygate');
                this.props.navigation.navigate('TripList');
                this.setState({ 
                  error: false,
                  isLoading: false
                });
                if(statusId == "1") {
                  Toast.show('Trip Saved Successfully', Toast.LONG);
                }
                if(statusId == "2") {
                  Toast.show('Trip Submited Successfully', Toast.LONG);
                }
              })
            }
            else {
              this.props.navigation.navigate('TripList');
              this.setState({ 
                error: false,
                isLoading: false
              });
              if(statusId == "1") {
                Toast.show('Trip Saved Successfully', Toast.LONG);
              }
              if(statusId == "2") {
                Toast.show('Trip Submited Successfully', Toast.LONG);
              }
            }
          })
        })
    })
    .catch((Error) => {
      console.log(Error)
    });
    Keyboard.dismiss();
  }
  renderDateAlert=()=> {
    return(
      Alert.alert(
        "Warning",
        "Date limit Exceed(Max 90 days).",
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
//souvik

  renderLocationAlert=()=> {
    return(
      Alert.alert(
        "Warning",
        "From location and To location can not be same.",
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

  render() {
//souvik date issue
//     if(this.props.trips.isLoading){
//       return(
//           <Loader/>
//       )
//     } else if(this.props.trips.errorStatus){
//       return(
//           <Text>URL Error</Text>
//       )
//     }
//     const listData = this.props.trips.dataSource;
//     const filteredData = listData?listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)):[]
//     var sortList = filteredData;
//   // alert(sortList.length)
//     sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
//     alert(JSON.stringify(sortList[0]))
//   var count=0;
//   var startdatearray=[];
//   var enddatearray=[];
//   var j=0;
// for(i=0;i<sortList.length;i++)
// {
//   if(sortList[i].status_id=="1"||sortList[i].status_id=="0"||sortList[i].status_id=="2")
//       {
//          startdatearray[j]=sortList[i].start_date;
//          enddatearray[j]=sortList[i].end_date;
//          j++;
//        }
      
// }
// // var date1 = new Date(moment(this.state.dateStart).format("MM/DD/YYYY")); 
// // var date2 = new Date(moment(this.state.dateEnd).format("MM/DD/YYYY")); 


// for(i=0;i<startdatearray.length;i++)
// {
//  startdatearray[i]=moment(startdatearray[i]).format("MM/DD/YYYY");
// enddatearray[i]=moment(enddatearray[i]).format("MM/DD/YYYY");      
// }



// //alert(triparray);
// alert(count);
// alert("start"+startdatearray)
// alert("end"+enddatearray)
// alert (startdatearray.length)
// var date1 = new Date(moment(this.state.dateStart).format("MM/DD/YYYY")); 
// var dateCheck= new Date(moment(this.state.dateEnd).format("MM/DD/YYYY")); 
// //doing
// for(i=0;i<startdatearray.length;i++)
// {
// var dateFrom = startdatearray[i];
// var dateTo = enddatearray[i];
// var from = Date.parse(dateFrom);
// var to   = Date.parse(dateTo);
// var check = Date.parse(dateCheck);
// if((check <= to && check >= from))      
//     alert("date contained");
 
// }

//souvik date issue 
    if(
      this.state.isLoading || 
      this.props.tripCreate.isLoading ||
      this.props.locations.isLoading ||
      this.props.tripFor.isLoading ||
      this.props.purpose.isLoading ||
      this.props.retainer.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(
      this.props.tripCreate.errorStatus ||
      this.props.locations.errorStatus ||
      this.props.tripFor.errorStatus ||
      this.props.purpose.errorStatus ||
      this.props.retainer.errorStatus
      ){
      return(
        <Text>URL Error</Text>
      )
    } else {
      console.log(this.state.tripNo);
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
          <NavigationEvents onDidFocus={() => {}} />
          <View style={styles.titleBar}>
            <Text style={styles.title}>Create New Trip</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Start Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerStart} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showStart && 
            <DateTimePicker value={new Date()}
              mode="date"
              minimumDate={new Date()}
              display="default"
              onChange={this.setDateStart} />
            }
             {this.state.dateErrorh &&
             <Text style={styles.errorText}>
               {this.state.dateErrorh}
               </Text>}
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>End Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateEnd).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showEnd && 
            <DateTimePicker value={new Date(moment(this.state.dateEnd).format("YYYY-MM-DD"))}
              mode={this.state.modeEnd}
              minimumDate={new Date(moment(this.state.dateStart).format("YYYY-MM-DD"))}
              display="default"
              onChange={this.setDateEnd} />
            }
              {this.state.endError.length>0 &&
              <Text style={styles.errorText}>{this.state.endError}</Text>
            }  
             {this.state.dateErrorh &&
             <Text style={styles.errorText}>
               {this.state.dateErrorh}
               </Text>}

            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select your Purpose"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.purpose}
                onValueChange={this.onValueChangePurpose}
                >
                {this.props.purpose.dataSource.map((item, index) => {
                  return (
                  <Picker.Item label={item.purpose_type} value={item.purpose_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
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
                  items={this.state.serchLocationList}
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
                  items={this.state.serchLocationList}
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select your Location"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.for}
                onValueChange={this.onValueChangeFor}
                >
                {this.props.tripFor.dataSource.map((item, index) => {
                  return (
                  <Picker.Item label={item.tripFor_type} value={item.tripFor_type} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>
                Traveler's Name:
                {this.state.forId != "1" &&
                <Text style={{color:'red',fontSize:13}}>*</Text>}
              </Label>
              {this.state.forId == "1" ?
              <Text style={[styles.value,styles.readOnly]}>{this.state.name}</Text>
              : this.state.forId == "3" ?
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                //placeholder="Select Travelers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.travelsName}
                onValueChange={this.onValueChangeTraveler}
                >
                <Picker.Item label={'Select Travelers'} value={'Select Travelers'} />
                {this.props.retainer.dataSource.map((item, index) => {
                  return (
                  <Picker.Item label={item.name_of_retainers} value={item.name_of_retainers} key={index} />
                  );
                })}
              </Picker>
              : this.state.forId == "5" ?
              <Text>&nbsp;</Text>
              :null}
            </Item>
            {this.state.travelsNameError.length>0 &&
              <Text style={styles.errorText}>{this.state.travelsNameError}</Text>
            }
            <Text style={[styles.formLabel,styles.inputLabel]}>Details:</Text>
            <TextInput 
              multiline
              numberOfLines={4}
              placeholder='Enter your comments'
              style={styles.textArea}
              underlineColorAndroid="transparent"
              onChangeText={this.handleChangeDetails}
              />
          </Form>         
        </Content>       
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.confirmation('1')} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBg}>
              <Ficon name='save' style={[styles.ftrBtnIcon,{marginVertical:2}]} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.confirmation('2')} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name="md-done-all" style={[styles.ftrBtnIcon,{fontSize:20}]} />
              <Text style={styles.ftrBtnTxt}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
  }
  
};

const mapStateToProps = state => {
  return {
    tripCreate: state.tripCreate,
    trips: state.trips,
    locations: state.locations,
    tripFor: state.tripFor,
    purpose: state.purpose,
    retainer: state.retainer,
    statusResult: state.statusResult,
    sendEmailState: state.sendEmailState,
    generateIdState: state.generateIdState
  };
};

const mapDispatchToProps = {
  tripCreate : Actions.tripCreate,
  getTrips : Actions.getTrips,
  getReqLocations: Actions.getReqLocations,
  getTripFor: Actions.getTripFor,
  getPurpose: Actions.getPurpose,
  getRetainer: Actions.getRetainer,
  getStatus: Actions.getStatus,
  sendEmail: Actions.sendEmail,
  generateId: Actions.generateId
};

export default connect(mapStateToProps, mapDispatchToProps)(TripCreateScreen);