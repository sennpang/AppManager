import {View, StyleSheet} from 'react-native';
import React from 'react';
const Box = ({children, css}) => {
  console.log(css);
  return (
    <View style={[styles.box, {...css}]}>
      <>{children}</>
    </View>
  );
};

export default Box;

const styles = StyleSheet.create({
  box: {
    padding: 10,
  },
});
