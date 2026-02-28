import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8080/graphql' }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          energy: {
            // Указываем, что пагинация зависит от фильтра, 
            // но НЕ зависит от курсора after
            keyArgs: ["where"], 

            merge(existing, incoming, { args }) {
              // Если это самая первая загрузка (курсора нет), 
              // просто возвращаем новые данные
              if (!existing || !args?.after) {
                return incoming;
              }

              // Берем старые узлы и добавляем к ним новые
              const existingNodes = existing.nodes || [];
              const incomingNodes = incoming.nodes || [];
              
              return {
                ...incoming, // Сохраняем актуальные pageInfo и totalCount
                nodes: [...existingNodes, ...incomingNodes],
              };
            },
          },
        },
      },
    },
  }),
});

export default client;