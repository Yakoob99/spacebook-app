import React, {Component} from 'react';
import {View,FlatList,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonGroup, withTheme, Text, Image} from 'react-native-elements';


class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      user: null,
      photo: null,

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getProfileImage();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + idValue, {
          'headers': {
            'X-Authorization':  value
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
            user: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getProfileImage = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + idValue +"/photo" , {
      method: 'GET',
      headers: {
        'X-Authorization': value 
      }
    })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
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
<Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 200,
              height: 200,
              borderWidth: 5 
            }}
          />
          
{/* request to edit profile picture */}
          <Button
                    title="Edit profile picture"
                    style={{fontSize:15, fontWeight:'light', padding:3, margin:3,}}
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate('Upload PP')}
                />         
          
{/* Welcome back message greeting user */}

            <Text 
            style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}>
            {"Welcome Back " + this.state.user.first_name}
            </Text>

{/* Providing user ID */}

            <Text 
            style={{fontSize:12, fontWeight:'bold', padding:5, margin:5}}>
            {"User ID: " + this.state.user.user_id }
            </Text>


{/* Providing user name */}
            <Text 
            style={{fontSize:12, fontWeight:'bold', padding:5, margin:5}}>
            {"Name: " + this.state.user.first_name + " " + this.state.user.last_name }
            </Text>

{/* Providing user email */}
            <Text 
            style={{fontSize:12, fontWeight:'bold', padding:5, margin:5}}>
            {"Email: " + this.state.user.email }
            </Text>

            <Text 
            style={{fontSize:12, fontWeight:'bold', padding:5, margin:5}}>
            {"Friend Count: " + this.state.user.friend_count }
            </Text>

            <Button
                    title="Edit Profile"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Update Info")}
                />

        </View>
      );
    }
    
  }
}



export default ProfileScreen;
