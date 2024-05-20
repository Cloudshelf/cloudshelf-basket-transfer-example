import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import DebounceLink from 'apollo-link-debounce';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

let cloudshelfApolloClient: ApolloClient<NormalizedCacheObject>;

const DEFAULT_DEBOUNCE_TIMEOUT = 500;

function assembleCookieHeader(cookies: NextApiRequestCookies): string {
    return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join(';');
}

function httpLinkPrefix(): string {
    return `https://ingestapi.cloudshelf.ai`;
}

function createCloudshelfApolloClient(cookies: NextApiRequestCookies | null): ApolloClient<NormalizedCacheObject> {
    const headers: { [key: string]: any } = !cookies ? {} : { Cookie: assembleCookieHeader(cookies) };

    const hostname = httpLinkPrefix();

    const authLink = setContext(async (_, { headers }) => {
        try {
            const authToken = 'YOUR API KEY HERE';
            return {
                headers: {
                    ...headers,
                    authorization: `token ${authToken}`,
                },
            };
        } catch (err) {
            console.error('Error setting auth token', err);
        }

        return {
            headers,
        };
    });

    const cloudshelfHttpLinks = ApolloLink.from([
        authLink,
        new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
        new HttpLink({ uri: `${hostname}/graphql`, headers }),
    ]);

    return new ApolloClient({
        // ssrMode: !isInBrowser,
        link: cloudshelfHttpLinks,
        cache: new InMemoryCache({
            addTypename: false,
        }),
        defaultOptions: {
            query: {
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },
    });
}

export function initializeCloudshelfApollo(
    initialState: NormalizedCacheObject | null = null,
    cookies: NextApiRequestCookies | null = null,
): ApolloClient<NormalizedCacheObject> {
    const _apolloClient = cloudshelfApolloClient ?? createCloudshelfApolloClient(cookies);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }
    // For SSG and SSR always create a new Apollo Client
    // if (!isInBrowser()) return _apolloClient;
    // Create the Apollo Client once in the client
    if (!cloudshelfApolloClient) cloudshelfApolloClient = _apolloClient;

    return _apolloClient;
}
