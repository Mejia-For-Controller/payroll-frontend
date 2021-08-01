import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'

function Payroll() {
  return <div className='height100'>
    <Head>
    <meta name="twitter:title" content="Los Angeles Employee Payroll 2020 -Employee Names and Salaries"></meta>
<meta name="twitter:description" content="Search Names and Job Titles and see their Salaries and Benefits."></meta>
<meta name="twitter:image" content="https://data.mejiaforcontroller.com/cityworkercard.png"></meta>
    </Head>
     <TableauEmbedFunc
      key='payroll1'
      url='https://public.tableau.com/views/LAPayrollFY2020withNames/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
    />
    </div>
}

export default Payroll