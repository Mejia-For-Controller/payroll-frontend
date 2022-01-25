import ActiveLink from './ActiveLink'
const navigationPayroll = [
  {
    'name': "Summary",
    'url': "summary"
  },
  {
    'name': "Employee List",
    'url': "/"
  },
  {
    'name': "Mejia for Controller",
    'url': "https://mejiaforcontroller.com/"
  }
]

function PayrollNav() {
  return <div className="bg-white">
    <nav className="flex flex-col sm:flex-row">
      {navigationPayroll.map((item, itemIdx) =>
                     
              
                     <ActiveLink activeClassName="text-gray-600 py-3 px-6 block hover:text-green-500 focus:outline-none text-green-500 border-b-2 font-medium border-green-500" href={item.url}
                     key={itemIdx}
                     >
                     <a className="text-gray-600 py-3 px-6 block hover:text-green-500 focus:outline-none underline">
                                                 {item.name}
                     </a>
                     </ActiveLink>
                     
                   )}
  </nav></div>
}

export default PayrollNav