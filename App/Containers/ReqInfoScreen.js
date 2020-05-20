import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Linking} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import moment from 'moment'
import Actions from '../redux/actions'

import Loader from '../Components/Loader'
import styles from './Styles/ReqInfoScreen'

class ReqInfoScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reqName: '',
      elAmnt: 0,
      ticket: null
    }
  }

  componentDidMount(props){
    const {params} = this.props.navigation.state
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

  downloadImage = (file) => {
    Linking.canOpenURL(file).then(supported => {
      if (supported) {
        Linking.openURL(file);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }

  render() {
		const {params} = this.props.navigation.state
    console.log(params);
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
          <Text style={styles.value}>INR {params.amount}</Text>
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
      <Text style={styles.value}>{data.days * this.state.elAmnt}</Text>
    </View>
    </>
  }

  renderTrain = (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Trip:</Text>
      <Text style={styles.value}>{this.state.elAmnt}</Text>
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
      <Text style={styles.label}>Personal Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>}
    </>
  }

  renderAir = (data) => {
    let ticket = this.state.ticket;
    return <>
    <Text style={styles.title}>Trip Details</Text>
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
      <Text style={styles.value}>6000</Text>
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
    {data.email ?
    <View style={styles.row}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>:null}
    {(data.vendor_name && data.through == "Travel Agent") ?
    <View style={styles.row}>
      <Text style={styles.label}>Travel Agent Name:</Text>
      <Text style={styles.value}>{data.vendor_name}</Text>
    </View>:null}
    
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
    ticketsList: state.ticketsList,
  };
};

const mapDispatchToProps = {
  getReqType : Actions.getReqType,
  getAttachments: Actions.getAttachments,
  getTickets: Actions.getTickets,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqInfoScreen);