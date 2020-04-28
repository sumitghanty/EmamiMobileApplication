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

import Loader from '../Components/Loader'
import styles from './Styles/TripCreateScreen';
import updateStyles from './Styles/TripUpdateScreen';

class TripUpdateScreen extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.state = {
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
      tripToError: '',
      name: global.USER.userName,
      updateParams: '',
    };
    this._handleBackPress = this._handleBackPress.bind(this);
  }
  
  componentDidMount() {
    const {params} = this.props.navigation.state;

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
 
  confirmation = (statusId) => {
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
    } else {
      if (statusId == '1') {
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
        /*.then(()=>{
          if(statusId == 2) {
            this.props.sendEmail({
              "mailId": global.USER.supervisorEmail,
              "cc": null,
              "subject": 'Kindly provide approval for trip #'+this.state.tripNo,
              "tripNonSales": generatedData,
              "requisitionNonSales": null
            })
          }
          else {
            console.log('Trip Saved');
          }
        })*/
      })
      .then(()=>{
        this.props.navigation.navigate('TripList')       
      })
      .then(()=>{
        this.setState({ 
          error: false,
          isLoading: false
        });
        if(statusId == "1") {
          Toast.show('Trip Saved Successfully', Toast.LONG);
        }
        if(statusId == "2") {
          Toast.show('Trip Updated Successfully', Toast.LONG);
        }
      }) ;
    })
    
    Keyboard.dismiss();
  }

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
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Start Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TouchableOpacity onPress={this.datepickerStart} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.showStart && 
            <DateTimePicker value={this.state.dateStart}
              mode={this.state.modeStart}
              minimumDate={new Date(this.state.curDate)}
              is24Hour={true}
              display="default"
              onChange={this.setDateStart} />
            }
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
              : this.state.forId == "3" ?
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Travelers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.travelsName}
                onValueChange={this.onValueChangeTraveler}
                >
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