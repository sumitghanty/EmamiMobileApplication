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

  constructor(props) {
    super(props);
    this.state = {
      reqName: '',
      elAmnt: 0
    }
  }

  componentDidMount(props){
    const {params} = this.props.navigation.state
    this.props.getReqType(global.USER.designation,global.USER.grade)
    .then(()=>{
      for(var i=0; i<this.props.reqType.dataSource.length; i++) {
        if(this.props.reqType.dataSource[i].sub_category_id == params.req_type) {
          this.setState({
            reqName: this.props.reqType.dataSource[i].sub_category,
            elAmnt: this.props.reqType.dataSource[i].upper_limit
          });
        }
      }
    });
  }

  render() {
    if(this.props.reqType.isLoading){
      return(
        <Loader/>
      )
    } else if(this.props.reqType.errorStatus) {
      return(
        <Text>URL Error</Text>
      )
    } else {
		const {params} = this.props.navigation.state
    //console.log(params, this.props.reqType.dataSource);
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
          <Text style={styles.typeValue}>{this.state.reqName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{params.sub_status && params.sub_status != 'NA'?params.sub_status:params.status}</Text>
        </View>
        {params.travel_date?
        <View style={styles.row}>
          <Text style={styles.label}>Travel Date:</Text>
          <Text style={styles.value}>{moment(params.travel_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.creation_date?
        <View style={styles.row}>
          <Text style={styles.label}>Creation Date:</Text>
          <Text style={styles.value}>{moment(params.creation_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {params.through ?
        <View style={styles.row}>
          <Text style={styles.label}>Through:</Text>
          <Text style={styles.value}>{params.through}</Text>
        </View>:null}
        {(params.through && params.through == "Self")?
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{params.username}</Text>
        </View>:null}
        {params.amount ?
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>INR {params.amount}</Text>
        </View>:null}
        
        {params.req_type=='10' || params.req_type=='11' ?
          this.renderTaxi(params)
        :params.req_type=='1BH' || params.req_type=='1BM' || params.req_type=='1BNM' ?
          this.renderHotel(params)
        :params.req_type=='3' ?
          this.renderTrain(params)
        :<>
        
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
        </>}
      </ScrollView>
    );
    }
  }

  renderTaxi = (data) => {
    return <>
    {data.travel_from &&
    <View style={styles.row}>
      <Text style={styles.label}>Destination From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>}
    {data.travel_to &&
    <View style={styles.row}>
      <Text style={styles.label}>Destination To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>}
    </>
  }

  renderHotel = (data) => {
    return <>
    {data.state &&
    <View style={styles.row}>
      <Text style={styles.label}>State:</Text>
      <Text style={styles.value}>{data.state}</Text>
    </View>}
    {data.city &&
    <View style={styles.row}>
      <Text style={styles.label}>Location/City:</Text>
      <Text style={styles.value}>{data.city}</Text>
    </View>}
    {data.travel_type &&
    <View style={styles.row}>
      <Text style={styles.label}>Travel Type:</Text>
      <Text style={styles.value}>{data.travel_type}</Text>
    </View>}
    {data.check_in_date &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckIn Date:</Text>
      <Text style={styles.value}>{moment(data.check_in_date).format(global.DATEFORMAT)}</Text>
    </View>}
    {data.check_in_time &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckIn Time:</Text>
      <Text style={styles.value}>{data.check_in_time}</Text>
    </View>}
    {data.check_out_date &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckOut Date:</Text>
      <Text style={styles.value}>{moment(data.check_out_date).format(global.DATEFORMAT)}</Text>
    </View>}
    {data.check_out_time &&
    <View style={styles.row}>
      <Text style={styles.label}>CheckOut Time:</Text>
      <Text style={styles.value}>{data.check_out_time}</Text>
    </View>}
    {data.days &&
    <View style={styles.row}>
      <Text style={styles.label}>No of Days:</Text>
      <Text style={styles.value}>{data.days}</Text>
    </View>}
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount:</Text>
      <Text style={styles.value}>{data.days * this.state.elAmnt}</Text>
    </View>
    </>
  }

  renderTrain = (data) => {
    return <>
    <View style={styles.row}>
      <Text style={styles.label}>Eligible Amount/Per Trip:</Text>
      <Text style={styles.value}>{this.state.elAmnt}</Text>
    </View>
    {data.ticket_class &&
    <View style={styles.row}>
      <Text style={styles.label}>Ticket Class:</Text>
      <Text style={styles.value}>{data.ticket_class}</Text>
    </View>}
    {data.travel_time &&
    <View style={styles.row}>
      <Text style={styles.label}>Suitable Time:</Text>
      <Text style={styles.value}>{data.travel_time}</Text>
    </View>}
    {data.travel_from &&
    <View style={styles.row}>
      <Text style={styles.label}>Station/Location From:</Text>
      <Text style={styles.value}>{data.travel_from}</Text>
    </View>}
    {data.travel_to &&
    <View style={styles.row}>
      <Text style={styles.label}>Station/Location To:</Text>
      <Text style={styles.value}>{data.travel_to}</Text>
    </View>}
    {data.email &&
    <View style={styles.row}>
      <Text style={styles.label}>Personal Email:</Text>
      <Text style={styles.value}>{data.email}</Text>
    </View>}
    </>
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