import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import Loader from '../Components/Loader'
import styles from './Styles/ApproveNoneSaleScreen';

class ApproveNoneSaleScreen extends Component {
  constructor() {
    super();
    this.state = {
      links: [
        {title:'Trip Pending for Approval',link:'ApproveNoneSaleTrip'},
        {title:'Advance Payment Pending for Approval',link:'ApproveNoneSaleAdvance'},
        {title:'Expense Claim Pending for Approval',link:'ApproveNoneSaleExpenses'}
      ]
    }
  }
  componentDidMount(){
    this.props.getCostCentre(global.USER.costCentre);
  }
  render() {
    if(this.props.costCentre.isLoading){
      return(
          <Loader/>
      )
    } else if (this.props.costCentre.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
    const cost = this.props.costCentre.dataSource[0];
    console.log(cost);
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.subHeader}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#e63826', '#fb4b7b']} 
            style={styles.subHeaderCol}
            >
            <Text style={styles.subHeaderLabel}>Budgeted Amount:</Text>
            <Text style={styles.subHeaderValue}>{cost.total_budget} INR </Text>
          </LinearGradient>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#5ba11c', '#92d40a']} 
            style={styles.subHeaderCol}>
            <Text style={styles.subHeaderLabel}>Remaining Amount:</Text>
            <Text style={styles.subHeaderValue}>{cost.remaining_budget > 0 ? cost.remaining_budget : '0.00'} INR </Text>
          </LinearGradient>
        </View>
        {this.state.links.map((item, index) => {
          return (
          <TouchableOpacity 
            key={index} 
            style={styles.linkItem} 
            onPress={() => this.props.navigation.navigate(item.link)}>
            <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#0066b3', '#3480ea']} 
            style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Icon name="ios-arrow-forward" style={styles.cardIcon}></Icon>
            </LinearGradient>
          </TouchableOpacity>
          );
        })}        
      </ScrollView>
    );
    }
  }
};

const mapStateToProps = state => {
  return {
    costCentre: state.costCentre
  };
};

const mapDispatchToProps = {
  getCostCentre : Actions.getCostCentre
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleScreen);