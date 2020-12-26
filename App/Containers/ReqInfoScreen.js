import React, { Component } from 'react'
import { ScrollView, View, Text, Picker, TouchableOpacity, Linking} from 'react-native'
import { Container, Content, Form, Item, Label,Card,CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import moment from 'moment'
import Actions from '../redux/actions'
import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/ReqInfoScreen'
import { TextInput } from 'react-native-gesture-handler'
import PickerModal from 'react-native-picker-modal-view'

class ReqInfoScreen extends Component {

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      showRejectionComment:false,
      reqName: '',
      elAmnt: 0,
      ticket: null,
      res:null,
      isLoading: false,
      emergencyJustification: params.emergencyJustification  ? params.emergencyJustification :'',
      emergencyJustificationDropdown: '',
      emergencyJustificationInput:'',
      showEmergencyJustification:false,
      showEmergencyJustificationInput:false,
      showEmergencyJustificationSave:false

     
    }
  }

  componentDidMount(props){
    const {params} = this.props.navigation.state

    if(params.sub_status_id == "10.1")
     this.setState({ showRejectionComment: true })
  
    this.props.getJustificationList()
    .then(()=>{
   if(params.req_type == "1"){
  
    let chosenFromDropdown = false;
    
    let justNotEntered = false;
  
    let just =  this.state.emergencyJustification;
    //alert(params.emergencyJustification+" ");
   
    if((params.scenario == "2" || params.scenario == "3") && (params.status_id  == "8" && params.sub_status_id == "8.1") ){
      
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

      if(params.approverLevel == null && params.isApproved == null && params.pending_with  == global.USER.personId) {
        
        this.setState({
          
          showEmergencyJustificationSave: true
          
        });
      }
    }


   }
    })
    
    this.props.getReqType(global.USER.grade)
    .then(()=>{
      for(var i=0; i<this.props.reqType.dataSource.length; i++) {
        if(this.props.reqType.dataSource[i].sub_category_id == params.req_type) {
          this.setState({
            reqName: this.props.reqType.dataSource[i].sub_category,
            elAmnt: this.props.reqType.dataSource[i].upper_limit
          });
        }
      }
    });

    

    this.props.getAttachments(params.trip_hdr_id_fk,params.trip_no,params.lineitem)

    if(params.req_type=='1') {
      this.props.getTickets(params.trip_no,params.lineitem,params.trip_hdr_id_fk)
      .then(()=>{
        if(this.props.ticketsList.dataSource.length>0){
          for(var i=0; i<this.props.ticketsList.dataSource.length; i++) {
            if(this.props.ticketsList.dataSource[i].flight_selected=='Y') {
              this.setState({
                ticket: this.props.ticketsList.dataSource[i]
              });
            }
          }
        }
      })
    }
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

  downloadImage = (file) => {
    Linking.canOpenURL(file).then(supported => {
      if (supported) {
        Linking.openURL(file);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }
  handleHtlAdrs = (text) => {
    
    this.setState({ 
      emergencyJustificationInput: text
    })
  }

  submitReq(params) {

    let just = this.state.emergencyJustificationDropdown;
    if(just == "Others") just = this.state.emergencyJustificationInput
    if(just == "") {
      alert("Please enter justification for approving emergency Air Travel");
      return false;
    }
    
    var str = API_URL+'updateEmergencyJustification?req_hdr_id='+params.req_hdr_id+"&justification="+just;
    


    this.setState({ isLoading: true }, () => {
    return fetch(str,{
      method: "GET",
      mode: "no-cors",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response)=> response.text() )
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
      else  alert("Justification not submitted .Please try again");
      
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

  render() {
    
		const {params} = this.props.navigation.state
    console.log(params);
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    if(this.props.reqType.isLoading || this.props.attachmentList.isLoading ||
      (params.req_type=='1' && this.props.ticketsList.isLoading)){
      return(
        <Loader/>
      )
    } else if(this.props.reqType.errorStatus || this.props.attachmentList.errorStatus ||
      (params.req_type=='1' && this.props.ticketsList.errorStatus)) {
      return(
        <Text>URL Error</Text>
      )
    } else {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          {params.req_type=='1' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#007AFF"}]}>
            <Icon style={styles.typeIcon} name="md-airplane" />
          </View>: params.req_type=='10' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#3ba03f"}]}>
            <Icon style={styles.typeIcon} name="ios-car" />
          </View>: params.req_type=='11' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#FF9501"}]}>
            <Icon style={styles.typeIcon} name="md-car" />
          </View>: params.req_type=='3' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#f16168"}]}>
            <Ficon style={styles.typeIcon} name="subway" />
          </View>: params.req_type=='1BH' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#00c4ff"}]}>
            <Ficon style={styles.typeIcon} name="hotel" />
          </View>: params.req_type=='1BM' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#9c27b0"}]}>
            <Icon style={styles.typeIcon} name="ios-train" />
          </View>: params.req_type=='1BNM' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#27b084"}]}>
            <Ficon style={styles.typeIcon} name="road" />
          </View>: null
          }
          <Text style={styles.typeValue}>{this.state.reqName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{params.sub_status && params.sub_status != 'NA'?params.sub_status:params.status}</Text>
        </View>
        {params.travel_date?
        <View style={styles.row}>
          <Text style={styles.label}>Travel Date:</Text>
          <Text style={styles.value}>{moment(params.travel_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.creation_date?
        <View style={styles.row}>
          <Text style={styles.label}>Creation Date:</Text>
          <Text style={styles.value}>{moment(params.creation_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.through ?
        <View style={styles.row}>
          <Text style={styles.label}>Through:</Text>
          <Text style={styles.value}>{params.through}</Text>
        </View>:null}
        {(params.through && params.through == "Self")?
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{params.username}</Text>
        </View>:null}
        {params.amount ?
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>INR {this.formatAmountForDisplay(params.amount)}</Text>
        </View>:null}
        
        {params.req_type=='10' || params.req_type=='11' ?
          this.renderTaxi(params)
        :params.req_type=='1BH' || params.req_type=='1BM' || params.req_type=='1BNM' ?
          this.renderHotel(params)
        :params.req_type=='3' ?
          this.renderTrain(params)
        :params.req_type=='1' ?
          this.renderAir(params)
        :null
        }
        
        {this.props.attachmentList.dataSource.length>0 ?
        <View style={styles.attachInfo}>
          <Text style={styles.attachmentLabel}>ATTACHMENTS:</Text>
          {this.props.attachmentList.dataSource.map((item, key) => (
            <View style={styles.atchFileRow} key={key}>
              <View style={styles.atchFileRowLeft}>
                <Text style={styles.atchFileName} numberOfLines = {1}>{item.file_name ? item.file_name : ''}</Text>
                <Text style={styles.atchType} numberOfLines = {1}>{item.doc_type ? item.doc_type : ''}</Text>
              </View>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => {this.downloadImage(item.file_path);}}
                  >
                  <Icon name='md-download' style={styles.actionBtnIco} />
                </TouchableOpacity>
            </View>
          ))}
        </View>:null}
        
      </ScrollView>
    );
    }
  }

  renderTaxi = (data) => {
    return <>
    {this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
             value = {data.req_comment}
              />
                  </View>:null}
    {data.travel_from &&
    <View style={styles.row}>
      <Text style={styles.label}>Destination From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>}
    {data.travel_to &&
    <View style={styles.row}>
      <Text style={styles.label}>Destination To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>}
    </>
  }

  renderHotel = (data) => {
    return <>
    {this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
              value = {data.req_comment}
              />
                  </View>:null}
    {data.state &&
    <View style={styles.row}>
      <Text style={styles.label}>State:</Text>
      <Text style={styles.value}>{data.state}</Text>
    </View>}
    {data.city &&
    <View style={styles.row}>
      <Text style={styles.label}>Location/City:</Text>
      <Text style={styles.value}>{data.city}</Text>
    </View>}
    {data.travel_type &&
    <View style={styles.row}>
      <Text style={styles.label}>Travel Type:</Text>
      <Text style={styles.value}>{data.travel_type}</Text>
    </View>}
    {data.check_in_date &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckIn Date:</Text>
      <Text style={styles.value}>{moment(data.check_in_date).format(global.DATEFORMAT)}</Text>
    </View>}
    {data.check_in_time &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckIn Time:</Text>
      <Text style={styles.value}>{data.check_in_time}</Text>
    </View>}
    {data.check_out_date &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckOut Date:</Text>
      <Text style={styles.value}>{moment(data.check_out_date).format(global.DATEFORMAT)}</Text>
    </View>}
    {data.check_out_time &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckOut Time:</Text>
      <Text style={styles.value}>{data.check_out_time}</Text>
    </View>}
    {data.days &&
    <View style={styles.row}>
      <Text style={styles.label}>No of Days:</Text>
      <Text style={styles.value}>{data.days}</Text>
    </View>}
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount:</Text>
      <Text style={styles.value}>{this.formatAmountForDisplay(data.days * this.state.elAmnt)}</Text>
    </View>
    </>
  }

  renderTrain = (data) => {
    return <>
    {this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
              value = {data.req_comment}
              />
                  </View>:null}
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Trip:</Text>
      <Text style={styles.value}>{this.formatAmountForDisplay(this.state.elAmnt)}</Text>
    </View>
    {data.ticket_class &&
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Class:</Text>
      <Text style={styles.value}>{data.ticket_class}</Text>
    </View>}
    {data.travel_time &&
    <View style={styles.row}>
      <Text style={styles.label}>Suitable Time:</Text>
      <Text style={styles.value}>{data.travel_time}</Text>
    </View>}
    {data.travel_from &&
    <View style={styles.row}>
      <Text style={styles.label}>Station/Location From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>}
    {data.travel_to &&
    <View style={styles.row}>
      <Text style={styles.label}>Station/Location To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>}
    {data.email &&
    <View style={styles.row}>
      <Text style={styles.label}>Alternate Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>}
    </>
  }

  renderAir = (data) => {

    //alert(JSON.stringify(data))
    let ticket = this.state.ticket;
    // let showEmergencyJustification = false;
    // let showEmergencyJustificationSave = false;
   
    // if((data.scenario == "2" || data.scenario == "3") && (data.status_id  == "8" && data.sub_status_id == "8.1") ){
    //   showEmergencyJustification =  true;
    //   if(data.approverLevel == null && data.isApproved == null) showEmergencyJustificationSave = true
    // }
    return <>

<Text style={styles.title}>Trip Details</Text>

{this.state.showRejectionComment == true ?
                  <View style={styles.modalBtnDngr}>
                 <Text style={[styles.formLabel,styles.redText]}>Rejection Reason:</Text>
               <TextInput 
              multiline
              numberOfLines={2}
              style={styles.redText}
              underlineColorAndroid="transparent"
              value = {data.req_comment}
              />
                  </View>:null}

    

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

    {/* <Text style={styles.label}>Justification:</Text>
              <TextInput 
              placeholder='Enter Hotel/Guest House Address' 
              style={styles.addressInput}
              underlineColorAndroid= "rgba(0,0,0,0)"
              value = {this.state.emergencyJustification}
              returnKeyType="next"
              numberOfLines={4}
              onChangeText={this.handleHtlAdrs} />   */}
    {data.travel_from ?
    <View style={styles.row}>
      <Text style={styles.label}>From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>:null}
    {data.travel_to ?
    <View style={styles.row}>
      <Text style={styles.label}>To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>:null}
    {data.travel_date ?
    <View style={styles.row}>
      <Text style={styles.label}>Travel Date:</Text>
      <Text style={styles.value}>{moment(data.travel_date).format(global.DATEFORMAT)}</Text>
    </View>:null}
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Flight:</Text>
      <Text style={styles.value}>6000.00</Text>
    </View>
    {data.travel_time ?
    <View style={styles.row}>
      <Text style={styles.label}>Suitable Time:</Text>
      <Text style={styles.value}>{data.travel_time}</Text>
    </View>:null}
    {data.travel_type ?
    <View style={styles.row}>
      <Text style={styles.label}>Travel Type:</Text>
      <Text style={styles.value}>{data.travel_type}</Text>
    </View>:null}
   
    {data.ticket_class ?
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Class:</Text>
      <Text style={styles.value}>{data.ticket_class}</Text>
    </View>:null}
    

    {data.justification ?
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Status:</Text>
      <Text style={styles.value}>{data.ticket_status}</Text>
    </View>:null}


    {data.justification ?
    <View style={styles.row}>
      <Text style={styles.label}>Justification:</Text>
      <Text style={styles.value}>{data.justification}</Text>
    </View>:null}


        


    {data.email ?
    <View style={styles.row}>
      <Text style={styles.label}>Alternate Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>:null}
    {(data.vendor_name && data.through == "Travel Agent") ?
    <View style={styles.row}>
      <Text style={styles.label}>Travel Agent Name:</Text>
      <Text style={styles.value}>{data.vendor_name}</Text>
    </View>:null}

   
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
    
    {this.state.ticket ?<>
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
    </>
  }

};

const mapStateToProps = state => {
  return {
    reqType: state.reqType,
    attachmentList: state.attachmentList,
    justificationList: state.justificationList,
    ticketsList: state.ticketsList,
  };
};

const mapDispatchToProps = {
  getReqType : Actions.getReqType,
  getJustificationList: Actions.getJustificationList,
  getAttachments: Actions.getAttachments,
  getTickets: Actions.getTickets,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqInfoScreen);