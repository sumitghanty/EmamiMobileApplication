import React, { Component } from 'react'
import { ScrollView, View, Text} from 'react-native'
import moment from 'moment'

import {Purpose, For, Traveler} from '../Components/GetValue'
import styles from './Styles/TripInfoScreen';

class TripInfoScreen extends Component {
  render() {
    const {params} = this.props.navigation.state;
    console.log(params);
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Trip Id</Text>
          <Text style={styles.headerValue}>{params.trip_no}</Text>
        </View>
        {params.status ?
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value,styles.status]}>{params.status}</Text>
        </View>:null}
        {(params.comment && params.comment.length>1)?
        <View style={styles.row}>
          <Text style={styles.label}>Comment:</Text>
          <Text style={styles.value}>{params.comment}</Text>
        </View>:null}
        {params.creation_date ?
        <View style={styles.row}>
          <Text style={styles.label}>Creation Date:</Text>
          <Text style={styles.value}>{params.creation_date}</Text>
        </View>:null}
        {params.start_date ?
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.end_date ?
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.trip_from ?
        <View style={styles.row}>
          <Text style={styles.label}>Trip From:</Text>
          <Text style={styles.value}>{params.trip_from}</Text>
        </View>:null}
        {params.trip_to ?
        <View style={styles.row}>
          <Text style={styles.label}>Trip To:</Text>
          <Text style={styles.value}>{params.trip_to}</Text>
        </View>:null}
        {params.purpose ?
        <View style={styles.row}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}><Purpose value={params.purpose} /></Text>
        </View>:null}
        {params.trip_for ?
        <View style={styles.row}>
          <Text style={styles.label}>Trip For:</Text>
          <Text style={styles.value}><For value={params.trip_for} /></Text>
        </View>:null}
        <View style={styles.row}>
          <Text style={styles.label}>Traveler's Name:</Text>
          {params.trip_for == "1" ?
          <Text style={styles.value}>{params.name}</Text>
          : params.trip_for == "3" ?
          <Text style={styles.value}><Traveler value={parseInt(params.name)} /></Text>
          : null }
        </View>
        {params.details ?
        <View style={styles.row}>
          <Text style={styles.label}>Details:</Text>
          <Text style={styles.value}>{params.details}</Text>
        </View>:null}
      </ScrollView>
    );
  }
};

export default TripInfoScreen;