import React, { Component } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, Modal, Picker, Alert, AsyncStorage} from 'react-native'
import { Button, Icon } from 'native-base'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-simple-toast'

import Loader from '../Components/Loader'
import {Purpose, For} from '../Components/GetValue'
import styles from './Styles/ExpInfoScreen';

const UPLOAD_TYPE = ['Approval Email', 'Other'];

class ExpInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advAcrd: 0,
      tripAcrd: 0,
      claimAcrd: 1,
      modalVisible: false,
      reqModal: false,
      uploadType: UPLOAD_TYPE[0],      
      attachFiles: [],
      uploadError: 0,
      isLoading: false,
      actAmnt: 0,
      msg: null,
      saveActive: true,
      submitActive: false,
      reload: false,
      airReqData: null,
    };
  }
  componentDidMount(props){
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      console.log('firsttime')
      this.onScreenLoad();
    });

    this.props.getReqClaimType(global.USER.designation,global.USER.grade);
    
    this.props.getReqType(global.USER.designation,global.USER.grade)
    .then(()=>{
      for(var i=0; i<this.props.reqType.dataSource.length; i++) {
        if(this.props.reqType.dataSource[i].sub_category_id == "1") {
          this.setState({airReqData: this.props.reqType.dataSource[i]})
        }
      }
    });    
    
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        if(this.state.reload) {
          this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
          .then(()=>{
            console.log('reload'+this.state.reload)
            this.onScreenLoad();
          });
        }
      }
    );
  }

  onScreenLoad=()=> {
    let tot = 0;
    let data = this.props.plans.dataSource;
    AsyncStorage.getItem("ONSCREENLOAD")
    .then(()=>{
      for (var i=0; i<data.length; i++) {
        if(data[i].delete_status != 'true') {
          tot = tot + parseFloat(data[i].amount)
        }
        /*if(data[i].status_id != '20') {
          this.setState({
            saveActive: true,
            submitActive: false
          })
        }*/
      }
    })
    .then(()=>{
      this.setState({
        actAmnt: tot,
        saveActive: true,
        submitActive: false
      });
    });
  }
  
  setAdvAcrd() {
    this.setState({
      advAcrd: this.state.advAcrd == 0?1:0
    });
  }
  setTripAcrd() {
    this.setState({
      tripAcrd: this.state.tripAcrd == 0?1:0
    });
  }
  setClaimAcrd() {
    this.setState({
      claimAcrd: this.state.claimAcrd == 0?1:0
    });
  }
  state = {
    modalVisible: 0,
    reqModal: 0
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  setReqModalVisible(visible) {
    this.setState({reqModal: visible});
  }
  updateUploadType = (value) => {
    this.setState({
      uploadType: value
    });
  }
  removeAttach(e) {
    var newList = this.state.attachFiles;
    if (e !== -1) {
      newList.splice(e, 1);
      this.setState({attachFiles: newList});
    }
  }
  async selectAttachFiles() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
      }
      if (results.length>1) {
        alert(results.length + ' fils are uploade successfully.');
      } else {
        alert(results.length + ' fil is uploade successfully.');
      }        
      this.setState({uploadError: 0});
      this.setState({ attachFiles: results });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You have not select any file for attachment');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }
  uploadFileReq() {
    if(this.state.attachFiles.length > 0) {
      this.setModalVisible(0);
    } else {
      this.setState({uploadError: 1});
    }
  }
  uploadCancReq() {    
    this.setState({
      uploadError: 0,
      attachFiles: []
    });
    this.setModalVisible(0);
  }

  handleMsg = (text) => {
    this.setState({
      msg:text,
    })
  }

  editModalVisible(value){
    this.setState({editModalData: value});
  }  

  tripSaveConfirmation() {
    Alert.alert(
      'Save',
      'Do you want to Save?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.tripSave()
        },
      ],
      {cancelable: true},
    )
  }

  tripSave() {
    let newTrip = this.props.navigation.state;
    let statusName = '';
    let subStatusName = '';
    AsyncStorage.getItem("TRIPSAVE")
    .then(()=>{
      this.setState({
        isLoading: true
      });
    })
    .then(()=>{
      this.props.getStatus("20","NA")
      .then(()=>{
        statusName = this.props.statusResult.dataSource[0].trip_pjp_status;
        subStatusName = this.props.statusResult.dataSource[0].sub_status;
      });
    })
    .then(()=>{
      newTrip.status_id = '20';
      newTrip.status = statusName;
      newTrip.sub_status_id = 'NA';
      newTrip.sub_status = subStatusName;
      newTrip.actual_claim_amount = this.state.actAmnt;
      newTrip.claim_comment = this.state.msg;
    })
    .then(()=>{
      this.props.trpNSClmDtlUpdt([newTrip])
      .then(()=>{
        this.setState({
          saveActive: false,
          submitActive: true,
          isLoading: false
        });
        Toast.show('Expenses Details Saved', Toast.LONG);
      })
    })
  }

  tripSubmitConfirmation() {
    for(var i=0; i< this.props.plans.dataSource.length; i++) {
      if(this.props.plans.dataSource[i].status_id == '19' && this.props.plans.dataSource[i].delete_status == 'false') {
        Alert.alert(
          'Warning',
          'One or more Requisition is not complete. Please compleet unsaved requisition',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        )
        break;
      }
    }
    Alert.alert(
      'Submit',
      'Do you want to Submit?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.tripSubmit()
        },
      ],
      {cancelable: true},
    )
  }

  tripSubmit() {
    const {params} = this.props.navigation.state;    
    let tripData = params
    let submitData = this.props.plans.dataSource;
    let statusName = '';
    let subStatusName = '';
    
    AsyncStorage.getItem("TRIPSUBMIT")
    .then(()=>{
      this.setState({
        isLoading: true
      });
    })    
    .then(()=>{
      this.props.getStatus("21","NA")
      .then(()=>{
        statusName = this.props.statusResult.dataSource[0].trip_pjp_status;
        subStatusName = this.props.statusResult.dataSource[0].sub_status;
      });
    })
    .then(()=>{
      for(var i=0; i< submitData.length; i++) {
        submitData[i].status_id = '21';
        submitData[i].status = statusName;
        submitData[i].sub_status_id = 'NA';
        submitData[i].sub_status = subStatusName;
      }
    })
    .then(()=>{
      this.props.reqUpdate(submitData)
      .then(()=>{
        tripData.status_id = '21';
        tripData.status = statusName;
        tripData.sub_status_id = 'NA';
        tripData.sub_status = subStatusName;
        tripData.actual_claim_amount = this.state.actAmnt;
        tripData.claim_comment = this.state.msg;
        tripData.pending_with = global.USER.supervisorId;
        tripData.pending_with_name = global.USER.supervisorName;
        tripData.email = global.USER.userEmail;
        tripData.pending_with_email = global.USER.supervisorEmail;
      })
      .then(()=>{
        this.props.tripClaimUpdate([tripData])
        /*.then(()=>{    
          this.props.sendEmail({
            "mailId": global.USER.supervisorName,
            "cc": null,
            "subject": 'Kindly provide approval of expense for trip #'+trip_no,
            "tripNonSales": tripData,
            "requisitionNonSales": null
          })
        })*/
        .then(()=>{
          this.props.getExpenses(global.USER.userId,"3",["3","4","9","11","15","17","19","20","23","25","27","29"])
          .then(()=>{
            this.setState({
              isLoading: false,
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Expenses Submit Successfully', Toast.LONG);
          });
        });
      })
    });
  }
	
  render() {
    const {params} = this.props.navigation.state;
    //console.log(params)
    if(this.props.plans.isLoading || this.props.reqClaimType.isLoading || this.props.reqType.isLoading || this.state.isLoading){
      return(
        <Loader/>
      )
    } else if(this.props.plans.errorStatus || this.props.reqClaimType.errorStatus || this.props.reqType.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else  if(!this.props.plans.isLoading || !this.props.reqClaimType.isLoading || !this.props.reqType.isLoading || !this.state.isLoading){
    var sortList = this.props.plans.dataSource;
    sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    console.log(sortList)
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.accordionHeader}
          onPress={()=>{this.setAdvAcrd()}}>
          <Text style={styles.acrdTitle}>View Advance Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.advAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.advAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Cost:</Text>
            <Text style={styles.value}>{params.estimated_cost?params.estimated_cost:'0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Advanced Required:</Text>
            <Text style={styles.value}>{params.payment_amount?params.payment_amount:'0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purpose:</Text>
            <Text style={styles.value}><Purpose value={params.purpose} /></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.accordionHeader}
          onPress={()=>{this.setTripAcrd()}}>
          <Text style={styles.acrdTitle}>Claim Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.tripAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.tripAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purpose:</Text>
            <Text style={styles.value}><Purpose value={params.purpose} /></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Destination From:</Text>
            <Text style={styles.value}>{params.trip_from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Destination To:</Text>
            <Text style={styles.value}>{params.trip_to}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Trip For:</Text>
            <Text style={styles.value}><For value={params.trip_for} /></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Traveler Name:</Text>
            <Text style={styles.value}>{params.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Details:</Text>
            <Text style={styles.value}>{params.details}</Text>
          </View>
          <TouchableOpacity style={[styles.btn,styles.mb]}onPress={() => {this.setReqModalVisible(1);}}>
            <LinearGradient
              style={styles.btnBg}
              colors={["#9752ff", "#5e93ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
              <Icon name='ios-add-circle-outline' style={styles.btnIcon} />
              <Text uppercase={false} style={styles.btnTxt}>Add Expense</Text>
            </LinearGradient>
          </TouchableOpacity>
          {sortList.map((item, index) => {
            return (
              this.renderItem(item,index,params)
            );
          })}
        </View>

        <TouchableOpacity style={styles.accordionHeader}
          onPress={()=>{this.setClaimAcrd()}}>
          <Text style={styles.acrdTitle}>Claim Summary</Text>
          <Icon style={styles.acrdIcon} name={this.state.claimAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.claimAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Cost:</Text>
            <Text style={styles.value}>{params.estimated_cost?params.estimated_cost:'0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Advance Amount:</Text>
            <Text style={styles.value}>{params.payment_amount?params.payment_amount:'0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim amount:</Text>
            <Text style={styles.value}>{this.state.actAmnt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim Currency:</Text>
            <Text style={styles.value}>{params.actual_claim_currency?params.actual_claim_currency:'INR'}</Text>
          </View>
          <View style={[styles.row,styles.noRow]}>
            <Text style={styles.label}>Justification :</Text>
            <TextInput 
              multiline
              numberOfLines={2}
              placeholder='Enter your Justification'
              underlineColorAndroid = 'transparent'
              style={[styles.value,styles.input]}
              onChangeText={this.handleMsg}
              value={this.state.msg}
              />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible===1}
          onRequestClose = {() => {this.setModalVisible(0)}}>
          <View style={styles.modalWraper}>
            <TouchableOpacity style={styles.modalOverlay}
              onPress={() => {this.setModalVisible(0)}}>
              <Text>&nbsp;</Text>
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Upload Document</Text>
              <Text style={styles.modalLabel}>Select Document Type</Text>
              <View style={styles.pickerBlock}>
                <Picker
                  mode="dropdown"
                  placeholder="Select Document Type" 
                  selectedValue = {this.state.uploadType} 
                  onValueChange = {this.updateUploadType}                
                  style={styles.modalSelect}
                  prompt="Select Document Type">
                  {UPLOAD_TYPE.map((item, index) => {
                  return (
                    <Picker.Item label={item} value={item} key={index} />
                  );
                  })}
                </Picker>
              </View>
              <TouchableOpacity style={styles.btn} onPress={this.selectAttachFiles.bind(this)}>
                <LinearGradient
                  style={styles.btnBg}
                  colors={["#9752ff", "#5e93ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  >
                  <Text style={styles.btnTxt}>Attach File</Text>
                </LinearGradient>
              </TouchableOpacity>
              {this.state.attachFiles.map((item, key) => (
                <View key={key} style={styles.atchFileRow}>
                  <Text style={styles.atchFileName}>{item.name ? item.name : ''}</Text>
                  <Button bordered small rounded danger style={styles.actionBtn}
                    onPress={()=>this.removeAttach(key)}>
                    <Icon name='close' style={styles.actionBtnIco} />
                  </Button>
                </View>
              ))}
              {this.state.uploadError == 1 &&
                <Text style={styles.uploadError}>No File attached to upload.</Text>
              }
              <View style={styles.modalFooter}>
                <Button full danger style={styles.modalFotterBtn}
                  onPress={() => {this.uploadCancReq()}}>
                  <Text style={styles.modalFotterBtnTxt}>Cancel</Text>
                </Button>
                <Button full info style={styles.modalFotterBtn}
                  onPress={() => {this.uploadFileReq()}}>
                  <Text style={styles.modalFotterBtnTxt}>Upload</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        {this.state.attachFiles.length > 0 &&
        <Text style={styles.attachTitle}>Attached File</Text>}
        {this.state.attachFiles.map((item, key) => (
          <View key={key} style={styles.atchFileRow}>
            <Text style={styles.atchFileName}>{item.name ? item.name : ''}</Text>
            <Button bordered small rounded danger style={styles.actionBtn}
              onPress={()=>this.removeAttach(key)}>
              <Icon name='close' style={styles.actionBtnIco} />
            </Button>
          </View>
        ))}

        {/*<TouchableOpacity style={styles.btn} onPress={() => {this.setModalVisible(1);}}>
          <LinearGradient
            style={styles.btnBg}
            colors={["#ec7b06", "#fd3939"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Upload</Text>
          </LinearGradient>
        </TouchableOpacity>*/}
        {this.state.saveActive &&
        <TouchableOpacity style={styles.btn} onPress={() => {this.tripSaveConfirmation()}}>
          <LinearGradient
            style={styles.btnBg}
            colors={["#0284f3", "#26cce6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>}
        {this.state.submitActive &&
        <TouchableOpacity style={styles.btn} onPress={() => {this.tripSubmitConfirmation()}}>
          <LinearGradient
            style={styles.btnBg}
            colors={['#53c55c', '#33b8d6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.editModalData? true : false}
          onRequestClose = {() => {this.editModalVisible(null)}}>
          <View style={styles.modalWraper}>
            <TouchableOpacity style={styles.modalOverlay}
              onPress={() => {this.editModalVisible(null)}}>
              <Text>&nbsp;</Text>
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Select Requisition Type:</Text>
              <ScrollView>
              {this.props.reqClaimType.dataSource.map((item, index) => {
              return (
              <TouchableOpacity style={[styles.modalItem,
                (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.modalItemActive
              ]}
                key= {index}
                onPress={() =>{
                  this.editModalVisible(null);
                  this.setState({ reload: true }); 
                  this.props.navigation.navigate(
                  item.sub_category_id=='10' ? 'TaxiRequisition'
                  : item.sub_category_id=='11' ? 'TaxiRequisition'
                  : item.sub_category_id=='3' ? 'TrainReq'
                  : item.sub_category_id=='1BH' ? 'HotelReq'
                  : item.sub_category_id=='1BM' ? 'HotelReq'
                  : item.sub_category_id=='1BNM' ? 'HotelReq'
                  : item.id==112 ? 'RailCommision'
                  : 'OtherRequisition',
                  {item, params, 
                    'update':this.state.editModalData?this.state.editModalData[0]:false, 
                    'claim':true}
                );
                }}>
                {(this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) &&
                  <Icon style={styles.modalItemcarot} name="md-arrow-dropright" />
                }
                <View style={[styles.modalItemIconHolder,{ backgroundColor:
                  (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) ? '#fff'
                  : item.sub_category_id=='10' ? '#3ba03f'
                  : item.sub_category_id=='11' ? '#FF9501'
                  : item.sub_category_id=='3' ? '#f16168'
                  : item.sub_category_id=='1BH' ? '#00c4ff'
                  : item.sub_category_id=='1BM' ? '#9c27b0'
                  : item.sub_category_id=='1BNM' ? '#27b084'
                  : '#999'
                  }]}>
                  {item.sub_category_id=='10' ?
                  <Icon style={[styles.modalItemIcon,{fontSize:24},
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="ios-car" />
                  : item.sub_category_id=='11' ?
                  <Icon style={[styles.modalItemIcon,{fontSize:24},
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="md-car" />
                  : item.sub_category_id=='3' ?
                  <Ficon style={[styles.modalItemIcon, 
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="subway" />
                  : item.sub_category_id=='1BH' ?
                  <Ficon style={[styles.modalItemIcon, 
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="hotel" />
                  : item.sub_category_id=='1BM' ?
                  <Ficon style={[styles.modalItemIcon,
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="hotel" />
                  : item.sub_category_id=='1BNM' ?
                  <Ficon style={[styles.modalItemIcon, 
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="hotel" />
                  : <Icon style={[styles.modalItemIcon,{fontSize:26},
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                    name="bookmark" />
                  }
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={[styles.modalItemText, 
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActText]}>
                      {item.sub_category}
                  </Text>
                </View>
              </TouchableOpacity>
              );
              })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.reqModal===1}
          onRequestClose = {() => {this.setReqModalVisible(0)}}>
          <View style={styles.modalWraper}>
            <TouchableOpacity style={styles.modalOverlay}
              onPress={() => {this.setReqModalVisible(0)}}>
              <Text>&nbsp;</Text>
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Select Requisition Type:</Text>
              <ScrollView>
              {this.props.reqClaimType.dataSource.map((item, index) => {
              return (
              <TouchableOpacity style={styles.modalItem}
                key= {index}
                onPress={() => this.setState({reqModal: 0, reload:true}, 
                () => this.props.navigation.navigate(
                    item.sub_category_id=='10' ? 'TaxiRequisition'
                  : item.sub_category_id=='11' ? 'TaxiRequisition'
                  : item.sub_category_id=='3' ? 'TrainReq'
                  : item.sub_category_id=='1BH' ? 'HotelReq'
                  : item.sub_category_id=='1BM' ? 'HotelReq'
                  : item.sub_category_id=='1BNM' ? 'HotelReq'
                  : item.id==112 ? 'RailCommision'
                  : 'OtherRequisition',
                  {item, params, 'update':false, 'actAmnt':this.state.actAmnt, 'claim':true}
                )
                )}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor:
                  item.sub_category_id=='10' ? '#3ba03f'
                  : item.sub_category_id=='11' ? '#FF9501'
                  : item.sub_category_id=='3' ? '#f16168'
                  : item.sub_category_id=='1BH' ? '#00c4ff'
                  : item.sub_category_id=='1BM' ? '#9c27b0'
                  : item.sub_category_id=='1BNM' ? '#27b084'
                  : '#999'
                  }]}>
                  {item.sub_category_id=='10' ?
                  <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="ios-car" />
                  : item.sub_category_id=='11' ?
                  <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="md-car" />
                  : item.sub_category_id=='3' ?
                  <Ficon style={styles.modalItemIcon} name="subway" />
                  : item.sub_category_id=='1BH' ?
                  <Ficon style={styles.modalItemIcon} name="hotel" />
                  : item.sub_category_id=='1BM' ?
                  <Ficon style={styles.modalItemIcon} name="hotel" />
                  : item.sub_category_id=='1BNM' ?
                  <Ficon style={styles.modalItemIcon} name="hotel" />
                  : <Icon style={[styles.modalItemIcon,{fontSize:26}]} name="bookmark" />
                  }
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>{item.sub_category}</Text>
                </View>
              </TouchableOpacity>
              );
              })}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </ScrollView>
    );
  }
  }

  getReqValue = (value) => {
    if(value=='1') {
      for(var i=0; i<this.props.reqType.dataSource.length; i++) {
        if(this.props.reqType.dataSource[i].sub_category_id == value) {
          return (
            this.props.reqType.dataSource[i].sub_category
          );
          break
        }
      }
    } else {
      for(var i=0; i<this.props.reqClaimType.dataSource.length; i++) {
        if(this.props.reqClaimType.dataSource[i].sub_category_id == value) {
          return (
            this.props.reqClaimType.dataSource[i].sub_category
          );
          break
        }
      }
    }
  }

  deleteConfirmation(e) {
    Alert.alert(
      'Delete Requistion',
      'Are you sure to Delete this Requistion?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.removeItem(e)
        },
      ],
      {cancelable: true},
    )
  };

  removeItem(e) {
    this.setState({ isLoading: true }, () => {
      this.props.reqDelete([{
        "lineitem": e.lineitem,
        "trip_no": e.trip_no,
        "trip_hdr_id_fk": e.trip_hdr_id_fk,
        "delete_status": "true"
      }])
      .then(() => {
        this.props.getPlans(e.trip_hdr_id_fk)
        .then(()=>{
          this.setState({
            isLoading: false
          });
        });
      })
      .then(() => {
        Toast.show('Requisition deleted.', Toast.LONG);
      });
    });
  }

  renderItem = (data,index,params) => {
    let item=this.state.airReqData;
    if(!data.req_type) {
      return <View key={index} style={[styles.cardItem,styles.cardHrzntl]}>
        <TouchableOpacity small danger style={styles.cardHrzntlBtnLeft}
          onPress={()=>this.deleteConfirmation(data)}
          >
          <Icon name='trash' style={styles.cardHrzntlBtnLeftIco} />
        </TouchableOpacity>
        <Text style={styles.cardTile}>{(data.sub_status && data.sub_status !='NA')?data.sub_status:data.status}</Text>
        <TouchableOpacity 
          onPress={() => {this.editModalVisible([data,data.req_type]);}}
          style={[styles.editlBtn,styles.cardHrzntlBtnRight]}
          >
          <Icon name="md-create" style={styles.editBtnIcon} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity >
      </View>  
    } else {
    return <TouchableOpacity 
      key={index} 
      style={styles.cardItem} 
      onPress={() => this.props.navigation.navigate('ReqInfo',data) }>
      <View style={styles.cardItemHeader}>
        {data.req_type=='1' ?
        <Icon style={styles.cardTileIcon} name="airplane" />
        : data.req_type=='10' ?
        <Icon style={styles.cardTileIcon} name="ios-car" />
        : data.req_type=='11' ?
        <Icon style={styles.cardTileIcon} name="md-car" />
        : data.req_type=='3' ?
        <Ficon style={styles.cardTileIcon} name="subway" />
        : data.req_type=='1BH' ?
        <Ficon style={styles.cardTileIcon} name="hotel" />
        : data.req_type=='1BM' ?
        <Ficon style={styles.cardTileIcon} name="hotel" />
        : data.req_type=='1BNM' ?
        <Ficon style={styles.cardTileIcon} name="hotel" />
        : <Icon style={styles.cardTileIcon} name="bookmark" />
        }
        <Text style={styles.cardTile}>{this.getReqValue(data.req_type)}</Text>
          <TouchableOpacity 
            onPress={data.req_type=='1' 
            ?() => {this.props.navigation.navigate('AirRequisition',{item, params, 'update':data,'claim':true})}
            :() => {this.editModalVisible([data,data.req_type]);}}
            style={styles.editlBtn}
            >
          <Icon name="md-create" style={styles.editBtnIcon} />          
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity >
      </View>
      <View style={styles.cardBody}>
        <View style={styles.itemActions}>
          {(data.status_id=="19" || data.status_id=="20") ?
          <Button bordered small rounded danger style={styles.actionBtn}
            onPress={()=>this.deleteConfirmation(data)}
            >
            <Icon name='trash' style={styles.actionBtnIco} />
          </Button>
          :null}
          
          {/*<Button bordered small rounded primary 
            style={[styles.actionBtn, styles.mrgTop]}
            onPress={() => {}}>
            <Icon name='attach' style={styles.actionBtnIco} />
          </Button>*/}
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Start Date:</Text>
            <Text style={styles.cardValue}>{moment(data.start_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>End Date:</Text>
            <Text style={styles.cardValue}>{moment(data.end_date).format(global.DATEFORMAT)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Status:</Text>
            <Text style={styles.cardValue}>{(data.sub_status && data.sub_status !='NA')? data.sub_status :  data.status }</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Out Of Policy:</Text>
            <Text style={styles.cardValue}>{data.is_outof_policy=="Y"?"Yes":"No"}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Amount:</Text>
            <Text style={styles.cardValue}>{data.invoice_amount?data.invoice_amount:data.amount}</Text>
          </View>          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Extra Amount:</Text>
            <Text style={styles.cardValue}>{data.extra_amount?data.extra_amount:'0.0'}</Text>
          </View>          
        </View>
      </View>    
    </TouchableOpacity>
    }
  };

};

const mapStateToProps = state => {
  return {
    plans: state.plans,
    ReqDelete: state.ReqDelete,    
    reqType: state.reqType,
    reqClaimType: state.reqClaimType,
    trpNSClmDtlUpdtState: state.trpNSClmDtlUpdtState,
    statusResult: state.statusResult,
    reqUpdateState: state.reqUpdateState,
    tripClaimUpdateState: state.tripClaimUpdateState,
    expenses: state.expenses,
    sendEmailState: state.sendEmailState,
  };
};

const mapDispatchToProps = {
  getPlans : Actions.getPlans,
  reqDelete: Actions.reqDelete,
  getReqType : Actions.getReqType,
  getReqClaimType : Actions.getReqClaimType,
  trpNSClmDtlUpdt: Actions.trpNSClmDtlUpdt,
  getStatus: Actions.getStatus,
  reqUpdate: Actions.reqUpdate,
  tripClaimUpdate: Actions.tripClaimUpdate,
  getExpenses : Actions.getExpenses,
  sendEmail: Actions.sendEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpInfoScreen);