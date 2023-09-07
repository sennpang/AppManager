import React from 'react';
import {Button, Checkbox} from 'react-native-paper';
import Row from '../components/layout/Row';
import {theme} from '../config/theme';
interface Props {
  selectAll: boolean;
  changeSelectAll: () => void;
  handleDelete: () => void;
  selectedApps: Set<any>;
  disabled: boolean;
}
const DeleteAppBtn = ({
  selectAll,
  selectedApps,
  changeSelectAll,
  handleDelete,
  disabled,
}: Props) => {
  return (
    <Row css={{paddingLeft: '1%'}} alignItems="center">
      <Checkbox
        status={selectAll ? 'checked' : 'unchecked'}
        onPress={() => changeSelectAll()}
      />
      <Button
        mode="text"
        disabled={!selectedApps.size || disabled}
        textColor={theme.colors.error}
        onPress={() => handleDelete()}>
        删除
      </Button>
    </Row>
  );
};

export default DeleteAppBtn;
