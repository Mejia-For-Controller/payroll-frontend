import ActiveLink from './ActiveLink'
const navigationPayroll = [
  {
    'name': "LA City Payroll",
    'url': "/",
  },
  {
    'name': "Mejia for Controller",
    'url': "https://mejiaforcontroller.com/",
    'newtab': true
  }
]

function PayrollNav() {
  return  <div className="bg-black flex flex-col">
  <nav className="flex flex-row">
      {navigationPayroll.map((item, itemIdx) =>
                     
              
                     <ActiveLink activeClassName="text-gray-100 py-3 px-2 md:px-3 md:px-6 block hover:text-green-300 focus:outline-none text-green-300 border-b-2 font-medium border-green-300 shrink" href={item.url}
                     key={itemIdx}
                     >
                     <a className="text-sm sm:text-base md:text-lg  text-gray-100 py-3 px-3 md:px-6 block hover:text-green-300 focus:outline-none underline shrink"
                          target={`${item.newtab === true ? "_blank" : ""}`}
                     >
                                                 {item.name}
                     </a>
                     </ActiveLink>
                     
                   )}
  </nav></div>
}

export default PayrollNav