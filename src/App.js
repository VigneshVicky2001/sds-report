import './App.css';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Sidebar from './Components/Common/Sidebar';
import PartnerContentDetails from './Components/PartnerDetails/PartnerContentDetails';
import Login from './Components/Login';
import Header from './Components/Common/Header';
import Footer from './Components/Common/Footer';
import TotalVodAssets from './Components/TotalSdAssets';
import RecentTrend from './Components/RecentTrend';
import "@fontsource/mulish";

const theme = createTheme({
  typography: {
    fontFamily: "Mulish, sans-serif",
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: "#212121",
        }}
      >
        {/* <Header toggleSidebar={toggleSidebar} showLogout={!isLoginPage} /> */}

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {!isLoginPage && (
            <Sidebar
              open={sidebarOpen}
              toggleSidebar={toggleSidebar}
              isMinimized={sidebarOpen}
            />
          )}

          <div
            style={{
              flexGrow: 1,
              overflow: 'auto',
              backgroundColor: "#212121",
            }}
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sds-dashboard" element={<TotalVodAssets />} />
              <Route
                index
                path="/partner-details"
                element={<PartnerContentDetails/>}
              />
              <Route
                path="/partner-details/:partnerName/:status"
                element={<PartnerContentDetails />}
              />
              <Route
                path="/report/:partner/daily-summary"
                element={<RecentTrend key={location.pathname} />}
              />
            </Routes>
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
