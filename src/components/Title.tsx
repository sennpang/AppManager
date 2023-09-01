import React from 'react';
import {Text} from 'react-native-paper';
interface Props {
  children: React.ReactNode | undefined;
}
const Title = (props: Props) => {
  return <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
};

export default Title;
