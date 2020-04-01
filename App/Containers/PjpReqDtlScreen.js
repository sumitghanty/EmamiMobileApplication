import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'

import styles from './Styles/PjpReqDtlScreen'

class PjpReqDtlScreen extends Component {
  render() {
  const {params} = this.props.navigation.state;
  console.log(params)
  return(
  <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{params.mode_name} Requisition Details</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Class:</Text>
      <Text style={styles.value}>{params.ticket_class}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Through:</Text>
      <Text style={styles.value}>XXX</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Status:</Text>
      <Text style={styles.value}>{params.ticket_status}</Text>
    </View>
    <Text style={[styles.label,styles.selfLable]}>Justification:</Text>
    {(params.justification && params.justification.length>0) ?
    <View style={styles.selfValueBlock}>
      <Text style={styles.value}>{params.justification}</Text>
    </View>:null}
  </ScrollView>
  );
  }
}

export default PjpReqDtlScreen;