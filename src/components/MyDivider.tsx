import React from 'react';
import {Divider} from 'react-native-paper';
interface Props {
  css: React.CSSProperties | object;
}

const MyDivider: React.FC<Props> = ({css}) => {
  return <Divider style={[{marginTop: 10, marginBottom: 10}, css]} />;
};

export default MyDivider;
