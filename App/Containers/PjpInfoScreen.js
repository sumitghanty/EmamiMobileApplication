import React, { Component } from 'react'
import { ScrollView, View,TouchableOpacity, Alert, Text, Modal, AsyncStorage} from 'react-native'
import { Button, Icon} from 'native-base';
import {Purpose, For} from '../Components/GetValue'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import Loader from '../Components/Loader'
import styles from './Styles/PjpInfoScreen'
import { connect } from 'react-redux'

class PjpInfoScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      acrdVisible: 0,
      modalVisible: 0,
      isLoading: false,
      statusName: '',
      subStatusName: '',
      reload: false,
      actAmnt: 0,
      isSubmit: true
    };
  }
  componentDidMount(props){
    const {params} = this.props.navigation.state
    this.props.getReqSale(params.trip_hdr_id)
    .then(()=>{
      console.log('firsttime')
      this.onScreenLoad();
    });

    this.props.getStatus("8","8.1")
    .then(()=>{
      this.setState({
        statusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        subStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });

    this.props.getReqTypeSale(global.USER.grade) 
    
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

  onScreenLoad=()=> {
    let tot = 0;
    let data = this.props.reqListSales.dataSource;
    AsyncStorage.getItem("ONSCREENLOAD")
    .then(()=>{
      for (var i=0; i<data.length; i++) {
        if(data[i].delete_status != 'true') {
          tot = tot + parseFloat((!data[i].amount_mode || data[i].amount_mode =="On Actual")?0 :parseInt(data[i].amount_mode))
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
      });
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
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
          for(var i=0; i<this.props.reqListSales.dataSource.length; i++) {
            if(this.props.reqListSales.dataSource[i].delete_status == 'false') {
              newData.push(this.props.reqListSales.dataSource[i])
            }
          }
        })
        .then(()=>{
          this.props.updtReqSale(newData)
          .then(()=>{
            this.props.pjpTotal(newData)
            .then(()=>{
              this.setState({
                isLoading: false
              });
            })
          })
        })        
      })
      .then(() => {
        Toast.show('Requisition deleted.', Toast.LONG);
      });
    });
  }

  submitRequest() {
    let dataList = this.props.reqListSales.dataSource;
    let shouldSubmit = true;
    let msg = "";
    AsyncStorage.getItem("ASYNC_STORAGE_SHOULD_SUBMIT")
    .then(()=>{
      for(var i=0; i<dataList.length; i++) {
        if(dataList[i].mode < 0 && dataList[i].delete_status == 'false') {
          Alert.alert(
            '',
            'One or more Requisition is not complete. Please check and complete that.',
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ],
            {cancelable: true},
          );
          shouldSubmit = false
          break;
        } else {
          shouldSubmit = true
        }
        if( (dataList[i].scenario == "2" || dataList[i].scenario == "3") && dataList[i].mode == "7" && dataList[i].isApproved ==  null)
                 msg = "emergency";
      }
      if(msg == "emergency") msg ="One or more of Air Travel requests belong to Emergency category.Requests raised 5-14 days before travel will require approval from immediate supervisor. Requests raised 0-5 days before travel will require further approval from supervisor's supervisor"

    })
    .then(()=>{
      if(shouldSubmit) {
        this.submitData(msg);
      } else {

      }
    })
    
  }

  submitData(msg) {
    //alert('submitData');
    const {params} = this.props.navigation.state
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
            isSubmit: false,
            isLoading: false
          });
          Alert.alert(
            'Warning',
            'You cannot submit tour plan until you choose any flight given by travel agent',
            [
              {
                text: 'Ok',
                style: 'cancel',
              }
            ],
            {cancelable: true},
          )
          break
        } else if (dataList[i].delete_status == 'false'){
          dataList[i].status_id = 8;
          dataList[i].sub_status_id = '8.1';
          dataList[i].status = this.state.statusName;
          dataList[i].sub_status = this.state.subStatusName;
        }
      }
      tourData.status_id = 8;
      tourData.sub_status_id = '8.1';
      tourData.status = this.state.statusName;
      tourData.sub_status = this.state.subStatusName;
      tourData.estimated_cost = this.state.actAmnt;
      tourData.pending_with = global.USER.supervisorId;
      tourData.pending_with_name = global.USER.supervisorName;
      tourData.pending_with_email = global.USER.supervisorEmail;
    })
    .then(()=>{
      if(this.state.isSubmit) {

        //alert(JSON.stringify(dataList));
      //this.props.updtReqSale([])
      this.props.updtReqSale(dataList)
        .then(()=>{
         this.props.updatePjpTot([tourData])
         //this.props.updatePjpTot([])
          .then(()=>{
            this.props.getPjp(global.USER.userId);
          })
          .then(()=>{
            this.setState({
              isLoading: false
            });
          })
          .then(()=>{
            this.props.navigation.goBack();
            if(msg == "")
            Toast.show('Tour Submitted Successfully', Toast.LONG);
             else Toast.show('Tour Submitted Successfully.'+msg, Toast.LONG);
          });
        })
      } else {
        console.log('one or more requisition sent to travel agent.')
      }
    })
  }
  formatYear(year,month){
   // alert(year);
    if(month==="January" || month==="February" || month==="March")
    {
      return parseInt(year)+1;
    }else return year;
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
    //console.log(params)
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
          {params.year ?
          <View style={styles.row}>
            <Text style={styles.label}>PJP Year</Text>
            <Text style={[styles.value,styles.readonly]}>{this.formatYear(params.year, params.month)}</Text>

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
        
        <View style={styles.titleHeader}>
          <Text style={styles.listTitle}>Requisition Details</Text>
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
        </View>


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
                onPress={() => { 
                  this.setState({modalVisible: 0, reload: true});
                  this.props.navigation.navigate('SalesReq',{item, params, 'update':false,'estCost':this.state.actAmnt})
                }}>
                <Text style={styles.modalItemText}>{item.category}</Text>
              </TouchableOpacity>
              );
              })}
              </ScrollView>             
            </View>
          </View>
        </Modal>     
      </ScrollView>
      
      <TouchableOpacity style={styles.ftrBtn} onPress={() => {this.submitRequest();}}>
        <LinearGradient
          style={styles.ftrBtnBg}
          colors={["#0066b3", "#740bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          >
          <View style={styles.estAmntWraper}>
            <Text style={styles.estAmntLabel}>Estimated Amount</Text>
            <Text style={styles.estAmntValue}>{this.state.actAmnt}</Text>
          </View>
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
    if(/*data.status_id == 0 || data.sub_status_id == '6.1'*/ parseInt(data.mode) < 0) {
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
      onPress={
        (
          ((parseInt(data.status_id) == 7 /*&& (data.sub_status_id == '7.1' || data.sub_status_id == '7.2' || 
          ((data.sub_status_id == '7.4' || data.sub_status_id == '7.3') && data.flight_selected == 'Y'))*/ ) ||
          data.sub_status_id == '11.1' || data.sub_status_id == '9.1' || data.sub_status_id == '8.1') && parseInt(data.mode) == 7
        )
        ?() => this.props.navigation.navigate('AirReqSales',{item, params, 'update':data,'estCost':this.state.actAmnt})
        :() => this.props.navigation.navigate('SalesReq',{item, params, 'update':data,'estCost':this.state.actAmnt})
        }>
      <View style={styles.cardItemHeader}>
        <Text style={styles.cardTile}>{data.mode_name?data.mode_name:''}</Text>
        <Icon name="md-arrow-round-forward" style={styles.arrowbtn}/>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          {data.pjp_date ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Date:</Text>
            <Text style={styles.cardValue}>{moment(data.pjp_date).format(global.DATEFORMAT)}</Text>
          </View>:null}
          {data.source_city_name ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>From:</Text>
            <Text style={styles.cardValue}>{data.source_city_name}</Text>
          </View> : null }
          { data.dest_city_name ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>To:</Text>
            <Text style={styles.cardValue}>{ data.dest_city_name }</Text>
          </View>:null}
          { data.distance ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Distance:</Text>
            <Text style={styles.cardValue}>{ data.distance }</Text>
          </View>: null}
          {data.twoWay == 'true' ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Local Conveyance - Two way Trip:</Text>
            <Text style={styles.cardValue}>{ data.twoWay == 'true' ? 'Two way' : '' }</Text>
          </View>: null}
          { data.amount_mode ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Requisition Amount:</Text>
            <Text style={styles.cardValue}>{ data.amount_mode }</Text>
          </View>: null}
          { (data.sub_status && data.sub_status != 'NA') ?
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Status:</Text>
            <Text style={styles.cardValue}>{ data.sub_status }</Text>
          </View>: null}
        </View>
        <View style={styles.itemActions}>
          {( data.sub_status_id && (data.sub_status_id=="6.1" || data.sub_status_id=="7.4") ) ?
          <Button bordered small rounded danger style={styles.actionBtn}
            onPress={()=>this.deleteConfirmation(data)}
            >
            <Icon name='trash' style={styles.actionBtnIco} />
          </Button>
          :null}
          
          {/*<Button bordered small rounded primary 
            style={[styles.actionBtn, styles.mrgTop]}
            onPress={() => {}}>
            <Icon name='attach' style={styles.actionBtnIco} />
          </Button>*/}
        </View>
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
    pjpTotalState: state.pjpTotalState,
    updtReqSaleState: state.updtReqSaleState,    
    statusResult: state.statusResult,
    updatePjpTotState: state.updatePjpTotState,
    pjp : state.pjp,
  };
};

mapDispatchToProps = {
  getReqTypeSale : Actions.getReqTypeSale,
  getReqSale : Actions.getReqSale,
  deleteReqSale: Actions.deleteReqSale,
  pjpTotal: Actions.pjpTotal,
  updtReqSale : Actions.updtReqSale,
  getStatus: Actions.getStatus,
  updatePjpTot: Actions.updatePjpTot,
  getPjp : Actions.getPjp,
};
export default connect(mapStateToProps, mapDispatchToProps)(PjpInfoScreen);