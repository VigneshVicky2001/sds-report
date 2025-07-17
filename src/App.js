import './App.css';
import { useState,  } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Sidebar from './Components/Common/Sidebar';
import PartnerContentDetails from './Components/PartnerContentDetails';
import Login from './Components/Login';
import Header from './Components/Common/Header';
import Footer from './Components/Common/Footer';
import TotalVodAssets from './Components/TotalSdAssets';
import RecentTrend from './Components/RecentTrend';
import { Navigate } from 'react-router-dom';
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: "#212121" }}>
        <Header toggleSidebar={toggleSidebar} showLogout={!isLoginPage} />
        
        <div style={{ flex: 1, display: 'flex' }}>
          {!isLoginPage && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} isMinimized={sidebarOpen} />}

          <div
            style={{
              flexGrow: 1,
              marginTop: '60px',
              height: 'calc(100vh - 60px - 40px)',
              overflowY: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route index path="/dashboard" element={<Dashboard />} />
              <Route path="/sds-dashboard" element={<TotalVodAssets />} />
              <Route path="/partner-details" element={<Navigate to="/partner-details/amazonprimevideo/notModified" />} />
              <Route path="/partner-details/:partnerName/:status" element={<PartnerContentDetails />} />
              <Route
                path="/report/:partner/daily-summary"
                element={<RecentTrend key={location.pathname} />}
              />
            </Routes>
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
