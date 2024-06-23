import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import CONST from '@/utils/getEnv';
import { WebSocket } from 'ws';

const httpLink = new HttpLink({
  uri: CONST.BASE_URL,
  headers: {
    // @ts-ignore
    'x-hasura-admin-secret': CONST.BASE_KEY,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://rare-monarch-97.hasura.app/v1/graphql`,
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': CONST.BASE_KEY,
      },
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  // ssrMode: true,
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
