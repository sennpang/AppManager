import React from 'react';
import {AppListScreenProps} from '..';

import ListContainer from '../unit/ListContainer';
function VersionList(props: AppListScreenProps) {
  return <ListContainer type="app" {...props} />;
}
export default VersionList;
