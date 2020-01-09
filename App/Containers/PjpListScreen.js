import React, { Component } from 'react'
import { View, Alert, TouchableOpacity} from "react-native";
import { Container, Content, Button, Text, Icon, Card, CardItem  } from 'native-base';
import {API_URL} from '../config'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'

import styles from './Styles/PjpListScreen';

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'month', 'status'];

class PjpListScreen extends Component {
  constructor(){ 
    super();
    this.state ={ 
      isLoading: true,
      searchTerm: ''
    }
  }; 
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  componentDidMount(){
    return fetch(API_URL+'getTripListSalesByTripNo?user_id='+global.USER.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  removeItem(e) {
    var newList = pjpList;
    if (e !== -1) {
      newList.splice(e, 1);
      this.setState({pjpList: newList});
    }
  }
  confirmation(e) {
    Alert.alert(
      'Remove PJP',
      'Are you sure to remove this PJP?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.removeItem(e)
        },
      ],
      {cancelable: true},
    )
  };
  render() {
    if(this.state.isLoading){
      return(
          <Loader/>
      )
    } else {
      const listData = this.state.dataSource;
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
          {sortList.length<1 &&
            <Text style={styles.noData}>No Item Found</Text>
          }
          {sortList.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('PjpInfo',item)}>
              <Card style={styles.item}>
                <CardItem header style={styles.itemHeader}>
                  <Text style={styles.headerLabel}>PJP ID:</Text>
                  <Text style={styles.headerValue}>{item.trip_no}</Text>
                </CardItem>
                <CardItem style={styles.itemBody}>
                  <View style={styles.itemInfo}>
                    {item.creation_date &&
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Creation Date:</Text>
                      <Text style={styles.itemValue}>{moment(item.creation_date).format(global.DATEFORMAT)}</Text>
                    </View>}
                    {item.month &&
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>For Month of:</Text>
                      <Text style={styles.itemValue}>{item.month}</Text>
                    </View>}
                    {item.status &&
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Status:</Text>
                      <Text style={[styles.itemValue, styles.statusInitiated]}>{item.status}</Text>
                    </View>}
                  </View>
                  <View style={styles.itemActions}>
                    {item.delete_status == "true" &&<Button bordered small rounded danger style={styles.actionBtn}
                      onPress={()=>this.confirmation(index)}>
                      <Icon name='trash' style={styles.actionBtnIco} />
                    </Button>}
                    {item.status_id != 3 &&<Button bordered small rounded primary style={[styles.actionBtn, styles.mrgTop]}>
                      <Icon name='undo' style={styles.actionBtnIco} />
                    </Button>}
                  </View>
                </CardItem>
              </Card>
            </TouchableOpacity>
          );
          })}
        </Content>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PjpCreate')} style={styles.ftrBtn}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#53c55c', '#33b8d6']} 
            style={styles.ftrBtnBg}>
            <Icon name='ios-add-circle-outline' style={styles.ftrBtnIcon} />
            <Text style={styles.ftrBtnTxt}>Create New PJP</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Container>
    );
    }
  }
};

export default PjpListScreen;