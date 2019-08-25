/* @flow */
import { useCallback, useEffect, useState, useRef } from 'react';
import { AsyncStorage } from 'react-native';
import makeEventEmitter from 'event-emitter';

const subscriptionMap = {};
export class GlobalValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  setValue(value) {
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
      subscriptionMap[key] ?? new GlobalValue(key, defaultValue);
    if (value !== subscriptionMap[key].value) {
      _setValue(subscriptionMap[key].value);
    }
    subscriptionMap[key].on('change', _setValue);
    return () => subscriptionMap[key].off('change', _setValue);
  }, [key]);

  return [value, setValue];
}
