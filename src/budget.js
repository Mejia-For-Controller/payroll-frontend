

import Chart from "react-google-charts";
import { Fragment } from 'react'
import React, { useState, useEffect, setState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

var resultofcsv = ''
var sankeydata;

export async function BudgetOld() {
   
      
    
  

        fetch("/datasets/fy2021budget.csv", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            resultofcsv = result;
            const parsed = parse(resultofcsv)
            console.log(parsed);

            sankeydata = parsed.map((row, index) => {
                if(index != 0) {
                    var amount = row[5]

                    if (amount === "") {
                        amount = 0;
                    }

                    amount = Number(amount)

                    return [row[1],row[2],amount];
                } else {
                    return [row[1],row[2],row[5]];
                }
            })

            const newArray = sankeydata.slice(0, 5)

            const bob = [["a",2,2],["police",2,1]]

          console.log("sankey")
            console.log(newArray)

            console.log(typeof(newArray))

           

            
        })

        return <Chart
        width={600}
        height={'300px'}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={[
            ['From', 'To', 'Weight'],
            ['Brazil', 'Portugal', 5],
            ['Brazil', 'France', 1],
            ['Brazil', 'Spain', 1],
            ['Brazil', 'England', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 5],
            ['Canada', 'England', 1],
            ['Mexico', 'Portugal', 1],
            ['Mexico', 'France', 1],
            ['Mexico', 'Spain', 5],
            ['Mexico', 'England', 1],
            ['USA', 'Portugal', 1],
            ['USA', 'France', 1],
            ['USA', 'Spain', 1],
            ['USA', 'England', 5],
            ['Portugal', 'Angola', 2],
            ['Portugal', 'Senegal', 1],
            ['Portugal', 'Morocco', 1],
            ['Portugal', 'South Africa', 3],
            ['France', 'Angola', 1],
            ['France', 'Senegal', 3],
            ['France', 'Mali', 3],
            ['France', 'Morocco', 3],
            ['France', 'South Africa', 1],
            ['Spain', 'Senegal', 1],
            ['Spain', 'Morocco', 3],
            ['Spain', 'South Africa', 1],
            ['England', 'Angola', 1],
            ['England', 'Senegal', 1],
            ['England', 'Morocco', 2],
            ['England', 'South Africa', 7],
            ['South Africa', 'China', 5],
            ['South Africa', 'India', 1],
            ['South Africa', 'Japan', 3],
            ['Angola', 'China', 5],
            ['Angola', 'India', 1],
            ['Angola', 'Japan', 3],
            ['Senegal', 'China', 5],
            ['Senegal', 'India', 1],
            ['Senegal', 'Japan', 3],
            ['Mali', 'China', 5],
            ['Mali', 'India', 1],
            ['Mali', 'Japan', 3],
            ['Morocco', 'China', 5],
            ['Morocco', 'India', 1],
            ['Morocco', 'Japan', 3],
          ]}
        rootProps={{ 'data-testid': '2' }}
      />
    }
  
    
export function Budgetv2() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems,data] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
     
       
    }, [])
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Chart
        width={600}
        height={'300px'}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={data}
      />
      );
    }
  }

  export class Budget extends React.Component {
    constructor() {
        super();
    
        var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
        '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];

        // Define the initial state:
        this.state = {

            options: {
              sankey: {
                  node: {
                      colors: colors
                  }
              } 
            },
          data:[
            ['From', 'To', 'Weight'],
            ['Brazil', 'Portugal', 5],
            ['Brazil', 'France', 1],
            ['Brazil', 'Spain', 1],
            ['Brazil', 'England', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 5],
            ['Canada', 'England', 1],
            ['Mexico', 'Portugal', 1],
            ['Mexico', 'France', 1],
            ['Mexico', 'Spain', 5],
            ['Mexico', 'England', 1]
          ]
        };
      }

      componentDidMount() {
        fetch("/datasets/fy2021budget.csv")
        .then(response => response.text())
        .then(result => {
            console.log(result)
            resultofcsv = result;
            const parsed = parse(resultofcsv)
            console.log(parsed);
  
            sankeydata = parsed.map((row, index) => {
                if(index != 0) {
                    var amount = row[5]
  
                    if (amount === "") {
                        amount = 0;
                    }
  
                    amount = Number(amount)
  
                    return [`Fund ${row[2]}`,`Dept: ${row[1]}`,amount];
                } else {
                    return [row[1],row[2],row[5]];
                }
            })
  
            const newArray = sankeydata.slice(0, 10)
  
            const bob = [["a",2,2],["police",2,1]]
  
          console.log("sankey")
            console.log(newArray)
  
            console.log(typeof(newArray))
  
            this.setState({ data: sankeydata });
  
  
            
        })
      }

      render() {
        return (
            <Chart
            width={'500'}
            height={'500'}
            chartType="Sankey"
            loader={<div>Loading Chart</div>}
            data={this.state.data}
            options={this.state.options}
            rootProps={{ 'data-testid': '2' }}
          />
        );
      }
    }
  