import React from 'react';
import {View, TouchableOpacity, Alert } from 'react-native'
import { Button, Icon, Text, Card, CardItem } from 'native-base'
import { withNavigation } from 'react-navigation';
import Ficon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'

import styles from './Styles/TripRequisitionItem'

class TripRequisitionItem extends React.Component {

	confirmation(e) {
    Alert.alert(
      'Remove Requistion',
      'Are you sure to remove this Requistion?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          //onPress: () => this.removeItem(e)
        },
      ],
      {cancelable: true},
    )
	};
	dateFormat(date) {
		return date.split('-').join('/');
	}

  render() {
		const {data,index}=this.props;
		//console.log(data);
    return (
    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ReqInfo',{itemId:index})}>
		<Card style={styles.item}>
			<CardItem style={styles.itemBody}>
				<View style={styles.itemInfo}>
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Requisition Type:</Text>
						<Text style={styles.itemValue}>                  
							{data.req_type == 1 ? <Icon name='airplane' style={styles.reqIcon} /> :
							data.req_type == 10 ? <Icon name='ios-car' style={styles.reqIcon} />:
							<Ficon style={styles.modalItemIcon} name="road" />
							} &nbsp;&nbsp;
							{data.req_type}
						</Text>
					</View>
					{data.creation_date ?
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Creation Date:</Text>
						<Text style={styles.itemValue}>{this.dateFormat(data.creation_date)}</Text>
					</View>:null}
					{data.travel_date ?
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Travel Date:</Text>
						<Text style={styles.itemValue}>{moment(data.travel_date).format(global.DATEFORMAT)}</Text>
					</View>:null}
					{data.start_date ?
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Start Date:</Text>
						<Text style={styles.itemValue}>{moment(data.start_date).format(global.DATEFORMAT)}</Text>
					</View>:null}
					{data.end_date ?
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>End Date:</Text>
						<Text style={styles.itemValue}>{moment(data.end_date).format(global.DATEFORMAT)}</Text>
					</View>:null}
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Amount:</Text>
						<Text style={styles.itemValue}>INR {data.amount}</Text>
					</View>
					<View style={styles.itemRow}>
						<Text style={styles.itemLabel}>Status:</Text>
						<Text style={styles.itemValue}>{data.status}</Text>
					</View>
				</View>
				<View style={styles.itemActions}>
					<Button bordered small rounded danger style={styles.actionBtn}
						onPress={()=>this.confirmation(index)}
						>
						<Icon name='trash' style={styles.actionBtnIco} />
					</Button>
					{data.attachment &&<Button bordered small rounded primary style={[styles.actionBtn, styles.mrgTop]}>
						<Icon name='attach' style={styles.actionBtnIco} />
					</Button>}
				</View>
			</CardItem>
			{data.attachment ?<CardItem style={styles.attachBlock}>
				<View style={styles.attachInfo}>
					<Text style={styles.attachTitle}>Attachments</Text>
					{data.attachment.map((attachItem, sl) => {
						return <View key={sl} style={styles.attachRow}>
							<Text style={styles.attachName}>{attachItem.fileName}</Text>
							<Text style={styles.attachSize}>{attachItem.size}</Text>
						</View>
					})}
				</View>
			</CardItem>:null}
		</Card>
		</TouchableOpacity>
    );
	}	
}

export default withNavigation(TripRequisitionItem);