import React, { Component } from 'react';
import { View, TouchableOpacity} from "react-native";
import { Container, Content, Text, Icon, Card, CardItem  } from 'native-base';
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
    this.props.getTrips(global.USER.userId);
  }
  
  render() {
    if(this.props.trips.isLoading){
      return(
          <Loader/>
      )
    } else {
      //console.log(this.props.navigation.state.routeName);
      const listData = this.props.trips.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
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
          {sortList.map((item, index) => {
          return (
          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('TripInfo',item)}>
          <Card style={styles.item}>
            <CardItem header style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Text style={styles.headerLabel}>Trip ID:</Text>
                <Text style={styles.headerValue}>{item.trip_no}</Text>
              </View>
              {((item.status_id == "3"
              || item.status_id == "4"
              || item.status_id == "6"
              || item.status_id == "15"
              || item.status_id == "16" 
              || item.status_id == "17" 
              || item.status_id == "18")
              && ((parseInt(item.end_date.replace("-","").replace("-","")) - this.state.curDate) > 0)) ?
              <View style={styles.itemHeaderRight}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('TripPlan',item)}>
                  <LinearGradient
                    style={styles.planBtn}
                    colors={["#9752ff", "#5e93ff"]}
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
                  <Text style={styles.itemValue}>{moment(item.end_date).format(global.DATEFORMAT)}</Text>
                </View>:null}
                {item.trip_creator_name ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Employee:</Text>
                  <Text style={styles.itemValue}>{item.trip_creator_name}</Text>
                </View>:null}
                {item.status ?
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Status:</Text>
                  <Text style={[styles.itemValue, styles.statusInitiated]}>{item.status}</Text>
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
          </TouchableOpacity>
          );
          })}
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