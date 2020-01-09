import React, {Component} from 'react'
import {API_URL} from '../config'

class For extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: '',      
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'getTripForMasterList')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          isLoading: false,
        }, function(){
        });
      })
      .catch((error) =>{
      });
  }
  render(){
    if(this.state.isLoading){
      return(
        ''
      )
    }
    const {value}=this.props;
    for(var i=0; i<this.state.dataSource.length; i++) {
      if(this.state.dataSource[i].tripFor_type_id == value) {
        return (
          this.state.dataSource[i].tripFor_type
        );
      }
    }
  }
}

class Purpose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: '',      
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'activeForListOfTripForMaster?active_for=B')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          isLoading: false,
        }, function(){
        });
      })
      .catch((error) =>{
      });
  }
  render(){
    if(this.state.isLoading){
      return(
        ''
      )
    }
    const {value}=this.props;
    for(var i=0; i<this.state.dataSource.length; i++) {
      if(this.state.dataSource[i].purpose_type_id == value) {
        return (
          this.state.dataSource[i].purpose_type
        );
      }
    }
  }
}

class ReqType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],      
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'getRequisitionTypeList?designation='+global.USER.designation+'&grade='+global.USER.grade)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: responseJson,
        isLoading: false,
      }, function(){
      });
    })
    .catch((error) =>{
    });
  }
  render(){
    if(this.state.isLoading){
      return(
        ''
      )
    }
    const {value}=this.props;
    for(var i=0; i<this.state.dataSource.length; i++) {
      if(this.state.dataSource[i].sub_category_id == value) {
        return (
          this.state.dataSource[i].sub_category
        );
      }
    }
  }
}

class Traveler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: '',      
      isLoading: true
    };
  }
  componentDidMount(props){
    return fetch(API_URL+'getRetainerNameList')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          isLoading: false,
        }, function(){
        });
      })
      .catch((error) =>{
      });
  }
  render(){
    if(this.state.isLoading){
      return(
        ''
      )
    }
    const {value}=this.props;
    for(var i=0; i<this.state.dataSource.length; i++) {
      if(this.state.dataSource[i].retainer_id == value) {
        return (
          this.state.dataSource[i].name_of_retainers
        );
      }
    }
  }
}

export {Purpose, For, ReqType, Traveler };