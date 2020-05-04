import React, { Component } from 'react'
import { View, Alert, TouchableOpacity} from "react-native";
import { Container, Content, Text, Icon, Card, CardItem  } from 'native-base';
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'

import styles from './Styles/PjpAprvListScreen';

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'month', 'name', 'status'];

class PjpAprvListScreen extends Component {
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
    const {params} = this.props.navigation.state;
    let ID = params == "tour"?[2,3,4,8]:[21];
    console.log(ID);
    this.props.getPjpAprvList(global.USER.personId,ID);
  }

  render() {
    if(this.props.pjpAprvList.isLoading){
      return(
        <Loader/>
      )
    } else if(this.props.pjpAprvList.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else {
      const {params} = this.props.navigation.state;
      const listData = this.props.pjpAprvList.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      sortList.sort((a,b) => b.trip_hdr_id - a.trip_hdr_id);
      console.log(params);
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
          <Text style={styles.title}>
            {params == "tour"?"List of PJP - Tour pending for Approval":"List of PJP - Claim pending for Approval"}
          </Text>
          {sortList.length<1 &&
            <Text style={styles.noData}>No Item Found</Text>
          }
          {sortList.map((item, index) => {
          return (
            <TouchableOpacity key={index} 
              onPress={() => this.props.navigation.navigate(params == "tour"?'PjpTripAprv':'PjpClaimAprv',item)}>
              <Card style={styles.item}>
                <CardItem header style={styles.itemHeader}>
                  <Text style={styles.headerLabel}>PJP ID:</Text>
                  <Text style={styles.headerValue}>{item.trip_no}</Text>
                  <Icon name="ios-arrow-round-forward" style={styles.headerIcon} />
                </CardItem>
                <CardItem style={styles.itemBody}>
                  <View style={styles.itemInfo}>
                    {item.creation_date ?
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Creation Date:</Text>
                      <Text style={styles.itemValue}>{moment(item.creation_date).format(global.DATEFORMAT)}</Text>
                    </View>:null}
                    {item.month ?
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>For Month of:</Text>
                      <Text style={styles.itemValue}>{item.month} {item.year}</Text>
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
                        {(params == "tour" && item.sub_status)?item.sub_status:item.status}
                      </Text>
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
};

const mapStateToProps = state => {
  return {
    pjpAprvList: state.pjpAprvList
  };
};

const mapDispatchToProps = {
  getPjpAprvList : Actions.getPjpAprvList
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpAprvListScreen);