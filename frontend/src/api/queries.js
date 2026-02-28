import { gql } from '@apollo/client';

// Общий запрос для получения списка комнат (используется везде)
export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      nodes {
        id
        name
      }
    }
  }
`;

// Запрос для страницы Energy
export const GET_ENERGY_DATA = gql`
  query GetEnergy($where: EnergyFilterInput, $after: String) {
    energy(
      first: 50, 
      after: $after, 
      where: $where, 
      order: { timestamp: DESC } 
    ) {
      nodes {
        id
        energyValue
        timestamp
        room { name }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;


export const GET_AIR_DATA = gql`
  query GetAir($where: AirQualityFilterInput, $after: String) {
    air(first: 50, 
      after: $after, 
      where: $where, 
      order: { timestamp: DESC } 
      ) {
      nodes {
        id
        co2
        humidity
        timestamp
        room { name }
      }
        pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MOTION_DATA = gql`
  query GetMotion($where: MotionFilterInput, $after: String) {
    motion(first: 50, 
      after: $after, 
      where: $where, 
      order: { timestamp: DESC } 
      ) {
      nodes {
        id
        motionDetected
        timestamp
        room { name }
      }
        pageInfo {
        hasNextPage
        endCursor
}
      totalCount
    }
  }
`;