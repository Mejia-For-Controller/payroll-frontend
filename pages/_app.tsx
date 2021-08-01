//import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import './App.css'
import type { AppProps } from 'next/app'
//import './App.css';
import Head from 'next/head'
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import React, { useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
//import TableauEmbed from './tableau'

import Navbar from '../components/navbar'
//import {Budget} from './budget'

import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function MyApp({ Component, pageProps }: AppProps) {
  //import logo from './logo.svg';



  return (
    <div className='height100'>
      <Head>
        <meta property='twitter:site' content='@kennethmejiala' />
        <script key='tableauscript' src='https://public.tableau.com/javascripts/api/tableau-2.min.js'></script>
      </Head>
      <Navbar/>
      <Component {...pageProps} class='height100'/>
    </div>
  );  
           


}
        

export default MyApp
