import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, FlatList} from "react-native";
import { Container, Content, Button, Text, Icon, Card, CardItem  } from 'native-base';
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import 'moment-precise-range-plugin'

import styles from './Styles/ExpensesListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'start_date', 'end_date', 'trip_from', 'trip_to', 'status','payment_amount','estimated_cost','actual_claim_amount','currency','actual_claim_currency'];
const STATUS_ID = ["3","4","9","11","15","17","19","20","21","22","23","25","27","29"];

class ExpensesListScreen extends Component {  
  constructor(){ 
    super();

   
    this.state ={
      searchTerm: '',
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(){
    this.props.getExpenses(global.USER.userId,"3",STATUS_ID);
  }
//edited souvik 28/07/2020
  // setAge = (date) => {
  //   var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
  //   var curDate = moment(new Date()).format('DD/MM/YYYY')
  //   var diff = moment(curDate, "DD/MM/YYYY").diff(moment(newDate, "DD/MM/YYYY"), 'days');
  //   return(
  //     diff<2?diff+' day':diff+' days'
  //   );
  // }


  setAge = (date) => {
    var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
    var curDate = moment(new Date()).format('DD/MM/YYYY')
    var diff = moment(curDate, "DD/MM/YYYY").diff(moment(newDate, "DD/MM/YYYY"), 'days');
    return(
      diff<2?diff:diff
    );
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

   
  render() {
  
    if(this.props.expenses.isLoading){
      return(
          <Loader/>
      )
    } else if(this.props.expenses.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else {
      const listData = this.props.expenses.dataSource;
      const filteredData = listData?listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)):[];
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
          {sortList.length<1 ?
            <Text style={styles.noData}>No Item Found</Text>
          :<View>
          <FlatList
            data={sortList}
            keyExtractor={item => item.trip_no}
            renderItem={({ item }) =><TouchableOpacity onPress={ () =>{console.log("onpress"+JSON.stringify (item));this.props.navigation.navigate('ExpInfo',item)}}>
          <Card style={styles.item}>
            <CardItem header style={styles.itemHeader}>
              <Text style={styles.headerLabel}>Trip ID:</Text>
              <Text style={styles.headerValue}>{item.trip_no}</Text>
            </CardItem>
            <CardItem style={styles.itemBody}>
              <View style={styles.itemInfo}>
                {item.start_date?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Start Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.start_date).format(global.DATEFORMAT)}</Text>
                </View>:null}
                {item.end_date?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>End Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.end_date).format(global.DATEFORMAT)}</Text>
                </View>:null}
                {item.trip_from?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Trip From:</Text>
                  <Text style={styles.itemValue}>{item.trip_from}</Text>
                </View>:null}
                {item.trip_to?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Trip To:</Text>
                  <Text style={styles.itemValue}>{item.trip_to}</Text>
                </View>:null}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Advance Payment amount:</Text>
                  <Text style={styles.itemValue}>
                    {this.formatAmountForDisplay(item.payment_amount ?item.payment_amount: '0.0')} &nbsp;
                    {item.currency?item.currency:'INR'}
                  </Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Estimated amount:</Text>
                  <Text style={styles.itemValue}>
                    {this.formatAmountForDisplay(item.estimated_cost ?item.estimated_cost: '0')} &nbsp;
                    {item.currency?item.currency:'INR'}
                  </Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Actual amount:</Text>
                  <Text style={styles.itemValue}>
                    {this.formatAmountForDisplay(item.actual_claim_amount ?item.actual_claim_amount: '0.0')} &nbsp; 
                    {item.actual_claim_currency?item.actual_claim_currency:'INR'}
                  </Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Ageing:</Text>
                  <Text style={styles.itemValue}>{this.setAge(item.payment_submit_date)}</Text>
                </View>
                {item.status?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Status:</Text>
                  <Text style={[styles.itemValue, styles.statusInitiated]}>
                    {(item.sub_status && item.sub_status!='NA')?item.status:item.status}
                  </Text>
                </View>:null}
              </View>
            </CardItem>
          </Card>
          </TouchableOpacity>}
          />
          </View>}
        </Content>
      </Container>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    expenses: state.expenses
  };
};

const mapDispatchToProps = {
  getExpenses : Actions.getExpenses
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesListScreen);