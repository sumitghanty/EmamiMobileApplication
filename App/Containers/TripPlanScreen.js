import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import { Container, Content, Button, Icon, Form, Item, Label } from 'native-base';
import Ficon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import {Purpose, For} from '../Components/GetValue'
import Loader from '../Components/Loader'
import styles from './Styles/TripPlanScreen';

class TripPlanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(this.props.navigation.state.params.end_date),
      mode: 'date',
      show: false,
      acrdVisible: 0,
      searchTerm: '',
      dataSource: null,
      SelectedDataList: [],
      isLoading: false,
      modalVisible: 0,
      attachData: null,
      editModalData: null,
      endaDateList: [],
      endDateLmt: null,
      airReqData: null,
      setGoBack: true
    };
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(props){
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      this.setState({dataSource: this.props.plans.dataSource});
    })
    .then(()=>{
      if(this.props.plans.dataSource.length>0){
        for(var i=0; i< this.props.plans.dataSource.length; i++) {
          if(this.props.plans.dataSource[i].check_out_date) {
            this.state.endaDateList.push(moment(this.props.plans.dataSource[i].check_out_date).format('YYYYMMDD'))
          }
          if(this.props.plans.dataSource[i].travel_date) {
            this.state.endaDateList.push(moment(this.props.plans.dataSource[i].travel_date).format('YYYYMMDD'))
          }
        }
      }
    })
    .then(()=>{
      if(this.props.plans.dataSource.length>0){
        let acdList = this.state.endaDateList
        acdList.sort((a,b) => b - a);
        let Y = parseInt(acdList[0]/10000)
        let M = parseInt(acdList[0]%10000) < 1000
                ? '0'+parseInt((acdList[0]%10000)/100)
                : parseInt((acdList[0]%10000)/100)
        let D = parseInt(acdList[0]%100) < 10
                ? '0'+parseInt((acdList[0]%100))
                : parseInt((acdList[0]%100))
        this.setState({endDateLmt: Y+'-'+M+'-'+D})
      }
    });

    this.props.getReqType(global.USER.designation,global.USER.grade)
    .then(()=>{
      for(var i=0; i<this.props.reqType.dataSource.length; i++) {
        if(this.props.reqType.dataSource[i].sub_category_id == "1") {
          this.setState({airReqData: this.props.reqType.dataSource[i]})
        }
      }
    });    
  }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  attachModalVisible(value){
    this.setState({attachData: value});
  }

  editModalVisible(value){
    this.setState({editModalData: value});
  }

  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
    });
  }

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

  endDateRequest = (event, date) => {
    const {params} = this.props.navigation.state;

    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_END_DATE")
    .then(()=>{
      this.setState({
        isLoading: true
      });
    })
    .then(()=>{
      this.props.tripEndDateUpdate([{
        'date_change_status': 'Y',
        'changed_end_date' : moment(date).format('YYYY-MM-DD'),
        'pending_with_email': global.USER.supervisorEmail,
        'pending_with_name' : global.USER.supervisorName,
        'pending_with' : global.USER.supervisorId,
        'trip_hdr_id': params.trip_hdr_id
      }])
      .then(() => {
        this.props.getTrips(global.USER.userId)
        .then(()=>{
          date = date || this.state.date;
          this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
            isLoading: false
          });
        })
        .then(() => {
          Toast.show('Trip End Date Updated.', Toast.LONG);
        })
      })
    })
  }

  setDate = (event, date) => {    
    if(date != undefined) {
      Alert.alert(
        'Confirm',
        'Do you want to change the End Date?',
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {this.setState({show: Platform.OS === 'ios' ? true : false, });}
          },
          {
            text: 'Yes', 
            onPress: () => this.endDateRequest(event, date)
          },
        ],
        {cancelable: true},
      )      
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
  
  press = (hey) => {
    this.props.plans.dataSource.map((item) => {
      if (item.req_hdr_id === hey.req_hdr_id) {
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

  submit = (action)=> {
    if(this.state.SelectedDataList.length<1) {
      Alert.alert(
        'Warning',
        'Please select requisition(s)',
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      this.setState({ isLoading: true });
      let newList = this.state.SelectedDataList;
      let statusNamePS = '';
      let subStatusNamePS = '';
      let statusNameComp = '';
      let subStatusNameComp = '';
      let statusNameSTA = '';
      let subStatusNameSTA = '';
      let statusNameWO = '';
      let subStatusNameWO = '';
      let amountVal = '0.0';

      if(action == "Save") {
        this.props.getStatus('8','8.1')
        .then(()=>{
          statusNamePS = this.props.statusResult.dataSource[0].trip_pjp_status;
          subStatusNamePS = this.props.statusResult.dataSource[0].sub_status
        })
        .then(()=>{
          this.props.getStatus('11','11.2')
          .then(()=>{
            statusNameComp = this.props.statusResult.dataSource[0].trip_pjp_status;
            subStatusNameComp = this.props.statusResult.dataSource[0].sub_status
          })
          .then(()=>{
            for(var i=0; i< newList.length;i++) {
              if(newList[i].through != "Self" || (newList[i].through == "Travel Agent" && newList[i].is_outof_policy == 'N')) {
                this.setState({ 
                  isLoading: false,
                  setGoBack: false
                });
                Alert.alert(
                  'Warning',
                  'Please choose proper options as per the requisition Status and Through ! ',
                  [
                    {
                      text: 'Ok',
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                )
                break
              } else {
                if(newList[i].req_type == '1' && newList[i].amount != null && newList[i].amount != '' 
                  && newList[i].amount != 'NA' && newList[i].amount == 'On Actual') {
                  amountVal = newList[i].amount;
                } else {
                  if(newList[i].amount == '') {
                    amountVal = '0.0';
                  } else if (newList[i].amount == 'NA' || newList[i].amount == 'On Actual'){
                    amountVal = newList[i].amount;
                  }
                }

                if( (newList[i].status_id == '7' && newList[i].sub_status_id == '7.5' && newList[i].is_outof_policy == 'Y')
                  || (newList[i].through == "Travel Agent" && newList[i].is_outof_policy == 'Y')
                ){
                  newList[i].status_id = '8';
                  newList[i].sub_status_id = '8.1';
                  newList[i].status = statusNamePS;
                  newList[i].sub_status = subStatusNamePS;
                } else if (newList[i].req_type == '1' && newList[i].sub_status_id == '7.1' && newList[i].is_outof_policy == 'N') {
                  newList[i] == newList[i];
                }
                else {
                  newList[i].status_id = '11';
                  newList[i].sub_status_id = '11.2';
                  newList[i].status = statusNameComp;
                  newList[i].sub_status = subStatusNameComp;
                }
                newList[i].email = global.USER.userEmail;
                newList[i].pending_with_name = global.USER.supervisorName;
                newList[i].pending_with_email = global.USER.supervisorEmail;
                newList[i].pending_with = global.USER.supervisorId;
                newList[i].userid = global.USER.userId;
                newList[i].amount = amountVal;
              }
            }
          })
          .then(()=>{
            this.props.plansSubmit(newList)
            .then(()=>{
              this.props.getTrips(global.USER.userId)
              .then(()=>{
                this.setState({ isLoading: false });
              })
              .then(()=>{
                this.props.navigation.goBack();
                Toast.show('Plan Trip Submitted Successfully', Toast.LONG);
              })
            })
          })
        })        
      } else if(action == "Send") {
        this.props.getStatus('7','7.1')
        .then(()=>{
          statusNameSTA = this.props.statusResult.dataSource[0].trip_pjp_status;
          subStatusNameSTA = this.props.statusResult.dataSource[0].sub_status
        })
        .then(()=>{
          this.props.getStatus('7','7.3')
          .then(()=>{
            statusNameWO = this.props.statusResult.dataSource[0].trip_pjp_status;
            subStatusNameWO = this.props.statusResult.dataSource[0].sub_status
          })
          .then(()=>{
            for(var i=0; i< newList.length;i++) {
              if(newList[i].through != "Travel Agent" || (newList[i].through == "Travel Agent" && newList[i].is_outof_policy == 'Y')) {
                this.setState({ 
                  isLoading: false,
                  setGoBack: false
                });
                Alert.alert(
                  'Warning',
                  'Please choose proper options as per the requisition Status or Through or Out Of Policy! ',
                  [
                    {
                      text: 'Ok',
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                )
                break
              } else if(newList[i].sub_status_id == '7.4' && newList[i].through == "Travel Agent"){                
                newList[i].status_id = '7';
                if(newList[i].flight && newList[i].flight.length>0){
                  newList[i].sub_status_id = '7.3';
                  newList[i].status = statusNameWO;
                  newList[i].sub_status = subStatusNameWO;
                } else {
                  newList[i].sub_status_id = '7.1';
                  newList[i].status = statusNameSTA;
                  newList[i].sub_status = subStatusNameSTA;
                }
              }
            }
          })
          .then(()=>{
            if(this.state.setGoBack) {
              this.props.planUpdate(newList)
              .then(()=>{
                this.props.getTrips(global.USER.userId)
                .then(()=>{
                  this.setState({ isLoading: false });
                })
                .then(()=>{
                  this.props.navigation.goBack();
                  Toast.show('Data Send To Vendor Successfully', Toast.LONG);
                })
              })
            }
          })
        })        
      }
    }
  }
	
  render() {
    const {params} = this.props.navigation.state;
    if(this.props.plans.isLoading || this.props.reqType.isLoading || this.state.isLoading){
      return(
        <Loader/>
      )
    } else if(this.props.plans.errorStatus || this.props.reqType.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else {
    var sortList = this.props.plans.dataSource;
    sortList.sort((a,b) => b.req_hdr_id - a.req_hdr_id);
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAcrdVisible()}}>
            <Text style={styles.acrdTitle}>Trip Info</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{display:this.state.acrdVisible==0?'none':'flex'}}>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Start Date:</Label>
              <Text style={styles.formInput}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>End Date:</Label>
              <TouchableOpacity onPress={this.datepicker} style={styles.datePicker}>
                <Text style={styles.datePickerLabel}>{moment(this.state.date).format(global.DATEFORMAT)}</Text>
                <Icon name="calendar" style={styles.datePickerIcon} />
              </TouchableOpacity>
            </Item>
            { this.state.show && 
            <DateTimePicker value={new Date(this.state.date)}
              mode={this.state.mode}
              minimumDate={new Date(this.state.endDateLmt?this.state.endDateLmt: params.start_date)}
              is24Hour={true}
              display="default"
              onChange={this.setDate} />
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:</Label>
              <Text style={styles.formInput}><Purpose value={params.purpose} /></Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:</Label>
              <Text style={styles.formInput}>{params.trip_from}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Text style={styles.formInput}>{params.trip_to}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:</Label>
              <Text style={styles.formInput}><For value={params.trip_for} /></Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Traveler's Name:</Label>
              <Text style={styles.formInput}>{params.name}</Text>
            </Item>
            <Item fixedLabel last style={styles.formRow}>
              <Label style={styles.formLabel}>Details:</Label>
              <Text style={styles.formInput}>{params.comment}</Text>
            </Item>
          </Form>
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
                <Text style={styles.modalTitle}>Select Requisition Type:</Text>
                {this.props.reqType.dataSource.map((item, index) => {
                return (
                <TouchableOpacity style={styles.modalItem}
                  key= {index}
                  onPress={() => this.setState({modalVisible: 0}, 
                  () => this.props.navigation.navigate(
                      item.sub_category_id=='1' ? 'AirRequisition'
                    : item.sub_category_id=='10' ? 'TaxiRequisition'
                    : item.sub_category_id=='11' ? 'TaxiRequisition'
                    : item.sub_category_id=='3' ? 'TrainReq'
                    : item.sub_category_id=='1BH' ? 'HotelReq'
                    : item.sub_category_id=='1BM' ? 'HotelReq'
                    : item.sub_category_id=='1BNM' ? 'HotelReq'
                    : null,
                    {item, params, 'update':false}
                  )
                  )}>
                  <View style={[styles.modalItemIconHolder,{ backgroundColor:
                    item.sub_category_id=='1' ? '#007AFF'
                    : item.sub_category_id=='10' ? '#3ba03f'
                    : item.sub_category_id=='11' ? '#FF9501'
                    : item.sub_category_id=='3' ? '#f16168'
                    : item.sub_category_id=='1BH' ? '#00c4ff'
                    : item.sub_category_id=='1BM' ? '#9c27b0'
                    : item.sub_category_id=='1BNM' ? '#27b084'
                    : null
                    }]}>
                    {item.sub_category_id=='1' ?
                    <Icon style={styles.modalItemIcon} name="airplane" />
                    : item.sub_category_id=='10' ?
                    <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="ios-car" />
                    : item.sub_category_id=='11' ?
                    <Icon style={[styles.modalItemIcon,{fontSize:24}]} name="md-car" />
                    : item.sub_category_id=='3' ?
                    <Ficon style={styles.modalItemIcon} name="subway" />
                    : item.sub_category_id=='1BH' ?
                    <Ficon style={styles.modalItemIcon} name="hotel" />
                    : item.sub_category_id=='1BM' ?
                    <Icon style={[styles.modalItemIcon,{fontSize:26}]} name="ios-train" />
                    : item.sub_category_id=='1BNM' ?
                    <Ficon style={styles.modalItemIcon} name="road" />
                    : null
                    }
                  </View>
                  <View style={styles.modalItemBody}>
                    <Text style={styles.modalItemText}>{item.sub_category}</Text>
                  </View>
                </TouchableOpacity>
                );
                })}                
              </View>
            </View>
          </Modal>
          
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>Created Requisition(s)</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => {this.setModalVisible(1);}}>
              <LinearGradient
                style={styles.addBtnBg}
                colors={["#9752ff", "#5e93ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                >
                <Icon name='ios-add-circle-outline' style={styles.addBtnIcon} />
                <Text uppercase={false} style={styles.addBtnText}>Add Requisition</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {sortList.length > 0 ?
            sortList.map((item, index) => {
            return (
              this.renderItem(item,index,params)
            );
            })
            :
            <Text style={styles.noReqMsg}>You don't have any Requisition.</Text>
          }
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
                {this.props.reqType.dataSource.map((item, index) => {
                return (
                <TouchableOpacity style={[styles.modalItem,
                  (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.modalItemActive
                ]}
                  key= {index}
                  onPress={() =>{this.editModalVisible(null); this.props.navigation.navigate(
                      item.sub_category_id=='1' ? 'AirRequisition'
                    : item.sub_category_id=='10' ? 'TaxiRequisition'
                    : item.sub_category_id=='11' ? 'TaxiRequisition'
                    : item.sub_category_id=='3' ? 'TrainReq'
                    : item.sub_category_id=='1BH' ? 'HotelReq'
                    : item.sub_category_id=='1BM' ? 'HotelReq'
                    : item.sub_category_id=='1BNM' ? 'HotelReq'
                    : null,
                    {item, params, 'update':this.state.editModalData?this.state.editModalData[0]:false}
                  );
                  }}>
                  {(this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) &&
                    <Icon style={styles.modalItemcarot} name="md-arrow-dropright" />
                  }
                  <View style={[styles.modalItemIconHolder,{ backgroundColor:
                    (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) ? '#fff'
                    : item.sub_category_id=='1' ? '#007AFF'
                    : item.sub_category_id=='10' ? '#3ba03f'
                    : item.sub_category_id=='11' ? '#FF9501'
                    : item.sub_category_id=='3' ? '#f16168'
                    : item.sub_category_id=='1BH' ? '#00c4ff'
                    : item.sub_category_id=='1BM' ? '#9c27b0'
                    : item.sub_category_id=='1BNM' ? '#27b084'
                    : null
                    }]}>
                    {item.sub_category_id=='1' ?
                    <Icon style={[styles.modalItemIcon, 
                      (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                      name="airplane" />
                    : item.sub_category_id=='10' ?
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
                    <Icon style={[styles.modalItemIcon,{fontSize:26},
                      (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                      name="ios-train" />
                    : item.sub_category_id=='1BNM' ?
                    <Ficon style={[styles.modalItemIcon, 
                      (this.state.editModalData && this.state.editModalData[1]==item.sub_category_id) && styles.mdlActIcon]} 
                      name="road" />
                    : null
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
              </View>
            </View>
          </Modal>
        </Content>

        {this.props.plans.dataSource.length>0 &&
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.submit("Save")} style={styles.ftrBtnR}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBgR}>
              <Icon name="md-done-all" style={styles.ftrBtnIconR} />
              <Text style={styles.ftrBtnTxtR}>Submit or Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.submit("Send")} style={styles.ftrBtnR}>
            <LinearGradient 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBgR}>
              <Icon name="md-paper-plane" style={styles.ftrBtnIconR} />
              <Text style={styles.ftrBtnTxtR}>Send to Agent</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>}
        {/*<View style={styles.footer}>
          <TouchableOpacity style={styles.ftrBtn} onPress={() => {}}>
            <Ficon name="save" style={[styles.ftrBtnIcon,styles.textPrimary]} />
            <Text style={[styles.ftrBtnText,styles.textPrimary]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ftrBtn} onPress={() => {}}>
            <Icon name="md-done-all" style={[styles.ftrBtnIcon,styles.textSuccess]} />
            <Text style={[styles.ftrBtnText,styles.textSuccess]}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ftrBtn} onPress={() => {}}>
            <Icon name="md-paper-plane" style={[styles.ftrBtnIcon,styles.textWarning]} />
            <Text style={[styles.ftrBtnText,styles.textWarning]}>Send to Agent</Text>
          </TouchableOpacity>
        </View>*/}
      </Container>
    );
    }
  }
	
	getReqValue = (value) => {
		for(var i=0; i<this.props.reqType.dataSource.length; i++) {
      if(this.props.reqType.dataSource[i].sub_category_id == value) {
        return (
          this.props.reqType.dataSource[i].sub_category
        );
      }
    }
  }

  renderItem = (data,index,params) => {
  let item=this.state.airReqData;
  if(!data.req_type) {
    return <View key={index} style={[styles.cardItem,styles.cardHrzntl]}>
      <Button small danger style={[styles.actionBtn,styles.cardHrzntlBtnLeft]}
        onPress={()=>this.deleteConfirmation(data)}
        >
        <Icon name='trash' style={styles.actionBtnIco} />
      </Button>
      <Text style={styles.cardTile}>{ data.sub_status }</Text>
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
    onPress={() => 
      ((data.req_type=='1' && data.sub_status_id == '11.1') 
      || (data.req_type=='1' && data.sub_status_id == '7.1') 
      || (data.req_type=='1' && data.sub_status_id == '7.3')
      || (data.req_type=='1' && data.sub_status_id == '11.2'))
      ? this.props.navigation.navigate('AirRequisition', {item, params, 'update':data})
      :this.props.navigation.navigate('ReqInfo',data)
    }>
    <View style={styles.cardItemHeader}>
      {((data.status_id=='11') || (data.status_id=='7' && data.sub_status_id =="7.1") || (data.status_id=='7' && data.sub_status_id =="7.3")
       || (data.status_id=='8' && data.sub_status_id == "8.1") || (data.status_id=='9' && data.sub_status_id == "9.1") 
       || (data.status_id=='6' && data.sub_status_id == '6.1') || (data.status_id=='7' && data.sub_status_id == '7.2') ) 
      ? null :
      <TouchableOpacity 
        onPress={() => {this.press(data)}}
        style={[data.check ?styles.checkedBox :styles.unCheckedBox, styles.checkBox]}
        >
        {data.check
        ? (<Icon name="md-checkmark" style={styles.checkIcon} />)
        : (<Icon name="md-square-outline" style={styles.uncheckIcon} />)
        }
      </TouchableOpacity >}     
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
      <Icon style={styles.cardTileIcon} name="ios-train" />
      : data.req_type=='1BNM' ?
      <Ficon style={styles.cardTileIcon} name="road" />
      : null
      }
      <Text style={styles.cardTile}>{this.getReqValue(data.req_type)}</Text>
      { data.status_id == "9"
        || data.status_id == "19"
        || data.status_id == "20"
        || data.status_id == "21"
        || data.status_id == "22"
        || data.status_id == "23"
        || data.status_id == "24"
        || data.status_id == "25" 
        ? null :
        <TouchableOpacity 
          onPress={() => {
            ((data.req_type=='1' && data.sub_status_id == '11.1') 
            || (data.req_type=='1' && data.sub_status_id == '7.1') 
            || (data.req_type=='1' && data.sub_status_id == '7.3')
            || (data.req_type=='1' && data.sub_status_id == '11.2'))
            ? this.props.navigation.navigate('AirRequisition', {item, params, 'update':data})
            :this.editModalVisible([data,data.req_type]);
          }}
          style={styles.editlBtn}
          >
          {((data.req_type=='1' && data.sub_status_id == '11.1') 
          || (data.req_type=='1' && data.sub_status_id == '7.1') 
          || (data.req_type=='1' && data.sub_status_id == '7.3')
          || (data.req_type=='1' && data.sub_status_id == '11.2'))
          ? <Icon name="md-arrow-forward" style={styles.editBtnIcon} />
          :<>
          <Icon name="md-create" style={styles.editBtnIcon} />          
          <Text style={styles.editBtnText}>Edit</Text>
          </>}
        </TouchableOpacity >
      }
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Status:</Text>
          <Text style={styles.cardValue}>{ data.sub_status ? data.sub_status :  data.status }</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Through:</Text>
          <Text style={styles.cardValue}>{data.through}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Out Of Policy:</Text>
          <Text style={styles.cardValue}>{data.is_outof_policy=="Y"?"Yes":"No"}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Amount:</Text>
          <Text style={styles.cardValue}>{data.amount?data.amount:'0.0'}</Text>
        </View>
        { data.status_id == '3' || data.status_id == '4' ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Attachment:</Text>
          <TouchableOpacity 
            style={styles.cardValueBtn}            
            onPress={() => {this.attachModalVisible(data.status);}}>
            <Text style={styles.cardValueBtnText}>staticfile.png</Text>
          </TouchableOpacity>
        </View>:null}
      </View>
      <View style={styles.itemActions}>
        {(data.sub_status_id=="6.1" || data.sub_status_id=="7.4") ?
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
    </View>    
  </TouchableOpacity>
  }
  };

}

const mapStateToProps = state => {
  return {
    plans: state.plans,
    reqType: state.reqType,
    ReqDelete: state.ReqDelete,
    tripEndDateUpdatePost: state.tripEndDateUpdatePost,
    trips: state.trips,
    statusResult: state.statusResult,
    plansSubmitState: state.plansSubmitState,
    planUpdateState: state.planUpdateState
  };
};

const mapDispatchToProps = {
  getPlans : Actions.getPlans,
  getReqType : Actions.getReqType,
  reqDelete: Actions.reqDelete,
  tripEndDateUpdate: Actions.tripEndDateUpdate,
  getTrips : Actions.getTrips,
  getStatus: Actions.getStatus,
  plansSubmit: Actions.plansSubmit,
  planUpdate: Actions.planUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(TripPlanScreen);