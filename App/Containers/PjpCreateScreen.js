import React, { Component } from 'react'
import { View, TouchableOpacity, Picker, Alert, AsyncStorage } from "react-native"
import { Container, Content, Icon, Text, Form, Item, Label, Input } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Actions from '../redux/actions'
import { connect } from 'react-redux'
import {API_URL} from '../config'
import Loader from '../Components/Loader'
import Toast from 'react-native-simple-toast'

import styles from './Styles/PjpCreateScreen';

const MONTHSLIST = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March']

class PjpCreateScreen extends Component {
  UNSAFE_componentWillMount() {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    this.setState({
      curYear: ''+year,
      selectedYear: ''+year,
      curMonth: MONTHS[month],
      selectedMonth: MONTHS[month],
    });
    this.onValueChangeYear(''+year)
  }
  constructor() {
    super();
    this.state = {
      purpose: undefined,
      purposeId: "1",
      for: undefined,
      travelsName: undefined,
      forId: 1,
      retainer_id: 1,
      curYear: '',
      selectedYear: '',
      curMonth: '',
      selectedMonth: '',
      monthList: [],
      isLoading: false,
      isError: false,
      tripNo: '',
      details: null,
      status: '',
    };
  } 

  componentDidMount() {
    this.props.getTripFor();
    this.props.getPurpose('B');
    this.props.getRetainer();
    this.props.getYear()

    .then(()=>{
      this.setState({
        selectedYear: this.props.yearList.dataSource[0],
        curYear: this.props.yearList.dataSource[0]
      });
    });
    this.onValueChangeYear(''+this.props.yearList.dataSource[0])

    this.props.getStatus("0","NA")
    .then(()=>{
      this.setState({
        status: this.props.statusResult.dataSource[0].trip_pjp_status
      });
    });
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
    this.setState({ travelsName: value });
    this.props.retainer.dataSource.map((item) => {
      if (item.name_of_retainers == value) {
        this.setState({ retainer_id: item.retainer_id });
      }      
    })
  }
  onValueChangeYear = (value) => {
    this.setState({ selectedYear: value });
   // alert(value)
    var newMotnhList = Array.from(MONTHS);
    if(value == ''+new Date().getFullYear()){
   //   alert(new Date().getFullYear()+" "+new Date().getMonth())
      var currentMonth = MONTHSLIST[new Date().getMonth()];
      var currentMonthIndex = 0;
      for(var i=0; i<newMotnhList.length; i++) {
        if(newMotnhList[i] == currentMonth) currentMonthIndex = i;
      }
      //alert(currentMonth+" "+currentMonthIndex);
      newMotnhList.splice(0, currentMonthIndex);
      
   // alert(JSON.stringify(newMotnhList));
    
    }
    //alert(JSON.stringify(newMotnhList));
    this.setState({monthList: newMotnhList});
    console.log('hi');
  }
  onValueChangeMonth= (value) => {
    this.setState({ selectedMonth: value });
  }

  handleChangeDetails = (text) => {
    this.setState({ details: text })
  }

  submit=()=>{    
    this.setState({
      isLoading: true
    });
    this.props.getPjpByMonth(global.USER.userId,this.state.selectedMonth,this.state.selectedYear)
    .then(()=>{
      if(this.props.getPjpByMonthState.dataSource.length>0) {
        Alert.alert(
          'Duplicate entry',
          'Tour for '+this.state.selectedMonth+'-'+this.state.selectedYear+' already exists. Please choose another month',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        )    
        this.setState({
          isLoading: false
        });
      } else {  
        this.saveData();
      }
    })
  }

  saveData = () => {
    this.setState({
      isLoading: true
    });
    /*this.props.generateId("PJP")
    .then(()=>{
      this.setState({
        tripNo: this.props.generateIdState.dataSource
      })
    })*/
    return fetch(API_URL+'getLatestTripNumber',{
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
      },
      body: "PJP"
    })
    .then((response)=> response.text() )
    .then((responseJson)=>{
      this.setState({
        tripNo: responseJson
      });
    })
    .then(()=>{
      console.log(this.state.tripNo)
      this.props.pjpCreate([{
        "isGroup": this.state.forId == 5 ? 'Y':'N',
        "person_id": global.USER.personId,
        "travel_grade": global.USER.grade,
        "email": global.USER.userEmail,
        "userid": global.USER.userId,
        "designation": global.USER.designation,
        "zone": global.USER.zone,
        "location": global.USER.location,
        "cost_center": global.USER.costCentre,
        "hq": global.USER.location,
        //"hq_id": global.USER.grade,
        "pending_with": global.USER.supervisorId,
        "pending_with_name": global.USER.supervisorName,
        "pending_with_email": global.USER.supervisorEmail,
        "name": this.state.forId == "1" ? global.USER.userName
          : this.state.forId == "3" ? this.state.travelsName
          : this.state.forId == "5" ? global.USER.userName
          :'',
        "trip_no": this.state.tripNo,
        "trip_for": this.state.forId,
        "status": this.state.status,
        "status_id": 0,
        "month": this.state.selectedMonth,
        "year": parseInt(this.state.selectedYear),
        "details": (this.state.details && this.state.details.length>0)?this.state.details:null,
        "delete_status": "false",
        "purpose": this.state.purposeId,
      }])
      .then(()=>{
        this.props.getPjp(global.USER.userId)
        .then(()=>{
          this.setState({
            isLoading: false
          });
          this.props.navigation.goBack();
          Toast.show('Tour created successfully', Toast.LONG);
        })
      })
    })
    .catch((Error) => {
      console.log(Error)
    });
  }
  
  render() {    
    if(this.state.isLoading || this.props.tripFor.isLoading || this.props.purpose.isLoading 
      || this.props.retainer.isLoading || this.props.yearList.isLoading){
      return(
        <Loader/>
      )
    } else if(this.state.isError || this.props.tripFor.errorStatus || this.props.purpose.errorStatus 
      || this.props.retainer.errorStatus || this.props.yearList.errorStatus) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    return (
      <Container style={styles.container}>
        <Content Style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Create New PJP</Text>
          </View>
          <Form>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>PJP Year:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Year"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={''+this.state.selectedYear}
                onValueChange={this.onValueChangeYear}
                >
                {this.props.yearList.dataSource.map((item, index) => {
                return (
                <Picker.Item label={''+parseInt(item)+"-"+((parseInt(item)+1)+"").substring(2,4)} value={''+parseInt(item)} key={index} />
                );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>PJP Month:</Label>
              <Picker
                mode="popup"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.formInput}
                placeholder="Select month"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectedMonth}
                onValueChange={this.onValueChangeMonth}
                >
                {this.state.monthList.map((item, index) => {
                  return (
                  <Picker.Item label={item} value={item} key={index} />
                  );
                })}
              </Picker>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:</Label>
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
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:</Label>
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
              <Label style={styles.formLabel}>Traveler's Name:</Label>
              {this.state.forId == 1 ?
              <Text style={[styles.value,styles.readOnly]}>{global.USER.userName}</Text>
              : this.state.forId == 5 ?
              <Text>&nbsp;</Text>
              : 
              <Picker
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Travelers"
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
              }
            </Item>            
            <Item stackedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Details:</Label>
              <Input 
                multiline
                numberOfLines={4}
                placeholder='Enter your comments'
                style={[styles.formInput,{fontSize:14}]}
                underlineColorAndroid="transparent"
                onChangeText={this.handleChangeDetails}
                />
            </Item>
          </Form>
          <TouchableOpacity onPress={()=>this.submit()} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={["#9752ff", "#5e93ff"]} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Create Tour Plan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Content>
      </Container>
    );
    }
  }
}

mapStateToProps = state => {
  return {
    tripFor: state.tripFor,
    purpose: state.purpose,
    retainer: state.retainer,
    pjp : state.pjp,
    generateIdState: state.generateIdState,
    pjpCreateState: state.pjpCreateState,
    yearList: state.yearList,
    getPjpByMonthState: state.getPjpByMonthState,
    statusResult: state.statusResult,
  };
};

mapDispatchToProps = {
  getTripFor: Actions.getTripFor,
  getPurpose: Actions.getPurpose,
  getRetainer: Actions.getRetainer,
  getPjp : Actions.getPjp,
  generateId: Actions.generateId,
  pjpCreate: Actions.pjpCreate,
  getYear: Actions.getYear,
  getPjpByMonth: Actions.getPjpByMonth,
  getStatus: Actions.getStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpCreateScreen);