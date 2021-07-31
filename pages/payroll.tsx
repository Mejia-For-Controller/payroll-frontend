import TableauEmbed from '../components/tableau'
//import BasicEmbed from '../components/basicembed'

function Payroll() {
  return <div suppressHydrationWarning={true}>{
    process.browser && <TableauEmbed
      key='payroll1'
      url='https://public.tableau.com/views/LAPayrollFY2020withNames/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link'
    />
  }
    </div>
}

export default Payroll