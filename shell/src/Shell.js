import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppDrawer from './AppDrawer';
import AppBar from './AppBar';
import Viewport from './Viewport';
import { useLocalStorageSync } from './useLocalStorageSync';
import { ServiceProvider } from './Service';


function useDrawer() {
  const { value, setItem } = useLocalStorageSync('@shared-routing/appdrawer/open');

  return {
    open: value,
    closeDrawer() {
      setItem(false);
    },
    openDrawer() {
      setItem(true);
    },
  };
}

export default function Shell() {
  const [allRoutes, setAllRoutes] = useState(null); // Start with null to check loading state
  const drawer = useDrawer();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const [dashboard, order, profile] = await Promise.all([
          import('dashboard/DashboardService'),
          import('order/OrderService'),
          import('profile/ProfilePage'),
        ]);

        // Combine routes into a single array
        setAllRoutes([
          ...dashboard.default,
          ...order.default,
          ...profile.default,
        ]);
      } catch (error) {
        console.error("Error loading routes:", error);
        setAllRoutes([]); // Fallback to an empty route list on error
      }
    };

    loadRoutes();
  }, []);

  // Render a loading indicator while routes are being loaded
  if (allRoutes === null) {
    return <div>Loading...</div>;
  }

  return (
    <ServiceProvider>
      <BrowserRouter>
        <Viewport>
          <Box display="flex" flex={1}>
            <AppBar drawer={drawer} />
            <AppDrawer drawer={drawer} />
            <React.Suspense fallback={'Loading'}>
              <Routes>
                {allRoutes.map((route, i) => (
                  <Route
                    key={`${route.path}-${i}`}
                    path={route.path}
                    element={route.element}
                  />
                ))}
                <Route
                  key={`all-${allRoutes.length}`}
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </React.Suspense>
          </Box>
        </Viewport>
      </BrowserRouter>
    </ServiceProvider>
  );
}

