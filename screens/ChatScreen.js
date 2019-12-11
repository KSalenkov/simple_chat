import React, { Component } from 'react';
import { StyleSheet,
          View,
          TextInput,
          KeyboardAvoidingView,
          TouchableOpacity,
          Image} from 'react-native';
import { width, height } from './constants/sizes';
import MessageList from '../components/MessageList'


class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      DATA: [],
      dataLoading: false
    }
  }

  getDataMessage = () => {
    return(
      fetch('https://raw.githubusercontent.com/KSalenkov/chat_test/master/dataMassage.json')
        .then((response) => {
            if (!response.ok) {
              this.setState({dataLoading: false})
            } else {
              this.setState({dataLoading: true});
              return(response.json())
            }
          })
        .then((responseJson) => {
          this.setState({
            DATA: responseJson
          })
        })
        .catch((error) => {
          console.error(error);
        })
    )
  }

  componentDidMount() {
    this.getDataMessage()
  }
  
  
  _addMessage = (text) => {
    this.setState({message: text})
  }

  _sendMessage = () => {
    
    if(this.state.message) {
      let id = (+new Date).toString();
    
      let messageData = this.state.DATA;
      let messageDataNew = messageData.concat({
        id: id,
        title: this.state.message
      })
      this.setState({
        message: '',
        DATA: messageDataNew
      })
    }
    
  }
   
  render() {
    console.log(this.state.dataLoading)
    return (
      <View
        style={styles.container}
        >
        <View style={styles.messageContainer}>
          <View style={styles.messageStyle}>
            <MessageList 
              loading={this.state.dataLoading}
              data={this.state.DATA}
            />
          </View>
        </View>

        <KeyboardAvoidingView style={styles.footerKeyboard} behavior='position' enabled>
          <View style={styles.footer}>
            <TextInput 
              style={styles.inputStyle}
              placeholder='Введите сообщение'
              value={this.state.message}
              onChangeText={this._addMessage}
            />
            <TouchableOpacity 
              style={styles.btnStyle}
              onPress={this._sendMessage}>
                <Image
                  style={{width: 45, height: 45}}
                  source={require('./src/image/btn.png')}
                />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    height: height*0.9,
    backgroundColor: '#e0dfdf',
    paddingHorizontal: 10,
    paddingTop: height * 0.1,
    paddingBottom: 10,
  },
  footerKeyboard: {
    width: width,
    height: height*0.1,
  },
  footer: {
    width: width,
    height: height*0.1,
    backgroundColor: '#e0dfdf',
    padding: 10,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageStyle: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 4,
  },
  inputStyle: {
    width: width *0.8,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRadius: 2,
    paddingHorizontal: 3
  },
  btnStyle: {
    height: 40,
    width: width*0.13,
    backgroundColor: '#e0dfdf',
    justifyContent: 'center',
    alignContent: 'center',
  }
})

export default ChatScreen;