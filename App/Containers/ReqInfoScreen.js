import React, { Component } from 'react'
import { ScrollView, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import moment from 'moment'
import Actions from '../redux/actions'

import Loader from '../Components/Loader'
import styles from './Styles/ReqInfoScreen'

class ReqInfoScreen extends Component {

  componentDidMount(props){
    this.props.getReqType(global.USER.designation,global.USER.grade);
  }

  getReqValue = (value) => {
		for(var i=0; i<this.props.reqType.dataSource.length; i++) {
      if(this.props.reqType.dataSource[i].sub_category_id == value) {
        return (
          this.props.reqType.dataSource[i].sub_category
        );
      }
    }
  }

  render() {
    if(this.props.reqType.isLoading){
      return(
        <Loader/>
      )
    }
		const {params} = this.props.navigation.state
    console.log(params, this.props.reqType.dataSource);
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          {params.req_type=='1' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#007AFF"}]}>
            <Icon style={styles.typeIcon} name="md-airplane" />
          </View>: params.req_type=='10' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#3ba03f"}]}>
            <Icon style={styles.typeIcon} name="ios-car" />
          </View>: params.req_type=='11' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#FF9501"}]}>
            <Icon style={styles.typeIcon} name="md-car" />
          </View>: params.req_type=='3' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#f16168"}]}>
            <Ficon style={styles.typeIcon} name="subway" />
          </View>: params.req_type=='1BH' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#00c4ff"}]}>
            <Ficon style={styles.typeIcon} name="hotel" />
          </View>: params.req_type=='1BM' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#9c27b0"}]}>
            <Icon style={styles.typeIcon} name="ios-train" />
          </View>: params.req_type=='1BNM' ?
          <View style={[styles.typeIconHolder,{backgroundColor:"#27b084"}]}>
            <Ficon style={styles.typeIcon} name="road" />
          </View>: null
          }
          <Text style={styles.typeValue}>{this.getReqValue(params.req_type)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{params.status}</Text>
        </View>
        {params.amount ?
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>INR {params.amount}</Text>
        </View>:null}
        {params.travel_date?
        <View style={styles.row}>
          <Text style={styles.label}>Travel Date:</Text>
          <Text style={styles.value}>{moment(params.travel_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
				{params.start_date?
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.check_in_time?
        <View style={styles.row}>
          <Text style={styles.label}>CheckIn Time:</Text>
          <Text style={styles.value}>{params.check_in_time}</Text>
        </View>:null}
				{params.end_date?
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.check_out_time?
        <View style={styles.row}>
          <Text style={styles.label}>CheckOut Time:</Text>
          <Text style={styles.value}>{params.check_out_time}</Text>
        </View>:null}
        {params.days?
        <View style={styles.row}>
          <Text style={styles.label}>Days:</Text>
          <Text style={styles.value}>{params.days}</Text>
        </View>:null}
        {params.travel_type?
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{params.travel_type}</Text>
        </View>:null}
        {params.travel_from?
        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{params.travel_from}</Text>
        </View>:null}
        {params.travel_to?
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{params.travel_to}</Text>
        </View>:null}
        {params.state?
        <View style={styles.row}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{params.state}</Text>
        </View>:null}
        {params.city?
        <View style={styles.row}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{params.city}</Text>
        </View>:null}
        {params.username?
        <View style={styles.row}>
          <Text style={styles.label}>User Name:</Text>
          <Text style={styles.value}>{params.username}</Text>
        </View>:null}
        {params.useremail?
        <View style={styles.row}>
          <Text style={styles.label}>User Email:</Text>
          <Text style={styles.value}>{params.useremail}</Text>
        </View>:null}
        {params.through ?
        <View style={styles.row}>
          <Text style={styles.label}>Through:</Text>
          <Text style={styles.value}>{params.through}</Text>
        </View>:null}
        {params.attachment ?
        <View style={styles.attachInfo}>
          <Text style={styles.label}>Attachments:</Text>
          {params.attachment.map((attachItem, sl) => {
            return <View key={sl} style={styles.attachRow}>
              <Text style={styles.attachName}>{attachItem.fileName}</Text>
              <Text style={styles.attachSize}>{attachItem.size}</Text>
            </View>
          })}
        </View>:null}
      </ScrollView>
    );
  }
};

const mapStateToProps = state => {
  return {
    reqType: state.reqType
  };
};

const mapDispatchToProps = {
  getReqType : Actions.getReqType
};

export default connect(mapStateToProps, mapDispatchToProps)(ReqInfoScreen);