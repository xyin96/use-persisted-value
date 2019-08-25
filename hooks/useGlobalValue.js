/* @flow */
import { useCallback, useEffect, useState, useRef } from 'react';
import { AsyncStorage } from 'react-native';
import makeEventEmitter from 'event-emitter';

const subscriptionMap = {};
export class GlobalValue<T> {
  key: string;
  value: ?T;
  emit: (string, T) => void;
  on: (string, T => void) => void;
  off: (string, T => void) => void;

  constructor(key: string, value?: T) {
    this.key = key;
    this.value = value;
  }

  setValue(value: T) {
    this.value = value;
    this.emit('change', value);
  }

}
makeEventEmitter(GlobalValue.prototype);

export function useGlobalValue<T>(
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
      subscriptionMap[key] ?? new GlobalValue<T>(key, defaultValue);
    if (value !== subscriptionMap[key].value) {
      _setValue(subscriptionMap[key].value);
    }
    subscriptionMap[key].on('change', _setValue);
    return () => subscriptionMap[key].off('change', _setValue);
  }, [key]);

  return [value, setValue];
}
