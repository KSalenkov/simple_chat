import React from 'React';
import { View, StyleSheet, Text } from 'react-native';





export default function Item(props) {

    {   title,
        itemStyle,
        itemStyleText } = props;

    return (
      <View style={itemStyle}>
        <Text style={itemStyleText}>{title}</Text>
      </View>
    );

}

const styles