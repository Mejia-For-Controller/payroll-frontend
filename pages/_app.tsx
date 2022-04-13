//import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import './App.css'
import type { AppProps } from 'next/app'
//import './App.css';
import Head from 'next/head'
/* This example requires Tailwind CSS v2.0+ */
import React, { useEffect } from 'react'

import TagManager from 'react-gtm-module'
//import TableauEmbed from './tableau'
import { MantineProvider } from '@mantine/core';


//import Navbar from '../components/navbar'
//import {Budget} from './budget'

import { datadogRum } from '@datadog/browser-rum';
try {
  datadogRum.init({
    applicationId: '0f167d08-abab-4f76-bdc7-71efacca54d8',
    clientToken: 'pub15407666c25ebb17ff50cdde4892057f',
    site: 'datadoghq.com',
    service:'payroll',
    // Specify a version number to identify the deployed version of your application in Datadog 
    version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'allow'
  });
    
  datadogRum.startSessionReplayRecording();
} catch (datadogerr) {
  console.error(datadogerr)
}

const tagManagerArgs = {
  gtmId: 'GTM-MQG62S5'
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function MyApp({ Component, pageProps }: AppProps) {
  //import logo from './logo.svg';

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <div className='h-full'>
      <Head>
     
      <link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/favicon.png" type="image/x-icon" />
        <meta property='twitter:site' content='@kennethmejiala' />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </Head>
      <MantineProvider theme={{ colorScheme: 'dark' }}>
      <Component {...pageProps} class='h-full'/>
      </MantineProvider>
    </div>
  );  
           


}
        

export default MyApp
