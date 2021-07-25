import React, { Component } from 'react';
import tableau from 'tableau-api';
 
 
class TableauEmbed extends Component {
  componentDidMount() {
    this.initViz()
  }
 
 
  initViz() {
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
        },
        device: deviceType
    };
    const vizContainer = this.vizContainer;

    let viz = new window.tableau.Viz(vizContainer, vizUrl,options)
    
  }
 
 
  render() {
    return (
      <div ref={(div) => { this.vizContainer = div }}>
      </div>
    )
  }
}
 
 
export default TableauEmbed;