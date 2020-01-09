import React, { Component } from 'react'
import { ScrollView, View, TouchableOpacity, Alert, Text} from 'react-native'
import {Purpose, For} from '../Components/GetValue'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

import {API_URL} from '../config'
import Loader from '../Components/Loader'
import styles from './Styles/PjpInfoScreen'

class PjpInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acrdVisible: 0,
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'getRequisitionListNonSales?triphdrId='+this.props.navigation.state.params.trip_hdr_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
        });
      })
      .catch((error) =>{
      });
  }
  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
    });
  }
  render() {
    const {params} = this.props.navigation.state
    if(this.state.isLoading){
      return(
        <Loader/>
      )
    }
    //console.log(this.state.dataSource)
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.title} onPress={()=>{this.setAcrdVisible()}}>
          <Text style={styles.titleText}>PJP Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"md-add-circle":"md-remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.acrdVisible==0?'none':'flex'}}>
          {params.year ?
          <View style={styles.row}>
            <Text style={styles.label}>PJP Year</Text>
            <Text style={[styles.value,styles.readonly]}>{params.year}</Text>
          </View>: null}
          {params.month ?
          <View style={styles.row}>
            <Text style={styles.label}>PJP Month</Text>
            <Text style={[styles.value,styles.readonly]}>{params.month}</Text>
          </View>: null}
          {params.purpose ?
          <View style={styles.row}>
            <Text style={styles.label}>Purpose</Text>
            <Text style={[styles.value,styles.readonly]}><Purpose value={params.purpose} /></Text>
          </View>: null}        
          {params.trip_for ?
          <View style={styles.row}>
            <Text style={styles.label}>Trip For:</Text>
            <Text style={[styles.value,styles.readonly]}><For value={params.trip_for} /></Text>
          </View>: null}
          {params.name ?
          <View style={styles.row}>
            <Text style={styles.label}>Traveler Name:</Text>
            <Text style={[styles.value,styles.readonly]}>{params.name}</Text>
          </View>: null}
          {params.details ?
          <View style={styles.row}>
            <Text style={styles.label}>Details:</Text>
            <Text style={[styles.value,styles.readonly]}>{params.details}</Text>
          </View>: null}
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <LinearGradient
            style={styles.addBtnBg}
            colors={["#9752ff", "#5e93ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <Icon name='ios-add-circle-outline' style={styles.addBtnIcon} />
            <Text uppercase={false} style={styles.addBtnText}>ADD ROW</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};

export default PjpInfoScreen;