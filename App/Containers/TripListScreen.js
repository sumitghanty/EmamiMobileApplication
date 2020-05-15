import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList } from "react-native";
import { Container, Content, Text, Icon, Card, CardItem } from 'native-base';
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'

import styles from './Styles/TripListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'start_date', 'end_date', 'trip_creator_name', 'status'];

class TripListScreen extends Component {
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
    this.props.getTrips(global.USER.userId);
  }
  setAge = (date) => {
    var newDate = date.includes('/')?date : moment(date).format('DD/MM/YYYY')
    var curDate = moment(new Date()).format('DD/MM/YYYY')
    var diff = moment(newDate, "DD/MM/YYYY").diff(moment(curDate, "DD/MM/YYYY"), 'days');
    return(
      diff
    );
  }
  
  render() {
    console.log(global.PASSWORD)
    if(this.props.trips.isLoading){
      return(
          <Loader/>
      )
    } else if(this.props.trips.errorStatus){
      return(
          <Text>URL Error</Text>
      )
    } else {
      console.log(this.props.navigation.state.routeName);
      const listData = this.props.trips.dataSource;
      const filteredData = listData?listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)):[]
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
          <Text style={styles.title}>List of Created Trip</Text>
          {sortList.length<1 ?
            <Text style={styles.noData}>No Item Found</Text>
          :null}
          <View>
          {sortList.length>0 &&
          <FlatList
            data={sortList}
            keyExtractor={item => String(item.trip_hdr_id)}
            renderItem={({ item }) => <TouchableOpacity onPress={() => this.props.navigation.navigate('TripInfo',item)}>
            <Card style={styles.item}>
              <CardItem header style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text style={styles.headerLabel}>Trip ID:</Text>
                  <Text style={styles.headerValue}>{item.trip_no}</Text>
                </View>
                {((item.status_id == "3"
                || item.status_id == "4"
                || item.status_id == "6"
                || item.status_id == "7"
                || item.status_id == "8"
                /*|| item.sub_status_id == '7.2'
                || item.sub_status_id == '7.3'
                || item.sub_status_id == '7.4'
                || item.sub_status_id == '7.5'*/
                || item.status_id == "9" 
                || item.status_id == "10" 
                || item.status_id == "11"
                || parseInt(item.status_id) >= 26)
                && parseInt(this.setAge(item.end_date)) >= 0) ?
                <View style={styles.itemHeaderRight}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('TripPlan',item)}>
                    <LinearGradient
                      style={styles.planBtn}
                      colors={["#2cc2d6", "#2cd66c"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      >
                        <Text uppercase={false} style={styles.planBtnText}>Plan Trip</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>: null}
              </CardItem>
              <CardItem style={styles.itemBody}>
                <View style={styles.itemInfo}>
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
                    <Text style={[styles.itemValue, item.date_change_status=='Y'&&{color:"red"}]}>
                      {moment(item.end_date).format(global.DATEFORMAT)}
                    </Text>
                  </View>:null}
                  {item.name ?
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Employee:</Text>
                    <Text style={styles.itemValue}>{item.name}</Text>
                  </View>:null}
                  {item.status ?
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Status:</Text>
                    <Text style={[styles.itemValue, styles.statusInitiated]}>
                      {item.status}
                    </Text>
                  </View>:null}
                </View>
                {item.status_id == "0" || item.status_id == "1" || item.status_id == "5" ?
                <TouchableOpacity style={styles.viewSvBtn} onPress={() => this.props.navigation.navigate('TripUpdate',item)} >
                  <Text style={styles.viewSvBtnText}>Update Trip</Text>
                  <Icon name="ios-arrow-round-forward" style={styles.viewSvBtnIcon} />
                </TouchableOpacity>:null
                }
              </CardItem>
            </Card>
          </TouchableOpacity>}
          />}
          </View>
        </Content>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('TripCreate')} style={styles.ftrBtn}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#53c55c', '#33b8d6']} 
            style={styles.ftrBtnBg}>
            <Icon name='ios-add-circle-outline' style={styles.ftrBtnIcon} />
            <Text style={styles.ftrBtnTxt}>Create New Trip</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Container>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    trips: state.trips
  };
};

const mapDispatchToProps = {
  getTrips : Actions.getTrips
};

export default connect(mapStateToProps, mapDispatchToProps)(TripListScreen);