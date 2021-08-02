//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'

function Payroll() {
  return <div className='height100'>
    <Head>
      <title>LA Payroll 2020 Employee Names and Salaries - Kentrol Panel</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="Los Angeles Employee Payroll 2020 -Employee Names and Salaries"></meta>
<meta name="twitter:description"  key='twitterdesc' content="Search Names and Job Titles and see their Salaries and Benefits."></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
    </Head>
    <div suppressHydrationWarning={true} className='height100'>
      {
        process.browser &&
        <TableauEmbedFunc
          key='payroll1'
          url='https://public.tableau.com/views/LAPayrollFY2020withNames/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
          acceptUrlParams='true'
        />}
    </div></div>
}

export default Payroll