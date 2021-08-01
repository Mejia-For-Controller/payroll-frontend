import React, {useEffect} from 'react'
import dynamic from 'next/dynamic';

//import tableau from 'tableau-api';
//var tableau = require('tableau-api');

type MyProps = { 
  url: string;  
};

type MyState = {
  value: string;
  vizContainer: any;
}

type TableauType = React.Component<MyProps, MyState> & {vizContainer: any}

class TableauEmbed extends React.Component<MyProps, MyState> {
  
  vizContainer;

  constructor(props) {
    super(props)
  }
 
  componentDidMount() {
    this.initViz()
  }

  initViz() {
    if (typeof window !== 'undefined') {
      if (process.browser) {
        // client-side-only code
        const vizUrl = this.props.url;
        var thingwidth= document.documentElement.clientWidth
    
        var deviceType = "desktop";
    
        if (thingwidth < 767) {
            deviceType = "mobile"
        } else {
            deviceType = 'desktop'
        }
        var options = {
            hideTabs: true,
            onFirstInteractive: function () {
              console.log("Run this code when the viz has finished loading.");
              // @ts-ignore: Unreachable code error
              document.querySelector('.tableauembed > iframe').style.height = '100%'
              console.log('did it work?')
          },
            device: deviceType
        };
          
          const vizContainer = this.vizContainer;
          
          console.log('vizContainer',this.vizContainer)
          // @ts-ignore: Unreachable code error
          let viz = new tableau.Viz(vizContainer, vizUrl, options)
        
      }

    // const {tableau} = window;

    
    }
    
   
  }
 
  render() {
    return (
      <div className='height100'>
        <script type="text/javascript"
	    src="https://public.tableau.com/javascripts/api/tableau-2.8.1.min.js"></script>
        <div className='tableauembed height100' ref={(div) => {
        this.vizContainer = div;
      }}>
      </div>
      </div>
     
    )
  }
}

export default TableauEmbed;