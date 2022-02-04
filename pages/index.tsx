//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'

import PayrollNav from '../components/payrollnav'

import { Tab } from '@headlessui/react'

import Head from 'next/head'

import React from 'react'
import dynamic from 'next/dynamic'

import { io } from "socket.io-client";

import { AutocompleteBox } from '../components/AutocompleteBox'
import { Autocomplete } from '../components/Autocomplete'

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

  //currently loaded
  currentlyLoadedF: string;
  currentlyLoadedL: string;
  currentlyLoadedJ: string;
  currentlyLoadedD: any;
  currentlyLoadedMetadata: any;
  lastReqF: string;
  lastReqL: string;
  lastReqJ: string;
  lastReqRowCount: any;


  constructor(props: any) {
    super(props);
    this.currentlyLoadedF = "";
    this.currentlyLoadedL = "";
    this.currentlyLoadedJ = "";
    this.currentlyLoadedD = arrayOfEnabledDepts;
    this.currentlyLoadedMetadata = {
      active: false
    }

    this.state = {
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

  checkIfLoadMore = () => {
    var loadMore = false;

    var actOn= []

    if (window.innerWidth >= 768) {
    
      actOn = [this.lastRef,this.lastRefBuffer70]
    } else {

      actOn = [this.lastRefMobile, this.lastRefMobileBuffer15]

    }

    actOn.forEach((eachItem) => {
      if (isInViewport(eachItem, 100)) {
        loadMore = true
      }
    })


    if (loadMore) {
      this.getNewData();
    }

  }

  checkIfLoadMoreScrollRapid = () => {
    //have idempotency

    if (this.lastReqF === this.state.filterFirstName &&
      this.lastReqRowCount === this.state.loadedEmployeeRows.length &&
      this.lastReqL === this.state.filterLastName &&
      this.lastReqJ === this.state.filterLastName
    ) {

    } else {
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

    this.socketmain.on("result", (message) => {

      // console.log(message)
      this.setState((state, props) => {



        var toloadrows = state.loadedEmployeeRows

        //if loaded states matches incoming state
        if ((
          this.currentlyLoadedF === message.meta.f
          &&
          this.currentlyLoadedL === message.meta.l
          &&
          this.currentlyLoadedJ === message.meta.j
        )) {
          console.log('append')
          toloadrows = [...toloadrows, ...message.employeePortion]
        } else {
          console.log('new')
          toloadrows = message.employeePortion
        }


        console.log('change employee state to', toloadrows)

        this.currentlyLoadedF = message.meta.f
        this.currentlyLoadedF = message.meta.l
        this.currentlyLoadedJ = message.meta.j,
          this.currentlyLoadedMetadata = {
            active: true,
            totalFiltered: message.meta.totalFiltered,
            f: message.meta.f,
            l: message.meta.l,
            j: message.meta.j
          }
        return {
          loadedEmployeeRows: toloadrows
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
    });
  }

  toggleFilterButton = () => {
    this.setState({
      filterpanel: !this.state.filterpanel
    })
  }

  setAllDept = (state) => {
    if (state === true) {
      this.setState({
        enabledDept: arrayOfEnabledDepts
      })
    } else {
      this.setState({
        enabledDept: arrayOfDisabledDepts
      }
      )
    }
  }

  getNewData = () => {
    console.log('get new data')
    var numberSelected = Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length;

    var valueToSubmit;

    if (numberSelected == Object.values(this.state.enabledDept).length) {
      valueToSubmit = 'all'
      // console.log('all')
    } else {
      if (numberSelected === 0) {
        valueToSubmit = 'none'
      } else {
        valueToSubmit = this.state.enabledDept;
      }
    }

    var newSeq: boolean = true;

    if (this.state.filterFirstName === this.currentlyLoadedF
      && this.state.filterLastName === this.currentlyLoadedL
      && this.state.filterJobTitle === this.currentlyLoadedJ
    ) {
      newSeq = false;
    }

    console.log({
      firstName: this.state.filterFirstName,
      lastName: this.state.filterLastName,
      j: this.state.filterJobTitle,
      enabledDept: valueToSubmit,

      currentF: this.currentlyLoadedF,
      currentL: this.currentlyLoadedL,
      currentJ: this.currentlyLoadedJ,
      newSeq
    })

    this.lastReqF = this.state.filterFirstName;
    this.lastReqJ = this.state.filterLastName;
    this.lastReqJ = this.state.filterJobTitle;
    this.lastReqRowCount = this.state.loadedEmployeeRows;

    var preventNextLoadBecauseRowsAreAllDone = false;

    if (this.currentlyLoadedMetadata.active === true) {
      if (this.currentlyLoadedMetadata.totalFiltered <= this.state.loadedEmployeeRows.length &&
        this.currentlyLoadedMetadata.f === this.state.filterFirstName &&
        this.currentlyLoadedMetadata.l === this.state.filterLastName &&
        this.currentlyLoadedMetadata.j === this.state.filterJobTitle
      ) {
        preventNextLoadBecauseRowsAreAllDone = true
      }
    }

    if (preventNextLoadBecauseRowsAreAllDone === false) {
      this.socketmain.emit("employeereq", {
        loadedEmployeeRowsCount: this.state.loadedEmployeeRows.length,
        requestedFilters: {
          firstName: this.state.filterFirstName,
          lastName: this.state.filterLastName,
          j: this.state.filterJobTitle,
          enabledDept: valueToSubmit
        },
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
      <div className=' w-screen h-full overflow-y-auto overflow-x-clip bg-truegray-900'>
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


        </Head>
        <div suppressHydrationWarning={true} className='bg-truegray-900 text-white h-full overflow-y-clip'>
          <PayrollNav />
          <React.StrictMode>
            <div className='flex flex-col overflow-y-auto'
              onScroll={e => {
                console.log('scroll')
              }}
            >
              <div className='font-semibold flex flex-row pl-1 mt-2 text-lg space-x-2 flex flex-row align-middle space-x-1'>

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
              </div>

              {

                this.state.filterpanel === true &&
                (//absolute bottom-0 

                  <div id='filterpanel' className='mt-2 w-full md:w-6/12 md:static md:mt-2 md:ml-2 bg-truegray-800 px-3 py-1'>
                    <p className='text-lg'>Filter Employees</p>
                    <div className='flex flex-col sm:flex-row md:flex-col sm:space-x-2 md:space-y-2 md:space-x-0'>
                      <div className='flex flex-col md:flex-row sm:w-full'>
                        <p className='grow md:w-28'>First Name</p>
                        <AutocompleteBox
                          index='PayrollFirstNames'
                          parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                          inputClasses='bg-truegray-700 '
                          placeholder='Search First Name'
                          col='First Name'
                          onChange={(value) => {
                            this.setState({
                              filterFirstName: value
                            }, () => {
                              this.getNewData();
                            });
                          }}
                        ></AutocompleteBox>
                      </div>
                      <div className='flex flex-col md:flex-row sm:w-full'>
                        <p className='md:w-28'>Last Name</p>
                        <AutocompleteBox
                          index='PayrollLastName'
                          parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                          inputClasses='bg-truegray-700 '
                          placeholder='Search Last Name'
                          col='Last Name'
                          onChange={(value) => {
                            this.setState({
                              filterLastName: value
                            }, () => {
                              this.getNewData();
                            })
                          }}
                        ></AutocompleteBox>
                      </div>
                    </div>

                    <div className='flex flex-row md:w-full space-x-2 align-middle mt-2'>
                      <p className='align-middle my-auto'>Departments</p>
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
                      this.state.deptpanelopen === true && (

                        <div className='bg-truegray-800 h-full flex flex-col fixed bottom-0 md:relative md:h-full overflow-y-clip left-0'

                          style={
                            {
                              zIndex: 50
                            }
                          }
                        >
                          <div className='border-b-1 border-truegray-600 px-2 mt-2 pb-4 md:pb-4 md:pt-2 md:pb-0 sticky top-0 h-content bg-truegray-800  md:flex-row flex flex-col'>
                            <div className='flex flex-row'>
                              <p className='text-lg'>Select Departments</p>
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

                              <div
                                onClick={() => {
                                  this.setAllDept(true)
                                }}
                                className={`${Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === Object.values(this.state.enabledDept).length ?
                                  'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
                                  } rounded-xl px-2 py-0.5 font-bold`}>Select All</div>
                              <div className={`${Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === 0 ?
                                'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
                                } rounded-xl px-2 py-0.5 font-bold`}

                                onClick={() => {
                                  this.setAllDept(false)
                                }}

                              >Unselect All</div>

                            </div>
                          </div>
                          <div className=' overflow-y-auto grow h-full'>
                            <>
                              {

                                departments.map((eachDepartmentGroup) => (
                                  <div className={`${eachDepartmentGroup.grouped === true ? 'bg-truegray-700' : "bg-truegray-800"}  px-1 `}>
                                    <div className='flex flex-col h-full '>
                                      {
                                        eachDepartmentGroup.nameOfGroup && (

                                          <p className='text-md px-2 pt-2'>{eachDepartmentGroup.nameOfGroup}</p>
                                        )
                                      }
                                      <div className='flex flex-row flex-wrap w-full'>
                                        {
                                          eachDepartmentGroup.array.map((eachDept) => (
                                            <div>
                                              <button
                                                onClick={(event) => { this.toggleDepartments(eachDept) }}
                                                className={`parentcheckmark rounded-full border-2 pl-3 pr-2 py-0.5 mx-1 my-1 flex flex-row
 ${this.state.enabledDept[eachDept] === true ? "  bg-truegray-700 bg-opacity-95 text-truegray-50 hover:bg-truegray-500 border-mejito" : 'bg-truegray-900 text-truegray-300  hover:bg-truegray-800  border-truegray-100'}

 `}>

                                                {eachDept}

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

                                              </button>

                                            </div>
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



                    <div className={`flex flex-row md:flex-row md:w-full ${this.state.deptpanelopen === true ? "-z-10 block" : "block"} md:z-0`}

                    >
                      <p className=''>Job Title</p>
                      <AutocompleteBox
                        index='PayrollEmployeeList'
                        parentClasses='w-full grow md:grow sm:w-full lg:w-9/12 md:ml-2'
                        placeholder='Search Job Title'
                        col='Job Title'
                        onChange={(value) => {
                          this.setState({
                            filterJobTitle: value
                          }, () => {
                            this.getNewData();
                          });

                        }}
                      ></AutocompleteBox>


                    </div>

                  </div>
                )
              }

              <div className='block md:hidden  mx-2 '>
                {this.state.loadedEmployeeRows.map((eachEmployee, index) => (
                  <div
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

                      <table className="table-auto">
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
                          <tr>
                            <td className='pr-1'>Healthcare</td>
                            <td>{excelnum(eachEmployee.h)}</td>
                          </tr>
                          <tr>
                            <td className='pr-1'>Retirement</td>
                            <td>{excelnum(eachEmployee.r)}</td>
                          </tr>
                          <tr>
                            <td className='pr-1'>Total Pay</td>
                            <td>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                          </tr>
                        </tbody>
                      </table>


                    </div>
                  </div>




                ))}
              </div>

              <table className="table-auto hidden md:block px-2 text-truegray-200">
                <thead className='sticky'>
                  <tr className='bg-truegray-900 border-b-1 border-white py-2'>
                    <th>First</th>
                    <th>Last</th>
                    <th>Job</th>
                    <th>Dept</th>
                    <th>Base Pay</th>
                    <th>Overtime</th>
                    <th>Other</th>
                    <th>Healthcare</th>
                    <th>Retirement</th>
                    <th>Total Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loadedEmployeeRows.map((eachEmployee, employeeIndex) => (
                    <tr
                      ref={ref =>

                        this.setLastObjRef(ref, employeeIndex, this.state.loadedEmployeeRows.length)


                      }

                      className='py-2 border-b border-truegray-700'
                    >
                      <td>{eachEmployee.f}</td>
                      <td>{eachEmployee.l}</td>
                      <td>{eachEmployee.j}</td>
                      <td>{eachEmployee.d.replace(/Department/gi, "")}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.b)}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.ov)}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.ot)}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.h)}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.r)}</td>
                      <td className='text-right mono'>{excelnum(eachEmployee.b + eachEmployee.ov + eachEmployee.ot + eachEmployee.h + eachEmployee.r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </React.StrictMode>

        </div></div>
    )
  }
}

export default Payroll