import ActiveLink from './ActiveLink'
const navigationPayroll = [
  {
    'name': "Map",
    'url': "/housing/"
  },
  {
    'name': "List",
    'url': "/housing/list"
  }
]

function HousingNav() {
  return <div className="bg-white">
    <nav className="flex flex-col sm:flex-row">
      {navigationPayroll.map((item, itemIdx) =>
                     
              
                     <ActiveLink activeClassName="text-gray-600 py-3 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500" href={item.url}
                     key={itemIdx}
                     >
                     <a className="text-gray-600 py-3 px-6 block hover:text-blue-500 focus:outline-none">
                                                 {item.name}
                     </a>
                     </ActiveLink>
                     
                   )}
  </nav></div>
}

export default HousingNav