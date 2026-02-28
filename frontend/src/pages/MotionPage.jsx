import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ROOMS, GET_MOTION_DATA } from '../api/queries';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Typography, MenuItem, FormControl, InputLabel, Select, Chip 
} from '@mui/material';
import { AlignCenter } from 'lucide-react';

const MotionPage = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const { data: roomsData } = useQuery(GET_ROOMS);

  const filter = selectedRoom ? { roomId: { eq: selectedRoom } } : undefined;

  const { loading, data } = useQuery(GET_MOTION_DATA, {
    variables: { where: filter },
    pollInterval: 5000,
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Motion detectors</Typography>

      <FormControl sx={{ minWidth: 300, mb: 3 }}>
        <InputLabel>Select room</InputLabel>
        <Select
          value={selectedRoom}
          label="Select room"
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <MenuItem value=""><em>All rooms</em></MenuItem>
          {roomsData?.rooms?.nodes.map((room) => (
            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}><b>Time</b></TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}><b>Room</b></TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff', }}><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.motion?.nodes.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>{item.room?.name || '—'}</TableCell>
                <TableCell align="center">
                  {item.motionDetected ? (
                    <Chip label="Motion" color="error" variant="filled" />
                  ) : (
                    <Chip label="Quite" color="success" variant="outlined" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MotionPage;