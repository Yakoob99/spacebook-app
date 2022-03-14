import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      friendsListData: [],
      friendRequestsData: []


    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getFriends();
    this.getFriendsRequests();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriends = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + idValue + "/friends", {
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
            friendsListData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getFriendsRequests = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
            friendRequestsData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  acceptFriendRequest = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+ user_id, {
      method: 'POST',
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
            friendRequestsData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }  

  rejectFriendRequest = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+ user_id, {
      method: 'DELETE',
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
            friendRequestsData: responseJson
          })
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
      console.log(this.state.friendsListData)
      console.log(this.state.friendRequestsData)

      return (
        <View>
          <Button
                    title="Meet the users"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Add Friends")}
                />
          <Text>Friends Online:</Text>
          <FlatList
                data={this.state.friendsListData}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
              <Text>Friend requests:</Text>
<FlatList
                data={this.state.friendRequestsData}
                renderItem={({item}) => (
                    <View>
                      <Text> {item.user_id} {item.first_name} {item.last_name} 
                      <Button
                    title="Accept user"
                    onPress={() => this.acceptFriendRequest(item.user_id)}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                 <Button                   title="Reject user"
                    onPress={() => this.rejectFriendRequest(item.user_id)}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
    
  }
}



export default FriendsScreen;