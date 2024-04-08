import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  // Example query method
  getSomeData() {
    return this.apollo.watchQuery({
      query: gql`
        {
          someQuery {
            someField
          }
        }
      `,
    }).valueChanges;
  }
}
