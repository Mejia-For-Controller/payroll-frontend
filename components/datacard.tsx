import DownloadButton from './downloadbutton'
import DownloadIcon from './downloadicon'

function DataCard(props) {
  return <div className='bg-white shadow rounded-lg'>
    <div className="border-t-2">
    <div className='space-x-2'>
  <div className="inline"><DownloadIcon /></div>
  <div className="inline">Download</div>
</div>
    </div>
  </div>
}

export default DataCard