import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Sentry from "@sentry/react";
// If taking advantage of automatic instrumentation (highly recommended)
import { Integrations as TracingIntegrations } from "@sentry/tracing";
// Or, if only manually tracing
// import * as _ from "@sentry/tracing"
// Note: You MUST import the package in some way for tracing to work
import { Integrations } from "@sentry/tracing";
import App from './App';
import reportWebVitals from './reportWebVitals';
import TagManager from 'react-gtm-module'

Sentry.init({
  dsn: "https://274fc6e6e9b54ecc96a67ef921dd64c5@o931607.ingest.sentry.io/5880538",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});



const tagManagerArgs = {
    gtmId: 'GTM-MQG62S5'
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)