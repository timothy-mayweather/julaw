import React from 'react';
import Main from "@/Layouts/Main";

const Dash = () => {
  return (
    <div>
      Dashboard
    </div>
  );
};

Dash.layout = page => <Main children={page} title="Dash"/>

export default Dash;
