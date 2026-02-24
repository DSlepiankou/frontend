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
    const filter = selectedRoom 
    ? { roomId: { eq: selectedRoom } } 
    : undefined;
  // 1. Получаем список комнат для фильтра
  const { data: roomsData, loading: roomsLoading } = useQuery(GET_ROOMS);

  // 2. Получаем данные об энергии (обновляются при смене selectedRoom или каждые 5 сек)
  const { loading, error, data } = useQuery(GET_ENERGY_DATA, {
    variables: { 
      where: filter 
    },
    pollInterval: 5000,
  });

  if (error) return <Alert severity="error">Ошибка загрузки данных: {error.message}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Мониторинг Энергопотребления
      </Typography>

      <Card sx={{ mb: 4, backgroundColor: '#fafafa' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="room-select-label">Выберите комнату</InputLabel>
            <Select
              labelId="room-select-label"
              value={selectedRoom}
              label="Выберите комнату"
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={roomsLoading}
            >
              <MenuItem value="">
                <em>Все комнаты</em>
              </MenuItem>
              {roomsData?.rooms?.nodes.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            Всего записей: {data?.energy?.totalCount || 0}
          </Typography>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        {loading && !data ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader aria-label="energy data table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}><b>Дата и время</b></TableCell>
                <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}><b>Комната</b></TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#1976d2', color: '#fff' }}><b>Значение (кВт⋅ч)</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.energy?.nodes.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{item.room?.name || '—'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                    {item.energyValue.toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
              {data?.energy?.nodes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    Нет данных для отображения. Проверьте работу эмулятора и Processor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default EnergyPage;