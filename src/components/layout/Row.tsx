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
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: props.direction || 'row',
          justifyContent: props.justifyContent || 'flex-start',
          alignContent: props.alignContent || 'flex-start',
          alignItems: props.alignItems || 'flex-start',
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
