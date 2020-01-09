import React, {Component} from 'react'
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import style from './Styles/Empty';

export default class Empty extends Component{
  render(){
    const {message,icon}=this.props;

    return <View {...this.props} style={style.emptyBlock}>
        <Icon style={style.emptyIcon} name={icon?icon:'logo-dropbox'} />
        <Text style={style.emptyText}>{message}</Text>
    </View>;
  }
}
