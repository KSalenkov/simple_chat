import React from 'react';
import { StyleSheet,
          View, 
          Text,
          FlatList,
          ProgressBarAndroid,
          TouchableOpacity } from 'react-native';
import { idClient } from '../constants/thisDevise'


const Item = ({ 
  nickName, 
  text, 
  date, 
  idClientItem, 
  itemData, 
  press, 
  edited,
  itemColor,
  itemMyColor
}) => {
  
  const time = (date) => {
    
    const time = new Date(date);
    
    const hours = addZero(time.getHours()),
          minuts = addZero(time.getMinutes()),
          seconds = addZero(time.getSeconds());
    return (`${hours}:${minuts}`)
  }

  const TitleEdit = () => {
    if (edited) {
      return (
        <Text>Изменено </Text>
      )
    } else {
      return (
        <Text></Text>
      )
    }
  }

  const { 
    item, 
    itemMy, 
    nick, 
    message, 
    messageTime
  } = styles;

  

  return (
    
    <TouchableOpacity
      style={(idClientItem==idClient) ? [itemMy, itemMyColor] : [item, itemColor]}
      activeOpacity={0.5}
      onLongPress={() => {
        if (itemData.idClient === idClient) {
          press(itemData)
        }
      }}
    >
        <Text ><Text style={nick}>{nickName}:</Text> <Text style={message}>{text}</Text></Text>
        <Text style={messageTime}><TitleEdit/>{time(date)}</Text>
    </TouchableOpacity>
  );
}

function MessageList(props) {
    
    const {
      loaded, 
      data, 
      server,
      itemColor,
      itemMyColor
    } = props;

    if (!loaded && server) {
      return(
        <ProgressBarAndroid
          color={'#cccaca'}
        />
      )
    } else if (!server) {
      return(
        <View style={styles.notServerBox}>
          <Text style={styles.textServer}>Нет подключения к серверу</Text>
        </View>
      )
    }

    return(
      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <Item
              nickName={item.nickName}
              text={item.message}
              date={item.time}
              idClientItem={item.idClient}
              edited={item.edited}
              itemData={item}
              press={props.chooseMessage}
              itemColor={itemColor}
              itemMyColor={itemMyColor}
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
      padding: 5,
      marginVertical: 3,
      borderRadius: 3,
    },
    itemMy: {
      padding: 5,
      marginVertical: 3,
      borderRadius: 3,
    },
    nick: {
      fontWeight: 'bold',
      textDecorationLine: 'underline'
    },
    message: {
      fontSize: 15,
    },
    messageTime: {
      fontSize: 8,
      textAlign: 'right'
    },
    notServerBox: {
      flex: 1,
      justifyContent: 'flex-start',
      textAlign: 'center'
    },
    textServer: {
      textAlign: 'center',
      opacity: 0.3
    }
  })

  const addZero = (num) => {
    if (num<10) {
      return ('0'+num)
    } else {
      return num
    }
  }

  export default MessageList