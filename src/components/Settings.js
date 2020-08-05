import { Page } from 'react-onsenui';
import React from 'react';

const Settings = (props) =>{
  const {title} = props;

  return (
    <Page {...props}>
      <p>{title}</p>
    </Page>
  )
}

export default Settings
