import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'

function lapdvendors() {
  return <div suppressHydrationWarning={true} className='height100'>{
    process.browser && <TableauEmbedFunc
      key='checkbook1'
      url='https://public.tableau.com/views/LosAngelesFY2021PoliceCheckbookv1/VendorAmountList?:language=en-US&:embed=y&:origin=viz_share_link&:embed_code_version=3&:loadOrderID=0&:display_count=y&publish=yes'
    />
  }
    <Head>
    <meta name="twitter:title" content="Los Angeles Police Dept FY2021 Vendors - $100,750,061"/>
<meta name="twitter:description" content="View and Search Vendors, Transactions, and Spending Purpose of LAPD's 2021 Checkbook"/>
<meta name="twitter:image" content="https://lapdvendors.mejiaforcontroller.com/twittercard3-min.png"/>

<meta property="og:title" content="Los Angeles Police Dept FY2021 Vendors - $100,750,061"/>
<meta property="og:site_name" content="Kenneth Mejia for Los Angeles City Controller"/>
<meta property="og:url" content="https://lapdvendors.mejiaforcontroller.com"/>
<meta property="og:description" content="View and Search Vendors, Transactions, and Spending Purpose of LAPD's 2021 Checkbook"/>
<meta property="og:image" content="https://lapdvendors.mejiaforcontroller.com/twittercard3-min.png"/>
    </Head>
    </div>
}

export default lapdvendors