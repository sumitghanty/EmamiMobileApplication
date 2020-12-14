import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, FlatList, Linking} from "react-native";
import { Container, Content, Button, Text, Icon, Card, CardItem  } from 'native-base';
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import 'moment-precise-range-plugin'
import Ficon from 'react-native-vector-icons/FontAwesome5'

import styles from './Styles/PjpClaimListScreen'

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'month', 'year', 'status'];
const STATUS_ID = [9, 11, 19, 20, 21, 22, 23, 24, 25];

class PjpClaimListScreen extends Component {  
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
    this.props.getPjpClaim(global.USER.userId,STATUS_ID);
  }

  downloadPdf = (file) => {
    Linking.canOpenURL(file).then(supported => {
      if (supported) {
        Linking.openURL(file);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
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
  formatYear(year,month){
    // alert(year);
     if(month==="January" || month==="February" || month==="March")
     {
       return parseInt(year)+1;
     }else return year;
      }

  render() {
    if(this.props.pjpClaims.isLoading){
      return(
          <Loader/>
      )
    } else if(this.props.pjpClaims.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else {
      const listData = this.props.pjpClaims.dataSource;
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
          <Text style={styles.title}>List of PJP for claim</Text>
          {sortList.length<1 ?
            <Text style={styles.noData}>No Item Found</Text>
          :<View>
            {sortList.map((item, index) => {
            return (
              (parseInt(item.status_id) != 21 && parseInt(item.status_id) != 22 && parseInt(item.status_id) != 24)?
                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('PjpClaimInfo',item)}>
                  {this.renderItem(item)}
                </TouchableOpacity>
                :<View key={index}>
                  {this.renderItem(item)}
                </View>
            );
            })}
          </View>}
        </Content>
      </Container>
    );
  }
  }

  renderItem = (item) => {
    return <Card style={styles.item}>
      <CardItem header style={styles.itemHeader}>
        <Text style={styles.headerLabel}>PJP ID:</Text>
        <Text style={styles.headerValue}>{item.trip_no ?item.trip_no:''}</Text>
        {(parseInt(item.status_id) != 21 && parseInt(item.status_id) != 22 && parseInt(item.status_id) != 24)?
        <Icon name="md-arrow-round-forward" style={styles.arrowbtn}/>
        :(parseInt(item.status_id) == 24)?
        <TouchableOpacity style={styles.fPdfLink} onPress={()=>this.downloadPdf('https://www.google.com/')}>
          <Ficon name="file-pdf" style={styles.fPdfLinkIcon}/>
          <Text style={styles.fPdfLinkText}>DOWNLOAD</Text>
        </TouchableOpacity>
        :null}
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
           <Text style={styles.itemValue}>{item.month} {this.formatYear(item.year,item.month)}</Text>

          </View>:null}
          {item.status ?
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Status:</Text>
            <Text style={[styles.itemValue, styles.statusInitiated]}>
              {item.status}
            </Text>
          </View>:null}
        </View>
        <View style={styles.itemActions}>
        {item.status_id == 0 ?
          <Button bordered small rounded danger style={styles.actionBtn}
            onPress={()=>this.confirmation(item)}>
            <Icon name='trash' style={styles.actionBtnIco} />
          </Button>:null}
          {item.status_id == 8 ?<Button bordered small rounded primary style={[styles.actionBtn, styles.mrgTop]}
            onPress={()=>this.revertConfirmation(item)}>
            <Icon name='undo' style={styles.actionBtnIco} />
          </Button>:null}
        </View>
      </CardItem>
    </Card>
  }
}

const mapStateToProps = state => {
  return {
    pjpClaims: state.pjpClaims
  };
};

const mapDispatchToProps = {
  getPjpClaim : Actions.getPjpClaim
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpClaimListScreen);