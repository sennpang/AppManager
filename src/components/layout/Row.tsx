import React from 'react';
import {FlexAlignType, StyleSheet, View} from 'react-native';
interface Props {
  children: React.ReactNode | undefined;
  direction?: 'column' | 'row';
  alignItems?: FlexAlignType;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  alignContent?: FlexAlignType | 'space-between' | 'space-around';
  css?: React.CSSProperties;
}
const Row = (props: Props) => {
  console.log(props.children);
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: props.direction || 'row',
          justifyContent: props.justifyContent || 'center',
          alignContent: props.alignContent || 'center',
          alignItems: props.alignItems || 'center',
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

export default Row;
