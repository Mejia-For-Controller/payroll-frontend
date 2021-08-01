//import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

import Head from 'next/head'

function Payroll() {
  return <div className='height100'>
          <script key='tableauscript' src='https://public.tableau.com/javascripts/api/tableau-2.min.js'></script>
    <div suppressHydrationWarning={true} className='height100'>
      {
        process.browser &&
        <TableauEmbedFunc
          key='payroll1'
          url='https://public.tableau.com/views/LAPayrollFY2020withNames/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
        />}
    </div></div>
}

export default Payroll