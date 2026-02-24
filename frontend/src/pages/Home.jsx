import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Home = () => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom>Welcome!</Typography>
    <Typography variant="body1">
      Select a category from the menu on the left to view real-time sensor data.
    </Typography>
  </Paper>
);

export default Home;