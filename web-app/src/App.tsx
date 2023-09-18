import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import GCIntlProvider from './containers/GCIntlProvider';
import { store } from './store';
import { updateLocalesThunk } from './store/locales/actions';
import { initUserFromStorage } from './store/user/actions';

// import DesktopApp from './DesktopApp';
import DesktopApp from './DesktopApp';
import './App.css';

store.dispatch(updateLocalesThunk('en'));
store.dispatch(initUserFromStorage());

function App() {
  const renderDesktopApp = () => {
    return <DesktopApp />;
  };

  return (
    <React.StrictMode>
      <Provider store={store}>
        <GCIntlProvider>
          <IntlProvider locale="ko">
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route path="*" render={renderDesktopApp} />
                </Switch>
              </Suspense>
            </BrowserRouter>
          </IntlProvider>
        </GCIntlProvider>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
