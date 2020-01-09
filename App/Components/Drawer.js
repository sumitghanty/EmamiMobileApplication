import React from 'react';
import {View, ScrollView, SafeAreaView, AsyncStorage, Image } from 'react-native'
import { ListItem, Icon, Left, Body, Text } from "native-base"

import styles from './Styles/Drawer'

class Drawer extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Trip List',
    drawerLabel: 'Create Trip',
  };

  constructor(props) {
    super(props)
    this.state = {
      entries:  [{'sl':'1'},{'sl':'2'},{'sl':'3'},{'sl':'4'},{'sl':'5'},{'sl':'6'},{'sl':'7'}],
      userName: '',
      personId: '',
      userDesig: '',
      uAvatar: null
    } ;
  }  

  componentDidUpdate() {   
    if(global.USER) {
      if(global.USER.userName) {
        this.state.userName = global.USER.userName
      }
      if(global.USER.personId) {
        this.state.personId = global.USER.personId
      }
      if(global.USER.designation) {
        this.state.userDesig = global.USER.designation
      }
      /*if(global.USER.avatar) {
        this.state.uAvatar = global.USER.avatar
      }*/
      if(global.USER.Approve_visibility_Sales) {
        this.state.entries[0] = {"id":"2", "title": "Approve Expense/PJP", "icon": "md-checkmark-circle-outline", "navigation":"ApproveSale"}
      }
      if(global.USER.Approve_visibility_NonSales) {
        this.state.entries[1] = {"id":"1", "title": "Approve Expense/Trip Non Sales", "icon": "done-all", "navigation":"ApproveNoneSale"}
      }
      if(global.USER.AdvancePayment_visibility) {
        this.state.entries[2] = {"id":"3", "title": "Advance Payment", "icon": "cash", "navigation":"Advance"}
      }
      if(global.USER.createReqisition_visibility) {
        this.state.entries[3] = {"id":"4", "title": "Create/View Trip", "icon": "subway", "navigation":"TripList"}
      }
      if(global.USER.create_pjp_visibility) {
        this.state.entries[4] = {"id":"5", "title": "Create/View PJP", "icon": "create", "navigation":"PjpList"}
      }
      if(global.USER.createExpense_visibility) {
        this.state.entries[5] = {"id":"7", "title": "Create/View Expenses", "icon": "calculator", "navigation":"ExpensesList"}
      }
      /*if(global.USER.approve_pjp_visibility) {
        this.state.entries[6] = {"id":"6", "title": "Approve Expense/PJP", "icon": "md-checkbox-outline", "navigation":"ApproveExpenses"}
      }*/
    }
  }

  async storeToken(user) {
    try {
       await AsyncStorage.setItem("userData", '');
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  logOut = () => {
    this.storeToken();
    this.setState({
      entries: []
    });
    global.USER = null
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
    <View style={styles.drwaer}>
      <View style={styles.header}>
        <View style={styles.avatarHolder}>
          {this.state.uAvatar ?
          <Image style={styles.userAvatar} source={{ uri:this.state.uAvatar}} />
          :
          <Icon name="md-contact" style={styles.userIcon} />
          }
        </View>
        <Text style={styles.userName}>{this.state.userName}</Text>
        <Text style={styles.userDes}>{this.state.userDesig}</Text>
        <Text style={styles.userID}>{this.state.personId}</Text>
      </View>
    <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        {this.state.entries.map((item, index) => {          
          return (
            <ListItem 
              key={index} 
              icon
              style={item.title?styles.listItem:styles.dNone} 
              onPress={ 
                () => (item.id == "1" || item.id == "2") ? this.props.navigation.navigate(item.navigation) : {}
                }>
              <Left>
                <Icon active name={item.icon} style={styles.listIcon} />
              </Left>
              <Body style={styles.listLabel}>
                <Text numberOfLines={1} style={styles.listItemText}>{item.title}</Text>
              </Body>
            </ListItem>
          );
        })}
				<ListItem last icon style={styles.listItem} onPress = {() => this.logOut()}>
          <Left>
            <Icon active name="power" style={styles.listIcon} />
          </Left>
          <Body style={styles.listLabel}>
            <Text numberOfLines={1} style={styles.listItemText}>Sign Out</Text>
          </Body>
        </ListItem>        
      </SafeAreaView>
    </ScrollView>
    </View>
    );
  }
}

export default Drawer;