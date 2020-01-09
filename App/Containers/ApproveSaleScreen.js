import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import styles from './Styles/ApproveSaleScreen';

class ApproveSaleScreen extends Component {
  constructor() {
    super();
    this.state = {
      links: [
        {title:'PJP pending for Approval',link:'PjpTripList'},
        {title:'PJP-Claim pending for Approval',link:'PjpClaimList'}
      ]
    }
  }
  render() {
    return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {this.state.links.map((item, index) => {
        return (
        <TouchableOpacity 
          key={index} 
          style={styles.linkItem} 
          onPress={() => this.props.navigation.navigate(item.link)}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Icon name="ios-arrow-forward" style={styles.cardIcon}></Icon>
          </View>
        </TouchableOpacity>
        );
      })}
    </ScrollView>
    );
  }
};

export default ApproveSaleScreen;