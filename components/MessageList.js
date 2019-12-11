import React from 'react';
import { StyleSheet,
          View, 
          Text,
          FlatList,
          ProgressBarAndroid} from 'react-native';


function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.message}>{title}</Text>
    </View>
  );
}

function MessageList(props) {

    const {loading, data} = props;
    
    if (!loading) {
        return(
        <ProgressBarAndroid />
        )
    } else {
        return(
        <FlatList
            data={data}
            renderItem={({item}) => <Item title={item.title} />}
            keyExtractor={item => item.id}
            inverted={true}
        />
        )
    }
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#cccaca',
      padding: 5,
      marginVertical: 3,
      borderRadius: 3,
    },
    message: {
      fontSize: 15,
    },
  })

  export default MessageList;