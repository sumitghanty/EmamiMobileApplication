import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Keyboard,AsyncStorage } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import {Purpose, For, ReqType} from '../Components/GetValue'
import styles from './Styles/ApproveNoneSaleTripDetailsScreen'

const ASYNC_STORAGE_COMMENTS_KEY = 'ANYTHING_UNIQUE_STRING'

class ApproveNoneSaleTripDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,    
      attachData: null,
      dataSource: null,
      SelectedDataList: [],
      updateParams: '',
      changeStatusDone: false,
      rejComment: '',
      isLoading: false,
      isError: false,
      hasOOP: false,
      aprvReqList: [],
    };
  }
  componentDidMount(props){
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      this.setState({dataSource: this.props.plans.dataSource});
      for(var i=0; i<this.props.plans.dataSource.length; i++) {
        if(this.props.plans.dataSource[i].is_outof_policy=="Y") {
          this.setState({hasOOP: true});
        }
      }
    });
  }

  state = {
    modalVisible: false,    
    attachData: null,
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  attachModalVisible(value){
    this.setState({attachData: value});
  }
  press = (hey) => {
    this.props.plans.dataSource.map((item) => {
      if (item.lineitem === hey.lineitem) {
        item.check = !item.check
        if (item.check === true) {
          this.state.SelectedDataList.push(item);
        } else if (item.check === false) {
          const i = this.state.SelectedDataList.indexOf(item)
          if (1 != -1) {
            this.state.SelectedDataList.splice(i, 1);
            return this.state.SelectedDataList
          }
        }
      }
    })
    this.setState({dataSource: this.props.plans.dataSource})
  }

  changeStatus() {
    this.setState({ 
      isLoading: true,
      modalVisible: false
    });
    const {params} = this.props.navigation.state;
    let newParams = params;
    if (params.status_id == "2") {
      newParams.status_id = "3";
      newParams.status = "Create Trip/PJP - Approved by Supervisor";
    } else if (params.status_id == "8" && params.sub_status_id == "8.1") {
      if(params.sub_status_id == "8.1") {
        newParams.status_id = "9";
        newParams.sub_status_id = "9.1";
        newParams.status = "Requisition - Approved by Supervisor";
      }
    }
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
    if (params.status_id == "2") {
      newParams.status_id = "5";
      newParams.status = "Create Trip/PJP - Rejected by Supervisor";
    } else if (params.status_id == "8" && params.sub_status_id == "8.1") {
      if(params.sub_status_id == "8.1") {
        newParams.status_id = "10";
        newParams.sub_status_id = "10.1";
        newParams.status = "Requisition - Rejected by Supervisor";
      }
    }    
    newParams.comment = this.state.rejComment;
    this.setState({
      updateParams:newParams,
      changeStatusDone: true
    });
  }

  approveTripNonReq() {
    this.changeStatus();
    if(this.state.changeStatusDone) {
      this.props.aprvTripNonReq(this.state.updateParams)
      .then(()=>{
        this.props.getApprovedTripPending(global.USER.userEmail);
        this.props.navigation.navigate('ApproveNoneSaleTrip');
        Toast.show('Trip Approved Successfuly', Toast.LONG);
        console.log('Approve Done');
      });
    }
  }

  rejectTripNonReq() {
    this.changeRejStatus();
    if(this.state.changeStatusDone) {
      this.props.aprvTripNonReq(this.state.updateParams)
      .then(()=>{
        this.props.getApprovedTripPending(global.USER.userEmail);
        this.props.navigation.navigate('ApproveNoneSaleTrip');
        Toast.show('Trip Reject Successfuly', Toast.LONG);
        console.log('Reject Done');
      });
    }
  }

  approveConfirmation(e) {
    Alert.alert(
      'Approve Trip',
      'Are you sure to Approve this Trip?',
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

  rejectConfirmation() {
    if(this.state.rejComment.length<1) {
      Alert.alert(
        'Feild Required',
        'Please enter reject comment.',
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
        'Reject Trip',
        'Are you sure to Reject this?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.state.hasOOP?this.rejectWithReq():this.rejectTripNonReq()
          },
        ],
        {cancelable: true},
      )
    }
  };

  handleRejComment = (text) => {
    this.setState({ rejComment: text })
  }

  approveWithReqConfirm=()=>{
    if(this.state.SelectedDataList.length<1) {
      Alert.alert(
        '',
        'Please select atleast one Requisition',
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
        'Approve Trip',
        'Are you sure to Approve this Trip?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => this.approveWithReq()
          },
        ],
        {cancelable: true},
      )
    }
  }

  approveWithReq(){
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY).then(value => {
      this.setState({ isLoading: true }, () => {  
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newSelectedDataList = this.state.SelectedDataList[i];
          if (params.status_id == "24") {
              newSelectedDataList.status_id="25";
              newSelectedDataList.status="Expense Claim - Rejected by Finance";
              newSelectedDataList.email=params.pending_with_email;
              newSelectedDataList.pending_with_email=params.email;
              newSelectedDataList.pending_with_name=params.name;
              newSelectedDataList.pending_with=params.userid;
              newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;
          } else {
            newSelectedDataList.vendor_comment="Approved";
            newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;
            if (newSelectedDataList.status_id == "8") {
              newSelectedDataList.status_id="9";
              newSelectedDataList.status="Plan Trip/PJP";
              newSelectedDataList.sub_status_id="9.1";
              newSelectedDataList.sub_status="Requisition - Approved by Supervisor";
              newSelectedDataList.email=params.email;
              newSelectedDataList.pending_with_email=params.pending_with_email;
              newSelectedDataList.pending_with_name=params.pending_with_name;
              newSelectedDataList.pending_with=params.pending_with;
            } else {
              newSelectedDataList.status_id="11";
              newSelectedDataList.status="Plan Trip/PJP";
              newSelectedDataList.sub_status_id="11.2";
              newSelectedDataList.sub_status="Requisition Completed";
              newSelectedDataList.email=params.pending_with_email;
              newSelectedDataList.pending_with_email=params.email;
              newSelectedDataList.pending_with_name=params.name;
              newSelectedDataList.pending_with=params.userid;
            }
          }
          this.state.aprvReqList.push(newSelectedDataList);
        }
      })      
    })
    .then(()=>{
      this.props.postAprvTripWithReq(this.state.aprvReqList)
      .then(()=> {
        this.props.getApprovedTripPending(global.USER.userEmail);
        this.props.navigation.navigate('ApproveNoneSaleTrip');
        Toast.show('Requisition Approved Successfuly', Toast.LONG);
      });
    })
    .then(()=>{
      this.setState({
        isLoading: false
      });
    });
  }

  rejectWithReqCheck=()=>{
    if(this.state.SelectedDataList.length<1) {
      Alert.alert(
        '',
        'Please select atleast one Requisition',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      this.setModalVisible(true);
    }
  }

  rejectWithReq=()=> {
    const {params} = this.props.navigation.state;
    AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY).then(value => {
      this.setState({ isLoading: true }, () => {  
        for(var i=0; i<this.state.SelectedDataList.length; i++) {
          let newSelectedDataList = this.state.SelectedDataList[i];
          newSelectedDataList.vendor_comment=this.state.rejComment;
          newSelectedDataList.trip_hdr_id_fk=params.trip_hdr_id;
          if (newSelectedDataList.status_id == "8") {
            newSelectedDataList.status_id="10";
            newSelectedDataList.status="Plan Trip/PJP";
            newSelectedDataList.sub_status_id="10.1";
            newSelectedDataList.sub_status="Requisition - Rejected by Supervisor";
            newSelectedDataList.email=params.email;
            newSelectedDataList.pending_with_email=params.pending_with_email;
            newSelectedDataList.pending_with_name=params.pending_with_name;
            newSelectedDataList.pending_with=params.pending_with;
          } else {
            newSelectedDataList.status_id="11";
            newSelectedDataList.status="Plan Trip/PJP";
            newSelectedDataList.sub_status_id="11.2";
            newSelectedDataList.sub_status="Requisition Completed";
            newSelectedDataList.email=params.pending_with_email;
            newSelectedDataList.pending_with_email=params.email;
            newSelectedDataList.pending_with_name=params.pending_with_name;
            newSelectedDataList.pending_with=params.userid;
          }
          this.state.aprvReqList.push(newSelectedDataList);
        }
      })      
    })
    .then(()=>{
      this.props.postAprvTripWithReq(this.state.aprvReqList)
      .then(()=> {
        this.props.getApprovedTripPending(global.USER.userEmail);
        this.props.navigation.navigate('ApproveNoneSaleTrip');
        Toast.show('Requisition Rejected Successfuly', Toast.LONG);
      });
    })
    .then(()=>{
      this.setState({
        isLoading: false
      });
    });
  }

  render(){
    const {params} = this.props.navigation.state;
    if(this.state.isLoading || this.props.plans.isLoading){
      return(
        <Loader/>
      )
    } else if ( this.state.isError
      || this.props.plans.errorStatus 
      || this.props.aprvTripNonReq.errorStatus
      || this.props.aprvTripWithReq.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
      //console.log(this.state.aprvReqList);
    return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.gnTrpDtl}>
          <View style={styles.row}>
            <Text style={styles.label}>Trip ID:</Text>
            <Text style={[styles.value,styles.tripId]}>{params.trip_no}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{params.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Creation Date:</Text>
            <Text style={styles.value}>{params.creation_date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pupose:</Text>
            {params.purpose.length>0 ?
            <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            :null}
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
            <Text style={styles.label}>Trip For:</Text>
            <Text style={styles.value}><For value={params.trip_for} /></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Traveler's Name:</Text>
            <Text style={styles.value}>{params.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Details:</Text>
            <Text style={styles.value}>{params.details}</Text>
          </View>
        </View>
        
        {(this.props.plans.dataSource.length && !this.props.plans.isLoading) ?
          <Text style={styles.reqTitle}>Requisition(s) List</Text>
        :null}
        { this.props.plans.isLoading ?
          <ActivityIndicator size="large" color="#0066b3" style={{marginVertical:100}} />
        : this.props.plans.dataSource.map((item, index) => {
            return (
              this.renderItem(item,index)
            );
          }
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.attachData? true : false}
          onRequestClose = {() => {this.attachModalVisible(null)}}>
          <View style={styles.modalWraper}>
            <TouchableOpacity style={styles.modalOverlay}
              onPress={() => {this.attachModalVisible(null)}}>
              <Text>&nbsp;</Text>
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Attachment-{this.state.attachData}</Text>
            </View>
          </View>
        </Modal>

      </ScrollView>

      {(!this.props.plans.isLoading) ?
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={() => {this.state.hasOOP?this.rejectWithReqCheck():this.setModalVisible(true);}}
          >
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#e63826', '#fb4b7b']} 
            style={styles.btnBg}>
            <Text style={styles.btnTxt}>Reject</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>{this.state.hasOOP?this.approveWithReqConfirm():this.approveConfirmation(params)}}
          >
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#5ba11c', '#92d40a']} 
            style={styles.btnBg}>
            <Text style={styles.btnTxt}>Approve</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>:null}

      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {this.setModalVisible(false)}}>
        <View style={styles.modalBody}>
          <Text style={styles.modalLabel}>Reject comment:</Text>
          <TextInput 
            multiline
            numberOfLines={4}
            placeholder='Type your text'
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
                ()=>this.rejectConfirmation()
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

  renderItem = (data,index) => {
    return <TouchableOpacity 
    key={index} 
    style={styles.cardItem} 
    onPress={() => this.props.navigation.navigate('ReqInfo',data)}>
    <View style={styles.cardItemHeader}>
      {data.is_outof_policy=="Y" 
      && data.status_id!="9" 
      && data.sub_status_id!="9.1"
      && data.status_id!="10" 
      && data.sub_status_id!="10.1" 
      && data.status_id!="11"
      && data.sub_status_id!="11.2"
      && data.sub_status_id!="25"?
      <TouchableOpacity 
        onPress={() => {this.press(data)}}
        style={[data.check ?styles.checkedBox :styles.unCheckedBox, styles.checkBox]}
        >
        {data.check
        ? (<Icon name="md-checkmark" style={styles.checkIcon} />)
        : (<Icon name="md-square-outline" style={styles.uncheckIcon} />)
        }
      </TouchableOpacity >:null}
      {data.req_type=='1' ?
      <Icon style={styles.cardTileIcon} name="ios-airplane" />
      : data.req_type=='10' ?
      <Icon style={styles.cardTileIcon} name="ios-car" />
      : data.req_type=='11' ?
      <Icon style={styles.cardTileIcon} name="md-car" />
      : data.req_type=='3' ?
      <Ficon style={styles.cardTileIcon} name="subway" />
      : data.req_type=='1BH' ?
      <Ficon style={styles.cardTileIcon} name="hotel" />
      : data.req_type=='1BM' ?
      <Icon style={styles.cardTileIcon} name="ios-train" />
      : data.req_type=='1BNM' ?
      <Ficon style={styles.cardTileIcon} name="road" />
      : null
      }
      <Text style={styles.cardTile}><ReqType value={data.req_type} /></Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Status:</Text>
        <Text style={styles.cardValue}>{data.sub_status?data.sub_status:data.status}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Through:</Text>
        <Text style={styles.cardValue}>{data.through}</Text>
      </View>
      {data.is_outof_policy=="Y"?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Out Of Policy:</Text>
        <Text style={styles.cardValue}>{data.is_outof_policy=="Y"?"Yes":"No"}</Text>
      </View>
      :null}
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Approx Amount:</Text>
        <Text style={styles.cardValue}>{data.amount}</Text>
      </View>
      {data.status_id == '3' || data.status_id == '4' ?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Attachment:</Text>
        <TouchableOpacity 
          style={styles.cardValueBtn}            
          onPress={() => {this.attachModalVisible(data.status);}}>
          <Text style={styles.cardValueBtnText}>staticfile.png</Text>
        </TouchableOpacity>
      </View>:null}
    </View>    
  </TouchableOpacity>
    };

};

const mapStateToProps = state => {
  return {
    plans: state.plans,
    aprvTripNonReq: state.aprvTripNonReq,
    aprvTripWithReq: state.aprvTripWithReq,
    aprvTripPend: state.aprvTripPend,
    //statusResult: state.statusResult
  };
};

const mapDispatchToProps = {
  getPlans : Actions.getPlans,
  aprvTripNonReq: Actions.aprvTripNonReq,
  postAprvTripWithReq: Actions.postAprvTripWithReq,
  getApprovedTripPending: Actions.getApprovedTripPending,
  //getStatus: Actions.getStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleTripDetailsScreen);