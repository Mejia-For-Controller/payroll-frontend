import TableauEmbed from '../components/tableau'
import TableauEmbedFunc from '../components/tableaufun'
//import BasicEmbed from '../components/basicembed'

function lapdvendors() {
  return <div suppressHydrationWarning={true} className='height100'>{
    process.browser && <TableauEmbedFunc
      key='checkbook1'
      url='https://public.tableau.com/views/LosAngelesFY2021PoliceCheckbookv1/VendorAmountList?:language=en-US&:embed=y&:origin=viz_share_link&:embed_code_version=3&:loadOrderID=0&:display_count=y&publish=yes'
    />
  }
    </div>
}

export default lapdvendors