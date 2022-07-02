export module "use-persisted-value" {
    export function useGlobalValue<T>(
        storageKey: string,
        defaultValue?: T,
    ): [?T, (newValue: T) => void];

    export function usePersistedValue<T>(
        storageKey: string,
        defaultValue?: T,
    ): [?T, (newValue: T) => void];

    export function usePersistedValueOptimistic<T>(key: string, defaultValue: T): [?T, (newValue: T)];

    export function prefetchKey<T>(key: string, defaultValue: T): Promise<void>;

    export function setKey<T>(key: string, value: T): void | Promise<void>;
}