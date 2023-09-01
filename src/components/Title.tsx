import React from 'react';
import {Text} from 'react-native-paper';
interface Props {
  children: React.ReactNode | undefined;
  marginBottom?: number;
}
const Title = (props: Props) => {
  return (
    <Text style={{fontWeight: 'bold', marginBottom: props.marginBottom || 0}}>
      {props.children}
    </Text>
  );
};

export default Title;
