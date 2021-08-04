//import TableauEmbed from '../components/tableau'
//import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'
import Disclaimer from '../components/disclaimer'
import DataCard from '../components/datacard'

function AllData() {
  return <div>
    <Head>
      <title>Browse Datasets - Kentrol Panel</title>
      <meta property="og:type" content="website"/>
      <meta name="twitter:site" content="@kennethmejiala" />
        <meta name="twitter:creator" content="@kennethmejiala" />
<meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" key='twittertitle' content="Browse Los Angeles Datasets - Kentrol Panel"></meta>
<meta name="twitter:description"  key='twitterdesc' content="A searchable Database of City Spending and Budgets."></meta>
<meta name="twitter:image" key='twitterimg' content="https://data.mejiaforcontroller.com/cityworkercardv2.png"></meta>
    </Head>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
      <DataCard
        tableau='https://public.tableau.com/app/profile/kenneth.mejia.for.la.city.controller/viz/LAPayrollFY2020withNames/Dashboard1'
        excel='http://datasets.mejiaforcontroller.com/cityofLA2020payrollemployeesv2.xlsx'
      />
<Disclaimer />
</div></div>
    
  </div>
}

export default AllData