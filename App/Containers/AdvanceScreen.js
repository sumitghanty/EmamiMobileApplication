import React, { Component } from 'react';
import { View, TouchableOpacity} from "react-native";
import { Container, Content, Text, Icon, Card, CardItem  } from 'native-base';
import Loader from '../Components/Loader'
import Empty from '../Components/Empty'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import styles from './Styles/AdvanceScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'name', 'status', 'actual_claim_amount', 'payment_amount'];

class AdvanceScreen extends Component {
  
  constructor(){ 
    super();
    this.state ={     
      searchTerm: ''
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(){
    this.props.getAdvPmnts(global.USER.userId,"3",["3", "4", "6", "7", "9", "11", "12", "13", "14", "15", "16", "17", "18"]);
  }
  removeItem(e) {
    var newList = tripList;
    if (e !== -1) {
      newList.splice(e, 1);
      this.setState({tripList: newList});
    }
  }
  
  render() {
    if(this.props.advPmnts.isLoading){
      return(
          <Loader/>
      )
    } else if(this.props.advPmnts.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else {
      console.log(this.props.advPmnts.errorStatus);
    const listData = this.props.advPmnts.dataSource;
    const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    var sortList = filteredData;
    sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return (
      this.props.advPmnts.dataSource.length < 1 ?
      <Container style={styles.container}>
        <Empty message="No Item avialable for Advance Payemnt." icon="ios-folder-open" />
      </Container>
      :
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
        <Content style={styles.content}>
          <Text style={styles.title}>List of Advance Payemnt</Text>
          {sortList.length<1 &&
            <Text style={styles.noData}>No Item Found</Text>
          }
          {sortList.map((item, index) => {
          return (
          item.delete_status === "false" ?
          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('AdvPmntReq',item)}>
          <Card style={styles.item}>
            <CardItem header style={styles.itemHeader}>
              <Text style={styles.headerLabel}>Trip ID:</Text>
              <Text style={styles.headerValue}>{item.trip_no}</Text>
              {/*<TouchableOpacity style={styles.actionBtn}>
                <Icon name='ios-undo' style={styles.actionBtnIco} />
              </TouchableOpacity>*/}
            </CardItem>
            <CardItem style={styles.itemBody}>
              <View style={styles.itemInfo}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Creation Date:</Text>
                  <Text style={styles.itemValue}>{item.creation_date}</Text>
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
                  <Text style={styles.itemLabel}>Employee:</Text>
                  <Text style={styles.itemValue}>{item.trip_creator_name}</Text>
                </View>
                {item.actual_claim_amount ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Claim Amount:</Text>
                  <Text style={styles.itemValue}>{item.actual_claim_currency} {item.actual_claim_amount}</Text>
                </View>:null}
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Status:</Text>
                  <Text style={[styles.itemValue, styles.statusInitiated]}>
                    {item.advancePaymentStatus?item.advancePaymentStatus:item.status}
                  </Text>
                </View>
              </View>
            </CardItem>
            </Card>
          </TouchableOpacity>
          :null
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
    advPmnts: state.advPmnts
  };
};

const mapDispatchToProps = {
  getAdvPmnts : Actions.getAdvPmnts
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvanceScreen);