# use-persisted-value
## Usage

### usePersistedValue
```
import * as React from 'react';
import {usePersistedValue} from 'use-persisted-value';

function MyComponent() {
  const [theme, setTheme] = usePersistedValue('ui:theme');

  if (theme == null) {
    // not yet loaded
    return null;
  }

  // render ui
  return <App theme={theme} />
}
```

### prefetchKey
```
import {prefetchKey} from 'use-persisted-value';

function loadResources() {
  return Promise.all([
    prefetchKey('ui:theme'),
  ]);
}
```

### setKey
```
import {setKey} from 'use-persisted-value';

function clearTheme() {
  return Promise.all([
    setKey('ui:theme', 'light'),
  ]);
}
```
