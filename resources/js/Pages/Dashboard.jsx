import React from 'react';
import Main from "@/Layouts/Main";

const Dashboard = () => {
  return (
    <div>
      Dashboard
    </div>
  );
};

Dashboard.layout = page => <Main children={page} title="Dashboard"/>

export default Dashboard;
