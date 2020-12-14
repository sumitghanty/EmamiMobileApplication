import React, { Component } from 'react'
import { View, Alert, TouchableOpacity, AsyncStorage } from "react-native";
import { Container, Content, Button, Text, Icon, Card, CardItem  } from 'native-base';
import Loader from '../Components/Loader'
import SearchInput, { createFilter } from 'react-native-search-filter'
import Vicon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import styles from './Styles/PjpListScreen';
import { connect } from 'react-redux';

const KEYS_TO_FILTERS = ['trip_no', 'creation_date', 'month', 'year', 'status'];

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
    this.props.getPjp(global.USER.userId);
  }

  removeItem(e) {
    this.setState({ isLoading: true }, () => {
      this.props.pjpDelete([e])
      .then(()=>{
        this.props.getPjp(global.USER.userId)
        .then(()=>{
          this.setState({ isLoading: false })
        })
        .then(()=>{
          Toast.show('Tour delete Successfully', Toast.LONG);
        })
      })
    })    
  }

  confirmation(e) {
    Alert.alert(
      'Remove PJP',
      'Are you sure to remove this Tour?',
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

  revertItem(e) {
    this.setState({ isLoading: true })
    let newData = e;
    AsyncStorage.getItem("ASYNC_STORAGE_SAVE_KEY")
    .then(()=>{
      newData.status_id = 0;
      newData.status = "initiated"
    })
    .then(()=>{
      this.props.pjpUpdate([newData])
      .then(()=>{
        this.props.getPjp(global.USER.userId)
        .then(()=>{
          this.setState({ isLoading: false })
        })
        .then(()=>{
          Toast.show('Tour revert Successfully', Toast.LONG);
        })
      })
    })    
  }

  revertConfirmation(e) {
    Alert.alert(
      'Revert PJP',
      'Are you sure to revert this Tour?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.revertItem(e)
        },
      ],
      {cancelable: true},
    )
  };
   formatYear(year,month){
  if(month==="January" || month==="February" || month==="March")
  {
    return parseInt(year)+1;
  }else return year;
   }
  render() {
    if(this.props.pjp.isLoading){
      return(
          <Loader/>
      )
    } else if(this.props.pjp.errorStatus){
      return(
          <Text>URL Error</Text>
      )
    } else {
      const listData = this.props.pjp.dataSource;
      const filteredData = listData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      var sortList = filteredData;
      //sortList.sort((a,b) => parseInt(b.year+moment().month(b.month).format("MM")) - parseInt(a.year+moment().month(a.month).format("MM")));
      sortList.sort((a,b) => parseInt(b.trip_hdr_id) - parseInt(a.trip_hdr_id));
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
            item.delete_status == "false" ?
              (item.status_id == 0 || item.status_id == 1 || item.status_id == 2 || item.status_id == 3 || 
              item.status_id == 4 || item.status_id == 6 || item.status_id == 7 || item.status_id == 9 || 
              item.status_id == 10 || item.status_id == 11)?
              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('PjpInfo',item)}>
                {this.renderItem(item)}
              </TouchableOpacity>
              :<View key={index}>
                {this.renderItem(item)}
              </View>
            :null
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
            <Text style={styles.ftrBtnTxt}>Create New Tour Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Container>
    );
    }
  }

  renderItem = (item) => {
    return <Card style={styles.item}>
      <CardItem header style={styles.itemHeader}>
        <Text style={styles.headerLabel}>PJP ID:</Text>
        <Text style={styles.headerValue}>{item.trip_no ?item.trip_no:''}</Text>
        {(item.status_id == 0 || item.status_id == 1 || item.status_id == 2 || item.status_id == 3 || 
        item.status_id == 4 || item.status_id == 6 || item.status_id == 7 || item.status_id == 9 || 
        item.status_id == 10 || item.status_id == 11)?
        <Icon name="md-arrow-round-forward" style={styles.arrowbtn}/>
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
           {/* if({item.month}=== "January", "February", "March" )
            {
               <Text style= {styles.itemValue}>{''+((parseInt(item.year)+1)+"").substring(2,4)} </Text
            } */}
          </View>:null}
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Status:</Text>
            <Text style={[styles.itemValue, styles.statusInitiated]}>
              {(item.sub_status && item.sub_status!='NA')?item.sub_status:item.status}
            </Text>
          </View>
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
};

mapStateToProps = state => {
  return {
    pjp : state.pjp,
    pjpUpdateState: state.pjpUpdateState,
    pjpDeleteState: state.pjpDeleteState,
    pjpUpdateState: state.pjpUpdateState
  };
};

mapDispatchToProps = {
  getPjp : Actions.getPjp,
  pjpUpdate: Actions.pjpUpdate,
  pjpDelete: Actions.pjpDelete,
  pjpUpdate: Actions.pjpUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpListScreen);