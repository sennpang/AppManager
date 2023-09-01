import {View, StyleSheet} from 'react-native';
import React from 'react';
interface Props {
  css?: React.CSSProperties | object | undefined;
  children: React.ReactNode | React.ReactNode[];
}
const Box: React.FC<Props> = ({children, css}: Props) => {
  console.log(css);
  return (
    <View style={[styles.box, css]}>
      <>{children}</>
    </View>
  );
};

export default Box;

const styles = StyleSheet.create({
  box: {
    padding: 10,
  },
});
