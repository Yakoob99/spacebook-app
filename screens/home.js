import React, {Component} from 'react';
import {View, FlatList, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';

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

  likePosts = async (user_id, post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" +user_id+ "/post/" +post_id+ "/like", {
      method: 'Post',
      headers: {
        'X-Authorization': value 
    }
})
    .then((response) => {
        if (response.status === 200) {
            console.log("Ok")
        } else if (response.status === 400) {
            throw Error('Failed validation')
        } else {
            return response.json()
            // throw Error('Something went wrong')
        }
    })
    .then((responseJson) => {
        console.log('Liked: ', responseJson)
    })
    .catch((error) => {
        console.log(error)
    })
}

unLikePosts = async (user_id, post_id) => {
  const value = await AsyncStorage.getItem('@session_token');
  const idValue = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" +user_id+ "/post/" +post_id+ "/like", {
    method: 'Delete',
    headers: {
      'X-Authorization': value 
  }
})
  .then((response) => {
      if (response.status === 200) {
          console.log("Ok")
      } else if (response.status === 400) {
          throw Error('Failed validation')
      } else {
          return response.json()
          // throw Error('Something went wrong')
      }
  })
  .then((responseJson) => {
      console.log('Un-Liked: ', responseJson)
  })
  .catch((error) => {
      console.log(error)
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
        <View         
        style={{
          flex: 1,
          flexDirection: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          
          <TextInput
                    placeholder="What is on your mind"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
          <Button
                    title="Make Posts"
                    onPress={() => this.makePost()}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="See my posts"
                    onPress={() => this.props.navigation.navigate("My Post")}
                    style={{padding:5, borderWidth:1, margin:5}}
                />

          <Text>Friends Online:</Text>
          <FlatList
                data={this.state.friendsListData}
                renderItem={({item}) => (
                    <View>
                      <Text> {item.user_givenname} {item.user_familyname}</Text>
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
              <Button
                title=""
                icon={{
                  name: 'thumbs-up',
                  type: 'font-awesome',
                  size: 15,
                  color: 'white',
                }}
                iconContainerStyle={{ marginRight: 10 }}
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={{
                  backgroundColor: 'rgba(90, 154, 230, 1)',
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 100,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
                onPress={() => this.likePosts(item.author.user_id, item.post_id)}
              />
                            <Button
                title=""
                icon={{
                  name: 'thumbs-down',
                  type: 'font-awesome',
                  size: 15,
                  color: 'white',
                }}
                iconContainerStyle={{ marginRight: 10 }}
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={{
                  backgroundColor: 'rgba(90, 154, 230, 1)',
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 100,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
                onPress={() => this.unLikePosts(item.author.user_id, item.post_id)}
              />
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
