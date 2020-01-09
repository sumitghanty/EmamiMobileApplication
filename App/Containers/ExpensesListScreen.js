import React, { Component } from 'react';
import { View, Alert, TouchableOpacity} from "react-native";
import { Container, Content, Button, Text, Icon, Card, CardItem  } from 'native-base';
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import {API_URL} from '../config'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import 'moment-precise-range-plugin'

import styles from './Styles/ExpensesListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'status','payment_amount','estimated_cost','actual_claim_amount','currency','actual_claim_currency'];
const STATUS_ID = ["11","17","19","20","23","25","27","29"];

class ExpensesListScreen extends Component {  
  constructor(){ 
    super();
    this.state ={
      searchTerm: '',
      dataArray: [],
      curDate: '',
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(){
    {STATUS_ID.map((item, key) => {
      this.props.getExps(global.USER.userId,item)
      .then(() => {
        this.state.dataArray.push(this.props.exps.dataSource)
      });
    })}

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    this.setState({
      curDate: year+', '+month+', '+date+' '+hours+':'+min+':'+sec,
    });
  }

  setAge = (date) => {
    var m1 = moment(date,'YYYY-MM-DD HH:mm:ss');
    var m2 = moment(this.state.curDate,'YYYY-MM-DD HH:mm:ss');
    var diff = moment.duration(m1.diff(m2)).humanize();
    return(
      diff
    );
  }
   
  render() {
    if(this.props.exps.isLoading){
      return(
          <Loader/>
      )
    } else {
      const listData = this.state.dataArray;
      const newData = [];
      for(var i=0; i< listData.length; i++) {
        for(var j=0; j< listData[i].length; j++) {
          newData.push(listData[i][j])
        }
      }
      const filteredData = newData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return (
      <Container style={styles.container}>
        <View style={styles.searchBar}>
          <SearchInput 
            onChangeText={(term) => { this.searchUpdated(term) }} 
            style={styles.searchInput}
            placeholder="Search Trip"
            clearIcon={this.state.searchTerm!==''?<Vicon name="md-close-circle" style={styles.searchClearIcon}/>:<Vicon name="md-search" style={[styles.searchClearIcon,styles.searchIcon]}/>}
            clearIconViewStyles={styles.searchClear}
            returnKeyType= 'search'
            underlineColorAndroid='transparent'
            />
        </View>
        <Content Style={styles.content}>
          <Text style={styles.title}>List of Expenses</Text>
          {sortList.length<1 &&
            <Text style={styles.noData}>No Item Found</Text>
          }
          {sortList.map((item, index) => {
          return (
          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ExpInfo',item)}>
          <Card style={styles.item}>
            <CardItem header style={styles.itemHeader}>
              <Text style={styles.headerLabel}>Trip ID:</Text>
              <Text style={styles.headerValue}>{item.trip_no}</Text>
            </CardItem>
            <CardItem style={styles.itemBody}>
              <View style={styles.itemInfo}>
                {item.creation_date &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Creation Date:</Text>
                  <Text style={styles.itemValue}>{item.creation_date}</Text>
                </View>}
                {item.start_date &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Start Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.start_date).format(global.DATEFORMAT)}</Text>
                </View>}
                {item.end_date &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>End Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.end_date).format(global.DATEFORMAT)}</Text>
                </View>}
                {item.trip_from &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Trip From:</Text>
                  <Text style={styles.itemValue}>{item.trip_from}</Text>
                </View>}
                {item.trip_to &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Trip To:</Text>
                  <Text style={styles.itemValue}>{item.trip_to}</Text>
                </View>}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Advance Payment amount:</Text>
                  <Text style={styles.itemValue}>
                    {item.payment_amount ?
                    item.payment_amount+' '+item.currency
                    : '0'}
                    </Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Estimated amount:</Text>
                  <Text style={styles.itemValue}>
                  {item.estimated_cost>0 ?
                  item.estimated_cost+' '+item.currency
                  : '0'}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Actual amount:</Text>
                <Text style={styles.itemValue}>
                  {item.actual_claim_amount>0 ?
                  item.actual_claim_amount+' '+item.actual_claim_currency
                  : '0'}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Ageing:</Text>
                  <Text style={styles.itemValue}>{this.setAge(item.payment_submit_date)}</Text>
                </View>
                {item.status &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Status:</Text>
                  <Text style={[styles.itemValue, styles.statusInitiated]}>{item.status}</Text>
                </View>}
              </View>
            </CardItem>
          </Card>
          </TouchableOpacity>
          );
          })}
        </Content>
      </Container>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    exps: state.exps
  };
};

const mapDispatchToProps = {
  getExps : Actions.getExps
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesListScreen);