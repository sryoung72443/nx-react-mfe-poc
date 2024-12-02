import React from 'react';
import Dashboard from './DashboardService';


const routes = [
    {
        path: "dashboard/*", 
        element: <Dashboard />,
    },
  ];

export default routes