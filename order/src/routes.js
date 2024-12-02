import React from 'react';
import OrderService from './OrderService';


const routes = [
    {
        path:"orders/*", 
        element: <OrderService /> 
    },
  ];

export default routes