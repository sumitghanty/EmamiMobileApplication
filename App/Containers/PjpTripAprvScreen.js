import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Modal, TextInput, AsyncStorage, Alert, Keyboard, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import Loader from '../Components/Loader'
import styles from './Styles/PjpTripAprvScreen'

class PjpTripAprvScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acrdVisible: 0,
      modalVisible: false,
      attachData: null,
      cmntData: null,
      rejComment: null,
      updateParams: '',
      isLoading: false,
      acrdCmntFirstVisible: 0,
      acrdCmntSecondVisible: 0,
      cmntError: null,
      reqCmntError: null,
      userComment: '',
      downloadLoading: false,
      firstComment: '',
      secondCommend: '',
      aprvStatusName: '',
      aprvSubStatusName: '',
      rejStatusName: '',
      rejSubStatusName: ''
    };
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

  setAcrdVisible() {
    this.setState({
      acrdVisible: this.state.acrdVisible == 0?1:0
    });
  }
  setAcrdCmntFirstVisible() {
    this.setState({
      acrdCmntFirstVisible: this.state.acrdCmntFirstVisible == 0?1:0
    });
  }
  setAcrdCmntSecondVisible() {
    this.setState({
      acrdCmntSecondVisible: this.state.acrdCmntSecondVisible == 0?1:0
    });
  }
  closeAcrdCmnt() {
    this.setState({
      acrdCmntFirstVisible: 0,
      acrdCmntSecondVisible: 0
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  attachModalVisible(value){
    this.setState({attachData: value});
  }
  reqCmntModalVisible(value){
    this.setState({cmntData: value});
  }

  approveConfirmation(e) {
    Alert.alert(
      'Approve Trip',
      'Are you sure to Approve this Trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.submitForm("A")
        },
      ],
      {cancelable: true},
    )
  };

  rejectConfirmation(e) {
    Alert.alert(
      'Reject PJP',
      'Are you sure to Reject this PJP?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => this.submitForm("R")
        },
      ],
      {cancelable: true},
    )
  };

  handleRejComment = (text) => {
    this.setState({ 
      rejComment: text,
      cmntError: null
    })
  }
  handleUserComment = (text) => {
    this.setState({ 
      userComment: text,
      reqCmntError: null
    })
  }
  removeCmntError=()=> {
    this.setState({ 
      reqCmntError: null,
      cmntError: null
    })
  }

  cmntSubmit() {
    if(this.state.rejComment) {
      this.rejectConfirmation();      
    } else {
      this.setState({ cmntError: "Please enter comment." })
    }
  }

  reqCmntSubmit=(value)=> {
    if(this.state.userComment) {
      this.reqCmntPost(value);      
    } else {
      this.setState({ reqCmntError: "Please enter comment." })
    }
  }

  reqCmntPost=(value)=>{
    let curReq = this.state.updateParams
    for(var i=0; i<curReq.length; i++) {
      if(curReq[i].req_hdr_id == value) {
        this.state.updateParams[i].claimSupcomment = this.state.userComment
      }
    }
    this.setState({cmntData: null});
  }

  downloadAttachment=(file)=> {
    this.downloadImage (file);
    this.setState({downloadLoading: true});
  }

  submitForm=(value)=> {
    let newParams = this.props.reqListSales.dataSource;
    AsyncStorage.getItem('ANYTHING_UNIQUE_STRING')
    .then(()=>{
      this.setState({
        isLoading: true,
        modalVisible: false
      });
      if (value == "A") {
        for(var i=0; i<newParams.length; i++) {
          newParams[i].status_id = "9";
          newParams[i].status = this.state.aprvStatusName;
          newParams[i].sub_status_id = "9.1";
          newParams[i].sub_status = this.state.aprvSubStatusName;
        }
      } else if (value == "R") {
        for(var i=0; i<newParams.length; i++) {
          newParams.status_id = "10";
          newParams[i].status = this.state.rejStatusName;
          newParams.sub_status_id = "10.1";
          newParams.sub_status = this.state.rejSubStatusName;
          newParams.vendor_comment = this.state.rejComment;
        }
      }
    })
    .then(()=>{
      this.props.postPjpAprv(this.state.updateParams)
      .then(()=>{
        this.props.getPjpAprvList(global.USER.userEmail,["2","3","4","8"]);
        this.props.navigation.navigate('PjpAprvList','tour');
        Toast.show('Tour Approved Successfuly', Toast.LONG);
        console.log('Approve Done');
      });
    });
  }

  componentDidMount(props){
    this.props.getReqSale(this.props.navigation.state.params.trip_hdr_id)
    .then(()=>{
      this.setState({
        updateParams:this.props.reqListSales.dataSource
      });
    });
    this.props.getStatus("9","9.1")
    .then(()=>{
      this.setState({
        aprvStatusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        aprvSubStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });
    this.props.getStatus("10","10.1")
    .then(()=>{
      this.setState({
        rejStatusName: this.props.statusResult.dataSource[0].trip_pjp_status,
        rejSubStatusName: this.props.statusResult.dataSource[0].sub_status
      });
    });
  }

  render() {
  if(this.state.isLoading || this.props.reqListSales.isLoading){
    return(
      <Loader/>
    )
  } else if ( this.props.reqListSales.errorStatus || this.props.pjpAprv.errorStatus) {
    return (
      <Text>URL Error</Text>
    )
  } else {
    //console.log(this.state.updateParams)
    const {params} = this.props.navigation.state;
    var sortList = this.props.reqListSales.dataSource;
    sortList.sort((a,b) => b.req_hdr_id - a.req_hdr_id);
  return(
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableOpacity style={styles.accordionHeader}
        onPress={()=>{this.setAcrdVisible()}}>
        <Text style={styles.acrdTitle}>Tour Plan</Text>
        <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"md-add-circle":"md-remove-circle"} />
      </TouchableOpacity>
      <View style={{display:this.state.acrdVisible==0?'none':'flex'}}>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>PJP Year:</Text>
          <Text style={styles.itemValue}>{params.year}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>PJP Month:</Text>
          <Text style={styles.itemValue}>{params.month}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Purpose:</Text>
          <Text style={styles.itemValue}>{params.purpose}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Trip For:</Text>
          <Text style={styles.itemValue}>{params.trip_for}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Traveler Name:</Text>
          <Text style={styles.itemValue}>{params.name}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Details:</Text>
          <Text style={styles.itemValue}>{params.comment}</Text>
        </View>
      </View>
      {sortList.length > 0 ?
      <View style={styles.titleRow}>
        <Text style={styles.title}>Requisition Details</Text>
        <View style={styles.titleRight}>
          <Text style={styles.estimatedLabel}>Estimated Amount</Text>
          <Text style={styles.estimatedValue}>INR {params.estimated_cost}</Text>
        </View>
      </View>: null}
      {sortList.length > 0 ?
        sortList.map((item, index) => {
        return (
          this.renderReq(item,index)
        );
        })
        :null
      }
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
            placeholder='Type your text'
            style={styles.modalInput}
            underlineColorAndroid="transparent"
            onChangeText={this.handleRejComment}
            />
          {this.state.cmntError?
            <Text style={styles.errorMsg}>{this.state.cmntError}</Text>
          :null}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalBtn,styles.modalBtnDngr]}
              onPress={() => { this.setModalVisible(!this.state.modalVisible), this.removeCmntError() }}>
              <Text style={[styles.mBtntxt,styles.mBtntxtDanger]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn,styles.modalBtnPrimary]}
              onPress={() => {this.cmntSubmit(); }}>
              <Text style={[styles.mBtntxt,styles.mBtntxtPrimary]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
    
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
    
    <Modal
      animationType="fade"
      transparent={false}
      visible={this.state.cmntData? true : false}
      onRequestClose = {() => {this.reqCmntModalVisible(null)}}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Comments</Text>
      </View>
      <ScrollView contentContainerStyle={styles.modaCmntlBody}>
        <TouchableOpacity style={styles.modalAccordionHeader}
          onPress={()=>{this.setAcrdCmntFirstVisible()}}>
          <Text style={styles.modalAcrdTitle}>Employee comment</Text>
          <Icon style={styles.modalAcrdIcon} name={this.state.acrdCmntFirstVisible==0?"ios-arrow-dropdown":"ios-arrow-dropup"} />
        </TouchableOpacity>
        <View style={[styles.modalAcrdBody,{display:this.state.acrdCmntFirstVisible==0?'none':'flex'}]}>
          {this.state.cmntData ?
          <Text style={styles.modalAcrdComents}>{this.state.cmntData.claimEmpcomment}</Text>
          :null}
        </View>
        <TouchableOpacity style={styles.modalAccordionHeader}
          onPress={()=>{this.setAcrdCmntSecondVisible()}}>
          <Text style={styles.modalAcrdTitle}>Financer comment</Text>
          <Icon style={styles.modalAcrdIcon} name={this.state.acrdCmntSecondVisible==0?"ios-arrow-dropdown":"ios-arrow-dropup"} />
        </TouchableOpacity>
        <View style={[styles.modalAcrdBody,{display:this.state.acrdCmntSecondVisible==0?'none':'flex'}]}>
          {this.state.cmntData ?
          <Text style={styles.modalAcrdComents}>{this.state.cmntData.claimFinancercomment}</Text>
          :null}
        </View>
        <Text style={styles.modalCmntLabel}>Supervisor comment:</Text>
        <TextInput 
          multiline
          numberOfLines={4}
          placeholder='Enter your comment'
          style={[styles.modalInput, styles.cmntInput]}
          underlineColorAndroid="transparent"
          onChangeText={this.handleUserComment}
          />        
        {this.state.reqCmntError ?
          <Text style={styles.errorMsg}>{this.state.reqCmntError}</Text>
        :null}
      </ScrollView>
      {this.state.cmntData ?
      <View style={styles.modalCmntFooter}>
        <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnDanger]}
          onPress={() => {this.reqCmntModalVisible(null), this.closeAcrdCmnt(), this.removeCmntError()}}>
          <Text style={styles.modaCmntlBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnPrimary]}
          onPress={() => this.reqCmntSubmit(this.state.cmntData.req_hdr_id)}>
          <Text style={styles.modaCmntlBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>:null}
    </Modal>
    
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.btn}
        onPress={() => {this.setModalVisible(true);}}
        >
        <LinearGradient 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}} 
          colors={['#e63826', '#fb4b7b']} 
          style={styles.btnBg}>
          <Text style={styles.btnTxt}>Reject</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.btn}
        onPress={()=>this.approveConfirmation(params)}
        >
        <LinearGradient 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}} 
          colors={['#0066b3', '#2ca2fb']} 
          style={styles.btnBg}>
          <Text style={styles.btnTxt}>Approve</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
  );
  }
}

  renderReq = (data,index) => {
    return <TouchableOpacity 
      key={index} 
      style={styles.cardItem} 
      onPress={() => {}/*this.props.navigation.navigate('PjpReqDtl',data)*/}>
      <View style={styles.cardItemHeader}>
        <View style={styles.cardItemHeaderCol}>
          <Text style={styles.cardHdrLabel}>FROM</Text>
          <Text style={styles.cardHdrValue}>{data.source_city_name}</Text>
        </View>
        <Icon name="ios-arrow-round-forward" style={styles.hdrIcon} />
        <View style={styles.cardItemHeaderCol}>
          <Text style={styles.cardHdrLabel}>TO</Text>
          <Text style={styles.cardHdrValue}>{data.dest_city_name}</Text>
        </View>
        <TouchableOpacity style={styles.cmntBtn}
          onPress={() => {this.reqCmntModalVisible(data);}}>
          <Icon name="ios-chatbubbles" style={styles.cmntIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Date:</Text>
        <Text style={styles.cardValue}>{data.pjp_date?moment(data.pjp_date).format(global.DATEFORMAT):null}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Distance:</Text>
        <Text style={styles.cardValue}>{data.distance}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Requisition Type:</Text>
        <Text style={styles.cardValue}>{data.mode_name}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Requisition Amount:</Text>
        <Text style={[styles.cardValue, styles.reqAmnt]}>{data.amount_mode}</Text>
      </View>
      {data.attachment ?
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Attachment:</Text>
        <View style={styles.cardValueCol}>
          <TouchableOpacity style={styles.atchLink}
            onPress={() => {this.attachModalVisible(data.attachment);}}>
            {(this.getExtention(data.attachment) == 'webp' ||
              this.getExtention(data.attachment) == 'png' ||
              this.getExtention(data.attachData) == 'jpg' ||
              this.getExtention(data.attachData) == 'jpeg' ||
              this.getExtention(data.attachData) == 'bmp' ||
              this.getExtention(data.attachData) == 'gif'
            ) ?
            <Image source={{uri:data.attachment}} style={styles.atchImg} resizeMode='contain' />
            :<Icon name="ios-paper" style={styles.atchImgIcon} />}            
          </TouchableOpacity>
        </View>
      </View>
      :null}

    </TouchableOpacity>
  };
  
}

const mapStateToProps = state => {
  return {
    pjpAprv: state.pjpAprv,
    reqListSales: state.reqListSales,
    pjpAprvList: state.pjpAprvList,
    statusResult: state.statusResult
  };
};

const mapDispatchToProps = {
  postPjpAprv : Actions.postPjpAprv,
  getReqSale: Actions.getReqSale,
  getPjpAprvList : Actions.getPjpAprvList,
  getStatus: Actions.getStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(PjpTripAprvScreen);