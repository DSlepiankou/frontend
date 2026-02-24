import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import client from './api/client';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import EnergyPage from './pages/EnergyPage';
import AirQualityPage from './pages/AirQualityPage';
import MotionPage from './pages/MotionPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/energy" element={<EnergyPage />} />
            <Route path="/air" element={<AirQualityPage />} />
            <Route path="/motion" element={<MotionPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ApolloProvider>
  );
}

export default App;