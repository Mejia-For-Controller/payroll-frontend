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

//import Navbar from '../components/navbar'
//import {Budget} from './budget'

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
    <div className='h-screen'>
      <Head>
     
      <link rel="icon" href="https://mejiaforcontroller.com/wp-content/uploads/2020/12/favicon.png" type="image/x-icon" />
        <meta property='twitter:site' content='@kennethmejiala' />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </Head>
      <Component {...pageProps} class='height100'/>
    </div>
  );  
           


}
        

export default MyApp
