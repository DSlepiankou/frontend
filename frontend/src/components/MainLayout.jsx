import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';
import { Zap, Wind, Move, Home as HomeIcon } from 'lucide-react';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Smart Home Monitoring
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/energy">
              <ListItemIcon><Zap color="orange" /></ListItemIcon>
              <ListItemText primary="Energy" />
            </ListItem>
            <ListItem button component={Link} to="/air">
              <ListItemIcon><Wind color="skyblue" /></ListItemIcon>
              <ListItemText primary="Air Quality" />
            </ListItem>
            <ListItem button component={Link} to="/motion">
              <ListItemIcon><Move color="green" /></ListItemIcon>
              <ListItemText primary="Motion" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;