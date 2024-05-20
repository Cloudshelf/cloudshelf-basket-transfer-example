import { Container, interfaces } from 'inversify';
import React, { createContext, useContext } from 'react';

export const DependencyContext = createContext<Container | null>(null);

interface DependencyProviderProps {
    container: Container;
    children?: React.ReactNode;
}

export const DependencyProvider: React.FC<DependencyProviderProps> = ({ children, container }) => {
    return <DependencyContext.Provider value={container}>{children}</DependencyContext.Provider>;
};

export function useContainer(): Container {
    const container = useContext(DependencyContext);
    if (container === null) {
        throw new Error(`The dependency container should be defined`);
    }
    return container;
}

export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>): T {
    return useContainer().get<T>(identifier);
}
