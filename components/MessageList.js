import React from 'react';
import { StyleSheet,
          View, 
          Text,
          FlatList,
          ProgressBarAndroid} from 'react-native';
import { idClient } from '../constants/thisDevise'


const Item = ({ text, date, idClientItem }) => {
  
  const addZero = (num) => {
    if (num<10) {
      return ('0'+num)
    } else {
      return num
    }
  }

  const time = (date) => {
    
    const time = new Date(date);
    
    const hours = addZero(time.getHours()),
          minuts = addZero(time.getMinutes()),
          seconds = addZero(time.getSeconds());
    return (`${hours}:${minuts}`)
  }

  const {item, itemMy, message, messageTime} = styles;

  return (
    
    <View style={(idClientItem==idClient) ? itemMy : item}>
      <Text style={message}>{text}</Text>
      <Text style={messageTime}>{time(date)}</Text>
    </View>
  );
}

function MessageList(props) {

    const {loaded, data} = props;

    if (!loaded) {
      return(
        <ProgressBarAndroid
          color={'#cccaca'}
        />
      )
    }

    return(
      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <Item
              text={item.message}
              date={item.time}
              idClientItem={item.idClient}
            />
          )
          
        }}
        keyExtractor={item => item.id}
        inverted={true}
      />
    )
    
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#e8e8e8',
      padding: 5,
      marginVertical: 3,
      borderRadius: 3,
    },
    itemMy: {
      backgroundColor: '#cccaca',
      padding: 5,
      marginVertical: 3,
      borderRadius: 3,
    },
    message: {
      fontSize: 15,
    },
    messageTime: {
      fontSize: 8,
      textAlign: 'right'
    }
  })

  export default MessageList;