//import TableauEmbed from '../components/tableau'
//import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'
import Disclaimer from '../components/disclaimer'

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
    <Disclaimer/>
  </div>
}

export default AllData