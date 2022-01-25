import Head from 'next/head'
//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'

import PayrollNav from '../components/payrollnav'

function Summary() {
  return <div className='height100'>
    <Head>
      <title>LA Payroll 2020 Employee Names and Salaries - Kentrol Panel</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="Los Angeles Employee Payroll 2020 -Employee Names and Salaries"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search Employee Names and Job Titles and see their Salaries and Benefits."></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
    </Head>
    <div suppressHydrationWarning={true} className='height100'>
    <PayrollNav/>
        <TableauEmbedFunc
          key='payroll1'
          url='https://public.tableau.com/views/LAPayrollFY2020withNames/SummaryPage'
          acceptUrlParams='true'
        />
  
      <div className='p-2'>
      <Disclaimer/>
      </div>
      </div></div>
}

export default Summary