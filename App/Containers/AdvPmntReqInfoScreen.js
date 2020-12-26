import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Modal, TextInput, Alert } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import moment from 'moment'

import {Purpose, For} from '../Components/GetValue'
import Loader from '../Components/Loader'
import styles from './Styles/AdvPmntReqInfoScreen'

class AdvPmntReqInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      tripAcrd: 0,
      updateParams: '',
      changeStatusDone: false,
      rejComment: '',
      isLoading: false,
    };
  }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setTripAcrd() {
    this.setState({
      tripAcrd: this.state.tripAcrd == 0?1:0
    });
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

  changeStatus() {
    this.setState({ 
      isLoading: true,
      modalVisible: false
    });
    const {params} = this.props.navigation.state;
    let newParams = params;
    newParams.advancePaymentStatusId = "15";
    newParams.advancePaymentStatus = "Advance Payment - Approved by Approver";
    newParams.pending_with = global.USER.financerId;
    newParams.pending_with_name = global.USER.financerName;
    newParams.pending_with_email = global.USER.financerEmail;
    this.setState({
      updateParams:newParams,
      changeStatusDone: true
    });
  }

  changeRejStatus() {
    this.setState({ 
      isLoading: true,
      modalVisible: false
    });
  
    const {params} = this.props.navigation.state;
    
    let newParams = params;
    newParams.advancePaymentStatusId = "16";
    newParams.advancePaymentStatus = "Advance Payment - Rejected by Approver";    
    newParams.pending_with = global.USER.financerId;
    newParams.pending_with_name = global.USER.financerName;
    newParams.pending_with_email = global.USER.financerEmail;   
    newParams.comment = this.state.rejComment;
    this.setState({
      updateParams:newParams,
      changeStatusDone: true
    });
  }

  approveTripNonReq() {
    const {params} = this.props.navigation.state;
    this.changeStatus();
    if(this.state.changeStatusDone) {
      this.props.postAprAdvPmnt(this.state.updateParams)
      .then(()=>{
        this.props.sendEmail({
          "mailId": global.USER.financerEmail,
          "cc": params.email,
          "subject": 'trip #'+this.state.tripNo+' has been approved.',
          "tripNonSales": this.state.updateParams,
          "requisitionNonSales": null
        })
        .then(()=>{
          this.props.getAdvPmntPend(global.USER.personId,"14");
          this.props.navigation.navigate('ApproveNoneSaleAdvance');
          Toast.show('Advance Payment Approved Successfully', Toast.LONG);
          console.log('Approve Done');
        });
      })
    }
  }

  rejectTripNonReq() {
    this.changeRejStatus();
    if(this.state.changeStatusDone) {
    
      this.props.postAprAdvPmnt(this.state.updateParams)
      .then(()=>{
        this.props.sendEmail({
          "mailId": this.state.updateParams.email,
          "cc": 'chinmaymcc@gmail.co',
          "subject": 'trip #'+this.state.tripNo+' has been rejected.',
          "tripNonSales": this.state.updateParams,
          "requisitionNonSales": null
        })
        .then(()=>{
          this.props.getAdvPmntPend(global.USER.userId,"14");
          this.props.navigation.navigate('ApproveNoneSaleAdvance');
          Toast.show('Advance Payment Rejected Successfully', Toast.LONG);
          console.log('Reject Done');
        });
      })
    }
  }

  approveConfirmation(e) {
    Alert.alert(
      'Approve',
      'Do you want to approve the advance payment request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.approveTripNonReq()
        },
      ],
      {cancelable: true},
    )
  };

  rejectConfirmation(e) {
    if(this.state.rejComment.length<1) {
      Alert.alert(
        'Field Required',
        'Please enter rejection reason.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      Alert.alert(
        'Reject',
        'Are you sure to Reject this Advance Payment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.rejectTripNonReq()
          },
        ],
        {cancelable: true},
      )
    }
  };

  handleRejComment = (text) => {
    this.setState({ rejComment: text })
  }

  render() {
    if(this.state.isLoading){
      return(
          <Loader/>
      )
    } else if (this.props.aprAdvPmnt.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
    const {params} = this.props.navigation.state;
    //console.log(this.state.updateParams);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setTripAcrd()}}>
            <Text style={styles.acrdTitle}>View Trip Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.tripAcrd==0?"md-add-circle":"md-remove-circle"} />
          </TouchableOpacity>
          <View style={[styles.accordionBody,{display:this.state.tripAcrd==0?'none':'flex'}]}>
            <View style={styles.row}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>From:</Text>
              <Text style={styles.value}>{params.trip_from}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To:</Text>
              <Text style={styles.value}>{params.trip_to}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Purpose:</Text>
              <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Trip For:</Text>
              <Text style={styles.value}><For value={params.trip_for} /></Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Traveler Name:</Text>
              <Text style={styles.value}>{params.name}</Text>
            </View>
            <View style={[styles.row,styles.rowLast]}>
              <Text style={styles.label}>Details:</Text>
              <Text style={styles.value}>{params.details}</Text>
            </View>            
          </View>
          <Text style={styles.title}>Advance Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Cost:</Text>
            <Text style={styles.value}>{this.formatAmountForDisplay(params.estimated_cost?params.estimated_cost:'0.0')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Advance Payment:</Text>
            <Text style={styles.value}>{this.formatAmountForDisplay(params.payment_amount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Currency:</Text>
            <Text style={styles.value}>{params.currency?params.currency:'INR'}</Text>
          </View> 
          {/*<View style={[styles.row,styles.rowLast]}>
            <Text style={styles.label}>Attachment:</Text>
            <View style={styles.atchFiles}>
              <Text style={styles.atchFile}>Pending</Text>
            </View>
          </View>*/}
          {/*<TouchableOpacity style={styles.downloadBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#9752ff', '#5e93ff']} 
              style={styles.downloadBtnGrd}>
              <Icon name='md-download' style={styles.downloadBtnIcon} />
              <Text style={styles.downloadBtnTxt}>Download</Text>
            </LinearGradient>
          </TouchableOpacity >*/}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.ftrBtn}
            onPress={() => {this.setModalVisible(true);}}
            >
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#e63826', '#fb4b7b']} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Reject</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.ftrBtn}
            onPress={()=>this.approveConfirmation(params)}
            >
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#5ba11c', '#92d40a']} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Approve</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false)}}>
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Rejection reason:</Text>
            <TextInput 
              multiline
              numberOfLines={4}
              style={styles.modalInput}
              underlineColorAndroid="transparent"
              onChangeText={this.handleRejComment}
              />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn,styles.modalBtnDngr]}
                onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                <Text style={[styles.mBtntxt,styles.mBtntxtDanger]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn,styles.modalBtnPrimary]}
                onPress={
                  () => { this.setModalVisible(!this.state.modalVisible); },
                  ()=>this.rejectConfirmation(params)
                }>
                <Text style={[styles.mBtntxt,styles.mBtntxtPrimary]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    aprAdvPmnt: state.aprAdvPmnt,
    aprvPmntPend: state.aprvPmntPend,
    sendEmailState: state.sendEmailState,
  };
};

const mapDispatchToProps = {
  postAprAdvPmnt : Actions.postAprAdvPmnt,
  getAdvPmntPend : Actions.getAdvPmntPend,
  sendEmail: Actions.sendEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvPmntReqInfoScreen);