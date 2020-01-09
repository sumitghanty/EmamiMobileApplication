import React, { Component } from 'react';
import { StyleSheet, Modal, Text, View, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import offlineIcon from '../Assets/Images/offline.png';	
	
export default class NetworkError extends Component {

  constructor() {
    super();
    this.state = {
			modalVisible: false
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) {
        this.setState({ modalVisible: false })
      }
      else {
        this.setState({ modalVisible: true })
      }
    });
  }
		
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ modalVisible: false })
    }
    else {
      this.setState({ modalVisible: true })
    }
  };

  render() {
    return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={this.state.modalVisible}>
			<View style={styles.modalBody}>
				<View style={styles.errorBlock}>
					<View style={styles.iconHolder}>
						<Image source={offlineIcon} style={styles.offlineIcon} />
					</View>
					<View>
						<Text style={styles.title}> No Internet Connection </Text>
						<Text style={styles.subTitle}> It looks like your internet connection is off. </Text>
						<TouchableHighlight 
							style={styles.btn}
							onPress={() => {this.handleConnectivityChange();}}
							>
							<Text style={styles.btnText}>RETRY</Text>
						</TouchableHighlight>
					</View>
				</View>
			</View>
		</Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
		flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,.5)'
  },
	errorBlock: {
		backgroundColor: '#fff',
		width: 280,
		shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
		borderRadius: 5
	},
	offlineIcon: {
		width: 80,
		height: 60,
		alignSelf: 'center'
	},
	iconHolder: {
		backgroundColor: '#ff6565',
		padding: 30,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4
	},
  title: {
    fontSize: 16,
    color: '#111',
		margin: 16,
		fontWeight: 'bold',
		textAlign: 'center'
  },
	subTitle: {
		color: 'rgba(0,0,0,.5)',
		textAlign: 'center',
		marginHorizontal: 16
	},
	btn: {
		backgroundColor: '#ff6565',
		margin: 16,
		borderRadius: 24,
		paddingHorizontal: 10,
		paddingVertical: 10,
		alignSelf: 'center',
		minWidth: 120
	},
	btnText: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 13,
		fontWeight: 'bold'
	}
});