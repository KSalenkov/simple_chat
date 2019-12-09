import React, { Component } from 'react';
import { StyleSheet,
          View, 
          Text,
          TextInput,
          KeyboardAvoidingView,
          TouchableOpacity,
          Image,
          FlatList } from 'react-native';
import { width, height } from './constants/sizes';


function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.massege}>{title}</Text>
    </View>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      massage: '',
      DATA: []
    }
  }

  componentDidMount() {
    return(
      fetch('/dataMassage.json')
        .then((response) => response.json())
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
  
  
  _addMassege = (text) => {
    this.setState({massage: text})
  }

  _sendMassege = () => {
    
    let id = (+new Date).toString();
    
    let massageData = this.state.DATA;
    let massageDataNew = massageData.concat({
      id: id,
      title: this.state.massage
    })
    // this.setState({
    //   massage: '',
    //   DATA: massageDataNew
    // })
    
  }
  
  
  render() {

    return (
      <KeyboardAvoidingView style={styles.container} behavior='position' enabled>
        <View style={styles.massegeContainer}>
          <View style={styles.messegeStyle}>
            
            <FlatList
              data={this.state.DATA}
              renderItem={({item}) => <Item title={item.title} />}
              keyExtractor={item => item.id}
            />


          </View>
        </View>

        <View style={styles.footer}>
          <TextInput 
            style={styles.inputStyle}
            placeholder='Введите сообщение'
            value={this.state.massage}
            onChangeText={this._addMassege}
          />
          <TouchableOpacity 
            style={styles.btnStyle}
            onPress={this._sendMassege}>
              <Image
                style={{width: 45, height: 45}}
                source={require('./src/image/btn.png')}
              />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
    justifyContent: 'space-between',
  },
  massegeContainer: {
    height: height*0.9,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingTop: height * 0.1,
    paddingBottom: 10,
  },
  footer: {
    width: width,
    height: height*0.1,
    backgroundColor: '#fff',
    padding: 10,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  messegeStyle: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    padding: 10
  },
  inputStyle: {
    width: width *0.8,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 3
  },
  btnStyle: {
    height: 40,
    width: width*0.13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center'
  },

  item: {
    backgroundColor: 'gray',
    padding: 5,
    marginVertical: 3,
    // marginHorizontal: 16,
  },
  massege: {
    fontSize: 15,
  },
})

export default App;