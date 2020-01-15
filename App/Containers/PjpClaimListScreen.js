import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text} from "react-native";
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import styles from './Styles/PjpClaimListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status'];

class PjpClaimListScreen extends Component {
  constructor(){ 
    super();
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.state ={
      searchTerm: '',
      curDate: parseInt(year+''+month+''+date),
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  componentDidMount(){
    this.props.getPjp(global.USER.userId);
  }
  
  render() {
    if(this.props.PJP.isLoading){
      return(
          <Loader/>
      )
    } else {
      const listData = this.props.PJP.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
    return (
      <View style={styles.container}>
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
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>List of PJP - Claim pending for Approval</Text>
          {sortList.length<1 ?
            <Text style={styles.noData}>No Item Found</Text>
          :null}
          {/*sortList.map((item, index) => {
          return (*/
          <TouchableOpacity 
            style={styles.linkItem}
            //key={index} 
            onPress={() => this.props.navigation.navigate('PjpClaimAprv'/*,item*/)}>
            <View style={styles.card}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemheaderLabel}>PJP ID:</Text>
                <Text style={styles.itemHeaderValue}>xxx</Text>
                <Vicon name="ios-arrow-round-forward" style={styles.forwardIcon}></Vicon>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Creation Date:</Text>
                  <Text style={styles.itemValue}>xxx</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>For Month of</Text>
                  <Text style={styles.itemValue}>xxx</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Employee:</Text>
                  <Text style={styles.itemValue}>xxx</Text>
                </View>
                <View style={[styles.itemRow,styles.mb]}>
                  <Text style={styles.itemLabel}>Status</Text>
                  <Text style={styles.itemValue}>xxx</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          /*);
          })*/}
        </ScrollView>
      </View>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    pjpAprvList: state.pjpAprvList
  };
};

const mapDispatchToProps = {
  getPjpAprvList : Actions.getPjpAprvList
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpClaimListScreen);