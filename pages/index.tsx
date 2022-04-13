//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'
import PayrollNav from '../components/payrollnav'

import { Tab } from '@headlessui/react'

import Head from 'next/head'

import React, {useEffect,  Fragment, useState } from 'react'

import { mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending, mdiSortAscending  } from '@mdi/js';
import dynamic from 'next/dynamic'

import { io } from "socket.io-client";

import { AutocompleteBox } from '../components/AutocompleteBox'
import { Autocomplete } from '../components/Autocomplete'
import _ from 'lodash';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { ArrowUpIcon } from '@modulz/radix-icons';
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Text, Transition as MantineTransition, SegmentedControl, Center, RadioGroup, Radio, Box  } from '@mantine/core';

const yearsofpayroll = [
  "2018", "2019", "2020", "2021"
]


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

const departments: Array<any> = [
  {
    grouped: false,
    array: [
      "Aging",
      "Airports",
      "Animal Services",
      "Building and Safety",
      "Cannabis Regulation",
      "City Administrative Officer",
      "City Attorney",
      "City Clerk",
      "City Employees Retirement System",
      "City Ethics Commission",
      "City Planning",
      "Controller",
      "Council",
      "Convention and Tourism Development",
      "Cultural Affairs",
      "Disability",
      "Economic and Workforce Development",
      "El Pueblo De Los Angeles",
      "Emergency Management",
      "Employee Relations Board",
      "Finance",
      "Fire",
      "General Services",
      "Harbor",
      "Housing and Community Investment",
      "IT",
      "Library",
      "Mayor",
      "Neighborhood Empowerment",
      "Pension",
      "Personnel",
      "Police",
      "Public Accountability",
    ],
  },

  {
    grouped: true,
    nameOfGroup: "Public Works",
    array: [
      "Board of Public Works",
      "Contract Administration",
      "Engineering",
      "Sanitation",
      "Street Lighting",
      "Street Services",
    ]
  },
  {
    grouped: false,
    array: [
      "Recreation and Parks",
      "Transportation",
      "Water and Power",
      "Zoo"
    ],
  },
];

var arrayOfEnabledDepts = {

}

var arrayOfDisabledDepts = {

}


departments.forEach((eachItem) => {
  eachItem.array.forEach((eachDept) => {
    arrayOfEnabledDepts[eachDept] = true;
    arrayOfDisabledDepts[eachDept] = false;
  })
})

export class Payroll extends React.Component<any, any> {
  socketmain: any;
  maintainSocketTimer: any;
  lastRef: any;
  lastRefBuffer70: any;
  lastRefSecondLast: any;
  lastRefMobile: any;
  lastRefMobileBuffer15: any;
  filterDeptName: any;
  filterFirstName: string;
  filterLastName: any;
  filterJobTitle: any;

  //currently loaded
  currentlyLoadedF: string;
  currentlyLoadedL: string;
  currentlyLoadedJ: string;
  currentlyLoadedD: any;
  currentlyLoadedYear: any; 
  currentlyLoadedMetadata: any;
  lastReqF: string;
  lastReqL: string;
  lastReqJ: string;
  lastReqD: any;
  lastReqRowCount: any;


  constructor(props: any) {
    super(props);
    this.currentlyLoadedF = "";
    this.currentlyLoadedL = "";
    this.currentlyLoadedJ = "";
    this.currentlyLoadedMetadata = {
      active: false
    }

    this.state = {
      selectedyear: "2021",
      numberoftotalrows: 0,
      entiresetcount: 1,
      loadedfirsttime: false,
      filterpanel: false,
      sortpanel: true,
      socketconnected: false,
      enabledDept: arrayOfEnabledDepts,
      showDepartmentScreen: false,
      deptpanelopen: false,
      filterFirstName: '',
      filterLastName: '',
      filterJobTitle: '',
      lastRef: null,
      loadedEmployeeRows: [],
      arrayOfResultsMetadata: [
      ]
    };
  }

    

  attemptConnectSocket() {
    //   console.log('socket status main page', this.socketmain.connected)
    if (this.state.socketconnected) {
    } else {
      this.socketmain.connect();
    }
  }

  
handleClick(e) { if (e) {e.preventDefault()}; }

  checkIfLoadMore = () => {
    var loadMore = false;

    var actOn = []

    if (window.innerWidth >= 768) {

      actOn = [this.lastRef, this.lastRefBuffer70]
    } else {

      actOn = [this.lastRefMobile, this.lastRefMobileBuffer15]

    }

    actOn.forEach((eachItem) => {
      if (eachItem) {
        if (isInViewport(eachItem, 100)) {
          loadMore = true
        }
      }
    })


    if (loadMore) {
      this.getNewData();
    }

  }

  makePercent= (num,dem) => {
    return parseFloat(((num/dem) * 100).toFixed(2))
  }

  checkIfLoadMoreScrollRapid = () => {
    //have idempotency

    if (this.lastReqF === this.filterFirstName &&
      this.lastReqRowCount === this.state.loadedEmployeeRows.length &&
      this.lastReqL === this.filterLastName &&
      this.lastReqJ === this.filterLastName &&
      this.lastReqD === this.getParsedDeptFilter()
    ) {

    } else {
      console.log('passed 2nd check')
      this.checkIfLoadMore()
    }

  }

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);

    this.socketmain =
      io(urlParams.get('devport') ? "http://localhost:4927" : "https://api.payroll.mejiaforcontroller.com", {
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 999999,
        autoConnect: false
      });

    let lastKnownScrollPosition = 0;
    let ticking = false;

    document.addEventListener('scroll', e => {

      //  console.log('scroll happened')

      lastKnownScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // doSomething(lastKnownScrollPosition);

          console.log('valid scroll')

          this.checkIfLoadMoreScrollRapid()

          ticking = false;
        });

        ticking = true;
      }
    }, true);

    this.socketmain.on("result", (message:any) => {

      
      this.setState((state, props) => {

        
      var toloadrows = state.loadedEmployeeRows

      //if loaded states matches incoming state
      if (message.meta.newseq === false) {
        //console.log('append')
        toloadrows = [...toloadrows, ...message.employeePortion]
      } else {
      //  console.log('new')
        toloadrows = message.employeePortion
      }

    //  console.log('change employee state to', toloadrows)

   
      this.currentlyLoadedF = message.meta.f;

    //  console.log('setting to ', message.meta.f);

    //  console.log('result ', this.currentlyLoadedF)

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
      }


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
        }
      })


    })

    this.setState({
      filterpanel: window.innerWidth >= 768 ? true : true
    })


    this.socketmain.on("connect", () => {
      console.log('socket.id', this.socketmain.id); // x8WIv7-mJelg7on_ALbx
      console.log('connected to the big boi');
      this.setState({
        socketconnected: this.socketmain.connected
      })
    });

    this.socketmain.on('disconnect', () => {
      this.setState({
        socketconnected: this.socketmain.connected
      })
    })

    this.attemptConnectSocket();
    this.maintainSocketTimer = setInterval(() => {
      this.attemptConnectSocket();



      this.setState((state, props) => {
        if (state.loadedEmployeeRows.length === 0) {
          console.log('trigger repeat')
          // this.getNewData()
        }
      });

      // this.checkIfLoadMore();
      this.checkIfLoadMoreScrollRapid()
    }, 900)

    this.getNewData()
  }

  //system to handle button presses for departments
  toggleDepartments = (nameOfDept) => {
    this.setState((state, props) => {
      var newSetDept = state.enabledDept;
      var newStateToSetForOneDept = !(newSetDept[nameOfDept]);
      newSetDept[nameOfDept] = newStateToSetForOneDept;

      return { enabledDept: newSetDept };
    }, () => {
      console.log('call back dept')
      this.getNewData();
    });
  }

  toggleFilterButton = () => {
    this.setState({
      filterpanel: !this.state.filterpanel
    })
  }

  setAllDept = (state) => {

    
    if (state === true) {
      var stateToPush = arrayOfEnabledDepts;
    } else {
      stateToPush = arrayOfDisabledDepts
    
    }

    document.querySelectorAll('input[data-inputdept]').forEach((eachItem:any) => eachItem.checked = state);

    console.log('plz set state')
      this.setState({
        enabledDept: stateToPush
      }, () => {
        console.log('call back set all dept set state')
        this.getNewData();
      });

      
   
  }

  getParsedDeptFilter = () => {
    //  console.log('get new data')
    var numberSelected = Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length;

    var valueToSubmit;

    if (numberSelected == Object.values(this.state.enabledDept).length) {
      valueToSubmit = 'all'
      // console.log('all')
    } else {
      if (numberSelected === 0) {
        valueToSubmit = 'none'
      } else {
      //  valueToSubmit = this.state.enabledDept;

      //submit an array instead
      valueToSubmit = 
      Object.keys(
        Object.fromEntries(
          Object.entries(this.state.enabledDept)
          .filter(([key, value]) => value === true)
          )
      )
      }
    }

    return valueToSubmit;
  }

 comparedeptcodes = (a,b) => {
    var maska:any = a;
    var maskb:any = b;

    if (Array.isArray(a)) {
      maska = a.join('|')
    }

    if (Array.isArray(b)) {
      maskb = b.join('|')
    }

    return maska == maskb;
  }

  getNewData = () => {

    var newSeq: boolean = true;

    var deptvaluetosubmit = this.getParsedDeptFilter()

    //console.log('getnewfunc says f is', this.state.currentlyLoadedF)

    if (this.state.filterFirstName == this.state.currentlyLoadedF
      && this.state.filterLastName == this.state.currentlyLoadedL
      && this.state.filterJobTitle == this.state.currentlyLoadedJ
  //    && deptvaluetosubmit == this.state.currentlyLoadedD
      && this.comparedeptcodes(deptvaluetosubmit, this.state.currentlyLoadedD)
      && this.state.currentlyLoadedYear === this.state.selectedyear
    ) {
      console.log('not new seq')

      newSeq = false;
    } else {
      
      console.log('new seq')

      console.log('is rest matching', (this.state.filterFirstName == this.state.currentlyLoadedF
        && this.state.filterLastName == this.state.currentlyLoadedL
        && this.state.filterJobTitle == this.state.currentlyLoadedJ))

        console.log('does the dept filter match', this.comparedeptcodes(deptvaluetosubmit, this.state.currentlyLoadedD))
        
        console.log('years match', this.state.currentlyLoadedYear, this.state.selectedyear)
    }

    console.log('deptvaluetosubmit ',  deptvaluetosubmit )
    console.log('this.state.currentlyLoadedD ',  this.state.currentlyLoadedD )

    console.log({
      firstName: this.state.filterFirstName,
      lastName: this.state.filterLastName,
      j: this.state.filterJobTitle,
      enabledDept: deptvaluetosubmit,

      currentF: this.state.currentlyLoadedF,
      currentL: this.currentlyLoadedL,
      currentJ: this.currentlyLoadedJ,
      newSeq
    })

    this.lastReqF = this.state.filterFirstName;
    this.lastReqJ = this.state.filterLastName;
    this.lastReqJ = this.state.filterJobTitle;
    this.lastReqD = this.getParsedDeptFilter();
    this.lastReqRowCount = this.state.loadedEmployeeRows;

    var preventNextLoadBecauseRowsAreAllDone = false;

    if (this.currentlyLoadedMetadata.active === true) {
      if (this.currentlyLoadedMetadata.totalFiltered <= this.state.loadedEmployeeRows.length &&
        this.currentlyLoadedMetadata.f === this.state.filterFirstName &&
        this.currentlyLoadedMetadata.l === this.state.filterLastName &&
        this.currentlyLoadedMetadata.j === this.state.filterJobTitle &&
        this.currentlyLoadedMetadata.year === this.state.selectedyear
      ) {
        preventNextLoadBecauseRowsAreAllDone = true
      }
    }

    //console.log('repeat load', preventNextLoadBecauseRowsAreAllDone)

    console.log('this.getParsedDeptFilter()', this.getParsedDeptFilter())

    if (preventNextLoadBecauseRowsAreAllDone === false) {

      this.socketmain.emit("employeereq", {
        loadedEmployeeRowsCount: this.state.loadedEmployeeRows.length,
        requestedFilters: {
          firstName: this.state.filterFirstName,
          lastName: this.state.filterLastName,
          j: this.state.filterJobTitle,
          enabledDept: deptvaluetosubmit
        },
        requestedYear: this.state.selectedyear,
        newSeq: newSeq,
        currentlyLoadedRowFilters: this.state.currentlyLoadedRowFilters
      })
    }


  }

  departmentsSelectedRender = () => {
    var numberSelected = Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length;
    var totalOptions = Object.values(this.state.enabledDept).length;

    if (numberSelected === totalOptions) {
      return "All " + totalOptions;
    } else {
      if (numberSelected === 1) {
        var singledept = Object.entries(this.state.enabledDept).filter((eachDept) => eachDept[1] == true)[0][0]

        return `${singledept}`
      } else {
        return `${numberSelected} of ${totalOptions}`
      }
    }
  }

  toggleDeptPanel = () => {
    this.setState({
      deptpanelopen: !this.state.deptpanelopen
    })
  }

  setLastObjRefMobile = (ref, EmployeeIndex, length) => {
    if (length - 1 === EmployeeIndex) {
      this.lastRefMobile = ref
    }

    if (length - 15 === EmployeeIndex) {
      this.lastRefMobileBuffer15 = ref
    }

  }

  setLastObjRef = (ref, EmployeeIndex, length) => {
    if (length > 70) {
      if (this.state.loadedEmployeeRows.length - 1 - 70 === EmployeeIndex) {
        this.lastRefBuffer70 = ref
      }
    }

    if (this.state.loadedEmployeeRows.length - 1 === EmployeeIndex) {
      this.lastRef = ref

    }

    if (this.state.loadedEmployeeRows.length - 2 === EmployeeIndex) {
      this.lastRefSecondLast = ref

    }


  }

  render() {
    return (
    <>
      
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
        < ScrollToTop/>
          <PayrollNav />
          <React.StrictMode>
            <div className='flex flex-col '
              onScroll={e => {
                console.log('scroll')
              }}
            >
              <div className='font-semibold flex flex-row pl-1 mt-2 text-base md:text-lg space-x-2 flex flex-row align-middle space-x-1'>

              <div className="">
      <Listbox value={this.state.selectedyear} onChange={(value) => {
        this.setState({
          selectedyear: value
        }, () => {
          this.getNewData();
        });
      }}>
        <div className="">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-truegray-800 rounded-lg border-white border shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-green-300 focus-visible:ring-offset-2 focus-visible:border-green-500 sm:text-sm">
            <span className="block truncate">{this.state.selectedyear}</span>
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
                    `cursor-default select-none relative py-2 pl-10 pr-4 bg-truegray-900 hover:bg-truegray-800 hover:shadow-sm ${
                      active ? 'text-amber-100 bg-amber-900' : 'text-white'
                    }`
                  }
                  value={eachyear}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
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
                  onClick={() => this.toggleFilterButton()}
                  className={` rounded-full  pl-3 pr-3 py-1  border border-2 border-gray-50 bg-truegray-200 ${this.state.filterpanel ? 'bg-truegray-100 text-coolgray-900' : 'bg-truegray-800'}`}>
                  <svg className={` h-6 w-6 align-bottom inline-block align-text-bottom  ${this.state.filterpanel ? 'text-coolgray-900' : 'bg-truegray-800'}`} viewBox="0 0 24 24">
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
                  this.state.loadedfirsttime === true && (
                    <>
                    <span className='font-semibold'>{this.state.numberoftotalrows.toLocaleString("en-US")}</span> <span className='font-normal'>({this.makePercent(this.state.numberoftotalrows, this.state.entiresetcount)}%) Filtered of </span> <span className='font-semibold'>{this.state.entiresetcount.toLocaleString("en-US")}</span>
                    </>
                  )
                }
                </div>
              </div>

        <div className='flex flex-col md:flex-row gap-x-2'>
        {

true &&
(//absolute bottom-0 

  <div id='filterpanel' className={`mt-2 w-full md:w-6/12 md:static md:mt-2 md:ml-2 bg-truegray-800 px-3 py-1 ${this.state.filterpanel === false ? 'hidden': ''}`}>
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
          onChange={(value) => {
            this.filterFirstName = value
            this.setState({
              filterFirstName: value
            }, () => {
              this.getNewData();
            });
          }}
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
          onChange={(value) => {
            this.filterLastName = value
            this.setState({
              filterLastName: value
            }, () => {
              this.getNewData();
            })
          }}
        ></AutocompleteBox>
      </div>
    </div>

    <div className={`flex flex-row md:flex-row md:w-full ${this.state.deptpanelopen === true ? "-z-10 block" : "block"} md:z-0`}

>
  <p className='text-sm md:text-base'>Job Title</p>
  <AutocompleteBox
    index='PayrollEmployeeList'
    parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
    placeholder='Search Job Title'
    col='Job Title'
    onChange={(value) => {
      
      this.filterJobTitle = value
      this.setState({
        filterJobTitle: value
      }, () => {
        this.getNewData();
      });

    }}
  ></AutocompleteBox>


</div>

    <div className='flex flex-row md:w-full space-x-2 align-middle mt-2'>
      <p className='text-sm md:text-base align-middle my-auto'>Departments</p>
      <button
        onClick={(event) => { this.toggleDeptPanel() }}
        className='rounded-full border-2 pl-3 pr-2 py-0.5 border-truegray-400 hover:bg-truegray-600 bg-truegray-700 flex flex-row'>
        {this.departmentsSelectedRender()}
        <svg className='w-7 h-7 my-auto relative bottom-0.5' viewBox="0 0 24 24">
          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
        </svg>
      </button>
    </div>

    {
      true && (

        <div className={`bg-truegray-800 h-full flex flex-col fixed top-0 bottom-0 md:relative md:h-full overflow-y-clip left-0 w-full md:w-auto
        ${this.state.deptpanelopen === false ? 'hidden': ""}
        `}

          style={
            {
              zIndex: 20
            }
          }
        >
          <div className='border-b-1 border-truegray-600 px-2 mt-2 pb-4 md:pb-4 md:pt-2 md:pb-0 sticky h-content bg-truegray-800  md:flex-row flex flex-col'>
            <div className='flex flex-row'>
              <p className='text-sm md:text-lg'>Select Departments</p>
              <button className='ml-auto mr-2 md:hidden'
                onClick={(event) => { this.toggleDeptPanel() }}
              >
                <svg className='h-10 w-10' viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div
              className='flex flex-row  space-x-4 my-auto  grow-0 md:ml-8'
            >

              <button
              onMouseDown={this.handleClick}

              onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleClick(e)}}}
                onClick={() => {
                  this.setAllDept(true);
                }}
                className={`${Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === Object.values(this.state.enabledDept).length ?
                  'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
                  } rounded-xl px-2 py-0.5 font-bold`}
                  
                  style={{
                    cursor: 'pointer'
                  }}
                  >Select All</button>
              <button className={`${Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === 0 ?
                'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
                } rounded-xl px-2 py-0.5 font-bold`}

                onMouseDown={this.handleClick}

                onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleClick(e)}}}

                style={{
                  cursor: 'pointer'
                }}

                onClick={() => {
                  this.setAllDept(false)
                }}

              >Unselect All</button>

            </div>
          </div>
          <div className=' overflow-y-auto grow h-full md:h-64'>
            <>
              {

                departments.map((eachDepartmentGroup,eachDepartmentGroupNum) => (
           
                  <div
                  key={eachDepartmentGroupNum}
                  className={`${eachDepartmentGroup.grouped === true ? 'bg-truegray-700' : "bg-truegray-800"}  px-1 `}>
                    <div className='flex flex-col h-full '>
                      {
                        eachDepartmentGroup.nameOfGroup && (

                          <p className='text-md px-2 pt-2'>{eachDepartmentGroup.nameOfGroup}</p>
                        )
                      }
                      <div className='flex flex-col  w-full'>
                        {
                          eachDepartmentGroup.array.map((eachDept) => (
                            <>

                  <div>
                      <div className="form-check"
                      onClick={(event) => {
                        this.toggleDepartments(eachDept)
                      }}

                      onMouseDown={this.handleClick} onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleClick(e)}}}
                      >
                        
                        <label
                         className="form-check-label inline-block text-gray-50"
                         
                         data-labeldept={eachDept}
                         >
                           <input
                         className={`form-check-input appearance-none h-4 w-4 border-2 border-gray-300 rounded-sm bg-truegray-800 
                         checked:bg-green-600 checked:border-truegray-50 focus:outline-none transition duration-200 
                          mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer`}
                          data-inputdept={eachDept}
                          type="checkbox" value={eachDept}
                        /*  checked={this.state.enabledDept[eachDept]}*/
                          id={`switch-${eachDept}`}/>
                        {eachDept}
                        </label>
                      </div>

                            {/*<div
                            key={eachDept}
                            >
                              <div
                                onClick={(event) => { this.toggleDepartments(eachDept);
                                }}
                                className={`parentcheckmark rounded-full border-2 pl-3 pr-2 py-0.5 mx-1 my-1 flex flex-row
${this.state.enabledDept[eachDept] === true ? "  bg-truegray-700 bg-opacity-95 text-truegray-50 hover:bg-truegray-500 border-mejito" : 'bg-truegray-900 text-truegray-300  hover:bg-truegray-800  border-truegray-100'}

`}>

                                

                                {
                                  this.state.enabledDept[eachDept] === true && (
                                    <svg className={`h-5 w-5 ml-1 my-auto text-mejito`} viewBox="0 0 24 24">
                                      <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                                    </svg>
                                  )
                                }
                                {
                                  this.state.enabledDept[eachDept] === false && (
                                    <svg className={`h-5 w-5 ml-1 my-auto text-white`} viewBox="0 0 24 24">
                                      <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                    </svg>
                                  )
                                }

                              </div>

                            </div>*/}
                            </div>
                            </>
                          )

                          )

                        }</div></div>
                  </div>
                ))


              }
              <div className='py-1 md:hidden'></div>
            </>
          </div>
        </div>
      )
    }



 
        <div className='flex flex-row'>
        <div className="text-base bg-opacity-30">
          {this.state.loadedfirsttime === true && (
            <span className='md:hidden'>
            <span className='font-semibold'>{this.state.numberoftotalrows.toLocaleString("en-US")}</span> ({this.makePercent(this.state.numberoftotalrows, this.state.entiresetcount)}%) of <span className='font-semibold'>{this.state.entiresetcount.toLocaleString("en-US")}</span>
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

this.state.sortpanel === true &&
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
          label:  "Z->A",
        }]} color="dark" />
</div>

</div>
</div>
)
}
        </div>

{
               this.state.currentlyLoadedYear == '2021' && (
                  <div>
                    <p className="text-base font-bold bg-orange-700 bg-opacity-20 text-white">2021 Healthcare & Retirement not avaliable yet - The City Controller is still calculating this data.</p>
                 
                  </div>
                )
              }

              <div className='block md:hidden  mx-2 bg-gray-50'>
                {_.uniq(this.state.loadedEmployeeRows).map((eachEmployee, index) => (
                  <div
                  key={index}

                    ref={
                      ref => {
                        this.setLastObjRefMobile(ref, index, this.state.loadedEmployeeRows.length)
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
                      this.state.currentlyLoadedYear != '2021' && (
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
                      this.state.currentlyLoadedYear != '2021' && (
                        <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                      )
                      }
                      
{
                      this.state.currentlyLoadedYear === '2021' && (
                        <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot )}</td>
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
                      this.state.currentlyLoadedYear != '2021' && (
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

                  {this.state.loadedEmployeeRows.map((eachEmployee, employeeIndex) => (

                    <tr
                      ref={ref =>

                        this.setLastObjRef(ref, employeeIndex, this.state.loadedEmployeeRows.length)

                      
                      }

                      key={employeeIndex}

                      className={`py-2 border-b border-truegray-700 ${this.getParsedDeptFilter() === 'none' ? 'hidden': ''}`}
                    >
                      <td className='border-x border-truegray-700'>{eachEmployee.f}</td>
                      <td  className='border-r border-truegray-700'>{eachEmployee.l}</td>
                      <td   className='border-r border-truegray-700'>{eachEmployee.j}</td>
                      <td   className='border-r border-truegray-700'>{eachEmployee.d.replace(/Department/gi, "")}</td>
                      <td className=' border-r text-right mono lg:px-3'>{excelnum(eachEmployee.b)}</td>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.ov)}</td>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.ot)}</td>
                      {
                      this.state.currentlyLoadedYear != '2021' && (
                     <>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.h)}</td>
                      <td className='border-r text-right mono lg:px-3'>{excelnum(eachEmployee.r)}</td>
                      </>
                      )
                      }

{
                      this.state.currentlyLoadedYear != '2021' && (
                        <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                      )
                      }
                      
{
                      this.state.currentlyLoadedYear === '2021' && (
                        <td className='border-x text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot )}</td>
                      )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>

              <>
              {
                this.state.loadedfirsttime === true && this.state.totalFiltered && (
                  <div>
                    <h2 className="text-md font-bold">Zero Rows Found</h2>
                  <h2 className="text-base font-semibold">Try expanding your search.</h2>
                 
                  </div>
                )
              }
               <>
                  {
                    this.getParsedDeptFilter() === 'none' && (
                      <div className="text-base font-semibold bg-green-500 bg-opacity-30">You don't have any departments selected. Please select some!</div>
                    )
                  }
                  </>
                  <>
                  {
                    (this.getParsedDeptFilter() === 'none' && this.state.loadedEmployeeRows.length == this.state.numberoftotalrows) && (
                      <>
                      <div className="text-base font-semibold bg-opacity-30">You've reached the end of the table.</div>
                      <div className="text-base bg-opacity-30">{this.state.numberoftotalrows.toLocaleString("en-US")}  ({this.makePercent(this.state.numberoftotalrows, this.state.entiresetcount)}%) filtered employees of {this.state.entiresetcount.toLocaleString("en-US")} total</div>
                      </>
                    )
                  }
                  </>
              </>
            </div>
          </React.StrictMode>

        </div></div>
    </>
    )
  }
}

export default Payroll