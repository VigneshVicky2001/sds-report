import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import SummarizeIcon from '@mui/icons-material/Summarize';

const Sidebar = ({ open, isMinimized }) => {
  const location = useLocation();
  const isSelected = (path) => {
    if (path === '/partner-details') {
      return location.pathname.startsWith('/partner-details');
    }
    if (path.startsWith('/report')) {
      return location.pathname.startsWith('/report');
    }
    return location.pathname === path;
  };
  const drawerWidth = isMinimized ? 70 : 250;
  const navigate = useNavigate();

  const navigateToPage = (path) => {
    navigate(path);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'SDS dashboard', path: '/sds-dashboard', icon: <CategoryIcon /> },
    { label: 'Partner Details', path: '/partner-details', icon: <ViewListIcon /> },
    { label: 'Recent Trends', path: '/report/hbomax/daily-summary?days=5', icon: <SummarizeIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: '#171717',
          color: '#fff',
          paddingTop: '60px',
          position: 'fixed',
          bottom: '50px',
          transition: 'width 0.3s ease',
        },
      }}
      open={open}
    >
      <List
        sx={{
          cursor: "pointer",
          pt: 0
        }}
      >
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigateToPage(item.path)}
            sx={{
              justifyContent: isMinimized ? 'center' : 'initial',
              px: isMinimized ? 1 : 2,
              py: 2,
              backgroundColor: isSelected(item.path) ? '444#' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                color: '#f8f4f8'
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isMinimized ? 0 : 2,
                justifyContent: 'center',
                color: isSelected(item.path) ? '#e26838' : '#f8f4f8',
                transition: 'margin 0.3s ease',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isMinimized && (
              <ListItemText
                primary={item.label}
                sx={{
                  color: isSelected(item.path) ? '#e26838' : '#f8f4f8',
                  opacity: isMinimized ? 0 : 1,
                  transition: 'opacity 0.3s ease, margin 0.3s ease',
                  marginLeft: isMinimized ? '0px' : '10px',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
