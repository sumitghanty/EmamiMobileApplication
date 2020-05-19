import React, { Component } from 'react'
import { ScrollView, View,TouchableOpacity, Alert, Text, Modal, AsyncStorage, TextInput,} from 'react-native'
import { Button, Icon} from 'native-base';
import {Purpose, For} from '../Components/GetValue'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import Loader from '../Components/Loader'
import styles from './Styles/PjpClaimInfoScreen'
import { connect } from 'react-redux'

class PjpClaimInfoScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      acrdVisible: 0,
      claimAcrd: 1,
      modalVisible: 0,
      isLoading: false,
      statusName: '',
      subStatusName: '',
      msg: null,
      reload: true,
      actAmnt: 0,
      estimatedCost: 0,
      paybleAmnt: 0
    };
  }
  componentDidMount(props){
    const {params} = this.props.navigation.state
    this.props.getReqSale(params.trip_hdr_id)
    .then(()=>{
      console.log('firsttime')
      this.onScreenLoad();
    });

    this.props.getStatus("21","NA")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getReqTypeSale(global.USER.designation,global.USER.grade)  
    
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        if(this.state.reload) {
          this.props.getReqSale(params.trip_hdr_id)
          .then(()=>{
            console.log('reload'+this.state.reload)
            this.onScreenLoad();
          });
        }
      }
    );
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
    });
  }  
  setClaimAcrd() {
    this.setState({
      claimAcrd: this.state.claimAcrd == 0?1:0
    });
  }

  handleMsg = (text) => {
    this.setState({
      msg:text,
    })
  }

  onScreenLoad=()=> {
    let tot = 0;
    let estTot = 0;
    let totPaybleAmnt = 0;
    let data = this.props.reqListSales.dataSource;
    AsyncStorage.getItem("ONSCREENLOAD")
    .then(()=>{
      for (var i=0; i<data.length; i++) {
        if(data[i].delete_status == 'false') {
          tot = tot + parseFloat((data[i].claimamount && data[i].amount_mode != '')?parseFloat(data[i].claimamount):0)
          estTot = estTot + parseFloat((data[i].amount_mode && data[i].amount_mode != 'On Actual')
                  ?parseFloat(data[i].amount_mode):0);
          totPaybleAmnt = totPaybleAmnt + parseFloat((data[i].claimamount && (data[i].claimamount != ''))
                  ?parseFloat(data[i].claimamount):0);
        }
        /*if(data[i].status_id != '20') {
          this.setState({
            saveActive: true,
            submitActive: false
          })
        }*/
      }
    })
    .then(()=>{
      this.setState({
        actAmnt: tot,
        estimatedCost: estTot,
        paybleAmnt: totPaybleAmnt
      });
    });
  }

  deleteConfirmation(e) {
    Alert.alert(
      'Delete Requistion',
      'Are you sure to Delete this Requistion?',
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

  removeItem(e) {
    const {params} = this.props.navigation.state;
    let newData = [];
    let deleteData = e;
    this.setState({
      isLoading: true
    });

    AsyncStorage.getItem("ASYNC_STORAGE_SUBMIT_DATA")
    .then(() => {
      deleteData.delete_status = "true"
    })
    .then(() => {
      this.props.deleteReqSale([deleteData])
      .then(() => {
        this.props.getReqSale(params.trip_hdr_id)
        .then(()=>{
          this.setState({
            isLoading: false
          });
        })
        .then(() => {
          Toast.show('Requisition deleted.', Toast.LONG);
        });
      });
    })
  }

  submitData() {
    const {params} = this.props.navigation.state;
    this.setState({
      isLoading: true
    });
    let dataList = this.props.reqListSales.dataSource;
    let tourData = params

    AsyncStorage.getItem("ASYNC_STORAGE_SUBMIT_DATA")
    .then(() => {
      for(var i=0; i<dataList.length; i++) {
        if(
          (parseInt(dataList[i].status_id) == 7 && (dataList[i].sub_status_id == '7.1' || dataList[i].sub_status_id == '7.2') ) ||
          (parseInt(dataList[i].status_id) == 11 && dataList[i].sub_status_id == '11.1' ) && dataList[i].delete_status == 'false'
        ) {
          this.setState({
            isSubmit: false
          });
          Alert.alert(
            'Warning',
            'You cannot submit tour plan until you did not choose any flight given by travel agent',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
            {cancelable: true},
          )
          break
        } else if (dataList[i].delete_status == 'false'){
          dataList[i].status_id = 21;
          dataList[i].sub_status_id = 'NA';
          dataList[i].status = this.state.statusName;
          dataList[i].sub_status = this.state.subStatusName;
        }
      }
      tourData.status_id = '21';
      //tourData.sub_status_id = 'NA';
      tourData.status = this.state.statusName;
      //tourData.sub_status = this.state.subStatusName;
      tourData.pending_with = global.USER.supervisorId;
      tourData.pending_with_name = global.USER.supervisorName;
      tourData.pending_with_email = global.USER.supervisorEmail;
      tourData.estimated_cost = this.state.estimatedCost;
      tourData.actual_claim_amount = this.state.actAmnt;
      tourData.claimpaybleamount = this.state.paybleAmnt;
    })
    .then(()=>{
      this.props.updtClaimReq(dataList)
      .then(()=>{
        this.props.postPjpClaimTot([tourData])
        .then(()=>{
          this.props.getPjpClaim(global.USER.userId,[9, 11, 19, 20, 21, 22, 23, 24, 25])
          .then(()=>{
            this.setState({
              isLoading: false
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            Toast.show('Expenses Submit Successfully', Toast.LONG);
          });
        })
      })
    })
  }

  render() {
    const {params} = this.props.navigation.state
    if(this.props.reqTypeSale.isLoading || this.props.reqListSales.isLoading || 
      this.props.statusResult.isLoading || this.state.isLoading){
      return(
        <Loader/>
      )
    }else if( this.props.reqTypeSale.errorStatus || this.props.reqListSales.errorStatus || this.props.statusResult.errorStatus){
      return(
        <Text>URL Error</Text>
      )
    } else{
    console.log(params)
    var sortList = this.props.reqListSales.dataSource;
    sortList.sort((a,b) => b.req_hdr_id - a.req_hdr_id);
    return (
      <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.title} onPress={()=>{this.setAcrdVisible()}}>
          <Text style={styles.titleText}>Tour Plan</Text>
          <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"md-add-circle":"md-remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.acrdVisible==0?'none':'flex'}}>
          <TouchableOpacity style={styles.addBtn} onPress={() => {this.setModalVisible(1);}}>
            <LinearGradient
              style={styles.addBtnBg}
              colors={["#ff4813", "#fd6337"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
              <Icon name='ios-add-circle-outline' style={styles.addBtnIcon} />
              <Text uppercase={false} style={styles.addBtnText}>ADD LINE ITEM</Text>
            </LinearGradient>
          </TouchableOpacity>
          {this.props.reqListSales.dataSource.length > 0 ?
            sortList.map((item, index) => {
            return (
              item.delete_status != "true" ?
              this.renderItem(item,index,params)
              :null
            );
            })
            :
            <Text style={styles.noReqMsg}>You don't have any Requisition.</Text>
          } 
        </View>

        <TouchableOpacity style={styles.title}
          onPress={()=>{this.setClaimAcrd()}}>
          <Text style={styles.titleText}>Claim Details</Text>
          <Icon style={styles.acrdIcon} name={this.state.claimAcrd==0?"add-circle":"remove-circle"} />
        </TouchableOpacity>
        <View style={{display:this.state.claimAcrd==0?'none':'flex'}}>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Cost:</Text>
            <Text style={styles.value}>{this.state.estimatedCost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim amount:</Text>
            <Text style={styles.value}>{this.state.actAmnt}</Text>
          </View>          
          <View style={styles.row}>
            <Text style={styles.label}>Actual Payable Amount:</Text>
            <Text style={styles.value}>{this.state.paybleAmnt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Currency:</Text>
            <Text style={styles.value}>{params.actual_claim_currency?params.actual_claim_currency:'INR'}</Text>
          </View>
          <View style={[styles.row,styles.noRow]}>
            <Text style={styles.label}>Justification :</Text>
            <TextInput 
              multiline
              numberOfLines={2}
              placeholder='Enter your Justification'
              underlineColorAndroid = 'transparent'
              style={[styles.value,styles.input]}
              onChangeText={this.handleMsg}
              value={this.state.msg}
              />
          </View>
        </View>         

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible===1}
          onRequestClose = {() => {this.setModalVisible(0)}}>
          <View style={styles.modalWraper}>
            <TouchableOpacity style={styles.modalOverlay}
              onPress={() => {this.setModalVisible(0)}}>
              <Text>&nbsp;</Text>
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Requisition Type:</Text>
              </View>
              <ScrollView>
              {this.props.reqTypeSale.dataSource.map((item, index) => {
              return (
              <TouchableOpacity style={styles.modalItem}
                key= {index}
                onPress={() => this.setState({modalVisible: 0}, 
                  () => this.props.navigation.navigate('SalesClaimReq',{item, params, 'update':false,'estCost':this.state.estimatedCost,'actAmnt':this.state.actAmnt})
                )}>
                <Text style={styles.modalItemText}>{item.category}</Text>
              </TouchableOpacity>
              );
              })}
              </ScrollView>             
            </View>
          </View>
        </Modal>     
      </ScrollView>
      
      <TouchableOpacity style={styles.ftrBtn} onPress={() => {this.submitData();}}>
        <LinearGradient
          style={styles.ftrBtnBg}
          colors={["#0066b3", "#740bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          >
          <Text uppercase={false} style={styles.ftrBtnText}>
            <Icon name='md-done-all' style={styles.ftrBtnIcon} />&nbsp;&nbsp;
            SUBMIT
          </Text>
        </LinearGradient>
      </TouchableOpacity>
        
      
    </>
    );
    }
  }

  getItem = (mode) => {
    for(var i=0; i<this.props.reqTypeSale.dataSource.length; i++) {
      if(this.props.reqTypeSale.dataSource[i].category_id == mode) {
        return this.props.reqTypeSale.dataSource[i];
        break;
      }
    }
  }

  renderItem = (data,index,params) => {
    let item = this.getItem(data.mode)
    let mode = parseInt(data.mode)
    let showField = (mode == 1 || mode == 2 || mode == 8 || mode == 9 || mode == 10 || mode == 11 || mode == 12 || mode == 18 || mode == 19)?false:true;
    if(data.status_id == 0 || data.status_id == 19 || data.sub_status_id == '6.1' || data.mode == '-1') {
      return <TouchableOpacity 
        key={index} 
        style={[styles.cardItem,styles.cardItemIntd]}
        onPress={() => {this.setModalVisible(1);}}>
        <TouchableOpacity style={styles.cardItemIntdBtn}
          onPress={()=>this.deleteConfirmation(data)}
          >
          <Icon name='md-close-circle' style={styles.cardItemIntdBtnIco} />
        </TouchableOpacity>
        <Text style={styles.cardTile}>{(data.sub_status && data.sub_status != 'NA')?data.sub_status:data.status}</Text>
        <Icon name="md-arrow-round-forward" style={styles.arrowbtn}/>
      </TouchableOpacity>
    } else {
    return <TouchableOpacity 
      key={index} 
      style={styles.cardItem}
      onPress={(data.flight_selected == 'Y')
        ?() => this.props.navigation.navigate('AirReqSalesClaim',{item, params, 'update':data,'estCost':this.state.estimatedCost,'actAmnt':this.state.actAmnt})
        :() => this.props.navigation.navigate('SalesClaimReq',{item, params, 'update':data,'estCost':this.state.estimatedCost,'actAmnt':this.state.actAmnt})
      }>
      <View style={styles.cardItemHeader}>
        <TouchableOpacity style={styles.actionBtn}  onPress={()=>this.deleteConfirmation(data)}
          >
          <Icon name='trash' style={styles.actionBtnIco} />
        </TouchableOpacity>
        <Text style={styles.cardTile}>{data.mode_name?data.mode_name:''}</Text>
        <Icon name="md-arrow-round-forward" style={styles.arrowbtn}/>
      </View>
      <View style={styles.cardBody}>
        {data.pjp_date ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Date:</Text>
          <Text style={styles.cardValue}>{moment(data.pjp_date).format(global.DATEFORMAT)}</Text>
        </View>:null}
        {(data.source_city_name && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>From:</Text>
          <Text style={styles.cardValue}>{data.source_city_name}</Text>
        </View> : null }
        {(data.dest_city_name && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>To:</Text>
          <Text style={styles.cardValue}>{ data.dest_city_name }</Text>
        </View>:null}
        {(data.distance && showField)?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Distance:</Text>
          <Text style={styles.cardValue}>{ data.distance }</Text>
        </View>: null}
        {(data.claimactualdistance && showField)?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Actual Distance:</Text>
          <Text style={styles.cardValue}>{ data.claimactualdistance }</Text>
        </View>: null}
        {(data.claimdeparturetime && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Departure Time:</Text>
          <Text style={styles.cardValue}>{ data.claimdeparturetime }</Text>
        </View>: null}
        {(data.claimarrivaltime && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Arrival Time:</Text>
          <Text style={styles.cardValue}>{ data.claimarrivaltime }</Text>
        </View>: null}
        {(data.claimtotaltime && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Total Time:</Text>
          <Text style={styles.cardValue}>{ data.claimtotaltime }</Text>
        </View>: null}
        {(data.dayCalculation && showField) ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Day:</Text>
          <Text style={styles.cardValue}>{ data.dayCalculation }</Text>
        </View>: null}
        {data.amount_mode ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Requisition Amount:</Text>
          <Text style={styles.cardValue}>{ data.amount_mode }</Text>
        </View>: null}
        { data.claimamount ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Claim Amount:</Text>
          <Text style={styles.cardValue}>{ data.claimamount }</Text>
        </View>: null}
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Deduction Amount:</Text>
          <Text style={styles.cardValue}>{ data.claimdeductionamount?data.claimdeductionamount:0 }</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Payable Amount:</Text>
          <Text style={styles.cardValue}>{ data.claimpaybleamount?data.claimpaybleamount:data.claimamount}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Out of Policy:</Text>
          <Text style={styles.cardValue}>{
            parseFloat(data.claimamount) > parseFloat(data.amount_mode) ? 'Yes' : 'No'
          }</Text>
        </View>
        
        { (data.sub_status && data.sub_status != 'NA') ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Status:</Text>
          <Text style={styles.cardValue}>{ data.sub_status }</Text>
        </View>: null}
      </View>    
    </TouchableOpacity>
    }
  }
};

mapStateToProps = state => {
  return{
    reqTypeSale: state.reqTypeSale,
    reqListSales: state.reqListSales,
    deleteReqSaleState: state.deleteReqSaleState,    
    statusResult: state.statusResult,
    updtClaimReqState: state.updtClaimReqState,
    updatePjpTotState: state.updatePjpTotState,
    pjpClaimTot: state.pjpClaimTot,
    pjpClaims: state.pjpClaims
  };
};

mapDispatchToProps = {
  getReqTypeSale : Actions.getReqTypeSale,
  getReqSale : Actions.getReqSale,
  deleteReqSale: Actions.deleteReqSale,
  getStatus: Actions.getStatus,
  updatePjpTot: Actions.updatePjpTot,
  updtClaimReq: Actions.updtClaimReq,
  postPjpClaimTot: Actions.postPjpClaimTot,
  getPjpClaim : Actions.getPjpClaim
};
export default connect(mapStateToProps, mapDispatchToProps)(PjpClaimInfoScreen);