import React, {Component} from 'react';
import {View, Text, FlatList, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SinglePostScreen extends Component {
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
  
    this.getSinglePost(this.props.route.params.user_id, this.props.route.params.post_id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }





  getSinglePost = async (user_id, post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const idValue = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
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
      return(
        <View>

<Text 
            style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}>
            { "Post ID: "+ this.state.postdata.post_id +" '" +  this.state.postdata.text + "' Likes: "+ this.state.postdata.numLikes}
            </Text>

        </View>
      )
  }
}



export default SinglePostScreen;
