import React, { Component } from 'react'
import { ScrollView, StatusBar, View, Text, Image, Dimensions, TouchableOpacity, BackHandler, Alert, PermissionsAndroid } from "react-native"
import { createAppContainer } from 'react-navigation'
import Carousel from 'react-native-snap-carousel'
import { Icon } from 'native-base'
import { LinearTextGradient } from "react-native-text-gradient"
import LinearGradient from 'react-native-linear-gradient'

import { Loader, NetworkError } from '../Components';
import styles from './Styles/HomeScreen'

export async function request_storage_runtime_permission() { 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Travel Management Storage Permission',
        'message': 'Travel Management needs access to your storage to download files.'
      }
    )
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) { 
      Alert.alert("Storage Permission Not Granted.");
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
        entries:  [],
    };
  }

  _renderItem ({item, index}) {
    return (
      <TouchableOpacity style={styles.sliderItem}
        onPress={() => (item.id==6)?  
                this.props.navigation.navigate(item.navigation)
                : {}
                }>
        <LinearGradient 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}} 
          colors={
            item.id==1 ? ['#fe5b6c', '#fd953e']
            : item.id==2 ? ['#f26077', '#ed96f5']
            : item.id==3 ? ['#177bd1', '#17b3dc']
            : item.id==4 ? ['#5ba11c', '#92d40a']
            : item.id==5 ? ['#d7ae23', '#fed442']
            : item.id==6 ? ['#32cfc2', '#43efe1']
            : item.id==7 ? ['#976bce', '#c27efb']
            : item.id==8 ? ['#e6aa19', '#f6c878']
            : ['#f26077', '#ed96f5']
          } 
          style={styles.sliderItemBlock}>
          <Icon name= { item.icon} style={styles.slideIcon} />
          <Text style={styles.slideTitle}>{ item.title }</Text>
          {(item.id == 6 || item.id == 7)
          ?<Text style={{fontSize: 12,}}> </Text>
          :<Text style={{color:'rgba(255,255,255,.65)',fontSize: 12,textAlign:'center'}}>coming soon</Text>}
        </LinearGradient>
      </TouchableOpacity >
    );
  }

  closeApp = () => {
    this.setState({
      entries: []
    });
    BackHandler.exitApp();
  }
  
  handleBackButton = () => {
		if(this.props.navigation.state.routeName =="Home") {
			Alert.alert(
        'Exit App',
        'Exiting the application?', [{
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'Yes',
            onPress: () => this.closeApp()
        }, ], {
            cancelable: false
        }
			)
			return true;
		}
   }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    request_storage_runtime_permission()
    if(global.USER) {
      if(global.USER.approve_pjp_visibility) {
        this.state.entries.push({ "id":7, "title": "Approve Expense/PJP", "icon": "md-checkmark-circle-outline", "navigation":"ApproveSale" });
      }
      if(global.USER.Approve_visibility_NonSales) {
        this.state.entries.push({ "id":6, "title": "Approve Expense/Trip Non Sales", "icon": "done-all", "navigation":"ApproveNoneSale" });
      }
      if(global.USER.AdvancePayment_visibility) {
        this.state.entries.push({ "id":1, "title": "Advance Payment", "icon": "cash", "navigation":"Advance"});
      }
      if(global.USER.createReqisition_visibility) {
        this.state.entries.push({ "id":2, "title": "Create/View Trip", "icon": "subway", "navigation":"TripList"});
      }
      if(global.USER.create_pjp_visibility) {
        this.state.entries.push({ "id":3, "title": "Create/View PJP", "icon": "create", "navigation":"PjpList"});
      }
      /*if(global.USER.approve_pjp_visibility) {
        this.state.entries.push({ "id":4, "title": "Approve Expense/PJP", "icon": "md-checkbox-outline", "navigation":"ApproveExpenses" });
      }*/
      if(global.USER.createExpense_visibility) {
        this.state.entries.push({ "id":5, "title": "Create/View Expenses", "icon": "calculator", "navigation":"ExpensesList" });
      }
    }
  }
  
  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    console.log(global.USER);
    return (
    <View style={styles.container}>
			<NetworkError />
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => this.props.navigation.toggleDrawer()}>
        <LinearTextGradient
            style={styles.title}
            locations={[0, 1]}
            colors={["#833589", "#5f9cfb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="menu" style={styles.menuBtnIcon} />
          </LinearTextGradient>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.titleBlock}>
          <LinearTextGradient
            style={styles.title}
            locations={[0, 1]}
            colors={["#1579cf", "#0aeacf"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text>Travel Management System</Text>
          </LinearTextGradient>
        </View>
        <View style={styles.userBlock}>
          {/*global.USER.avatar &&
          <Image style={styles.userAvatar} source={{ uri:global.USER.avatar}} />
          */}
          <View style={styles.userInfo}>
            <LinearTextGradient
              locations={[0, 1]}
              colors={["#7bf0f9", "#8dfbdf"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.userNameHolder}
              >
              <Text style={styles.userName}>{global.USER.userName}</Text>
            </LinearTextGradient>
            <Text style={styles.designation}>{global.USER.designation}</Text>
            <Text style={styles.designation}>Department:{global.USER.department}</Text>
          </View>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userTitle}>Contact Information</Text>
          <View style={styles.userRow}>
            <Text style={[styles.label, styles.infoLable]}>Email:</Text>
            <Text style={[styles.value, styles.infoValue]}>{global.USER.userEmail}</Text>
          </View>
          <View style={styles.userRow}>
            <Text style={[styles.label, styles.infoLable]}>Location:</Text>
            <Text style={[styles.value, styles.infoValue]}>{global.USER.location}</Text>
          </View>
          <View style={styles.userRow}>
            <Text style={[styles.label, styles.infoLable]}>Zone:</Text>
            <Text style={[styles.value, styles.infoValue]}>{global.USER.zone}</Text>
          </View>
          <View style={styles.userRow}>
            <Text style={[styles.label, styles.infoLable]}>Supervisor:</Text>
            <Text style={[styles.value, styles.infoValue]}>{global.USER.supervisorName}</Text>
          </View>
        </View>

        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.entries}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={220}
          firstItem={1}
          inactiveSlideScale={0.65}
        />
        <Text style={styles.copyright}>&copy; All rights reserved by Emami</Text>
      </ScrollView>
    </View>
    );
  }
}