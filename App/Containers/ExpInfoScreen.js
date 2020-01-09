import React, { Component } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, Platform, Modal, Picker} from 'react-native'
import { Button, Icon } from 'native-base'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import DocumentPicker from 'react-native-document-picker'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import TripRequisitionItem from '../Components/TripRequisitionItem'
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
      date: new Date(this.props.navigation.state.params.end_date),
      mode: 'date',
      show: false,      
      modalVisible: false,
      reqModal: false,
      uploadType: UPLOAD_TYPE[0],      
      attachFiles: [],
      uploadError: 0,
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'getRequisitionListNonSales?triphdrId='+this.props.navigation.state.params.trip_hdr_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          reqList: responseJson,
        }, function(){
        });
      })
      .catch((error) =>{
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
  setDate = (event, date) => {
    date = date || this.state.date; 
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
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
        alert(results.length + ' fils are uploade successfuly.');
      } else {
        alert(results.length + ' fil is uploade successfuly.');
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
	
  render() {
    const {params} = this.props.navigation.state;
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    var sortList = this.state.reqList;
		sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
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
            <Text style={styles.value}>{params.estimated_cost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Advanced Required:</Text>
            <Text style={styles.value}>{params.payment_amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Purpose:</Text>
            <Text style={styles.value}><Purpose value={params.purpose} /></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.accordionHeader}
          onPress={()=>{this.setTripAcrd()}}>
          <Text style={styles.acrdTitle}>View Trip Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.tripAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.tripAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{params.start_date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
              <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
              <Icon name="md-calendar" style={styles.datePickerIcon} />
            </TouchableOpacity>
          </View>
          { this.state.show && 
          <DateTimePicker value={new Date(params.end_date)}
            mode={this.state.mode}
            minimumDate={new Date(params.start_date)}
            is24Hour={true}
            display="default"
            onChange={this.setDate} />
          }
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
              <Text uppercase={false} style={styles.btnTxt}>Add Requisition</Text>
            </LinearGradient>
          </TouchableOpacity>
          {sortList.map((item, index) => {
            return (<View>
              <TripRequisitionItem data={item} index={index} key={index} />
            </View>);
          })}
        </View>
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
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('AirRequisition'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#007AFF" }]}>
                  <Icon style={styles.modalItemIcon} name="airplane" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>Air Travel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('TrainReq'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#f16168" }]}>
                  <Ficon style={styles.modalItemIcon} name="subway" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>Train</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('ActaxiRequisition'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#3ba03f" }]}>
                  <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="ios-car" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>AC Taxi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('NonActaxiReq'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#FF9501" }]}>
                  <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="md-car" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>Non-AC Taxi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('HillStReq'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#00c4ff" }]}>
                  <Ficon style={styles.modalItemIcon} name="hotel" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>B, L & OOP Expenses (Hill Station / Other Cities)</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('MetroReq'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#9c27b0" }]}>
                  <Icon style={[styles.modalItemIcon,{fontSize:26}]} name="ios-train" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>B, L & OOP Expenses (Metro / A Class Cities)</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => this.setState({reqModal: 0}, () => this.props.navigation.navigate('NonMetroReq'))}>
                <View style={[styles.modalItemIconHolder,{ backgroundColor: "#27b084" }]}>
                  <Ficon style={styles.modalItemIcon} name="road" />
                </View>
                <View style={styles.modalItemBody}>
                  <Text style={styles.modalItemText}>B, L & OOP Expenses (Non-Metro / B Class Cities)</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.accordionHeader}
          onPress={()=>{this.setClaimAcrd()}}>
          <Text style={styles.acrdTitle}>Claim Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.claimAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.claimAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Cost:</Text>
            <Text style={styles.value}>{params.estimated_cost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Advance Amount:</Text>
            <Text style={styles.value}>{params.payment_amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim amount:</Text>
            <Text style={styles.value}>{params.actual_claim_amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim Currency:</Text>
            <Text style={styles.value}>{params.actual_claim_currency}</Text>
          </View>
          <View style={[styles.row,styles.noRow]}>
            <Text style={styles.label}>Justification :</Text>
            <TextInput 
              multiline
              numberOfLines={2}
              placeholder='Enter your Justification'
              underlineColorAndroid = 'transparent'
              style={[styles.value,styles.input]}
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
        <TouchableOpacity style={styles.btn} onPress={() => {this.setModalVisible(1);}}>
          <LinearGradient
            style={styles.btnBg}
            colors={["#ec7b06", "#fd3939"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Upload</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <LinearGradient
            style={styles.btnBg}
            colors={["#0284f3", "#26cce6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <LinearGradient
            style={styles.btnBg}
            colors={['#53c55c', '#33b8d6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Text style={styles.btnTxt}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};

export default ExpInfoScreen;