import React from 'react';
import {StyleSheet, View} from 'react-native';
interface Props {
  children: React.ReactNode | undefined;
  direction?: 'column' | 'row';
  css?: React.CSSProperties;
}
const VStack = (props: Props) => {
  console.log(props.children);
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: props.direction || 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        props.css,
      ]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default VStack;
