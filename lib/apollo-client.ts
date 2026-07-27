import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { schema } from "./graphql/schema";

// SchemaLink executes GraphQL operations directly against the local schema
// instead of over HTTP. This keeps every query/mutation/component exactly
// as they will look once a real Apollo Server / GraphQL Yoga endpoint is
// swapped in — only this file changes at that point (swap SchemaLink for
// HttpLink pointed at the real API URL).
export function makeApolloClient() {
  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });
}
