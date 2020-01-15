import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Modal, TextInput, Alert, Image, FlatList } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import Ficon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'
import moment from 'moment'
import RNFetchBlob from 'rn-fetch-blob'

import {Purpose, For, ReqType} from '../Components/GetValue'
import Loader from '../Components/Loader'
import styles from './Styles/AprvExpnsClaimPendInfoScreen'

const STAT_IMG = 'https://qph.fs.quoracdn.net/main-qimg-2fbdde5788e73478a08dc4bf338eee02.webp'

class AprvExpnsClaimPendInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      claimAcrd: 0,
      advAcrd: 0,
      updateParams: '',
      changeStatusDone: false,
      rejComment: '',
      isLoading: true,
      attachData: null,
      downloadLoading: false,
      planList:[]
    };
  }

  componentDidMount(props){
    let tripHdrId = this.props.navigation.state.params.trip_hdr_id;
    this.props.getPlans(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      for(var i=0; i<this.props.plans.dataSource.length; i++) {
        let newwPlanData= this.props.plans.dataSource[i]
        this.props.getAttachment(tripHdrId,this.props.plans.dataSource[i].trip_no,this.props.plans.dataSource[i].lineitem)
        .then(()=>{
          this.state.planList.push({
            "sl":i,
            "attachment":this.props.attachment.dataSource,
            "planData": newwPlanData
          })
        });
      }
    })
    .then(()=>{
      this.setState({isLoading: false});
    });
    this.props.getReqName(global.USER.designation,global.USER.grade);
  }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  attachModalVisible(value){
    this.setState({attachData: value});
  }

  setClaimAcrd() {
    this.setState({
      claimAcrd: this.state.claimAcrd == 0?1:0
    });
  }
  setAdvAcrd() {
    this.setState({
      advAcrd: this.state.advAcrd == 0?1:0
    });
  }

  changeStatus() {
    this.setState({ 
      isLoading: true,
      modalVisible: false
    });
    const {params} = this.props.navigation.state;
    let newParams = params;
    newParams.status_id = "22";
    newParams.status = "Expense Claim - Approved by Approver";
    newParams.pending_with = global.USER.financerId;
    newParams.pending_with_name = global.USER.financerName;
    newParams.pending_with_email = global.USER.financerEmail;
    this.setState({
      updateParams:newParams,
      changeStatusDone: true
    });
  }

  changeRejStatus() {
    this.setState({ 
      isLoading: true,
      modalVisible: false
    });
    const {params} = this.props.navigation.state;
    let newParams = params;
    newParams.status_id = "23";
    newParams.status = "Expense Claim - Rejected by Approver";
    newParams.pending_with = global.USER.financerId;
    newParams.pending_with_name = global.USER.financerName;
    newParams.pending_with_email = global.USER.financerEmail;
    newParams.comment = this.state.rejComment;
    this.setState({
      updateParams:newParams,
      changeStatusDone: true
    });
  }

  approveTripNonReq() {
    this.changeStatus();
    if(this.state.changeStatusDone) {
      this.props.postExpAprv(this.state.updateParams)
      .then(()=>{
        this.props.getExpPendApr("21");
        this.props.getCostCentre(global.COSTCENTRE);
        this.props.navigation.navigate('ApproveNoneSaleExpenses');
        Toast.show('Expense Claim Approved Successfuly', Toast.LONG);
        console.log('Approve Done');
      });
    }
  }

  rejectTripNonReq() {
    this.changeRejStatus();
    if(this.state.changeStatusDone) {
      this.props.postExpAprv(this.state.updateParams)
      .then(()=>{
        this.props.getExpPendApr("21");
        this.props.getCostCentre(global.COSTCENTRE);
        this.props.navigation.navigate('ApproveNoneSaleExpenses');
        Toast.show('Expense Claim Rejected Successfuly', Toast.LONG);
        console.log('Reject Done');
      });
    }
  }

  approveConfirmation(e) {
    Alert.alert(
      'Approve Trip',
      'Are you sure to Approve this Advance Payment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.approveTripNonReq()
        },
      ],
      {cancelable: true},
    )
  };

  rejectConfirmation(e) {
    if(this.state.rejComment.length<1) {
      Alert.alert(
        'Feild Required',
        'Please enter reject comment.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      )
    } else {
      Alert.alert(
        'Reject Trip',
        'Are you sure to Reject this Advance Payment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.rejectTripNonReq()
          },
        ],
        {cancelable: true},
      )
    }
  };

  handleRejComment = (text) => {
    this.setState({ rejComment: text })
  }

  downloadAttachment=(file)=> {
    this.downloadImage (file);
    this.setState({downloadLoading: true});
  }

  downloadImage = (file) => {
    var date = new Date();
    var image_URL = file;
    var ext = this.getExtention(image_URL);
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: PictureDir + "/Emami/image_" + Math.floor(date.getTime()
          + date.getSeconds() / 2) + ext,
        description: 'Image'
      }
    }
    config(options).fetch('GET', image_URL).then((res) => {
      Alert.alert("File Downloaded Successfully.");      
      this.attachModalVisible(null);
      this.setState({downloadLoading: false});
    });
  }
 
  getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }
  getFilename = (filename) => {
    return (/[/]/.exec(filename)) ? /[^/]+$/.exec(filename) :
      undefined;
  }

  setReqName=(value)=>{
    for(var i=0; i<this.props.reqName.dataSource.length; i++) {
      if(this.props.reqName.dataSource[i].sub_category_id == value) {
        return (
          this.props.reqName.dataSource[i].sub_category
        );
        break
      }
    }
  }
  viewDetails=(value)=>{
    for(var i=0; i<this.props.reqName.dataSource.length; i++) {
      if(this.props.reqName.dataSource[i].sub_category_id == value) {
        return (
          this.props.reqName.dataSource[i].bill_required=="Y"?true:false
        );
        break
      }
    }
  }

  render() {
    if(this.state.isLoading 
      || this.props.plans.isLoading 
      || this.props.reqName.isLoading
      || this.props.attachment.isLoading){
      return(
          <Loader/>
      )
    } else if (this.props.plans.errorStatus) {
      return (
        <Text>URL Error</Text>
      )
    } else {
    const {params} = this.props.navigation.state;
    //console.log(this.state.planList.length);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setAdvAcrd()}}>
            <Text style={styles.acrdTitle}>View Advance Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.advAcrd==0?"md-add-circle":"md-remove-circle"} />
          </TouchableOpacity>
          <View style={[styles.accordionBody,{display:this.state.advAcrd==0?'none':'flex'}]}>
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Cost:</Text>
              <Text style={styles.value}>{params.estimated_cost}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Advance Required:</Text>
              <Text style={styles.value}>{params.payment_amount?params.payment_amount:'0'}</Text>
            </View>
            <View style={[styles.row, styles.lastRow]}>
              <Text style={styles.label}>Pupose:</Text>
              <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            </View>
            {/*}
            <Text style={styles.subTitle}>ON HOLD DETAILS</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Onhold amount:</Text>
              <Text style={styles.value}>Pending</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Trip Id:</Text>
              <Text style={styles.value}>Pending</Text>
            </View>
            <View style={[styles.row, styles.lastRow]}>
              <Text style={styles.label}>Justification:</Text>
              <Text style={styles.value}>Pending</Text>
            </View>
            */}
          </View>
          
          <TouchableOpacity style={styles.accordionHeader}
            onPress={()=>{this.setClaimAcrd()}}>
            <Text style={styles.acrdTitle}>View Trip Details</Text>
            <Icon style={styles.acrdIcon} name={this.state.claimAcrd==0?"md-add-circle":"md-remove-circle"} />
          </TouchableOpacity>
          <View style={[styles.accordionBody, styles.lastRow,{display:this.state.claimAcrd==0?'none':'flex'}]}>
            <View style={styles.row}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>{moment(params.start_date).format(global.DATEFORMAT)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>{moment(params.end_date).format(global.DATEFORMAT)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destination From:</Text>
              <Text style={styles.value}>{params.trip_from}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destination To:</Text>
              <Text style={styles.value}>{params.trip_to}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Purpose:</Text>
              <Text style={styles.value}><Purpose value={params.purpose} /></Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Trip For:</Text>
              <Text style={styles.value}><For value={params.trip_for} /></Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Traveler Name:</Text>
              <Text style={styles.value}>{params.name}</Text>
            </View>
            <View style={[styles.row,styles.rowLast]}>
              <Text style={styles.label}>Details:</Text>
              <Text style={styles.value}>{params.details}</Text>
            </View>
            {this.props.plans.dataSource.length>0 ?
            <Text style={styles.subTitle}>EXPENSES DETAILS</Text>
            :null}
            {this.props.plans.dataSource.length == this.state.planList.length ?
              this.state.planList.map((item, index) => {
                return (
                  this.renderItem(item,index)
                );
              }):null
            }
          </View>
          
          <View style={styles.accordionHeader}>
            <Text style={styles.acrdTitle}>Claim Summary</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimatedd Cost:</Text>
            <Text style={styles.value}>{params.estimated_cost?params.estimated_cost:0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Advance Amount:</Text>
            <Text style={styles.value}>{params.payment_amount?params.payment_amount:0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim Amount:</Text>
            <Text style={styles.value}>{params.actual_claim_amount?params.actual_claim_amount:0}</Text>
          </View> 
          <View style={styles.row}>
            <Text style={styles.label}>Actual Claim Currency:</Text>
            <Text style={styles.value}>{params.actual_claim_currency}</Text>
          </View> 
          <View style={styles.row}>
            <Text style={styles.label}>Justification:</Text>
            <Text style={styles.value}>{params.claim_comment}</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.ftrBtn}
            onPress={() => {this.setModalVisible(true);}}
            >
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#e63826', '#fb4b7b']} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Reject</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.ftrBtn}
            onPress={()=>this.approveConfirmation(params)}
            >
            <LinearGradient 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              colors={['#5ba11c', '#92d40a']} 
              style={styles.ftrBtnBg}>
              <Text style={styles.ftrBtnTxt}>Approve</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false)}}>
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Reject comment:</Text>
            <TextInput 
              multiline
              numberOfLines={4}
              style={styles.modalInput}
              underlineColorAndroid="transparent"
              onChangeText={this.handleRejComment}
              />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn,styles.modalBtnDngr]}
                onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                <Text style={[styles.mBtntxt,styles.mBtntxtDanger]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn,styles.modalBtnPrimary]}
                onPress={
                  () => { this.setModalVisible(!this.state.modalVisible); },
                  ()=>this.rejectConfirmation(params)
                }>
                <Text style={[styles.mBtntxt,styles.mBtntxtPrimary]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.attachData? true : false}
          onRequestClose = {() => {this.attachModalVisible(null)}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Attachment</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modaCmntlBody}>
            {this.state.downloadLoading ?
              <Loader/>
            :<View>
            {(this.getExtention(this.state.attachData) == 'webp' ||
              this.getExtention(this.state.attachData) == 'png' ||
              this.getExtention(this.state.attachData) == 'jpg' ||
              this.getExtention(this.state.attachData) == 'jpeg' ||
              this.getExtention(this.state.attachData) == 'bmp' ||
              this.getExtention(this.state.attachData) == 'gif'
            ) ?
              <Image source={{uri:this.state.attachData}} 
                style={styles.atchMdlImg} 
                resizeMode='contain' />
            :<Icon name="ios-paper" style={styles.atchMdlImgIcon} />}
            <Text style={styles.atchMdlImgName}>{this.getFilename(this.state.attachData)}</Text>
            </View>}
          </ScrollView>
          <View style={styles.modalCmntFooter}>
            <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnDanger]}
              onPress={() => {this.attachModalVisible(null)}}>
              <Text style={styles.modaCmntlBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnPrimary]}
              onPress={() => {this.downloadAttachment(this.state.attachData)}}>
              <Text style={styles.modaCmntlBtnText}>Download</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </View>
    );
  }
  }

  renderItem = (data,index) => {
    if (data.planData.delete_status == "false") {
    return <TouchableOpacity 
      key={index} 
      style={styles.cardItem} 
      onPress={() => 
        this.viewDetails(data.planData.req_type)?
        this.props.navigation.navigate('ReqInfo',data.planData)
        :null
      }>
      <View style={styles.cardItemHeader}>
        {data.planData.req_type=='1' ?
        <Icon style={styles.cardTileIcon} name="ios-airplane" />
        : data.planData.req_type=='10' ?
        <Icon style={styles.cardTileIcon} name="ios-car" />
        : data.planData.req_type=='11' ?
        <Icon style={styles.cardTileIcon} name="md-car" />
        : data.planData.req_type=='3' ?
        <Ficon style={styles.cardTileIcon} name="subway" />
        : data.planData.req_type=='1BH' ?
        <Ficon style={styles.cardTileIcon} name="hotel" />
        : data.planData.req_type=='1BM' ?
        <Icon style={styles.cardTileIcon} name="ios-train" />
        : data.planData.req_type=='1BNM' ?
        <Ficon style={styles.cardTileIcon} name="road" />
        : null
        }
        <Text style={styles.cardTile}>{this.setReqName(data.planData.req_type)}</Text>
        {this.viewDetails(data.planData.req_type)?
        <Icon name="ios-arrow-round-forward" style={styles.forwardIcon}></Icon>
        :null}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Start Date:</Text>
          <Text style={styles.cardValue}>{moment(data.planData.start_date).format(global.DATEFORMAT)}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>End Date:</Text>
          <Text style={styles.cardValue}>{moment(data.planData.end_date).format(global.DATEFORMAT)}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Status:</Text>
          <Text style={styles.cardValue}>{data.planData.status}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Amount:</Text>
          <Text style={styles.cardValue}>{data.planData.amount?data.planData.amount:'0'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Extra Amount:</Text>
          <Text style={styles.cardValue}>{data.planData.extra_amount?data.planData.extra_amount:'0'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Out Of Policy:</Text>
          <Text style={styles.cardValue}>{data.planData.is_outof_policy=="Y"?"Yes":"No"}</Text>
        </View>
        {/*data.attachment.length > 0 ?
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Attachment:</Text>
          <View style={styles.cardValueCol}>
            <FlatList
              data={data.attachment}
              keyExtractor={(item, index) => index.toString() }
              horizontal= {true}
              renderItem={({ item }) => <TouchableOpacity style={styles.atchLink} key={index}
                  onPress={() => {this.attachModalVisible(item.file_path);}}>
                  {(this.getExtention(item.file_name) == 'webp' ||
                    this.getExtention(item.file_name) == 'png' ||
                    this.getExtention(item.file_name) == 'jpg' ||
                    this.getExtention(item.file_name) == 'jpeg' ||
                    this.getExtention(item.file_name) == 'bmp' ||
                    this.getExtention(item.file_name) == 'gif'
                  ) ?
                  <Image source={{uri:item.file_path}} style={styles.atchImg} resizeMode='contain' />
                  :<Icon name="ios-paper" style={styles.atchImgIcon} />}            
                </TouchableOpacity>}
            />
          </View>
        </View>:null*/}
      </View>    
    </TouchableOpacity>
    } else {
      <View style={[{display:'none'}]}></View>
    }
  };

}

const mapStateToProps = state => {
  return {
    reqName: state.reqName,
    expAprv: state.expAprv,
    plans: state.plans,
    costCentre: state.costCentre,
    aprExpPend: state.aprExpPend,
    attachment: state.attachment
  };
};

const mapDispatchToProps = {
  getReqName: Actions.getReqName,
  postExpAprv : Actions.postExpAprv,
  getExpPendApr : Actions.getExpPendApr,
  getCostCentre : Actions.getCostCentre,
  getPlans : Actions.getPlans,
  getAttachment: Actions.getAttachment
};

export default connect(mapStateToProps, mapDispatchToProps)(AprvExpnsClaimPendInfoScreen);