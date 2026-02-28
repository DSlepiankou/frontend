import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ROOMS, GET_AIR_DATA } from '../api/queries';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Typography, MenuItem, FormControl, InputLabel, Select , CircularProgress
} from '@mui/material';

const AirQualityPage = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const { data: roomsData } = useQuery(GET_ROOMS);

  // Формируем фильтр: если комната не выбрана, отправляем undefined
  //const filter = selectedRoom ? { roomId: { eq: selectedRoom } } : undefined;

  const { loading, data, fetchMore } = useQuery(GET_AIR_DATA, {
    variables: { 
      where: selectedRoom ? { roomId: { eq: selectedRoom } } : undefined,
      after: null // Начинаем с начала
    },
    notifyOnNetworkStatusChange: true,
  });

 const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  
  if (scrollHeight - scrollTop <= clientHeight + 100 && !loading) {
    if (data?.air?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { 
          // Передаем курсор
          after: data.air.pageInfo.endCursor,
          // ОБЯЗАТЕЛЬНО передаем тот же where, что и в основном запросе
          where: selectedRoom ? { roomId: { eq: selectedRoom } } : undefined,
        }
      });
    }
  }
};


  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Air Quality</Typography>
      <FormControl sx={{ minWidth: 300, mb: 3 }}>
        <InputLabel>Select Room</InputLabel>
        <Select 
        value={selectedRoom} l
        label="Select Room" 
        onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <MenuItem value=""><em>All Rooms</em></MenuItem>
          {roomsData?.rooms?.nodes.map((room) => (
            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} onScroll={handleScroll} sx={{maxHeight:'75vh'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Time</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Room</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>CO2 (ppm)</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Humidity (%)</TableCell>
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
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default AirQualityPage;