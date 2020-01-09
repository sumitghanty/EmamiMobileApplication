import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import Loader from '../Components/Loader'
import styles from './Styles/ApproveNoneSaleTripScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'name', 'status', 'trip_from', 'trip_to'];

class ApproveNoneSaleTripScreen extends Component {
  
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: false,
      searchTerm: '',
    }
  }  
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(){
    this.props.getApprovedTripPending(global.USER.userEmail);
  }
	
  render(){    
    if(this.props.aprvTripPend.isLoading || this.state.isLoading){
      return(
        <Loader/>
      )
    } else if (this.props.aprvTripPend.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
      const listData = this.props.aprvTripPend.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return(
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchInput 
          onChangeText={(term) => { this.searchUpdated(term) }} 
          style={styles.searchInput}
          placeholder="Search Trip"
          clearIcon={this.state.searchTerm!==''?<Icon name="md-close-circle" style={styles.searchClearIcon}/>:<Icon name="md-search" style={[styles.searchClearIcon,styles.searchIcon]}/>}
          clearIconViewStyles={styles.searchClear}
          returnKeyType= 'search'
          underlineColorAndroid='transparent'
          />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>List of Trip Pending for Approval</Text>
        {sortList.length<1 &&
          <Text style={styles.noData}>No Item Found.</Text>
        }
        {sortList.map((item, index) => {
        return (
					(item.status_id == "2" || item.status_id == "26" || item.status_id == "3" || item.status_id == "4" || item.status_id == "8" || item.status_id == "9" || item.status_id == "10" || item.status_id == "11") ?
          <View key={index} style={styles.linkItem}>
            <View style={styles.card}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemheaderLabel}>Trip ID:</Text>
                <Text style={styles.itemHeaderValue}>{item.trip_no}</Text>
              </View>
              <View style={styles.cardBody}>
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
                  <Text style={styles.itemLabel}>Employee</Text>
                  <Text style={styles.itemValue}>{item.name}</Text>
                </View>
                <View style={[styles.itemRow,styles.mb]}>
                  <Text style={styles.itemLabel}>Status</Text>
                  <Text style={styles.itemValue}>{item.status}</Text>
                </View>
              </View>
              {item.status_id == "2" || item.status_id == "26" ?
              <TouchableOpacity style={styles.itemFtrBtn}
                onPress={() => this.props.navigation.navigate('ApproveNoneSaleTripDetails',item)}>
                <Text style={styles.itemFtrBtnText}>Approve Trip</Text>
                <Icon name="ios-arrow-round-forward" style={styles.itemFtrIcon} />
              </TouchableOpacity>
              : item.status_id == "3" || item.status_id == "4" || item.status_id == "8" || item.status_id == "9" || item.status_id == "10" || item.status_id == "11" ?
              <TouchableOpacity style={styles.itemFtrBtn}
                onPress={() => this.props.navigation.navigate('ApproveNoneSaleTripDetails',item)}>
                <Text style={[styles.itemFtrBtnText,styles.textInfo]}>Approve Plan Trip</Text>
                <Icon name="ios-arrow-round-forward" style={[styles.itemFtrIcon,styles.textInfo]} />
              </TouchableOpacity>
              :null}
            </View>
          </View>
					:null);
        })}
      </ScrollView>
      </View>
    );
  }
  }
};

const mapStateToProps = state => {
  return {
    aprvTripPend: state.aprvTripPend
  };
};

const mapDispatchToProps = {
  getApprovedTripPending : Actions.getApprovedTripPending
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveNoneSaleTripScreen);