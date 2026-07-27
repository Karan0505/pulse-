"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useState } from "react";
import { makeApolloClient } from "@/lib/apollo-client";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => makeApolloClient());
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
