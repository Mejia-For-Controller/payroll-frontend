import React, { useEffect } from 'react'
import dynamic from 'next/dynamic';

//import tableau from 'tableau-api';
//var tableau = require('tableau-api');

declare global {
  interface Window {
    tableau: any;
  }
}

type MyProps = { 
  url: string;  
};

type MyState = {
  value: string;
  vizContainer: any;
}

type TableauType = React.Component<MyProps, MyState> & {vizContainer: any}

const TableauEmbedFunc = (props) => {

  var vizContainer;
 // var viz;

  useEffect(() => {

    if (typeof window !== 'undefined') {
      if (process.browser) {

        console.log("current time", Date.now())

        // client-side-only code
        const vizUrl = props.url;
        var thingwidth = document.documentElement.clientWidth
    
        const filterAttachToUrl = props.filterAttachToUrl;

        var deviceType = "desktop";
    
        if (thingwidth < 767) {
          deviceType = "mobile"
        } else {
          deviceType = 'desktop'
        }
        var options = {
          hideTabs: true,
          onFirstInteractive: function () {
             // @ts-ignore: Unreachable code error
          document.querySelector('.tableauembed > iframe').style.height = '100%'
            // @ts-ignore: Unreachable code error
            var elementtohide = document.querySelector('.loadinginfo')
            elementtohide.remove()
            console.log("Run this code when the viz has finished loading.");
          },
          device: deviceType
        };
          
       // const vizContainer = vizContainer;
        
        const queryString = window.location.search;
        console.log(queryString);
        
    //   const queryString = window.location.search;
      // console.log(queryString);
          
        console.log('vizContainer', vizContainer)
        console.log('window.tableau', window.tableau)
        // @ts-ignore: Unreachable code error
        if (typeof window.tableau !== 'undefined') {
          // @ts-ignore: Unreachable code error
         let viz = new window.tableau.Viz(vizContainer, vizUrl, options)
        }
      }

      // const {tableau} = window;
      
    
    }

  }, [])

  return (
    <div className='height100'>

      <div className='tableauembed height100' ref={(div) => {
      vizContainer = div;
      }}>
        <p className="text-center loadinginfo corgiloading sm:p-4 md:p-8 sm:text-sm md:text-base max-w-full">Our team of well-fed corgis are downloading and visualizing your data.
         This may take a few seconds, please wait.</p>
    </div>
    </div>
   
  )
}

export default TableauEmbedFunc;