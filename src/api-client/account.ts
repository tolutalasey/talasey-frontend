import { toPlacedOrder, type PlacedOrder } from './basket';
import { ApiError, createApiClient, unwrap, type ApiClientOptions } from './client';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;
type AccountDto = Json<paths['/store/account']['get']['responses'][200]>;

export interface AccountOrder extends PlacedOrder {
  placedAt: string;
  cancelled: boolean;
}

export interface Account {
  email: string;
  orders: AccountOrder[];
  samples: AccountDto['samples'];
}

const statusOf = (error: unknown) => (error instanceof ApiError ? error.status : null);

// Customer accounts: a sign-in link by email, and the orders and samples for that address.
export function createAccountClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    sendLink: (email: string) =>
      unwrap(api.POST('/store/account/sign-in-link', { body: { email } })),

    // A link that has expired or was used already gives null.
    redeem: async (token: string) => {
      try {
        return await unwrap(api.POST('/store/account/sessions', { body: { token } }));
      } catch (error) {
        if (statusOf(error) === 400) return null;
        throw error;
      }
    },

    // Null when the session has ended.
    account: async (sessionToken: string): Promise<Account | null> => {
      const signedIn = createApiClient({ ...options, token: sessionToken });
      try {
        const account = await unwrap(signedIn.GET('/store/account'));
        return {
          email: account.email,
          samples: account.samples,
          orders: account.orders.map((order) => ({
            ...toPlacedOrder(order),
            placedAt: order.createdAt,
            cancelled: order.status === 'cancelled',
          })),
        };
      } catch (error) {
        if (statusOf(error) === 401) return null;
        throw error;
      }
    },

    signOut: (sessionToken: string) =>
      unwrap(
        createApiClient({ ...options, token: sessionToken }).DELETE('/store/account/sessions'),
      ),
  };
}

export type AccountClient = ReturnType<typeof createAccountClient>;
