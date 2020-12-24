import React, { Component } from 'react'
import { ScrollView, View, Text, Picker, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Form, Item, Label,Card,CardItem } from 'native-base'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'
import Actions from '../redux/actions'
import Icon from 'react-native-vector-icons/Ionicons'
import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/PjpReqDtlScreen'

class PjpReqDtlScreen extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    
    this.state = {
      ticket: null,
      res:null,
      isLoading: false,
      emergencyJustification: params.data.emergencyJustification  ? params.data.emergencyJustification :'',
      emergencyJustificationDropdown: '',
      emergencyJustificationInput:'',
      showEmergencyJustification:false,
      showEmergencyJustificationInput:false,
      showEmergencyJustificationSave:false
     
    }
  }

  handleHtlAdrs = (text) => {
    
    this.setState({ 
      emergencyJustificationInput: text
    })
  }

  componentDidMount(props){
    const {params} = this.props.navigation.state
    //alert(JSON.stringify(params));
    this.props.getJustificationList()
    
    .then(()=>{
      
   if(params.data.mode == "7"){
  
    let chosenFromDropdown = false;
    
    let justNotEntered = false;
  
    let just =  this.state.emergencyJustification;
    //alert(params.emergencyJustification+" ");
   
    if((params.data.scenario == "2" || params.data.scenario == "3") && ((params.data.status_id  == "8" && params.data.sub_status_id == "8.1") || (params.data.status_id  == "7" && params.data.sub_status_id == "7.1") || params.data.status_id  == "22") ){
      
      this.setState({
        showEmergencyJustification: true
      });
      if(just ==null || just == "")  justNotEntered = true;
      else{
      for(var i=0; i<this.props.justificationList.dataSource.length; i++) {
        if(just == this.props.justificationList.dataSource[i].just_type){
          chosenFromDropdown = true;
        
        }
      }
    }
     //alert(chosenFromDropdown);

if(justNotEntered == true) {
      
 
}
      else if(chosenFromDropdown == false) {
      
        this.setState({
          emergencyJustificationDropdown: "Others",
          emergencyJustificationInput:just,
          showEmergencyJustificationInput: true
          
        });
        
      }else{
        this.setState({
          emergencyJustificationDropdown: just,
          emergencyJustificationInput:""
        });
      }

      if(params.data.approverLevel == null && params.data.isApproved == null && params.data.userid  != global.USER.userId) {
        
        this.setState({
          
          showEmergencyJustificationSave: true
          
        });
      }
    }


   }
    })




    if(params.data.mode=='7') {
      this.props.getTicketsSales(params.data.trip_no,params.data.lineitem,params.data.trip_hdr_id_fk)
      .then(()=>{
        if(this.props.ticketsSalesList.dataSource.length>0){
          for(var i=0; i<this.props.ticketsSalesList.dataSource.length; i++) {
            if(this.props.ticketsSalesList.dataSource[i].flight_selected=='Y') {
              this.setState({
                ticket: this.props.ticketsSalesList.dataSource[i]
              });
            }
          }
        }
      })
    }
  }

 

  render() {
    
  const {params} = this.props.navigation.state;
  console.log(params)
  if(this.state.isLoading){
    return(
      <Loader/>
    )
  }
  if((params.data.mode=='7' && this.props.ticketsSalesList.isLoading)) {
    return(
      <Loader/>
    )
  } else if ((params.data.mode=='7' && this.props.ticketsSalesList.errorStatus)) {
    return(
      <Text>URL Error</Text>
    )
  } else {
  return(
  <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{params.data.mode_name} Requisition Details</Text>
    </View>
    {params.data.mode == '3'?
      this.renderTrain(params.data)
     
     

      :(params.data.mode =='32')?
      alert(params.data)
      
      //this.renderACTaxi(params.data)
       
    :(params.data.mode == '7')?
      this.renderAirr(params.data)
    :(params.data.mode == '14' || params.data.mode == '22')?
      this.renderHotel(params.data)
    :null}
  </ScrollView>
  );
  }
  }

  renderTrain = (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Class:</Text>
      <Text style={styles.value}>{data.ticket_class}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Through:</Text>
      <Text style={styles.value}>{data.through}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Status:</Text>
      <Text style={styles.value}>{data.ticket_status}</Text>
    </View>
    <Text style={[styles.label,styles.selfLable]}>Justification:</Text>
    {(data.justification && data.justification.length>0) ?
    <View style={styles.selfValueBlock}>
      <Text style={styles.value}>{data.justification}</Text>
    </View>:null}
    </>
  }


  renderACTaxi= (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Vendor Name:</Text>
      <Text style={styles.value}>{data.ticket_class}</Text>
      
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Vendor Id:</Text>
      <Text style={styles.value}>{data.through}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Vendor GSTIN:</Text>
      <Text style={styles.value}>{data.ticket_status}</Text>
    </View>
   </>
  }

  submitReq(params) {
    let just = this.state.emergencyJustificationDropdown;
    if(just == "Others") just = this.state.emergencyJustificationInput
    if(just == "") {
      alert("Please enter justification for approving emergency Air Travel");
      return false;
    }
    
    var str = API_URL+'updateEmergencyJustificationSales?req_hdr_id='+params.req_hdr_id+"&justification="+just;
    


    this.setState({ isLoading: true }, () => {
    return fetch(str,{
      method: "GET",
      mode: "no-cors",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response)=> response.text()) 
    .then((responseJson)=>{
      
      this.setState({ 
        res: responseJson
      })
     
    })
    .then(() => {   
      this.setState({
        isLoading: false
      }); 
      if(JSON.parse(this.state.res).message == "success")
       alert("Justification Sucessfully Submitted");
       else  alert("Justification  not submitted .Please try again");
       
    })
    .catch((Error) => {
      console.log(Error)
    });
  })
  } onValueChangeJustification = (value) => {
    //alert('called');
    if(value == "Others"){
      this.setState({
        emergencyJustificationDropdown: value,
       
        showEmergencyJustificationInput: true
        
      });
    }else{
    this.setState({
      emergencyJustificationDropdown: value,
      showEmergencyJustificationInput: false
    });

  }
  }

  renderAirr = (data) => {
     let ticket = this.state.ticket;

    // let showEmergencyJustification = false;
    // let showEmergencyJustificationSave = false;
   
    // if(data.scenario == "2" || data.scenario == "3" ) {
    //   showEmergencyJustification =  true;
    //   if(data.approverLevel == null && data.isApproved == null) showEmergencyJustificationSave = true
    // }
    return <>

    {this.state.showEmergencyJustification ?
    <Item picker style={styles.row}>
    <Label style={styles.label}><Text style={styles.formLabel}>Emergency Justification:</Text></Label>
              <Picker
                 mode="dropdown"
                 placeholder="Select Through"
                  selectedValue={this.state.emergencyJustificationDropdown}
                  onValueChange={this.onValueChangeJustification}
                 style={styles.EJustifvalue}
                 prompt="Select Through"
                  >
                 { this.props.justificationList.dataSource.map((item, index) => {
                  return (
                    <Picker.Item label={item.just_type} value={item.just_type} key={index} />
                  );
                })
              }
                </Picker>
                </Item>:null}

                {this.state.showEmergencyJustificationInput ?
    <View style={styles.row}>
      <Text style={styles.label}></Text>
      { <TextInput  value ={this.state.emergencyJustificationInput}  onChangeText={this.handleHtlAdrs}  style={styles.Justifvalue}></TextInput>  }
    </View>:null}

    <View style={styles.row}>
      <Text style={styles.label}>Travel Date:</Text>
      <Text style={styles.value}>{moment(data.travel_date).format(global.DATEFORMAT)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Flight:</Text>
      <Text style={styles.value}>{data.eligible_amount}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Suitable Time:</Text>
      <Text style={styles.value}>{data.travel_time}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Travel Type:</Text>
      <Text style={styles.value}>{data.travel_type}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Alternate Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Through:</Text>
      <Text style={styles.value}>{data.through}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>
        {(data.through == 'Travel Agent') ?'Trvel Agent Name:'
        :(data.through == 'Vendor')?'Vendor Name:'
        :'Name:'}
        </Text>
      <Text style={styles.value}>
        {(data.through == 'Travel Agent') ?data.vendor_name
        :(data.through == 'Vendor')?data.vendor_name
        :data.username}
      </Text>
    </View>  

    {ticket ?<>
    <Text style={styles.title}>Flight Details</Text>
    <View style={styles.ticketItem}>
      <View style={[
        styles.ticketColumn,
        styles.ticketLeft,
        styles.selectedTicket,
        styles.selectedTicketLeft
        ]}>
        <View style={[styles.circle, styles.circleLeft]}></View>
        <Text style={styles.nameLabel}>Flight Name:</Text>
        <Text style={styles.flightName}>{ticket.airline}</Text>
        <Text style={styles.ticketLabel}>Departure Time &amp; Place:</Text>
        <Text style={styles.ticketValue}>{ticket.departure}</Text>
        <Text style={styles.ticketLabel}>Arival Time &amp; Place</Text>
        <Text style={styles.ticketValue}>{ticket.arrival}</Text>
      </View>
      <View style={[
        styles.ticketColumn,
        styles.ticketRight,          
        styles.selectedTicket,
        styles.selectedTicketRight
        ]}>
        <View style={[styles.circle, styles.circleRight]}></View>
        <Text style={styles.price}>{ticket.price}</Text>
        <Text style={styles.currency}>{ticket.currency}</Text>        
        <Text style={styles.oop}>Out of Policy:</Text>
        <Text style={styles.oopValue}>{ticket.type}</Text>
      </View>
    </View>
      </>:null}

    <Text style={[styles.label,styles.selfLable]}>Comments:</Text>
    <View style={styles.selfValueBlock}>      
      {(data.justification && data.justification.length>0) ?
        <Text style={styles.value}>{data.justification}</Text>
      :null}
    </View>


    {this.state.showEmergencyJustificationSave ?
    <TouchableOpacity onPress={() => this.submitReq(data)} style={styles.ftrBtn}>
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#53c55c', '#33b8d6']} 
              style={styles.ftrBtnBg}>
              <Icon name='md-checkmark-circle-outline' style={styles.ftrBtnTxt} />
              <Text style={styles.ftrBtnTxt}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>:null}
    </>
  }

  renderHotel = (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Through:</Text>
      <Text style={styles.value}>{data.through}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Check_in Date:</Text>
      <Text style={styles.value}>{moment(data.check_in_date).format(global.DATEFORMAT)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Check_out Date:</Text>
      <Text style={styles.value}>{moment(data.check_out_date).format(global.DATEFORMAT)}</Text>
    </View>    
    <View style={styles.row}>
      <Text style={styles.label}>No of Days:</Text>
      <Text style={styles.value}>{data.noofdays}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount:</Text>
      <Text style={styles.value}>{data.invoice_amount}</Text>
    </View>
    </>
  }
}

const mapStateToProps = state => {
  return {
    ticketsSalesList: state.ticketsSalesList,
    justificationList: state.justificationList
  };
};

const mapDispatchToProps = {
  getTicketsSales: Actions.getTicketsSales,
  getJustificationList: Actions.getJustificationList
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpReqDtlScreen);