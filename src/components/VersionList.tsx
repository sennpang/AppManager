import React from 'react';
import {VersionScreenProps} from '..';

import ListContainer from '../unit/ListContainer';
function VersionList(props: VersionScreenProps) {
  return <ListContainer type="version" {...props} />;
}
export default VersionList;
