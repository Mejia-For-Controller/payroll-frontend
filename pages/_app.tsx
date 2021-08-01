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
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
        <script src='https://public.tableau.com/javascripts/api/tableau-2.min.js'></script>
        <meta name="twitter:title" content="Los Angeles Employee Payroll 2020 -Employee Names and Salaries"></meta>
<meta name="twitter:description" content="Search Names and Job Titles and see their Salaries and Benefits."></meta>
<meta name="twitter:image" content="https://data.mejiaforcontroller.com/cityworkercard.png"></meta>
      </Head>
      <Navbar/>
     
      <Component {...pageProps} class='height100'/>
    </div>
  );  
           


}
        

export default MyApp
