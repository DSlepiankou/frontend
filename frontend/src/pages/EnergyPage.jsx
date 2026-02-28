import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client/core';
import { 
  GET_ROOMS, 
  GET_ENERGY_DATA 
} from '../api/queries';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Typography, CircularProgress, MenuItem, FormControl, 
  InputLabel, Select, Alert, Card, CardContent 
} from '@mui/material';

const EnergyPage = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
const { data: roomsData } = useQuery(GET_ROOMS);
 const { data, loading, fetchMore } = useQuery(GET_ENERGY_DATA, {
  variables: { 
    where: selectedRoom ? { roomId: { eq: selectedRoom } } : undefined,
    after: null // Начинаем с начала
  },
  // Это критично для того, чтобы fetchMore работал с merge
  notifyOnNetworkStatusChange: true, 
});

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  
  if (scrollHeight - scrollTop <= clientHeight + 100 && !loading) {
    if (data?.energy?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { 
          // Передаем курсор
          after: data.energy.pageInfo.endCursor,
          // ОБЯЗАТЕЛЬНО передаем тот же where, что и в основном запросе
          where: selectedRoom ? { roomId: { eq: selectedRoom } } : undefined,
        }
      });
    }
  }
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Energy</Typography>
      
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Select Room</InputLabel>
        <Select 
            value={selectedRoom} 
            label="Room" 
            onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <MenuItem value=""><em>All rooms</em></MenuItem>
          {roomsData?.rooms?.nodes.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
        </Select>
      </FormControl>

      <TableContainer component={Paper} onScroll={handleScroll} sx={{ maxHeight: '75vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Time</b></TableCell>
              <TableCell><b>Room</b></TableCell>
              <TableCell align="right"><b>Value</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.energy?.nodes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>{item.room?.name || '—'}</TableCell>
                <TableCell align="right">{item.energyValue.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default EnergyPage;