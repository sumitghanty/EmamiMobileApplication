import React from 'react';
import {View, TouchableOpacity, Text, TextInput, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import styles from './Styles/SearchBar'

class SearchBar extends React.Component {

  render() {
    return (
    <View style={styles.bar}>
		  <Icon name={Platform.OS === 'ios' ? "ios-search" : "md-search"} style={styles.searchIcon} />
      <TextInput
        keyboardType='default'
        returnKeyType='search'
        autoCapitalize='none'
        autoCorrect={false}
        style={styles.searchInput}
        underlineColorAndroid='transparent'
        placeholder="Search Items"
        />
      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.searchBtnTxt}>Search</Text>
      </TouchableOpacity>
    </View>
    );
  }
}

export default SearchBar;