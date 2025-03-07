"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity, // Never mark data as stale
            gcTime: Infinity,    // Never garbage collect
            retry: false,        // Don't retry failed requests
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false
          },
        },
      })
  );

  const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    key: 'muzo-cache',
    serialize: data => JSON.stringify(data),
    deserialize: str => JSON.parse(str)
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ 
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: () => true // Cache everything
        }
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
} 