/* @flow */
import { useCallback, useEffect, useState, useRef } from 'react';
import { AsyncStorage } from 'react-native';
import makeEventEmitter from 'event-emitter';
import {GlobalValue} from './useGlobalValue';

const subscriptionMap = {};
class PersistedValue extends GlobalValue {
  constructor(key, defaultValue = '', initialize = true) {
    super(key, null);
    if (initialize) {
      this._initializationPromise = new Promise(resolve => {
        AsyncStorage.getItem(key).then(value => {
          try {
            this.setValue(JSON.parse(value ?? defaultValue));
          } catch (e) {
            this.setValue(value ?? defaultValue);
          }
          resolve();
        });
      });
    }
  }

  setValue(value) {
    super.setValue(value);
    return AsyncStorage.setItem(this.key, JSON.stringify(value));
  }
}
makeEventEmitter(PersistedValue.prototype);

export function usePersistedValue<T>(
  key: string,
  defaultValue?: T,
): [?T, (T) => void] {
  const [value, _setValue] = useState(subscriptionMap[key]?.value);
  const setValue = useCallback(value => subscriptionMap[key].setValue(value), [
    key,
  ]);

  useEffect(() => {
    // set initial value
    subscriptionMap[key] =
      subscriptionMap[key] ?? new PersistedValue(key, defaultValue);
    if (value !== subscriptionMap[key].value) {
      _setValue(subscriptionMap[key].value);
    }
    subscriptionMap[key].on('change', _setValue);
    return () => subscriptionMap[key].off('change', _setValue);
  }, [key]);

  return [value, setValue];
}

export function usePersistedValueOptimistic<T>(key: string, defaultValue: T) {
  return usePersistedValue(key, defaultValue) ?? defaultValue;
}

export function prefetchKey<T>(key: string, defaultValue: T) {
  subscriptionMap[key] =
    subscriptionMap[key] ?? new PersistedValue(key, defaultValue);
  return subscriptionMap[key]._initializationPromise;
}

export function setKey<T>(key: string, value: T) {
  subscriptionMap[key] =
    subscriptionMap[key] ?? new PersistedValue(key, value, false);
  return subscriptionMap[key].setValue(value);
}
