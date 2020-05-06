import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Picker, Platform, TouchableOpacity, TextInput, 
        AsyncStorage, BackHandler, Alert, Modal, Image, TouchableNativeFeedback, ActivityIndicator } from "react-native";
import { Button, Icon, Text, Form, Item, Label } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient'
import PickerModal from 'react-native-picker-modal-view'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import { HeaderBackButton } from "react-navigation-stack"

import Loader from '../Components/Loader'
import styles from './Styles/AirRequisitionScreen';

class AirReqSalesClaimScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const handleClearPress = navigation.getParam("handleBackPress", () => {});
    return {
      title: "Air Requisition",
      headerLeft: <HeaderBackButton onPress={handleClearPress} />
    };
  };

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      isLoading: false,
      readOnly: params.update.sub_status_id == '7.3' ? true:false,
      ticketList: null,
      selectTicketData: null,
      acrdOneVisible: 0,
      acrdTwoVisible: 0,
      statusName: '',
      subStatusName: '',
      tcktClass: (params.update && params.update.ticket_class)?params.update.ticket_class:null,
      tcktClassError: null,
      tcktStatus: (params.update && params.update.ticket_status)?params.update.ticket_status:null,
      tcktStatusError: null,
      justification: (params.update && params.update.justification)?params.update.justification:null,
      justificationError: null,
      msg: (params.update && params.update.comment)?params.update.comment:null
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

    this.props.getTicketsSales(params.update.trip_no,params.update.lineitem,params.update.trip_hdr_id_fk)
    .then(()=>{
      if(this.props.ticketsSalesList.dataSource.length>0){
        this.setState({
          ticketList: this.props.ticketsSalesList.dataSource
        })
        for(var i=0; i<this.props.ticketsSalesList.dataSource.length; i++) {
          if(this.props.ticketsSalesList.dataSource[i].airline==params.update.flight) {
            this.setState({
              selectTicketData: this.props.ticketsSalesList.dataSource[i]
            });
          }
        }
      }
    })
  }

  handleComment = (text) => {
    this.setState({ comments: text })
  }

  setAcrdOneVisible() {
    this.setState({
      acrdOneVisible: this.state.acrdOneVisible == 0?1:0
    });
  }

  setAcrdTwoVisible() {
    this.setState({
      acrdTwoVisible: this.state.acrdTwoVisible == 0?1:0
    });
  }

  handleClass = (text) => {
    this.setState({ 
      tcktClass: text,
      tcktClassError: null
    })
  }

  handleStatus = (text) => {
    this.setState({ 
      tcktStatus: text,
      tcktStatusError: null
    })
  }
  
  handleJustification = (text) => {
    this.setState({ 
      justification: text,
      justificationError: null
    })
  }

  handleMsg = (text) => {
    this.setState({ 
      msg: text,
    })
  }

  submitReq = () => { 
    this.setState({
      isLoading: true
    });   
    const {params} = this.props.navigation.state;
    if ( !this.state.tcktClass || !this.state.tcktStatus || !this.state.justification ){      
      if(!this.state.tcktClass) {
        this.setState({
          tcktClassError: 'Please enter Ticket class'
        });
      }
      if(!this.state.tcktStatus) {
        this.setState({
          tcktStatusError: 'Please enter Ticket status.',
        });
      }
      if(!this.state.justification) {
        this.setState({
          justificationError: 'Please enter proper justification.',
        });
      }
    } else {      
      this.reqUpdate();
    }
  }

  reqUpdate = () => {
    const {params} = this.props.navigation.state;
    let newReq = params.update;
    let newPJP = params.params;
    AsyncStorage.getItem("ASYNC_STORAGE_UPDATE_KEY")
    .then(()=>{
      newReq.ticket_class = this.state.tcktClass;
      newReq.ticket_status = this.state.tcktStatus;
      newReq.justification = this.state.justification;
      newReq.comment = this.state.msg;
      newReq.status_id = '20';
      newReq.status = this.state.statusName;
    })
    .then(()=>{
      newPJP.status_id = '20';
      newPJP.status = this.state.statusName;
      newPJP.sub_status_id = 'NA';
      newPJP.sub_status = this.state.subStatusName;
    })
    .then(()=>{
        this.props.updtReqSale([newReq])
        .then(()=>{
          this.props.pjpTotal([newPJP])
          .then(()=>{
            this.props.getReqSale(params.params.trip_hdr_id)
            .then(()=>{
              this.props.getPjp(global.USER.userId)
              .then(()=>{
                this.setState({
                  isLoading: false,
                });
              })
              .then(()=>{
                this.props.navigation.goBack();
                Toast.show('Requisition Saved Successfully', Toast.LONG);
              });
            })
          })
        })
    });
  }

  render() {
    const {params} = this.props.navigation.state;
    console.log(this.state.selectTicketData)

    if(this.state.isLoading ||
      this.props.ticketsSalesList.isLoading ||
      this.props.statusResult.isLoading
      ){
      return(
        <Loader/>
      )
    } else if(
      this.props.ticketsSalesList.errorStatus ||
      this.props.statusResult.errorStatus
      ) {
      return(
        <Text>URL Error</Text>
      )
    } else {
      console.log(params);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin, height, padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAcrdOneVisible()}}>
            <Text style={styles.acrdTitle}>Tour Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdOneVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:(this.state.acrdOneVisible==0)?'none':'flex'}}>
            {params.update.travel_date ?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.travel_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            {params.item.upper_limit ?
            <Item fixedLabel style={styles.formRow}>
              <Label style={[styles.formLabel,{flex:5}]}>Eligible Amount/Per Flight:</Label>              
              <Text style={[styles.formInput,styles.readOnly]}>{params.item.upper_limit}</Text>
            </Item>:null}
            {params.update.travel_time?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Suitable Time:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_time}</Text>
            </Item>:null}
            {params.update.travel_type?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Type:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_type}</Text>
            </Item>:null}
            {params.update.travel_from?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_from}</Text>
            </Item>:null}
            {params.update.travel_to?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.travel_to}</Text>
            </Item>:null}
            {params.update.email?
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Email:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.email}</Text>
            </Item>:null}
            {params.update.through?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Through:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.through}</Text>
            </Item>:null}
            {params.update.vendor_name ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>:null}
            {params.update.vendor_comment?<>
            <Label style={[styles.formLabel,{marginLeft:16, marginBottom:4}]}>Comments:</Label>
            <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_comment}</Text>
            </>:null}
          </Form>
          
          <TouchableOpacity style={[styles.accordionHeader,styles.mt]}
            onPress={()=>{this.setAcrdTwoVisible()}}>
            <Text style={styles.acrdTitle}>Travel Agent Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdTwoVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{marginBottom:16,display:(this.state.acrdTwoVisible==0)?'none':'flex'}}>
            {params.update.invoice_date ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(params.update.invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Travel Agent Name:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_name}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.gstin}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>CGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_CGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>SGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_SGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>IGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{params.update.vendor_IGST}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Processing Charges:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>&nbsp;</Text>
            </Item>
          </Form>
          
          {this.state.selectTicketData ?<>
          <View style={[styles.accordionHeader,styles.mt]}>
            <Text style={styles.acrdTitle}>Flight Informations</Text>
          </View>
          <Form style={{marginBottom:16}}>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Vendor:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor Invoice Amount:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.price}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Out of policy:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.type}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vender CGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_CGST_percent}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor SGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_SGST_percent}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Vendor IGST:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.f_IGST_percent}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.ticket_number}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Number:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline_invoice_number}</Text>
            </Item>
            {this.state.selectTicketData.airline_invoice_date ?
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Invoice Date:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{moment(this.state.selectTicketData.airline_invoice_date).format(global.DATEFORMAT)}</Text>
            </Item>:null}
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Flight Vendor:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.airline_vendor}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>GSTIN:</Label>
              <Text style={[styles.formInput,styles.readOnly]}>{this.state.selectTicketData.gstin}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Class:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                onSubmitEditing={() => this.refs.tcktStatus.focus()}
                placeholder='Enter ticket class' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.tcktClass}
                onChangeText={this.handleClass} />
            </Item>
            {this.state.tcktClassError &&
              <Text style={styles.errorText}>{this.state.tcktClassError}</Text>
            }
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Ticket Status:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
              <TextInput 
                ref='tcktStatus'
                onSubmitEditing={() => this.refs.justification.focus()}
                placeholder='Enter ticket status' 
                style={styles.formInput}
                underlineColorAndroid= "rgba(0,0,0,0)"
                value = {this.state.tcktStatus}
                onChangeText={this.handleStatus} />
            </Item>
            {this.state.tcktStatusError &&
              <Text style={styles.errorText}>{this.state.tcktStatusError}</Text>
            }
            <Label style={[styles.formLabel,styles.inputLabel]}>Justification:<Text style={{color:'red',fontSize:13}}>*</Text></Label>
            <TextInput 
              ref='justification'
              placeholder='Enter your justification' 
              style={styles.textArea}
              numberOfLines={4}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.justification}
              onChangeText={this.handleJustification} />
            {this.state.justificationError &&
              <Text style={styles.errorText}>{this.state.justificationError}</Text>
            }
          </Form>
          
          <Text style={styles.flightTitle}>Flight Details</Text>
          <View style={styles.ticketItem}>
            <View style={[
              styles.ticketColumn,
              styles.ticketLeft,
              styles.selectedTicket,
              styles.selectedTicketLeft
              ]}>
              <View style={[styles.circle, styles.circleLeft]}></View>
              <Text style={styles.nameLabel}>Flight Name:</Text>
              <Text style={styles.flightName}>{this.state.selectTicketData.airline}</Text>
              <Text style={styles.ticketLabel}>Departure Time &amp; Place:</Text>
              <Text style={styles.ticketValue}>{this.state.selectTicketData.departure}</Text>
              <Text style={styles.ticketLabel}>Arival Time &amp; Place</Text>
              <Text style={styles.ticketValue}>{this.state.selectTicketData.arrival}</Text>
            </View>
            <View style={[
              styles.ticketColumn,
              styles.ticketRight,          
              styles.selectedTicket,
              styles.selectedTicketRight
              ]}>
              <View style={[styles.circle, styles.circleRight]}></View>
              <View style={styles.checkBox}>
                <Icon name='md-checkmark' style={styles.checkIcon} />
              </View>
              <Text style={styles.price}>{this.state.selectTicketData.price}</Text>
              <Text style={styles.currency}>{this.state.selectTicketData.currency}</Text>        
              <Text style={styles.oop}>Out of Policy:</Text>
              <Text style={styles.oopValue}>{this.state.selectTicketData.type}</Text>
            </View>
          </View>
          
          </>:null}

          <Text style={[styles.formLabel,styles.inputLabel]}>Comments:</Text>
          <TextInput 
            placeholder='Enter comments' 
            style={styles.textArea}
            underlineColorAndroid= "rgba(0,0,0,0)"
            value = {this.state.msg}
            returnKeyType="next"
            numberOfLines={4}
            onChangeText={this.handleMsg} />

          {(params.update.sub_status_id != '7.1' && params.update.sub_status_id != '7.3') ?
          <TouchableOpacity onPress={() => this.submitReq()} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save Requisition</Text>
            </LinearGradient>
          </TouchableOpacity>
          :null}

        </ScrollView>
      </KeyboardAvoidingView>
    );
    }
  }

  selectTicket=(data)=>{
    this.setState({ 
      selectTicketData: data,
      amount: data.price,
      OOP: data.type == 'YES'?'Y':'N'
    })
    console.log(this.state.selectTicketData);
    console.log(this.state.OOP);
  }
}

const mapStateToProps = state => {
  return {
    updtReqSaleState: state.updtReqSaleState,
    statusResult: state.statusResult,
    reqListSales: state.reqListSales,
    generateExpState: state.generateExpState,
    ticketsSalesList: state.ticketsSalesList,
  };
};

const mapDispatchToProps = {
  updtReqSale: Actions.updtReqSale,
  getStatus: Actions.getStatus,
  getReqSale : Actions.getReqSale,
  generateExp: Actions.generateExp,
  getTicketsSales: Actions.getTicketsSales,
};

export default connect(mapStateToProps, mapDispatchToProps)(AirReqSalesClaimScreen);