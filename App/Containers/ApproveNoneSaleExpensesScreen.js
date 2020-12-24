import React, { Component } from 'react'
import { View, TouchableOpacity} from "react-native";
import { Container, Content, Text, Icon, Card, CardItem  } from 'native-base';
import SearchInput, { createFilter } from 'react-native-search-filter'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import Empty from '../Components/Empty'
import Loader from '../Components/Loader'
import styles from './Styles/ApproveNoneSaleExpensesScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status', 'actual_claim_amount', 'payment_amount'];

class ApproveNoneSaleExpensesScreen extends Component {
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
    this.props.getExpPendApr("21");
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

  setAge = (date) => {
    var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
    var curDate = moment(new Date()).format('DD/MM/YYYY')
    var diff = moment(curDate, "DD/MM/YYYY").diff(moment(newDate, "DD/MM/YYYY"), 'days');
    return(
      diff<2?diff+' day':diff+' days'
    );
  }

  render() {    
    if(this.props.aprExpPend.isLoading){
      return(
          <Loader/>
      )
    }
    else {
      const listData = this.props.aprExpPend.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return (
      this.props.aprExpPend.dataSource < 1 ?
      <Container style={styles.container}>
        <Empty message="No Item available for Expense Claim Pending." icon="ios-folder-open" />
      </Container>
      :
      <Container style={styles.container}>
        <View style={styles.searchBar}>
          <SearchInput 
            onChangeText={(term) => { this.searchUpdated(term) }} 
            style={styles.searchInput}
            placeholder="Search Trip"
            clearIcon={this.state.searchTerm!==''?<Icon name="close-circle" style={styles.searchClearIcon}/>:<Icon name="md-search" style={[styles.searchClearIcon,styles.searchIcon]}/>}
            clearIconViewStyles={styles.searchClear}
            returnKeyType= 'search'
            underlineColorAndroid='transparent'
            />
        </View>
        <Content style={styles.content}>
        <Text style={styles.title}>List of Expense Claim pending for Approval</Text>
        {sortList.length<1 &&
          <Text style={styles.noData}>No Item Found</Text>
        }
        {sortList.map((item, index) => {
          return (
          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('AprvExpnsClaimPendInfo',item)}>
            <Card style={styles.item}>
              <CardItem header style={styles.itemHeader}>
                <Text style={styles.headerLabel}>Trip ID:</Text>
                <Text style={styles.headerValue}>{item.trip_no}</Text>
              </CardItem>
              <CardItem style={styles.itemBody}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Creation Date:</Text>
                    <Text style={styles.itemValue}>{moment(item.creation_date).format(global.DATEFORMAT)}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Start Date:</Text>
                    <Text style={styles.itemValue}>{moment(item.start_date).format(global.DATEFORMAT)}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>End Date:</Text>
                    <Text style={styles.itemValue}>{moment(item.end_date).format(global.DATEFORMAT)}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>From:</Text>
                    <Text style={styles.itemValue}>{item.trip_from}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>To:</Text>
                    <Text style={styles.itemValue}>{item.trip_to}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Traveler Name:</Text>
                    <Text style={styles.itemValue}>{item.trip_creator_name}</Text>
                  </View>
                  {item.actual_claim_amount ?
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Actual Amount:</Text>
                    <Text style={styles.itemValue}> {this.formatAmountForDisplay(item.actual_claim_amount)} {item.actual_claim_currency} </Text>
                  </View>:null}
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Ageing:</Text>
                    <Text style={styles.itemValue}>{this.setAge(item.claim_submit_date)}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Status:</Text>
                    <Text style={[styles.itemValue, styles.statusInitiated]}>{item.status}</Text>
                  </View>
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
};

const mapStateToProps = state => {
  return {
    aprExpPend: state.aprExpPend
  };
};

const mapDispatchToProps = {
  getExpPendApr : Actions.getExpPendApr
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleExpensesScreen);