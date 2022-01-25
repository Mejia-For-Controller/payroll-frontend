import Head from 'next/head'
//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'
import Disclaimer from '../components/disclaimer'

import PayrollNav from '../components/payrollnav'

function Summary() {
  return <div className='height100'>
    <Head>
      <title>Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="City of LA Employee Names and Payroll"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search City Employee Names, Job Titles, Salaries, Overtime, Benefits, Pensions, and more!"></meta>
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