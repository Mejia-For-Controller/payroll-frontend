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

import algoliasearch from 'algoliasearch/lite';
import { ProductItem } from '../components/ProductItem';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import { Autocomplete } from '../components/Autocomplete';

const appId = 'O5BYH2RE4Y';
const apiKey = 'f245c81fd74df69b274bf619e1c29fd3';
const searchClient = algoliasearch(appId, apiKey);


const jobtitleindex = searchClient.initIndex("PayrollEmployeeList");


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

export class  Payroll extends React.Component<any, any> {
  socketmain: any;
  maintainSocketTimer: any;
  constructor(props: any) {

    super(props);
    this.state = {
        filterpanel: false,
        sortpanel: true,
        socketconnected: false,
        enabledDept: arrayOfEnabledDepts,
        showDepartmentScreen: false,
        employeejobtitlelastupdated: '',
        employeesJobTitleAutocompleteResults: null,
        deptpanelopen: false
    };
  }

  searchEmployeeJobTitle = () => {
    var inputjobtitle:any = document.getElementById('jobelementtitle')

    if (inputjobtitle) {
      if (inputjobtitle.value.length > 0) {
        var searchterm = inputjobtitle.value;
        if (searchterm.length < 90) {
          jobtitleindex
        .search(searchterm)
        .then(({ hits }) => {
          console.log(hits);

          this.setState({
            employeejobtitlelastupdated: searchterm, 
            employeesJobTitleAutocompleteResults: hits
          })
        })
        .catch(err => {
          console.log(err);
        });
        }
        
      }
    }


  }

  attemptConnectSocket() {
    //   console.log('socket status main page', this.socketmain.connected)
       if (this.state.socketconnected) {
       }  else {
             this.socketmain.connect();
     }
    }

  componentDidMount = () => {
    this.socketmain = 
    io("https://api.payroll.mejiaforcontroller.com", {
      'reconnection': true,
      'reconnectionDelay': 500,
      'reconnectionAttempts': 999999,
      autoConnect: false
    });

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
  }, 900)
  }

  //system to handle button presses for departments
  toggleDepartments = (nameOfDept) => {
    this.setState((state, props) => {
      var newSetDept = state.enabledDept;
      var newStateToSetForOneDept = !(newSetDept[nameOfDept]);
      newSetDept[nameOfDept] = newStateToSetForOneDept;

      return {enabledDept: newSetDept};
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

  departmentsSelectedRender = () => {
    var numberSelected = Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length;
    var totalOptions = Object.values(this.state.enabledDept).length;

    if (numberSelected === totalOptions) {
      return "All " + totalOptions;
    } else {
      if (numberSelected === 1) {
var singledept  = Object.entries(this.state.enabledDept).filter((eachDept) => eachDept[1] == true)[0][0]

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

  render () {
    return (
      <div className='height100 w-screen h-screen bg-truegray-900'>
    <Head>
    <title>Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Employee Names and Payroll"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!"></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css" integrity="sha256-TehzF/2QvNKhGQrrNpoOb2Ck4iGZ1J/DI4pkd2oUsBc=" crossOrigin="anonymous"/>


    </Head>
    <div suppressHydrationWarning={true} className='height100 bg-truegray-900 text-white'>
      <PayrollNav />
      <React.StrictMode>
        <div className='flex flex-col'>
          <div className='font-semibold flex flex-row pl-1 mt-2 text-lg space-x-2  flex flex-row align-middle space-x-1'>
         
            <button 
              onClick={() => this.toggleFilterButton()}
            className={` rounded-full  pl-3 pr-3 py-1  border border-2 border-gray-50 bg-truegray-200 ${this.state.filterpanel ? 'bg-truegray-100 text-coolgray-900' : 'bg-truegray-800'}`}>
            <svg  className={` h-6 w-6 align-bottom inline-block align-text-bottom  ${this.state.filterpanel ? 'text-coolgray-900' : 'bg-truegray-800'}`}  viewBox="0 0 24 24">
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
(
          <div id='filterpanel' className='w-full absolute bottom-0 md:w-6/12 md:static md:mt-2 md:ml-2 bg-truegray-800 px-3 py-1'>
<p className='text-lg'>Filter Employees</p>
<div className='flex flex-col space-x-1 md:space-x-0 md:space-y-2'>
<div className='flex flex-col md:flex-row md:w-full'>
  <p className='grow'>First Name</p>
      <input className='bg-truegray-600 md:grow lg:w-9/12 md:ml-2'></input>
</div>
<div className='flex flex-col md:flex-row md:w-full'>
  <p className=''>Last Name</p>
      <input className='bg-truegray-600 md:grow lg:w-9/12 md:ml-2'></input>
</div>
</div>

<div className='flex flex-row md:w-full space-x-2 align-middle mt-2'>
  <p className='align-middle my-auto'>Departments</p>
      <button 
      onClick={(event) => {this.toggleDeptPanel()} }
      className='rounded-full border-2 pl-3 pr-2 py-0.5 border-truegray-400 hover:bg-truegray-600 bg-truegray-700 flex flex-row'>
        {this.departmentsSelectedRender()}
      <svg className='w-7 h-7 my-auto relative bottom-0.5' viewBox="0 0 24 24">
    <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
</svg> 
      </button>
</div>

{
  this.state.deptpanelopen === true && (
    
<div className='bg-truegray-800 max-h-screen h-screen flex flex-col md:h-full z-40'

style={
  {
    zIndex: 50
  }
}
>
  <div className=' px-2 pt-4 pb-4 md:pt-2 md:pb-0 sticky top-0 bg-truegray-800 flex flex-col md:flex-row'> 
<div className='flex flex-row'>
<p className='text-lg'>Select Departments</p>
<button className='ml-auto mr-2'
 onClick={(event) => {this.toggleDeptPanel()} }
>
<svg className='h-10 w-10' viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg>
</button>
</div>
<div
className='flex flex-row  space-x-4 my-auto md:ml-8'
>

<div 
onClick={() => {
  this.setAllDept(true)
}}
className={`${
  Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === Object.values(this.state.enabledDept).length ? 
  'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
} rounded-xl px-2 py-0.5 font-bold`}>Select All</div>
<div className={`${
  Object.values(this.state.enabledDept).filter((eachDept) => eachDept === true).length === 0 ? 
  'text-truegray-400 bg-truegray-700  ' : "text-truegray-100 bg-truegray-600 border-1 underline border-truegray-100"
} rounded-xl px-2 py-0.5 font-bold`}

onClick={() => {
  this.setAllDept(false)
}}

>Unselect All</div>

</div>
</div>
{
  departments.map((eachDepartmentGroup) => (
    <div className={`${eachDepartmentGroup.grouped === true ? 'bg-truegray-700': "bg-truegray-800"}  px-1 `}>
         <div className='flex flex-col overflow-y-auto '>
         {
            eachDepartmentGroup.nameOfGroup && (
              
<p className='text-md px-2 pt-2'>{ eachDepartmentGroup.nameOfGroup}</p>
            )
         }
         <div  className='flex flex-row flex-wrap w-full'>
         {
            eachDepartmentGroup.array.map((eachDept) => (
              <div>
<button 
onClick={(event) => {this.toggleDepartments(eachDept)}}
className={`parentcheckmark rounded-full border-2 pl-3 pr-2 py-0.5 mx-1 my-1 flex flex-row
 ${this.state.enabledDept[eachDept] === true ?  "  bg-truegray-700 bg-opacity-95 text-truegray-50 hover:bg-truegray-500 border-mejito": 'bg-truegray-900 text-truegray-300  hover:bg-truegray-800  border-truegray-100'}

 `}>
 
  {eachDept}

{
  this.state.enabledDept[eachDept] === true  && (
    <svg className={`h-5 w-5 ml-1 my-auto text-mejito`} viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
</svg>
  )
}
{
   this.state.enabledDept[eachDept] === false  && (
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
</div>
  )
}



<div className={`flex flex-col md:flex-row md:w-full ${this.state.deptpanelopen === true ? "-z-10 block" : "block"} md:z-0`}

>
  <p className='grow'>Job Title</p>
  <input className='bg-truegray-600 md:grow lg:w-9/12 md:ml-2'
  onChange={e => {
    this.searchEmployeeJobTitle()
  }}
  id="jobelementtitle"></input>

<div>



</div>
</div>

          </div>
          
    )
          }
        </div>
  </React.StrictMode>
   
      </div></div>
    )
  }
}



export default Payroll