import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'

import Loader from '../Components/Loader'
import styles from './Styles/PjpReqDtlScreen'

class PjpReqDtlScreen extends Component {
  render() {
  return(
  <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.row}>
      <Text style={styles.label}>From:</Text>
      <Text style={styles.value}>xxxxx</Text>
    </View>
  </ScrollView>
  );
  }
}

export default PjpReqDtlScreen;