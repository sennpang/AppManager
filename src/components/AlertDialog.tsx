import * as React from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useAlertStore} from '../store/alert';

const AlertDialog = () => {
  const alertInfo = useAlertStore(state => state.info);
  const setInfo = useAlertStore(state => state.setInfo);
  const handleClose = () => {
    setInfo({open: false});
  };
  const {open, title, msg, confirmCb, confirm} = alertInfo;
  const handleConfirm = () => {
    confirmCb && confirmCb();
    handleClose();
  };

  return (
    <View>
      <Portal>
        <Dialog visible={!!open} onDismiss={handleClose}>
          <Dialog.Title>{title || '提示'}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{msg}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {confirmCb && <Button onPress={handleClose}>取消</Button>}
            <Button onPress={handleConfirm}>{confirm || '好的'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AlertDialog;
