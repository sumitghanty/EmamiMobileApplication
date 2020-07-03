import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import Loader from '../Components/Loader'
import styles from './Styles/PjpReqDtlScreen'

class PjpReqDtlScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: null
    }
  }

  componentDidMount(props){
    const {params} = this.props.navigation.state

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


  renderAirr = (data) => {
    let ticket = this.state.ticket;
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Travel Date:</Text>
      <Text style={styles.value}>{moment(data.travel_date).format(global.DATEFORMAT)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Flight:</Text>
      <Text style={styles.value}>{moment(data.travel_date).format(global.DATEFORMAT)}</Text>
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
      <Text style={styles.label}>Email:</Text>
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
  };
};

const mapDispatchToProps = {
  getTicketsSales: Actions.getTicketsSales,
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpReqDtlScreen);