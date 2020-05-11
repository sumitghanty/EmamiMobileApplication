import React, { Component } from 'react';
import { View, TouchableOpacity, Picker, Keyboard } from "react-native";
import { Container, Content, Button, Icon, Text, Form, Item, Label, Input, } from 'native-base';
import DocumentPicker from 'react-native-document-picker'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import Ficon from 'react-native-vector-icons/FontAwesome5'

import Loader from '../Components/Loader'
import {Purpose, For } from '../Components/GetValue'
import styles from './Styles/AdvPmntReqScreen';

class AdvPmntReqScreen extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      currency: 'INR',
      acrdVisible: 0,
      attachFiles: [],
      advAmount: params.payment_amount,
      advAmntError: '',
      error: false,
      isLoading: false,
    };
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
      //Setting the state to show multiple file attributes
      this.setState({ attachFiles: results });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('You have not select any file for attachment');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  onValueChangeCurrency = (value) => {
    this.setState({
      currency: value
    });
  }

  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
    });
  }
  
  handleChangeAmount = (amnt) => {
    var v= Math.sign(amnt);
     if(v=== 1 || amnt===''){
         this.setState({
             advAmount: amnt,
             advAmntError: '',
         })
     }
     else if (amnt === "0")
     {
         alert("Enter Correct Amount");
         
     }
     else {
         alert("Enter Correct Amount");
     } 
  }

  submitAdv = (statusId) => {
    const {params} = this.props.navigation.state;
    let newParams = params;
    newParams.trip_hdr_id=params.trip_hdr_id;
    newParams.id=params.trip_no;
    newParams.advancePaymentStatusId=statusId;
    newParams.advancePaymentStatus= statusId == "12"
                                      ?"Advance Payment - Initiated"
                                      :statusId == "14"?"Advance Payment - Pending with Approver"
                                      :null;
    newParams.payment_amount=this.state.advAmount;
    newParams.currency=this.state.currency;
    newParams.pending_with_name=global.USER.supervisorName;
    newParams.pending_with=global.USER.supervisorId;
    newParams.pending_with_email=global.USER.supervisorEmail;

    if(!this.state.advAmount) {
      this.setState({
        advAmntError: 'Please enter advance amount.',
        error: true,
      });
    } else {
      this.setState({ isLoading: true }, () => {      
        this.props.advPmnt([newParams])
        .then(()=>{    
          if(statusId ==  '14') {   
            this.props.sendEmail({
              "mailId": global.USER.supervisorName,
              "cc": 'chinmaymcc@gmail.com',
              "subject": 'Kindly Approve The Advance Payment',
              "tripNonSales": newParams,
              "requisitionNonSales": null
            })
            .then(()=>{
              //this.props.getAdvPmnts(global.USER.userId,"3",["3", "4", "6", "7", "9", "11", "12", "13", "14", "15", "16", "17", "18"]);
              this.props.getAdvPmnts(global.USER.userId,"3",["3", "4", "6", "7", "9", "11", "12", "13", "14", "16", "18"])          
              .then(()=>{
                this.props.navigation.navigate('Advance');
                if(statusId == "14") {
                  Toast.show('Advance payment submited successfully', Toast.LONG);
                }
                if(statusId == "12") {
                  Toast.show('Advance payment saved successfully', Toast.LONG);
                }
              })
            });
          } else {
            this.props.getAdvPmnts(global.USER.userId,"3",["3", "4", "6", "7", "9", "11", "12", "13", "14", "16", "18"])          
            .then(()=>{
              this.props.navigation.navigate('Advance');
              if(statusId == "14") {
                Toast.show('Advance payment submited successfully', Toast.LONG);
              }
              if(statusId == "12") {
                Toast.show('Advance payment saved successfully', Toast.LONG);
              }
            })
          }
        })
      });
    }
    Keyboard.dismiss();
  }

  render() {
    const {params} = this.props.navigation.state;
    if(this.state.isLoading || this.props.advPmnt.isLoading){
      return(
        <Loader/>
      )
    }
    console.log(params);
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAcrdVisible()}}>
            <Text style={styles.acrdTitle}>Trip Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"add-circle":"remove-circle"} />
          </TouchableOpacity>
          <Form style={{display:this.state.acrdVisible==0?'none':'flex'}}>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Start Date:</Label>
              <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>End Date:</Label>
              <Text style={styles.value}>{params.trip_from}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Purpose:</Label>
              <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>From:</Label>
              <Text style={styles.value}>{params.trip_from}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>To:</Label>
              <Text style={styles.value}>{params.trip_to}</Text>
            </Item>
            <Item picker fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Trip for:</Label>
              <Text style={styles.value}><For value={params.trip_for} /></Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Traveler's Name:</Label>
              <Text style={styles.value}>{params.name}</Text>
            </Item>
            <Item fixedLabel last style={styles.formRow}>
              <Label style={styles.formLabel}>Details:</Label>
              <Text style={styles.value}>{params.details}</Text>
            </Item>
          </Form>
          <Form style={styles.form}>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Estimated Cost:</Label>
              <Text style={styles.value}>{params.estimated_cost ? params.estimated_cost : '00.00'}</Text>
            </Item>
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Advance Payment:</Label>
              {params.advancePaymentStatusId == '14' ?
              <Text style={styles.value}>{this.state.advAmount}</Text>
              :
              <Input 
                style={styles.formInput} 
                keyboardType= "number-pad" 
                placeholder="Enter amount"
                value={this.state.advAmount}
                onChangeText={this.handleChangeAmount}
                />
              }
            </Item>
            {this.state.advAmntError.length>0 ?
              <Text style={styles.errorText}>{this.state.advAmntError}</Text>
            :null}
            <Item fixedLabel style={styles.formRow}>
              <Label style={styles.formLabel}>Currency:</Label>
              {params.advancePaymentStatusId == '14' ?
              <Text style={styles.value}>{this.state.currency}</Text>
              :
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={[styles.formInput, styles.select]}
                placeholder="Select Currency"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.currency}
                onValueChange={this.onValueChangecurrency}
                >
                <Picker.Item label="INR" value="INR" />
              </Picker>
              }
            </Item>
            {/*<View style={styles.attachRow}>
              <Text style={styles.formLabel}>Attachments:</Text>
              <TouchableOpacity onPress={this.selectAttachFiles.bind(this)} style={styles.atchBtn}>
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#8c3fff', '#0ec5a3']} 
                  style={styles.atchBtnBg}>
                  <Icon name='attach' style={styles.attachIcon} />
                  <Text style={styles.attachBtnTxt}>Attach Documents</Text>
                </LinearGradient>
              </TouchableOpacity >
            </View>*/}
          </Form>
          {/*this.state.attachFiles.map((item, key) => (
            <View key={key} style={styles.atchFileRow}>
              <Text style={styles.atchFileName}>{item.name ? item.name : ''}</Text>
              <Button bordered small rounded danger style={styles.actionBtn}
                onPress={()=>this.removeAttach(key)}>
                <Icon name='close' style={styles.actionBtnIco} />
              </Button>
            </View>
          ))*/}
        </Content>
        {params.advancePaymentStatusId == '14' ? null :
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.submitAdv("12")} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#0066b3', '#0a7fd2']}
              style={styles.ftrBtnBg}>
              <Ficon name='save' style={styles.ftrBtnIcon} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.submitAdv("14")} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#5ba11c', '#b3c51a']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-paper-plane' style={styles.ftrBtnIcon} />
              <Text style={styles.ftrBtnTxt}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity >
        </View>
        }
        
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    advPmnt: state.advPmnt,
    advPmnts: state.advPmnts,
    sendEmailState: state.sendEmailState,
  };
};

const mapDispatchToProps = {
  advPmnt : Actions.advPmnt,
  getAdvPmnts : Actions.getAdvPmnts,
  sendEmail: Actions.sendEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvPmntReqScreen);