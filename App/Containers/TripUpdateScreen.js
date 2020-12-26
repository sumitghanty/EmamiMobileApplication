import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Picker, Platform, Keyboard, TextInput, BackHandler, Alert, AsyncStorage } from "react-native"
import { Container, Content, Icon, Form, Item, Label, Input } from 'native-base'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { NavigationEvents } from 'react-navigation'
import PickerModal from 'react-native-picker-modal-view'
import {API_URL_FRONT} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/TripCreateScreen';
import updateStyles from './Styles/TripUpdateScreen';
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status'];
class TripUpdateScreen extends Component {
  constructor(props) {

    super(props);
    const {params} = this.props.navigation.state;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.state = {
      showRejectionComment:false,
      searchTerm: '',
      retainerData:null,
      consultantData:null,
      employeeData:null,
      curDate: year+'-'+month+'-'+date,
      dateStart: new Date(params.start_date),
      modeStart: 'date',
      showStart: false,
      dateEnd: new Date(params.end_date),
      modeEnd: 'date',
      showEnd: false,
      purpose: '',
      purposeId: params.purpose,
      for: '',
      travelsName: null,
      forId: params.trip_for,
      retainer_id: 1,
      serchLocationList: [],
      isLoading: false,
      details: params.details,
      fromItem: {"Name": params.trip_from, "Value": params.trip_from, "Code": "", "Id":0},
      toItem: {"Name": params.trip_to, "Value": params.trip_to, "Code": "", "Id":0},
      saveStatusName: '',
      saveSubStatusName: '',
      createStatusName: '',
      createSubStatusName: '',      
      tripFromError: '',
      dateError:null,
      tripToError: '',
      name: global.USER.userName,
      updateParams: '',
      error:false,
      flag:"0"
    };
    this._handleBackPress = this._handleBackPress.bind(this);
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount() {
    const {params} = this.props.navigation.state;
     
     if(params.status_id == "5")
     this.setState({ showRejectionComment: true })


    
    this.props.getReqLocations()
    .then(()=>{
      let fetchLocationList = this.props.locations.dataSource;
      for(var i=0; i<fetchLocationList.length; i++) {
        this.state.serchLocationList.push({
          "Name": fetchLocationList[i].city,
          "Value": fetchLocationList[i].city,
          "Code": fetchLocationList[i].type,
		      "Id": fetchLocationList[i].id,
        },)
        if(fetchLocationList[i].city == params.trip_from) {
          this.setState({ 
            fromItem : {
              "Name": fetchLocationList[i].city, 
              "Value": fetchLocationList[i].city, 
              "Code": fetchLocationList[i].type, 
              "Id": fetchLocationList[i].id
            },
          })
        }        
        if(fetchLocationList[i].city == params.trip_to) {
          this.setState({ 
            toItem : {
              "Name": fetchLocationList[i].city, 
              "Value": fetchLocationList[i].city, 
              "Code": fetchLocationList[i].type, 
              "Id": fetchLocationList[i].id
            },
          })
        }
      }
    });
    this.props.getTrips(global.USER.userId); 
    this.props.getTripFor()
    .then(()=> {
      for(var i=0; i<this.props.tripFor.dataSource.length; i++) {
        if(parseInt(this.props.tripFor.dataSource[i].tripFor_type_id) == parseInt(params.trip_for)) {
          this.setState({ 
            for : this.props.tripFor.dataSource[i].tripFor_type,
          })
        }
      }
    });
    
    this.props.getPurpose('B')
    .then(()=> {
      for(var i=0; i<this.props.purpose.dataSource.length; i++) {
        if(this.props.purpose.dataSource[i].purpose_type_id == params.purpose) {
          this.setState({ 
            purpose : this.props.purpose.dataSource[i].purpose_type,
          })
        }
      }
    });

    this.props.getRetainer()
    .then(()=> {
      if(params.trip_for == "3") {
        for(var i=0; i<this.props.retainer.dataSource.length; i++) {
          if(parseInt(this.props.retainer.dataSource[i].retainer_id) == parseInt(params.name)) {
            this.setState({ 
              travelsName : this.props.retainer.dataSource[i].name_of_retainers,
            })
          }
        }
      }
    });

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
    alert(this.state.forId+ " "+value)
   
  }
  onValueChangeTraveler = (value) => {
    this.setState({ travelsName: value });
    this.props.retainer.dataSource.map((item) => {
      if (item.name_of_retainers == value) {
        this.setState({ retainer_id: item.retainer_id });
      }      
    })
  }
  setDateEnd = (event, dateEnd) => {
    dateEnd = dateEnd || this.state.dateEnd; 
    this.setState({
      showEnd: Platform.OS === 'ios' ? true : false,
      dateError:null,
      dateEnd,
    });
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
      dateError:null,
      dateStart,
    });
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

  loginRequest=()=>{
      //Murchana start
      var value = "Consultant";
      this.setState({ isLoading: true }, () => {
        
        fetch(API_URL_FRONT+'getEmployeeList?type='+value,{
          method: "GET",
          mode: "no-cors",
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json'
            
          }
        })
        .then((response)=> response.json())
        .then((res) => {
          
         // alert(JSON.stringify(res[0].userName));
          this.setState({
            userData: {'userInfo':res}
          });
        })
        .then(() => {
          this.setState({
            isLoading: false
          });
       
       //alert(JSON.stringify(this.state.userData.userInfo[0].userId));
        })
        .catch((Error) => {
          alert("error"+Error);
        });
      })
      

//Murchana End


  }

 
  confirmation = (statusId) => {



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
   if((sortList[i].status_id != "0") && (sortList[i].status_id != "1") && (sortList[i].status_id != "2") && (sortList[i].status_id != "5"))
   //if(sortList[i].status_id=="3")
   {  // alert(sortList[i].status_id)
        startdatearray[j]=sortList[i].start_date;
        enddatearray[j]=sortList[i].end_date;
        //alert(startdatearray[j])
        j++;
    
      }
     
        
   }
  // alert(startdatearray.length);

   for(i=0;i<startdatearray.length;i++)
   {
   startdatearray[i]= new Date(moment(startdatearray[i]).format("MM/DD/YYYY"));
   enddatearray[i]= new Date(moment(enddatearray[i]).format("MM/DD/YYYY"));      
   }
   
   var checkstart =  new Date(moment(this.state.dateStart).format("MM/DD/YYYY")); 
   var checkend=  new Date(moment(this.state.dateEnd).format("MM/DD/YYYY")); 
       
   //alert(startdatearray.length);
   


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
          dateError: 'Please select correct date',
          error: true,
          flag:'1'
        });
        //this.state.flag="1"
        alert("contained")
        // alert("error"+this.state.error)
        return;
        }
        
      else  if(checke > from && checke <= to) {
        this.setState({
          dateError: 'Please select correct date',
          flag:"1",
          error: true,
        });
        //this.state.flag="1"
        alert("contained")
        return;
        }
        else if(from >= checks && from < checke) {
          this.setState({
            dateError: 'Please select correct date',
            error: true,
            flag:"1"
          });
          //this.state.flag="1"
          alert("contained")
        return;
        }
        
       else  if(to > checks && to <= checke) {
        this.setState({
          dateError: 'Please select correct date',
          error: true,
          flag:"1"
        });
        //this.state.flag="1"
        alert("contained")
        return;
        }
        else if(checks == from && checke == from) {
          this.setState({
            dateError: 'Please select correct date',
            error: true,
            flag:"1"
          }); 
          //this.state.flag="1"         
        alert("contained")
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
       dateError: 'Please select correct date'
     });
     alert("Trip duration cannot be more than 90 days");
    return;
   }
    
    
    
    
    
    
    if( this.state.fromItem.Name == "Select From Location" || this.state.toItem.Name == "Select To Location" ) {
      if(this.state.fromItem.Name == "Select From Location") {
        this.setState({
          tripFromError: 'Please select Trip From Location',
          error: true,
        });
      }
      if(this.state.toItem.Name == "Select To Location") {
        this.setState({
          tripToError: 'Please select Trip To Location',
          error: true,
        });
      }
    } 
    
    else {

      if (statusId == '1' ) {
        

      Alert.alert(
          "Update",
          "Do you want to Update this trip?",
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


      } else if(statusId == '2'  ) {
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
 
    const {params} = this.props.navigation.state;
    let newParams = params;    
    let generatedData= null;
    AsyncStorage.getItem("ASYNC_STORAGE_FROM_KEY")
    .then(()=>{
      this.setState({ isLoading: true });
      newParams.trip_from = this.state.fromItem.Name;
      newParams.trip_to = this.state.toItem.Name;
      newParams.start_date = moment(this.state.dateStart).format("YYYY-MM-DD");
      newParams.end_date = moment(this.state.dateEnd).format("YYYY-MM-DD");
      newParams.trip_for = this.state.forId;
      newParams.purpose = this.state.purposeId;
      newParams.trip_creator_name = global.USER.userName;
      newParams.trip_creator_userid = global.USER.userId;
      newParams.details = this.state.details;
      newParams.status_id = statusId;
      newParams.status = statusId == "1"?this.state.saveStatusName:statusId == "2"?this.state.createStatusName:'';
      newParams.userid = global.USER.userId;
      newParams.email = global.USER.userEmail;
      newParams.delete_status = "false";
      newParams.pending_with_email = global.USER.supervisorEmail;
      newParams.pending_with_name = global.USER.supervisorName;
      newParams.pending_with = global.USER.supervisorId;
      newParams.name = this.state.forId == "1" ? this.state.name 
                      : this.state.forId == "3"?this.state.retainer_id
                      :this.state.forId == "5"?''
                      :'';
    })
    .then(()=>{
      this.props.tripUpdate([newParams])
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
              "cc": 'chinmaymcc@gmail.com',
              "subject": 'Kindly provide approval for trip #'+this.state.tripNo,
              "tripNonSales": generatedData,
              "requisitionNonSales": null
            })
            .then(()=>{
              this.props.navigation.navigate('TripList')
              this.setState({ 
                error: false,
                isLoading: false
              });
              if(statusId == "1"  ) {
                Toast.show('Trip Saved Successfully', Toast.LONG);
              }
              if(statusId == "2" ) {
                Toast.show('Trip Updated Successfully', Toast.LONG);
              }
            })
          }
          else { 
            this.props.navigation.navigate('TripList')
            this.setState({ 
              error: false,
              isLoading: false
            });
            if(statusId == "1") {
              Toast.show('Trip Saved Successfully', Toast.LONG);
            }
            if(statusId == "2"&& this.state.dateError.length<0) {
              Toast.show('Trip Updated Successfully', Toast.LONG);
            }
          
        }})
      })
    })
    
    Keyboard.dismiss();
  }

  renderLocationAlert=()=> {
    return(
      Alert.alert(
        "Warning",
        "From location and To location cannot be same.",
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
    if(
      this.state.isLoading || 
      this.props.tripUpdate.isLoading ||
      this.props.locations.isLoading ||
      this.props.tripFor.isLoading ||
      this.props.purpose.isLoading ||
      this.props.retainer.isLoading
      ){
      return(
        <Loader/>
      )
    } else if (
      this.props.tripUpdate.errorStatus ||
      this.props.locations.errorStatus ||
      this.props.tripFor.errorStatus ||
      this.props.purpose.errorStatus ||
      this.props.retainer.errorStatus
    ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    const {params} = this.props.navigation.state;
    console.log(params);
    return (
      <Container style={styles.container}>
        <Content Style={styles.content}>
          <NavigationEvents onDidFocus={() => {}} />
          <View style={updateStyles.header}>
            <Text style={updateStyles.headerLabel}>Trip Id</Text>
            <Text style={updateStyles.headerValue}>{params.trip_no}</Text>
          </View>
          <Form>
          {this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
             value = {params.comment}
              />
                  </View>:null}
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
           {this.state.dateError &&
           <Text style={styles.errorText}>
             {this.state.dateError} 
             </Text>}

            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>End Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateEnd).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
           
            { this.state.showEnd && 
            <DateTimePicker value={this.state.dateEnd}
              mode={this.state.modeEnd}
              minimumDate={new Date(this.state.dateStart)}
              is24Hour={true}
              display="default"
              onChange={this.setDateEnd} />
            }
             {this.state.dateError &&
             <Text style={styles.errorText}>
               {this.state.dateError}
               </Text>}

               {/* <TouchableOpacity onPress={() => this.loginRequest()} style={styles.btn}>
              <LinearGradient 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                colors={['#008ab3', '#8c3fff']} 
                style={styles.btnBg}>
                <Text style={styles.btnTxt}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity > */}

            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select your Purpose"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue= {this.state.purpose}
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
                  onBackButtonPressed={()=>{}}
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
                  onBackButtonPressed={()=>{}}
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
              : this.state.forId == "6" ?
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Travelers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                 selectedValue={this.state.userData.userInfo[0].userName}
                onValueChange={this.onValueChangeTraveler}
                >
                 {this.state.userData.userInfo.map((item, index) => {
                  return (
                  <Picker.Item label={item.personId} value={item.userName} key={index} />
                  );
                })} 
              </Picker>
              : this.state.forId == "5" ?
              <Text>&nbsp;</Text>
             

              :null}
            </Item>
            <Text style={[styles.formLabel,styles.inputLabel]}>Details:</Text>
            <TextInput 
              multiline
              numberOfLines={4}
              placeholder='Enter your comments'
              style={styles.textArea}
              underlineColorAndroid="transparent"
              onChangeText={this.handleChangeDetails}
              value = {this.state.details}
              />
          </Form>         
        </Content>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.confirmation(1)} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBg}>
              <Ficon name='save' style={[styles.ftrBtnIcon,{marginVertical:2}]} />
              <Text style={styles.ftrBtnTxt}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.confirmation(2)} style={styles.ftrBtn}>
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
    tripUpdate: state.tripUpdate,
    trips: state.trips,
    locations: state.locations,
    tripFor: state.tripFor,
    purpose: state.purpose,
    retainer: state.retainer,
    statusResult: state.statusResult,
    sendEmailState: state.sendEmailState,
  };
};

const mapDispatchToProps = {
  tripUpdate : Actions.tripUpdate,
  getTrips : Actions.getTrips,
  getReqLocations: Actions.getReqLocations,
  getTripFor: Actions.getTripFor,
  getPurpose: Actions.getPurpose,
  getRetainer: Actions.getRetainer,
  getStatus: Actions.getStatus,
  sendEmail: Actions.sendEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(TripUpdateScreen);