import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import moment from 'moment'

import styles from './Styles/PjpReqDtlScreen'

class PjpReqDtlScreen extends Component {
  render() {
  const {params} = this.props.navigation.state;
  console.log(params)
  return(
  <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{params.data.mode_name} Requisition Details</Text>
    </View>
    {params.data.mode == '3'?
      this.renderTrain(params.data)
    :(params.data.mode == '7')?
      this.renderAirr(params.data)
    :(params.data.mode == '14' || params.data.mode == '22')?
      this.renderHotel(params.data)
    :null}
  </ScrollView>
  );
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

  renderAirr = (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Travel Date:</Text>
      <Text style={styles.value}>{data.travel_date}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Flight:</Text>
      <Text style={styles.value}>{data.travel_date}</Text>
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
    <Text style={[styles.label,styles.selfLable]}>Comments:</Text>
    {(data.justification && data.justification.length>0) ?
    <View style={styles.selfValueBlock}>
      <Text style={styles.value}>{data.comment}</Text>
    </View>:null}
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

export default PjpReqDtlScreen;