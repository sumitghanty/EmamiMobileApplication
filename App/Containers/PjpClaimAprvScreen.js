import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Keyboard, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import Toast from 'react-native-simple-toast'

import Loader from '../Components/Loader'
import styles from './Styles/PjpClaimAprvScreen'

const TEMPLIST =[
  {"req_hdr_id":"1","attachment":null},
{"req_hdr_id":"2","attachment":null},
{"req_hdr_id":"3","attachment":null},
{"req_hdr_id":"4","attachment":"https://qph.fs.quoracdn.net/main-qimg-2fbdde5788e73478a08dc4bf338eee02.webp"},
]
const params = ""

class PjpClaimAprvScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acrdVisible: 0,
      modalVisible: false,
      attachData: null,
      cmntData: null,
      changeStatusDone: false,
      rejComment: null,
      reqComment: null,
      isLoading: false,
      acrdCmntFirstVisible: 0,
      acrdCmntSecondVisible: 0,
      cmntError: null,
      reqCmntError: null,
      userComment: '',
      width: 100,
      height: 100,
      downloadLoading: false,
      justification: '',
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
          onPress: () => this.submitForm("9")
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
          onPress: () => this.submitForm("10")
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
      reqComment: text,
      reqCmntError: null
    })
  }
  handleJustification=(text)=>{
    this.setState({ justification: text })
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

  reqCmntSubmit=()=> {
    if(this.state.reqComment) {
      this.reqCmntPost();      
    } else {
      this.setState({ reqCmntError: "Please enter comment." })
    }
  }

  reqCmntPost=()=>{
    console.log('Requisition Comment Submit');
    this.setState({cmntData: null});
  }

  downloadAttachment=(file)=> {
    this.downloadImage (file);
    this.setState({downloadLoading: true});
  }

  submitForm=(statusId)=> {
    this.setState({modalVisible: null});
    console.log('Form submit pending');
  }

  render() {
    var sortList = TEMPLIST;
    sortList.sort((a,b) => b.req_hdr_id - a.req_hdr_id);
  return(
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableOpacity style={styles.accordionHeader}
        onPress={()=>{this.setAcrdVisible()}}>
        <Text style={styles.acrdTitle}>PJP Details</Text>
        <Icon style={styles.acrdIcon} name={this.state.acrdVisible==0?"md-add-circle":"md-remove-circle"} />
      </TouchableOpacity>
      <View style={{display:this.state.acrdVisible==0?'none':'flex'}}>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>PJP Year:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>PJP Month:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Purpose:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Trip For:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Traveler Name:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Details:</Text>
          <Text style={styles.itemValue}>xxx</Text>
        </View>
        
        {sortList.length > 0 ?
        <Text style={styles.subTitle}>REQUISITION DETAILS</Text>
        :null }
        {sortList.length > 0 ?
          sortList.map((item, index) => {
          return (
            this.renderReq(item,index)
          );
          })
        :null}
        {sortList.length > 0 ?
        <View style={styles.totalTable}>
          <View style={styles.totalTableHeader}>
            <Text style={styles.totalTableTitle}>Estimated Amount</Text>
          </View>
          <View style={styles.totalTableRow}>
            <Text style={styles.totalTableLabel}>Requisition Amount:</Text>
            <Text style={styles.totalTableValue}>0000.00</Text>
          </View>
          <View style={styles.totalTableRow}>
            <Text style={styles.totalTableLabel}>Claim Amount:</Text>
            <Text style={styles.totalTableValue}>0000.00</Text>
          </View>
          <View style={styles.totalTableRow}>
            <Text style={styles.totalTableLabel}>Deduction Amount:</Text>
            <Text style={styles.totalTableValue}>0000.00</Text>
          </View>
        </View>
        :null}
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Claim Details</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Estimated Cost:</Text>
        <Text style={[styles.itemValue,styles.textRight]}>xxxxx</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Actual Claim Amount:</Text>
        <Text style={[styles.itemValue,styles.textRight]}>xxxxx</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Currency:</Text>
        <Text style={[styles.itemValue,styles.textRight]}>xxxxx</Text>
      </View>
      <Text style={[styles.itemLabel,styles.selfLabel]}>Justification:</Text>
      <TextInput 
        multiline
        numberOfLines={4}
        placeholder='Enter your Justification'
        style={styles.selfInput}
        underlineColorAndroid="transparent"
        onChangeText={this.handleJustification}
        />

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
          <Text style={styles.modalAcrdComents}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
        </View>
        <TouchableOpacity style={styles.modalAccordionHeader}
          onPress={()=>{this.setAcrdCmntSecondVisible()}}>
          <Text style={styles.modalAcrdTitle}>Employee comment</Text>
          <Icon style={styles.modalAcrdIcon} name={this.state.acrdCmntSecondVisible==0?"ios-arrow-dropdown":"ios-arrow-dropup"} />
        </TouchableOpacity>
        <View style={[styles.modalAcrdBody,{display:this.state.acrdCmntSecondVisible==0?'none':'flex'}]}>
          <Text style={styles.modalAcrdComents}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
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
      <View style={styles.modalCmntFooter}>
        <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnDanger]}
          onPress={() => {this.reqCmntModalVisible(null), this.closeAcrdCmnt(), this.removeCmntError()}}>
          <Text style={styles.modaCmntlBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modaCmntlBtn, styles.btnPrimary]}
          onPress={() => this.reqCmntSubmit()}>
          <Text style={styles.modaCmntlBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
          colors={['#5ba11c', '#92d40a']} 
          style={styles.btnBg}>
          <Text style={styles.btnTxt}>Approve</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
  );
  }

  renderReq = (data,index) => {
    return <TouchableOpacity 
      key={index} 
      style={styles.cardItem} 
      onPress={() => this.props.navigation.navigate('PjpReqDtl',data)}>
      <View style={styles.cardItemHeader}>
        <View style={styles.cardItemHeaderCol}>
          <Text style={styles.cardHdrLabel}>FROM</Text>
          <Text style={styles.cardHdrValue}>Kolkata</Text>
        </View>
        <Icon name="ios-arrow-round-forward" style={styles.hdrIcon} />
        <View style={styles.cardItemHeaderCol}>
          <Text style={styles.cardHdrLabel}>TO</Text>
          <Text style={styles.cardHdrValue}>Hydrebad</Text>
        </View>
        <TouchableOpacity style={styles.cmntBtn}
          onPress={() => {this.reqCmntModalVisible(data.req_hdr_id);}}>
          <Icon name="ios-chatbubbles" style={styles.cmntIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Date:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Distance:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Actual Distance:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Departure Time:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Arrival Time:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Total Time:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Requisition Type:</Text>
        <Text style={styles.cardValue}>xxx</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Requisition Amount:</Text>
        <Text style={styles.cardValue}>9999.99</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Claim Amount:</Text>
        <Text style={styles.cardValue}>9999.99</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Deduction Amount:</Text>
        <Text style={styles.cardValue}>9999.99</Text>
      </View>      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Payable Amount:</Text>
        <Text style={styles.cardValue}>9999.99</Text>
      </View>      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Out of Policy:</Text>
        <Text style={styles.cardValue}>xxx</Text>
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

export default PjpClaimAprvScreen;