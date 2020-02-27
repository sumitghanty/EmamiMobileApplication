import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Platform, Modal, 
  Keyboard, Alert, AsyncStorage, BackHandler } from "react-native";
import { Icon, Text, Form, Item, Label } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import { HeaderBackButton } from "react-navigation-stack"

import Loader from '../Components/Loader'
import styles from './Styles/OtherRequisitionScreen'

class OtherRequisitionScreen extends Component {

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
      curDate: new Date,
      dateStart: (params.update && params.update.start_date)?params.update.start_date:params.params.start_date,
      dateEnd: (params.update && params.update.end_date)?params.update.end_date:params.params.end_date,
      mode: 'date',
      show: false,
      showEnd: false,
      isLoading: false,
      error: false,
      aprxAmnt: (params.update && params.update.amount)?params.update.amount:'0',
      statusName: '',
      subStatusName: '',
      lineitem: null
    };
  }
  
  componentDidMount() {
    const {params} = this.props.navigation.state;

    this.props.getStatus("20","NA")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

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
    date = date || this.state.dateStart; 
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      dateStart: date,
      dateEnd: date
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

  setEndDate = (event, date) => {
    date = date || this.state.dateEnd; 
    this.setState({
      showEnd: Platform.OS === 'ios' ? true : false,
      dateEnd: date,
    });
  } 
  showEnd = mode => {
    this.setState({
      showEnd: true,
      mode,
    });
  } 
  datepickerEnd = () => {
    this.showEnd('date');
  }

  handleChangeAmount = (amount) => {
    this.setState({ 
      aprxAmnt: amount
    })
  }

  submitReq = () => {
    const {params} = this.props.navigation.state;
    this.setState({
      isLoading: true,
    });
    if(params.update){
      let newReq = params.update;
      AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
      .then(()=>{
        newReq.req_type = params.item.sub_category_id;
        newReq.start_date = moment(this.state.dateStart).format('YYYY-MM-DD');
        newReq.end_date = moment(this.state.dateEnd).format('YYYY-MM-DD');
        newReq.gl = params.item.gl;
        newReq.travel_heads = params.item.travel_heads;  
        newReq.status_id = "20";
        newReq.sub_status_id = "NA";
        newReq.status = this.state.statusName;
        newReq.sub_status = this.state.subStatusName;
        if(params.item.bill_required == 'Y') {
          newReq.is_billRequired = 'Y';
          newReq.invoice_amount = this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt);
        } else {
          newReq.amount = this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt);
        }
      })
      .then(()=>{
        this.props.reqUpdate([newReq])
        .then(()=>{
          this.setState({
            isLoading: false,
          });
        })
        .then(()=>{
          this.props.navigation.goBack();
          Toast.show('Expense Updated Successfully', Toast.LONG);
        });
      });

    } else {
      this.props.getPlans(params.params.trip_hdr_id)
      .then(()=>{
        this.setState({
          lineitem: this.props.plans.dataSource.length + 1,
        });
      })
      .then(()=>{
        let postData = [{
          "trip_hdr_id_fk": params.params.trip_hdr_id,          
          "trip_no": params.params.trip_no,
          "useremail": params.params.email,
          "username": params.params.name,
          "userid": params.params.userid,
          "start_date": moment(this.state.dateStart).format('YYYY-MM-DD'),
          "end_date": moment(this.state.dateEnd).format('YYYY-MM-DD'),
          "req_type": params.item.sub_category_id,
          "amount": this.state.aprxAmnt.length<1?0:parseFloat(this.state.aprxAmnt),
          "status_id": "20",
          "sub_status_id": "NA",
          "status": this.state.statusName,
          "sub_status": this.state.subStatusName,
          "is_outof_policy": "N",
          "is_billRequired": params.item.bill_required == 'Y'?'Y':'N',
          "invoice_amount": params.item.bill_required == 'Y'?this.state.aprxAmnt:null,
          "delete_status" : "false",
          "pending_with": global.USER.supervisorId,
          "pending_with_name": global.USER.supervisorName,
          "pending_with_email": global.USER.supervisorEmail,
          "lineitem": this.state.lineitem,
          
          "gl": params.item.gl,
          "travel_heads": params.item.travel_heads,
          "creation_date": moment(this.state.curDate).format("YYYY-MM-DD"),          
        }]
        this.props.reqCreate(postData)
        .then(()=>{
          this.props.updtReqNSBD(postData)
          .then(()=>{
            this.setState({
              isLoading: false,
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Expense Created Successfully', Toast.LONG);
          })
        })
      });
    }
    Keyboard.dismiss();
  }

  render() {
    const {params} = this.props.navigation.state;
    if(this.state.isLoading ||
      this.props.plans.isLoading ||
      this.props.statusResult.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(this.props.reqCreateState.errorStatus
      || this.props.reqUpdateState.errorStatus 
      || this.props.plans.errorStatus 
      || this.props.statusResult.errorStatus) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.item.sub_category}</Text>
        </View>
        <Form>
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Start Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateStart).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.show && 
          <DateTimePicker value={new Date(moment(this.state.dateStart).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>End Date:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TouchableOpacity onPress={this.datepickerEnd} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.dateEnd).format("DD-MM-YYYY")}</Text>
              <Icon name="calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </Item>
          { this.state.showEnd && 
          <DateTimePicker value={new Date(moment(this.state.dateStart).format('YYYY-MM-DD'))}
            mode="date"
            minimumDate={new Date(moment(params.params.start_date).format('YYYY-MM-DD'))}
            maximumDate={new Date(moment(params.params.end_date).format('YYYY-MM-DD'))}
            display="default"
            onChange={this.setEndDate} />
          }
          <Item fixedLabel style={styles.formRow}>
            <Label style={styles.formLabel}>Amount :</Label>
            <TextInput 
              placeholder='0.00' 
              style={styles.formInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.aprxAmnt}
              keyboardType="decimal-pad"
              autoCapitalize="words"
              onChangeText={this.handleChangeAmount} />
          </Item>
        </Form>
        </ScrollView>

        <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#53c55c', '#33b8d6']} 
            style={styles.ftrBtnBg}>
            <Icon name='done-all' style={styles.ftrBtnIcon} />
            <Text style={styles.ftrBtnTxt}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
    }
  }
}

const mapStateToProps = state => {
  return {
    reqCreateState: state.reqCreateState,
    plans: state.plans,
    statusResult: state.statusResult,
    reqUpdateState: state.reqUpdateState,
    updtReqNSBDState: state.updtReqNSBDState,
    //trpNSClmDtlUpdtState: state.trpNSClmDtlUpdtState
  };
};

const mapDispatchToProps = {
  reqCreate : Actions.reqCreate,
  getPlans : Actions.getPlans,
  getStatus: Actions.getStatus,
  reqUpdate: Actions.reqUpdate,
  updtReqNSBD: Actions.updtReqNSBD,
  //trpNSClmDtlUpdt: Actions.trpNSClmDtlUpdt
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherRequisitionScreen);