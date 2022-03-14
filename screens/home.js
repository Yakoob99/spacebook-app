import React, {Component} from 'react';
import {View, Text, FlatList, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      friendsListData: [],
      postdata:[],
      text: "",
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getFriends();
    this.makePost();
    // this.getPosts(8);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  makePost = async () => {
    const value = await AsyncStorage.getItem('@session_token')
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/"+ idValue + "/post/", {
        method: 'post',
        headers: {
            'X-Authorization': value ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
            } else if (response.status === 400) {
                throw Error('Failed validation')
            } else {
                throw Error('Something went wrong')
            }
        })
        .then((responseJson) => {
            console.log('Post created with ID: ', responseJson)
        })
        .catch((error) => {
            console.log(error)
        })
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

  getPosts = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
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


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    console.log(this.state.postdata)


    if (this.state.isLoading){
      console.log(this.state.postdata)
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
        <View>
          <TextInput
                    placeholder="What is on your mind"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
          <Button
                    title="make posts"
                    onPress={() => this.makePost()}
                    style={{padding:5, borderWidth:1, margin:5}}
                />

          <Text>Friends Online:</Text>
          <FlatList
                data={this.state.friendsListData}
                renderItem={({item}) => (
                    <View>
                      <Text> {item.user_id} {item.user_givenname} {item.user_familyname}</Text>
                      <Button
                    title="See posts"
                    onPress={() => this.getPosts(item.user_id)}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
          <FlatList
                data={this.state.postdata}
                renderItem={({item}) => (
                    <View>
                      <Text>Post ID: 
                        <Button
                    title= {item.post_id}
                    onPress={() => this.props.navigation.navigate('SinglePost', {user_id: item.author.user_id, post_id: item.post_id})}
                    style={{padding:5, borderWidth:1, margin:5}}
                />  "{item.text}" Author: {item.author.first_name} {item.author.last_name} 
                       </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
              />

        </View>
      );
    }
    
  }
}



export default HomeScreen;
