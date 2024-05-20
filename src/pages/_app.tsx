import 'reflect-metadata';
import '@/styles/globals.css';
import dependencyContainer from '@/dependency-injection/DependencyContainer';
import { DependencyProvider } from '@/dependency-injection/DependencyContext';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <DependencyProvider container={dependencyContainer}>
            <Component {...pageProps} />
        </DependencyProvider>
    );
}
