import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
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
    };
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(props){
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id);
    this.props.getReqType(global.USER.designation,global.USER.grade);
    this.setState({dataSource: this.props.plans.dataSource});
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
	
  render() {
    const {params} = this.props.navigation.state;
    if(this.props.plans.isLoading || this.props.reqType.isLoading || this.state.isLoading){
      return(
        <Loader/>
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
            <DateTimePicker value={new Date(params.end_date)}
              mode={this.state.mode}
              minimumDate={new Date(params.start_date)}
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
              this.renderItem(item,index)
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
                  this.state.editModalData && this.state.editModalData[1]==item.sub_category_id && styles.modalItemActive
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
        </Content>
        {/*<View style={styles.footer}>
          <TouchableOpacity onPress={() => {}} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']} 
              style={styles.ftrBtnBg}>
              <Icon name="md-done-all" style={styles.ftrBtnIcon} />
              <Text style={styles.ftrBtnTxt}>Submit or Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name="md-done-all" style={[styles.ftrBtnIcon,{fontSize:20}]} />
              <Text style={styles.ftrBtnTxt}>Send to Agent</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>*/}
        <View style={styles.footer}>
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
        </View>
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

  renderItem = (data,index) => {
  return <TouchableOpacity 
    key={index} 
    style={styles.cardItem} 
    onPress={() => this.props.navigation.navigate('ReqInfo',data)}>
    <View style={styles.cardItemHeader}>
      <TouchableOpacity 
        onPress={() => {this.press(data)}}
        style={[data.check ?styles.checkedBox :styles.unCheckedBox, styles.checkBox]}
        >
        {data.check
        ? (<Icon name="md-checkmark" style={styles.checkIcon} />)
        : (<Icon name="md-square-outline" style={styles.uncheckIcon} />)
        }
      </TouchableOpacity >      
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
      { data.status_id == "19"
        || data.status_id == "20"
        || data.status_id == "21"
        || data.status_id == "22"
        || data.status_id == "23"
        || data.status_id == "24"
        || data.status_id == "25" 
        ? null :
        <TouchableOpacity 
          onPress={() => {this.editModalVisible([data,data.req_type]);}}
          style={styles.editlBtn}
          >
          <Icon name="md-create" style={styles.editBtnIcon} />
          <Text style={styles.editBtnText}>Edit</Text>
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
          <Text style={styles.cardValue}>{data.is_outof_policy=="Y"&&"Yes"}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Amount:</Text>
          <Text style={styles.cardValue}>{data.amount}</Text>
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
        {(data.status_id=="6" && data.sub_status_id=="6.1") 
        || (data.status_id=="7" && data.sub_status_id=="7.4") ?
        <Button bordered small rounded danger style={styles.actionBtn}
          onPress={()=>this.deleteConfirmation(data)}
          >
          <Icon name='trash' style={styles.actionBtnIco} />
        </Button>
        :null}
        
        <Button bordered small rounded primary 
          style={[styles.actionBtn, styles.mrgTop]}
          onPress={() => {}}>
          <Icon name='attach' style={styles.actionBtnIco} />
        </Button>
      </View>
    </View>    
  </TouchableOpacity>
  };

}

const mapStateToProps = state => {
  return {
    plans: state.plans,
    reqType: state.reqType,
    ReqDelete: state.ReqDelete
  };
};

const mapDispatchToProps = {
  getPlans : Actions.getPlans,
  getReqType : Actions.getReqType,
  reqDelete: Actions.reqDelete
};

export default connect(mapStateToProps, mapDispatchToProps)(TripPlanScreen);