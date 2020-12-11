import React, { Component } from 'react';
import { View, TouchableOpacity} from "react-native";
import { Container, Content, Text, Icon, Card, CardItem  } from 'native-base';
import Loader from '../Components/Loader'
import Empty from '../Components/Empty'
import SearchInput, { createFilter } from 'react-native-search-filter'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import styles from './Styles/AdvanceScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status', 'actual_claim_amount', 'payment_amount'];

class ApproveNoneSaleAdvanceScreen extends Component {
  
  constructor(){ 
    super();
    this.state ={     
      searchTerm: '',
      curDate: '',
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  formatAmountForDisplay(value){
    var num = 0;
    if(value != "" && value != null && value != 'null')
    num = parseFloat(value);
    return num.toFixed(2);
  }

  componentDidMount(){
    this.props.getAdvPmntPend(global.USER.personId,"14");
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
    var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
    var curDate = moment(new Date()).format('DD/MM/YYYY')
    var diff = moment(curDate, "DD/MM/YYYY").diff(moment(newDate, "DD/MM/YYYY"), 'days');
    return(
      diff<2?diff+' day':diff+' days'
    );
  }
	
  render() {
    if(this.props.aprvPmntPend.isLoading){
      return(
          <Loader/>
      )
    } else {
      const listData = this.props.aprvPmntPend.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return (
      this.props.aprvPmntPend.dataSource < 1 ?
      <Container style={styles.container}>
          <Empty message="No Item available for Advance Payment." icon="ios-folder-open" />
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
          <Text style={styles.title}>List of Advance payment pending for Approval</Text>
          {sortList.length<1 &&
            <Text style={styles.noData}>No Item Found</Text>
          }
          {sortList.map((item, index) => {
          return (
          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('AdvPmntReqInfo',item)}>
          <Card style={styles.item}>
            <CardItem header style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Text style={styles.headerLabel}>Trip ID:</Text>
                <Text style={styles.headerValue}>{item.trip_no}</Text>
              </View>
              {/*<TouchableOpacity style={styles.actionBtn}>
                <Icon name='ios-undo' style={styles.actionBtnIco} />
              </TouchableOpacity>*/}
            </CardItem>
            <CardItem style={styles.itemBody}>
              <View style={styles.itemInfo}>
                {item.trip_creator_name ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Employee:</Text>
                  <Text style={styles.itemValue}>{item.trip_creator_name}</Text>
                </View>:null}
                {item.creation_date ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Creation Date:</Text>
                  <Text style={styles.itemValue}>{item.creation_date}</Text>
                </View>:null}
                {item.start_date ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Start Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.start_date).format(global.DATEFORMAT)}</Text>
                </View>:null}
                {item.end_date ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>End Date:</Text>
                  <Text style={styles.itemValue}>{moment(item.end_date).format(global.DATEFORMAT)}</Text>
                </View>:null}
                {item.actual_claim_amount ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Claim Amount:</Text>
                  <Text style={styles.itemValue}>{item.actual_claim_currency} {this.formatAmountForDisplay(item.actual_claim_amount)}</Text>
                </View>:null}
                {item.payment_amount ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Advance Amount:</Text>
                  <Text style={styles.itemValue}>{item.currency} {this.formatAmountForDisplay(item.payment_amount)}</Text>
                </View>:null}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Age:</Text>
                  <Text style={styles.itemValue}>{this.setAge(item.payment_submit_date)}</Text>
                </View>
                {item.status ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Status:</Text>
                  <Text style={[styles.itemValue, styles.statusInitiated]}>{item.status}</Text>
                </View>:null}
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
    aprvPmntPend: state.aprvPmntPend
  };
};

const mapDispatchToProps = {
  getAdvPmntPend : Actions.getAdvPmntPend
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleAdvanceScreen);