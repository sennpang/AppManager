import React, {useEffect} from 'react';
import {useAlertStore} from '../store/alert';
interface Props {
  errorMsg: string;
}
const AlertMiddle: React.FC<Props> = ({errorMsg}) => {
  const setAlertInfo = useAlertStore(state => state.setInfo);
  // const alertInfo = useAlertStore(state => state.info);

  useEffect(() => {
    if (!errorMsg) {
      return;
    }
    setAlertInfo({msg: errorMsg, open: true});
  }, [errorMsg, setAlertInfo]);

  return <></>;
};

export default AlertMiddle;
