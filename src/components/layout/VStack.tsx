import React from 'react';
import {FlexAlignType, StyleSheet, View} from 'react-native';
interface Props {
  children: React.ReactNode;
  direction?: 'column' | 'row';
  alignItems?: FlexAlignType | unknown;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | unknown;
  marginBottom?: number;
  alignContent?: FlexAlignType | 'space-between' | 'space-around';
  css?: React.CSSProperties | any;
}
const VStack = (props: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: props.justifyContent || 'flex-start',
          alignContent: props.alignContent || 'flex-start',
          alignItems: props.alignItems || 'flex-start',
          marginBottom:
            props.marginBottom !== undefined ? props.marginBottom : 10,
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
