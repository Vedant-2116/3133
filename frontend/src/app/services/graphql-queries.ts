import gql from 'graphql-tag';

export const SOME_QUERY = gql`
  {
    someQuery {
      someField
    }
  }
`;
