import React, {Component} from 'react';
import {View, FlatList, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';

class UpdatePostScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      postdata:[],
      text: "",
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      
    });
  this.getPosts(this.props.route.params.post_id)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  getPosts = async (post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + idValue+ "/post/" + post_id , {
      method: 'get',
      headers: {
          "X-Authorization": value
      }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            postdata: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  updatePosts = async (post_id, text) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + idValue+ "/post/" + post_id , {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'x-authorization': value,
      } ,
      body: JSON.stringify(text)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                console.log(JSON.stringify(text))
            }
        })
        .then((responseJson) => {
            console.log("Updated") 
        })
        .catch((error) => {
            console.log(error);
        })
  }



  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {


    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{

      return (
        <View         
        style={{
          flex: 1,
          flexDirection: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

<Button
                    title="Update"
                    onPress={() => this.updatePosts(this.state.postdata.post_id, { text: "hello"})}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
          
          
        </View>
      );
    }
    
  }
}



export default UpdatePostScreen;