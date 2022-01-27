//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'

import PayrollNav from '../components/payrollnav'

import { Tab } from '@headlessui/react'

import Head from 'next/head'

import React from 'react'
import dynamic from 'next/dynamic'

export class  Payroll extends React.Component<any, any> {
  constructor(props: any) {

    super(props);
    this.state = {
        filterpanel: true,
        sortpanel: true
    };
  }

  render () {
    return (
      <div className='height100'>
    <Head>
    <title>Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Employee Names and Payroll"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!"></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
    </Head>
    <div suppressHydrationWarning={true} className='height100 bg-truegray-900 text-white'>
      <PayrollNav />
      <React.StrictMode>
        <div>
          <div className='flex flex-row pl-1 mt-2 text-lg space-x-2  flex flex-row align-middle space-x-1'>
         
            <div className={`font-semibold rounded-full  pl-3 pr-3 py-1  border border-2 border-gray-50 bg-truegray-200 ${this.state.filterpanel ? 'bg-truegray-100 text-coolgray-900' : 'bg-truegray-800'}`}>
            <svg  className={` h-6 w-6 align-bottom inline-block align-text-bottom  ${this.state.filterpanel ? 'text-coolgray-900' : 'bg-truegray-800'}`}  viewBox="0 0 24 24">
    <path fill="currentColor" d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
</svg>
              Filter
            </div>
            <div className='font-semibold rounded-full bg-truegray-800  pl-3 pr-4 py-1 border border-2 border-gray-50 flex flex-row align-middle space-x-1'>
            <svg className='text-white h-5 w-5 align-bottom inline-block align-text-bottom relative top-1' viewBox="0 0 24 24">
    <path fill="currentColor" d="M19 17H22L18 21L14 17H17V3H19V17M7 3C4.79 3 3 4.79 3 7S4.79 11 7 11 11 9.21 11 7 9.21 3 7 3M7 9C5.9 9 5 8.1 5 7S5.9 5 7 5 9 5.9 9 7 8.1 9 7 9M7 13C4.79 13 3 14.79 3 17S4.79 21 7 21 11 19.21 11 17 9.21 13 7 13Z" />
</svg>
              <span className='align-middle'>Sort</span>
            </div>
          </div>
        </div>
  </React.StrictMode>
   
      </div></div>
    )
  }
}

function PayrollFunc() {
  return <div className='height100'>
    <Head>
    <title>Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Employee Names and Payroll"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!"></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
    </Head>
    <div suppressHydrationWarning={true} className='height100 bg-truegray-900 text-white'>
      <PayrollNav />
      <React.StrictMode>
        <div>
          <div className='flex flex-row'>
            <div className='rounded-full bg-truegray-800'>
              Filter
            </div>
            <div className='rounded-full bg-truegray-800'>
              Sort
            </div>
          </div>
        </div>
  </React.StrictMode>
   
      </div></div>
}

export default Payroll