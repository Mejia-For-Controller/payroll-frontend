//import logo from './logo.svg';
import kennethavatar from './kennethheadshot.png';
import './App.css';
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import React, { useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import TableauEmbed from './tableau'
//import {Budget} from './budget'

import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

const {tableau} = window;


//const navigation = ['Dashboard', 'Payroll', 'Checkbook', 'Budget', "Revenue", "All Data"]
const navigation = [
  {
    'name': "Dashboard",
    'url': "/"
  },
  {
    'name': "Payroll",
    'url': "/payroll"
  },
  {
    'name': "Checkbook",
    'url': '/checkbook'
  },
  {
    'name': "Revenue",
    'url': "/revenue"
  },
  {
    'name': "All Data",
    'url': "alldata"
  }
]
const profile = ['Your Profile', 'Settings', 'Sign out']

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  return (
   
<div class='box height100'>
<Router>
    <Disclosure class='row header' as="nav" className="bg-gray-800 shadow-lg z-50">
        {({ open }) => (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-9 w-9"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                // src='/favicon.png'
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                     
                          <NavLink
                          key={item}
                          exact={true}
                          to={item.url}
                          activeClassName='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {item.name}
                         
                        </NavLink>
                        
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <div>
                          <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={kennethavatar}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              {profile.map((item) => (
                                <Menu.Item key={item}>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      {item}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </div>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                
                
                {navigation.map((item, itemIdx) =>
                 
                    <NavLink
                    key={item}
                    exact={true}
                    to={item.url}
                    activeClassName='bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white'
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                   
                  </NavLink>

                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">Tom Cook</div>
                    <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
                  </div>
                  <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {profile.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      

      <div class='row content'>

         {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
         
          <Route path="/checkbook" onEnter={() => {
       
          }}>
         <TableauEmbed
         key='Checkbook'
         url='https://public.tableau.com/views/LosAngelesFY2021Checkbookv1/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
         
                  />
          </Route>
          <Route path="/lapdvendors" onEnter={() => {
       
      }}>
     <TableauEmbed
     key='LAPDVendors'
     url='https://public.tableau.com/views/LosAngelesFY2021PoliceCheckbookv1/VendorAmountList?:language=en-US&:embed=y&:origin=viz_share_link&:embed_code_version=3&:loadOrderID=0&:display_count=y&publish=yes'
     
              />
      </Route>
          <Route path="/payroll">
            <TableauEmbed
            key='payroll1'
            url='https://public.tableau.com/views/LAPayrollFY2020withNames/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
            />
          </Route>
          <Route path="/budget">
            
          <TableauEmbed 
          key = 'Budget'
          url = 'https://public.tableau.com/views/Budget_16273393123040/Sheet1?:language=en-US&:display_count=n&:origin=viz_share_link'
          />
            
          </Route>
          <Route path="/alldata">
          
          <Empty/>
          </Route>
          <Route path="/">
            <Empty/>
          </Route>
          </Switch>
          </div>
      </Router>
      </div>
  );
}


function Empty() {
  return <h2 className='p-10'> kyler hasn't coded anything here yet! If you think it's actually broken, email kyler at kyler@mejiaforcontroller.com</h2>
}
