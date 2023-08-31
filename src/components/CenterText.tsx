import {Text} from 'react-native-paper';
import React from 'react';
import TextProps from 'react-native-paper/lib/typescript/components/Typography/Text';
type MyTextInputProps = React.ComponentProps<typeof TextProps> & {
  // ...
};

const CenterText: React.FC<MyTextInputProps> = props => {
  const {children} = props;
  let style = {};
  if (typeof props.style === 'object') {
    style = {...props.style};
  }
  return (
    <Text {...props} style={{...style, textAlign: 'center'}}>
      {children}
    </Text>
  );
};

export default CenterText;
