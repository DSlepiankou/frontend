import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ROOMS, GET_AIR_DATA } from '../api/queries';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Typography, MenuItem, FormControl, InputLabel, Select 
} from '@mui/material';

const AirQualityPage = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const { data: roomsData } = useQuery(GET_ROOMS);

  // Формируем фильтр: если комната не выбрана, отправляем undefined
  const filter = selectedRoom ? { roomId: { eq: selectedRoom } } : undefined;

  const { loading, data } = useQuery(GET_AIR_DATA, {
    variables: { where: filter },
    pollInterval: 5000,
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Качество воздуха</Typography>
      <FormControl sx={{ minWidth: 300, mb: 3 }}>
        <InputLabel>Выберите комнату</InputLabel>
        <Select value={selectedRoom} label="Выберите комнату" onChange={(e) => setSelectedRoom(e.target.value)}>
          <MenuItem value=""><em>Все комнаты</em></MenuItem>
          {roomsData?.rooms?.nodes.map((room) => (
            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Время</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Комната</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>CO2 (ppm)</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Влажность (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.air?.nodes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>{item.room?.name || '—'}</TableCell>
                <TableCell align="right">{item.co2.toFixed(0)}</TableCell>
                <TableCell align="right">{item.humidity.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AirQualityPage;