# use-persisted-value
## Usage

### usePersistedValue
We also keep a list of subscribers, so any mounted react components that use this hook will be notified of the update if you call `setTheme`.
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

## How does this differ from Context?
This is not a replacement for Context. Context API is good for *React Hierarchy scoped variables* such as form state, theming, etc. But this lets you create global *singleton* variables that React Components can *subscribe* to, and retain its value between app starts.
