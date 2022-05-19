//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'
import PayrollNav from '../components/payrollnav'

import { Tab } from '@headlessui/react'

import Head from 'next/head'

import config from './depts.json'

import React, { useEffect, Fragment, useState, useRef } from 'react'

import { mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending, mdiSortAscending } from '@mdi/js';
import dynamic from 'next/dynamic'

import { io } from "socket.io-client";

import { AutocompleteBox } from '../components/AutocompleteBox'
import { Autocomplete } from '../components/Autocomplete'
import _ from 'lodash';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { CheckboxGroup, Checkbox } from '@mantine/core';
import { ArrowUpIcon } from '@modulz/radix-icons';
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Text, Transition as MantineTransition, SegmentedControl, Center, RadioGroup, Radio, Box } from '@mantine/core';

const depts = config.depts;

const yearsofpayroll = [
  "2018", "2019", "2020", "2021"
]


const makePercent = (num, dem) => {
  return parseFloat(((num / dem) * 100).toFixed(2))
}

function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <MantineTransition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftIcon={<ArrowUpIcon />}
              style={transitionStyles}
              className='bg-mejito text-black hover:bg-mejito bg-opacity-90 hover:bg-opacity-100'
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </MantineTransition>
      </Affix>
    </>
  );
}

export function isInViewport(element: any, buffer: any) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight + buffer || document.documentElement.clientHeight + buffer) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function excelnum(number) {
  return Math.round(number).toLocaleString();
}

interface payrollprops {

}

export default function PayrollFunc(props: payrollprops) {
  var lastreqf;
  var lastreqrowcount;
  var lastreql;
  var lastreqd;

  var [selectedyear, setselectedyear] = useState('2021');
  var [currentlyLoadedYear, setCurrentlyLoadedyear] = useState(null);
  var [numberoftotalrows, setnumberoftotalrows] = useState(0);
  var [entiresetcount, setentiresetcount] = useState(1);
  var [loadedfirsttime, setloadedfirsttime] = useState(false);
  var [filterpanel, setfilterpanel] = useState(true);
  var [sortpanel, setsortpanel] = useState(true);
  var [socketconnected, setsocketconnected] = useState(false);
  var [enableddept, setenableddept] = useState<string[]>(depts);
  var [deptpanelopen, setdeptpanelopen] = useState(false);
  var [filterfirstname, setfilterfirstname] = useState("");
  var [filterlastname, setfilterlastname] = useState("");
  var [filterjobtitle, setfilterjobtitle] = useState("");
  var [loadedEmployeeRows, setLoadedEmployeeRows] = useState([]);
  var [arrayOfResultsMetadata, setarrayOfResultsMetadata] = useState([]);
  var [currentlyLoadedMetadata, setCurrentlyLoadedMetadata] = useState({
    f: "0000000000",
    l: "00000000000",
    j: "0000000000",
    d: ['000000000'],
    year: '0000000000000',
    totalFiltered: 99999
  })
  const lastRefBuffer70 = useRef(null);
  const lastRefMobileBuffer15 = useRef(null);
  const lastRefMobile = useRef(null);
  const lastRefSecondLast = useRef(null);
  const lastRef = useRef(null);
  let socket = useRef(null);

  const setLastObjRefMobile = (ref, EmployeeIndex, length) => {
    if (length - 1 === EmployeeIndex) {
      lastRefMobile.current = ref
    }

    if (length - 15 === EmployeeIndex) {
      lastRefMobileBuffer15.current = ref
    }

  }

  const setLastObjRef = (ref, EmployeeIndex, length) => {
    if (length > 70) {
      if (loadedEmployeeRows.length - 1 - 70 === EmployeeIndex) {
        lastRefBuffer70.current = ref
      }
    }

    if (loadedEmployeeRows.length - 1 === EmployeeIndex) {
      lastRef.current = ref

    }

    if (loadedEmployeeRows.length - 2 === EmployeeIndex) {
      lastRefSecondLast.current = ref

    }

  }

  const toggleFilterButton = () => {
    setfilterpanel(!filterpanel)
  }

  const toggleDeptPanel = () => {
    setdeptpanelopen(!deptpanelopen)
  }

  const departmentsSelectedRender = () => {
    var numberSelected = enableddept.length;
    var totalOptions = depts.length;

    if (numberSelected === totalOptions) {
      return "All " + totalOptions;
    } else {
      if (numberSelected === 1) {
        var singledept = enableddept[0]

        return `${singledept}`
      } else {
        return `${numberSelected} of ${totalOptions}`
      }
    }
  }

  const labelDeptProcess = (input) => {
    return input.replace(/Economic & Workforce Development/g, "Economic & Workforce Dev")
  }


//  const [filterArray, setFilterArray] = useState<string[]>(depts);

  const setAllDeptFilter = (event) => {
    setenableddept(depts)
  }

  const setNoneDeptFilter = (event) => {
    setenableddept([])
  }

  const invertDeptFilter = (event) => {
    setenableddept(depts.filter(n => !enableddept.includes(n)))
  }

  var urlParams = undefined;

  if (typeof window !== 'undefined') {
    console.log('You are on the browser')
    urlParams = new URLSearchParams(window.location.search);
    // ✅ Can use window here
  } else {
    console.log('You are on the server')
    // ⛔️ Don't use window here
  }

  var payrollserverendpoint: string = "https://api.payroll.mejiaforcontroller.com"

  if (urlParams !== undefined) {
    if (urlParams.get('devport')) {
      payrollserverendpoint = "http://localhost:4927";
    }
  }

  if (socket.current === null) {
    socket.current = io(payrollserverendpoint, {
      'reconnection': true,
      'reconnectionDelay': 500,
      'reconnectionAttempts': 999999,
      autoConnect: false
    });
  }


  socket.current.on("result", (message: any) => {
    console.log('result came in')

    var toloadrows = loadedEmployeeRows

    //if loaded states matches incoming state
    if (message.meta.newseq === false) {
      console.log('append')
      toloadrows = [...toloadrows, ...message.employeePortion]
    } else {
        console.log('new')
      toloadrows = message.employeePortion
    }

    //  console.log('change employee state to', toloadrows)


   // this.currentlyLoadedF = message.meta.f;

    //  console.log('setting to ', message.meta.f);

    //  console.log('result ', this.currentlyLoadedF)
/*
    this.currentlyLoadedL = message.meta.l;
    this.currentlyLoadedJ = message.meta.j;
    this.currentlyLoadedD = message.meta.d;
    this.currentlyLoadedYear = message.meta.year
    // console.log(message)
    this.currentlyLoadedMetadata = {
      active: true,
      totalFiltered: message.meta.totalFiltered,
      f: message.meta.f,
      l: message.meta.l,
      j: message.meta.j,
      d: message.meta.d,
      year: message.meta.year
    }*/

    /*
    return {
      entiresetcount: message.meta.entiresetcount,
      numberoftotalrows: message.meta.totalFiltered,
      loadedfirsttime: true,
      loadedEmployeeRows: toloadrows,
      currentlyLoadedF: message.meta.f,
      currentlyLoadedL: message.meta.l,
      currentlyLoadedJ: message.meta.j,
      currentlyLoadedD: message.meta.d,
      currentlyLoadedYear: message.meta.year
    }*/
    
    setLoadedEmployeeRows(toloadrows);
    setentiresetcount(message.meta.entiresetcount);
    setnumberoftotalrows(message.meta.totalFiltered);
    setloadedfirsttime(true);
    setCurrentlyLoadedMetadata(message.meta);
    

  });

  const getNewData = () => {

    var newSeq: boolean = true;

    //var deptvaluetosubmit = this.getParsedDeptFilter()

    //console.log('getnewfunc says f is', this.state.currentlyLoadedF)

    if (filterfirstname == currentlyLoadedMetadata.f
      && filterlastname == currentlyLoadedMetadata.l
      && filterjobtitle == currentlyLoadedMetadata.j
      //    && deptvaluetosubmit == this.state.currentlyLoadedD
      && enableddept == currentlyLoadedMetadata.d
      && selectedyear == currentlyLoadedMetadata.year
    ) {
      console.log('not new seq')

      newSeq = false;
    } else {

      console.log('new seq')
    }

    var preventNextLoadBecauseRowsAreAllDone = false;

    if (true) {
      if (currentlyLoadedMetadata.totalFiltered <= loadedEmployeeRows.length &&
        currentlyLoadedMetadata.f === filterlastname &&
        currentlyLoadedMetadata.l === filterlastname &&
        currentlyLoadedMetadata.j === filterjobtitle &&
        currentlyLoadedMetadata.year === selectedyear &&
        currentlyLoadedMetadata.d === enableddept
      ) {
        preventNextLoadBecauseRowsAreAllDone = true
      }
    }

    //console.log('repeat load', preventNextLoadBecauseRowsAreAllDone)

    if (preventNextLoadBecauseRowsAreAllDone === false) {

        console.log('emitting')

      var emitobj = {
        loadedEmployeeRowsCount: loadedEmployeeRows.length,
        requestedFilters: {
          f: filterfirstname,
          l: filterlastname,
          j: filterjobtitle,
          d: enableddept
        },
        requestedYear: selectedyear,
        newSeq: newSeq
      }

      console.log('emitobj', emitobj)

      socket.current.emit("employeereq", emitobj)
    }


  }
  
 

 

  const attemptConnectSocket = () => {
    //   console.log('socket status main page', this.socketmain.connected)
    if (socketconnected) {
    } else {
      socket.current.connect();
    }
  }

  function handleClick(e) { if (e) { e.preventDefault() }; }

  const checkIfLoadMore = () => {
    var loadMore = false;

    var actOn = []

    if (window.innerWidth >= 768) {

      actOn = [lastRef.current, lastRefBuffer70.current]
    } else {

      actOn = [lastRefMobile.current, lastRefMobileBuffer15.current]

    }

    actOn.forEach((eachItem) => {
      if (eachItem) {
        if (isInViewport(eachItem, 100)) {
          loadMore = true
        }
      }
    })


    if (loadMore) {
      getNewData();
    }

  }

  socket.current.on("connect", () => {
    setsocketconnected(true)
    getNewData();
  });

  useEffect(() => {
    console.log('useeffect new change')
    getNewData();
  }, [filterfirstname, filterlastname, filterjobtitle, enableddept, selectedyear])

  useEffect(() => {
    attemptConnectSocket();
  },[]);

  return (
    <div className='h-full'>


      <div className='w-full h-full overflow-x-clip bg-truegray-900'>


        <Head>
          <title>Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!</title>
          <meta property="og:type" content="website" />
          <meta name="twitter:site" content="@kennethmejiala" />
          <meta name="twitter:creator" content="@kennethmejiala" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" key='twittertitle' content="City of LA Employee Names and Payroll"></meta>
          <meta name="twitter:description" key='twitterdesc' content="Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!"></meta>
          <meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css" integrity="sha256-TehzF/2QvNKhGQrrNpoOb2Ck4iGZ1J/DI4pkd2oUsBc=" crossOrigin="anonymous" />

          <script defer={true} src="https://helianthus.mejiaforcontroller.com/index.js"></script>
        </Head>
        <div suppressHydrationWarning={true} className='bg-truegray-900 text-white h-content'>
          < ScrollToTop />
          <PayrollNav />
          <React.StrictMode>
            <div className='flex flex-col '
              onScroll={e => {
                console.log('scroll')
              }}
            >
              <div className='font-semibold flex flex-row pl-1 mt-2 text-base md:text-lg space-x-2 flex flex-row align-middle space-x-1'>

                <div className="">
                  <Listbox value={selectedyear} onChange={setselectedyear}>
                    <div className="">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-truegray-800 rounded-lg border-white border shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-green-300 focus-visible:ring-offset-2 focus-visible:border-green-500 sm:text-sm">
                        <span className="block truncate">{selectedyear}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options
                          style={
                            {
                              zIndex: 30
                            }
                          }
                          className="absolute py-1 mt-1 overflow-auto text-base bg-truegray-800 rounded-md border-truegray-200 border shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {yearsofpayroll.map((eachyear, yearIdx) => (
                            <Listbox.Option
                              key={yearIdx}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-10 pr-4 bg-truegray-900 hover:bg-truegray-800 hover:shadow-sm ${active ? 'text-amber-100 bg-amber-900' : 'text-white'
                                }`
                              }
                              value={eachyear}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {eachyear}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <button
                  onClick={() => toggleFilterButton()}
                  className={` rounded-full  pl-3 pr-3 py-1  border border-2 border-gray-50 bg-truegray-200 ${filterpanel ? 'bg-truegray-100 text-coolgray-900' : 'bg-truegray-800'}`}>
                  <svg className={` h-6 w-6 align-bottom inline-block align-text-bottom  ${filterpanel ? 'text-coolgray-900' : 'bg-truegray-800'}`} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
                  </svg>
                  Filter
                </button>
                <div className='rounded-full bg-truegray-800  pl-3 pr-4 py-1 border border-2 border-gray-50 flex flex-row align-middle space-x-1'>
                  <svg className='text-white h-5 w-5 align-bottom inline-block align-text-bottom relative top-1' viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 17H22L18 21L14 17H17V3H19V17M7 3C4.79 3 3 4.79 3 7S4.79 11 7 11 11 9.21 11 7 9.21 3 7 3M7 9C5.9 9 5 8.1 5 7S5.9 5 7 5 9 5.9 9 7 8.1 9 7 9M7 13C4.79 13 3 14.79 3 17S4.79 21 7 21 11 19.21 11 17 9.21 13 7 13Z" />
                  </svg>
                  <span className='align-middle'>Sort</span>
                </div>
                <div className='hidden md:block my-auto ml-auto pl-2'>
                  {
                    loadedfirsttime === true && (
                      <>
                        <span className='font-semibold'>{numberoftotalrows.toLocaleString("en-US")}</span> <span className='font-normal'>({makePercent(numberoftotalrows, entiresetcount)}%) Filtered of </span> <span className='font-semibold'>{entiresetcount.toLocaleString("en-US")}</span>
                      </>
                    )
                  }
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-x-2'>
                {

                  true &&
                  (//absolute bottom-0 

                    <div id='filterpanel' className={`mt-2 w-full md:w-6/12 md:static md:mt-2 md:ml-2 bg-truegray-800 px-3 py-1 ${filterpanel === false ? 'hidden' : ''}`}>
                      <div className='flex flex-row'>

                        <p className='text-base md:text-lg'>Filter Employees</p>


                      </div>
                      <div className='flex flex-col sm:flex-row md:flex-col sm:space-x-2 md:space-y-2 md:space-x-0'>
                        <div className='flex flex-col md:flex-row sm:w-full'>
                          <p className='text-sm md:text-base grow md:w-28'>First Name</p>
                          <AutocompleteBox
                            index='PayrollFirstNames'
                            parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                            inputClasses='bg-truegray-700 '
                            placeholder='Search First Name'
                            col='First Name'
                            onChange={setfilterfirstname}
                          ></AutocompleteBox>
                        </div>
                        <div className='flex flex-col md:flex-row sm:w-full'>
                          <p className='text-sm md:text-base md:w-28'>Last Name</p>
                          <AutocompleteBox
                            index='PayrollLastName'
                            parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                            inputClasses='bg-truegray-700 '
                            placeholder='Search Last Name'
                            col='Last Name'
                            onChange={setfilterlastname}
                          ></AutocompleteBox>
                        </div>
                      </div>

                      <div className={`flex flex-row md:flex-row md:w-full ${deptpanelopen === true ? "-z-10 block" : "block"} md:z-0`}

                      >
                        <p className='text-sm md:text-base'>Job Title</p>
                        <AutocompleteBox
                          index='PayrollEmployeeList'
                          parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                          placeholder='Search Job Title'
                          col='Job Title'
                          onChange={(value) => {
                            setfilterjobtitle(value)
                          }}
                        ></AutocompleteBox>


                      </div>

                      <div className='flex flex-row md:w-full space-x-2 align-middle mt-2'>
                        <p className='text-sm md:text-base align-middle my-auto'>Departments</p>
                        <button
                          onClick={(event) => { toggleDeptPanel() }}
                          className='rounded-full border-2 pl-3 pr-2 py-0.5 border-truegray-400 hover:bg-truegray-600 bg-truegray-700 flex flex-row'>
                          {departmentsSelectedRender()}
                          <svg className='w-7 h-7 my-auto relative bottom-0.5' viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                          </svg>
                        </button>
                      </div>

                      {
                        true && (

                          <div className={`bg-truegray-800 h-full flex flex-col fixed top-0 bottom-0 md:relative md:h-full overflow-y-clip left-0 w-full md:w-auto
${deptpanelopen === false ? 'hidden' : ""}
`}

                            style={
                              {
                                zIndex: 20
                              }
                            }
                          >
                            <div className='border-b-1 border-truegray-600 px-2 mt-2 pb-4 md:pb-4 md:pt-2 md:pb-0 sticky h-content bg-truegray-800 flex flex-col'>
                              <div className='flex'>
                                <h2 className='font-bold text-base md:text-lg'>Filter Depts</h2>
                                <button className='ml-auto mr-2 md:hidden'
                                  onClick={(event) => { toggleDeptPanel() }}
                                >
                                  <svg className='h-10 w-10' viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                  </svg>
                                </button>
                              </div>
                              <div
                                className='my-auto grow-0 '
                              >

                                <div className='flex flex-row gap-x-1'>
                                  <button className='align-middle bg-gray-800 rounded-lg px-1  border border-gray-400 text-sm md:text-base'
                                    onClick={setAllDeptFilter}

                                  >Select All</button>
                                  <button className='align-middle bg-gray-800 rounded-lg px-1 text-sm md:text-base border border-gray-400'
                                    onClick={setNoneDeptFilter}
                                  >Unselect All</button>
                                  <button
                                    onClick={invertDeptFilter}
                                    className='align-middle bg-gray-800 rounded-lg px-1 text-sm md:text-base  border border-gray-400'>Invert</button>
                                </div>
                                <div className='
 scrollbar-thumb-gray-400 scrollbar-rounded scrollbar scrollbar-thin scrollbar-trackgray-900  mejiascrollbar
overflow-y-scroll h-full'>
                                  <CheckboxGroup
                                    orientation="vertical"
                                    spacing="sm"
                                    value={enableddept} onChange={(changes) => {
                                      setenableddept(changes);
                                      console.log(changes)
                                    }}>
                                    {depts.sort().map((eachDept) => (
                                      <Checkbox value={eachDept}
                                      key={eachDept}
                                       label={labelDeptProcess(eachDept)} />
                                    ))
                                    }
                                  </CheckboxGroup>
                                  <br />
                                </div>
                              </div>
                            </div>
                            <div className=' overflow-y-auto grow h-full md:h-64'>
                              <>

                                <div className='py-1 md:hidden'></div>
                              </>
                            </div>
                          </div>
                        )
                      }




                      <div className='flex flex-row'>
                        <div className="text-base bg-opacity-30">
                          {loadedfirsttime === true && (
                            <span className='md:hidden'>

                              <span className='font-semibold'>{numberoftotalrows.toLocaleString("en-US")}</span> ({makePercent(numberoftotalrows, entiresetcount)}%) of <span className='font-semibold'>{entiresetcount.toLocaleString("en-US")}</span>
                            </span>
                          )}
                        </div>

                        <div className='ml-auto'>
                          <a href='https://algolia.com' target="_blank">
                            <img className='ml-auto w-32' src='https://res.cloudinary.com/hilnmyskv/image/upload/q_auto/v1638794025/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-dark-background.svg'></img>

                          </a>
                        </div>
                      </div>

                    </div>
                  )
                }

                {

                  sortpanel === true &&
                  (//absolute bottom-0 

                    <div id='sortpanel' className='mt-2 w-full md:w-6/12 md:static md:mt-2 md:ml-2 bg-truegray-800 px-3 py-1'>
                      <div className='flex flex-col'>

                        <p className='text-base md:text-lg'>Sort Employees</p>
                        <div>
                          {
                            true && (
                              <>
                                <RadioGroup
                                  label="Sorted Column"
                                  color="green"
                                >
                                  <Radio value="first" label="First" />
                                  <Radio value="last" label="Last" />
                                  <Radio value="job" label="Job" />
                                  <Radio value="dept" label="Dept" />
                                  <Radio value="base" label="Base Pay" />
                                  <Radio value="overtime" label="Overtime" />
                                  <Radio value="other" label="Other" />
                                  <Radio value="health" label="Health" />
                                  <Radio value="retirement" label="Retirement" />
                                  <Radio value="total" label="Total" />
                                </RadioGroup><br></br>
                              </>
                            )
                          }


                          <SegmentedControl data={[{
                            value: "forward",
                            label: "A->Z",
                          },
                          {
                            value: "reverse",
                            label: "Z->A",
                          }]} color="dark" />
                        </div>

                      </div>
                    </div>
                  )
                }
              </div>

              {
                currentlyLoadedMetadata.year == '2021' && (
                  <div>
                    <p className="text-base font-bold bg-orange-700 bg-opacity-20 text-white">2021 Healthcare & Retirement not avaliable yet - The City Controller is still calculating this data.</p>

                  </div>
                )
              }

              <div className='block md:hidden  mx-2 bg-gray-50'>
                {_.uniq(loadedEmployeeRows).map((eachEmployee, index) => (
                  <div
                    key={index}

                    ref={
                      ref => {
                        setLastObjRefMobile(ref, index, loadedEmployeeRows.length)
                      }
                    }
                    className='bg-truegray-900 border-slate-700  border-b py-2'>
                    <div className=' flex flex-row'><div className='grow flex-grow'><span
                      className='bold font-bold'
                    >{eachEmployee.f}</span> {eachEmployee.l}</div>
                      <div className='grow flex-grow text-right'>
                        <span className='font-semibold'>{eachEmployee.j}</span>
                        <span className='ml-2'>{eachEmployee.d}</span></div></div>

                    <div className='pl-3'>

                      {
                        /*
                         Base Pay <span className='mono'>{excelnum(eachEmployee.b)}</span>
                    <br></br>
                    Overtime <span className='mono'>{excelnum(eachEmployee.ov)}</span>
                    <br></br>
                    Other <span className='mono'>{excelnum(eachEmployee.ot)}</span>
                    <br></br>
                    Healthcare <span className='mono'>{excelnum(eachEmployee.h)}</span>
                    <br></br>
                    Retirement <span className='mono'>{excelnum(eachEmployee.r)}</span>
                    <br></br>
                    <span className='font-semibold'> 
                    Total Pay <span className='mono'>{excelnum( eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</span></span>
                        */
                      }



                      <table className="table-auto text-sm">
                        <tbody>
                          <tr>
                            <td className='pr-2'>Base Pay</td>
                            <td>{excelnum(eachEmployee.b)}</td>
                          </tr>
                          <tr>
                            <td className='pr-1'>Overtime</td>
                            <td>{excelnum(eachEmployee.ov)}</td>
                          </tr>
                          <tr>
                            <td className='pr-1'>Other</td>
                            <td>{excelnum(eachEmployee.ot)}</td>
                          </tr>
                          {
                             currentlyLoadedMetadata.year != '2021' && (
                              <>
                                <tr>
                                  <td className='pr-1'>Health</td>
                                  <td>{excelnum(eachEmployee.h)}</td>
                                </tr>
                                <tr>
                                  <td className='pr-1'>Retirement</td>
                                  <td>{excelnum(eachEmployee.r)}</td>
                                </tr>

                              </>
                            )
                          }
                          <tr>
                            <td className='pr-1'>Total</td>
                            <>
                              {
                                currentlyLoadedYear != '2021' && (
                                  <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                                )
                              }

                              {
                                currentlyLoadedYear === '2021' && (
                                  <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot)}</td>
                                )
                              }</>
                          </tr>
                        </tbody>
                      </table>


                    </div>
                  </div>




                ))}
              </div>

              <table className="relative table-auto hidden md:block px-2 text-truegray-200">
                <thead className='sticky top-0'>
                  <tr className='bg-truegray-800 border-b-1 border-white py-2'>
                    <th className='sticky top-0'>First</th>
                    <th className='sticky top-0'>Last</th>
                    <th className='sticky top-0'>Job</th>
                    <th className='sticky top-0'>Dept</th>
                    <th className='sticky top-0'>Base Pay</th>
                    <th className='sticky top-0'>Overtime</th>
                    <th className='sticky top-0'>Other</th>
                    {
                      currentlyLoadedMetadata.year != '2021' && (
                        <>
                          <th>Health</th>
                          <th>Retirement</th>
                        </>
                      )
                    }
                    <th>Total Pay</th>
                  </tr>
                </thead>
                <tbody>

                  {loadedEmployeeRows.map((eachEmployee, employeeIndex) => (

                    <tr
                      ref={ref =>

                        setLastObjRef(ref, employeeIndex, loadedEmployeeRows.length)


                      }

                      key={employeeIndex}

                      className={`py-2 border-b border-truegray-700 ${enableddept.length == 0 ? 'hidden' : ''}`}
                    >
                      <td className='border-x border-truegray-700'>{eachEmployee.f}</td>
                      <td className='border-r border-truegray-700'>{eachEmployee.l}</td>
                      <td className='border-r border-truegray-700'>{eachEmployee.j}</td>
                      <td className='border-r border-truegray-700'>{eachEmployee.d.replace(/Department/gi, "")}</td>
                      <td className=' border-r text-right mono lg:px-3'>{excelnum(eachEmployee.b)}</td>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.ov)}</td>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.ot)}</td>
                      {
                        currentlyLoadedMetadata.year != '2021' && (
                          <>
                            <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.h)}</td>
                            <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.r)}</td>
                          </>
                        )
                      }

                      {
                         currentlyLoadedMetadata.year != '2021' && (
                          <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                        )
                      }

                      {
                         currentlyLoadedMetadata.year === '2021' && (
                          <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot)}</td>
                        )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>

              <>
                {
                  loadedfirsttime === true && numberoftotalrows === 0 && (
                    <div>
                      <h2 className="text-md font-bold">Zero Rows Found</h2>
                      <h2 className="text-base font-semibold">Try expanding your search.</h2>

                    </div>
                  )
                }
                <>
                  {
                    enableddept.length === 0 && (
                      <div className="text-base font-semibold bg-green-500 bg-opacity-30">You don't have any departments selected. Please select some!</div>
                    )
                  }
                </>
                <>
                  {
                    (enableddept.length === 0 && loadedEmployeeRows.length == numberoftotalrows) && (
                      <>
                        <div className="text-base font-semibold bg-opacity-30">You've reached the end of the table.</div>
                        <div className="text-base bg-opacity-30">{numberoftotalrows.toLocaleString("en-US")}  ({makePercent(numberoftotalrows, entiresetcount)}%) filtered employees of {entiresetcount.toLocaleString("en-US")} total</div>
                      </>
                    )
                  }
                </>
              </>
            </div>
          </React.StrictMode>

        </div></div>
    </div>
  )
}