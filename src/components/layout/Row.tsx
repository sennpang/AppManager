import React from 'react';
import {StyleSheet, View} from 'react-native';
interface Props {
  children: React.ReactNode;
  direction?: 'column' | 'row';
}
const Row = (props: Props) => {
  console.log(props.children);
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: props.direction || 'column',
          alignContent: 'space-between',
        },
      ]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Row;
