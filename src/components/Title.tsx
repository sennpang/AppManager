import React from 'react';
import {Text} from 'react-native-paper';
interface Props {
  children: React.ReactNode | undefined;
  textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
  marginBottom?: number;
  fontSize?: number;
  css?: React.CSSProperties | object;
}
const Title = (props: Props) => {
  return (
    <Text
      style={[
        {
          fontWeight: 'bold',
          marginBottom: props.marginBottom || 0,
          fontSize: props.fontSize || 16,
          textAlign: props.textAlign || 'left',
        },
        props.css,
      ]}>
      {props.children}
    </Text>
  );
};

export default Title;
