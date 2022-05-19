
import algoliasearch from 'algoliasearch/lite';
import { ProductItem } from '../components/ProductItem';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import { Autocomplete } from '../components/Autocomplete';


import Head from 'next/head'

import React from 'react'
import dynamic from 'next/dynamic'
import { timeStamp } from 'console';


const appId = 'O5BYH2RE4Y';
const apiKey = 'f245c81fd74df69b274bf619e1c29fd3';
const searchClient = algoliasearch(appId, apiKey);


interface requirementsForAutocompleteProps {
    [key: string]: any,
    index: string,
    onChange?: any;
}

export class AutocompleteBox extends React.Component<any, any> {

    //PayrollEmployeeList
    jobtitleindex = searchClient.initIndex(this.props.index);

    constructor(props: requirementsForAutocompleteProps) {

        super(props);
        this.state = {
            employeejobtitlelastupdated: '',
            employeesJobTitleAutocompleteResults: [],
            outputvalue: "",
            currentFocus: -1,
            openUpBox: false
        };
    }

    setInputValue = (valueToSet) => {
        var inputjobtitle: any = document.getElementById(`inputboi-${this.props.index}`)


        if (inputjobtitle) {
        
            inputjobtitle.value = valueToSet;

            this.setState({
                outputvalue: valueToSet
            })
        
            if (valueToSet === '') {
                this.setState({
                    openUpBox: false
                })
            }

        }
    }

    searchEmployeeJobTitle = () => {
        var inputjobtitle: any = document.getElementById(`inputboi-${this.props.index}`)

        if (inputjobtitle) {

            this.setState({
                outputvalue: inputjobtitle.value,
                currentFocus: -1
            })

            if (inputjobtitle.value.length > 0) {
                var searchterm = inputjobtitle.value;


                if (searchterm.length < 90) {
                    this.jobtitleindex
                        .search(searchterm)
                        .then(({ hits }) => {
                            console.log(hits);

                            this.setState({
                                employeejobtitlelastupdated: searchterm,
                                employeesJobTitleAutocompleteResults: hits
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

            }
        }


    }


    sendBackToParent = () => {
        var inputBoi: any = document.getElementById(`inputboi-${this.props.index}`)

        if (inputBoi) {
            if (inputBoi.value !== undefined && inputBoi.value !== null) {
                if (this.props.onChange) {
                    console.log('sending', inputBoi.value)
                    this.props.onChange(inputBoi.value)
                }
            }
            
        }
    }

    nextFocus = () => {
        this.setState((state, props) => {
            return {
                currentFocus: state.currentFocus + 1
            }
        })
    }

    prevFocus = () => {
        this.setState((state, props) => {
            return {
                currentFocus: state.currentFocus - 1
            }
        })
    }

    componentDidMount = () => {

        /*execute a function when someone clicks in the document:*/
document.addEventListener("click",(e) => {
    this.closeAllLists(e.target);
});

        var indexName = this.props.index;

        var inputBoi: any = document.getElementById(`inputboi-${this.props.index}`)
        /*execute a function presses a key on the keyboard:*/
        inputBoi.addEventListener("keydown", (e) => {
            var x: any = document.getElementById(indexName + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    this.prevFocus()
                } else {
                    this.nextFocus()
                }
                if ((this.state.openUpBox === true) && (inputBoi.value > 0)) {
                    e.preventDefault();
                }
            }

            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                this.nextFocus()
                /*and and make the current item more visible:*/
                //addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                // currentFocus--;

              this.prevFocus()

                /*and and make the current item more visible:*/
                //addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                // e.preventDefault();
                if (this.state.currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[this.state.currentFocus].click();
                }
            }
        });

    }

      closeAllLists = (elmnt) =>{
        this.setState({
            openUpBox: false
        })
    }



    switchValue = (valueToSet) => {
        var inputBoi: any = document.getElementById(`inputboi-${this.props.index}`)

        if (inputBoi) {
            inputBoi.value = valueToSet;
        }
    }


    render() {
        return (

            <div className={`${this.props.parentClasses} autocomplete w-full`}>
                <label className="mdc-text-field mdc-text-field--outlined">
                 <span className="mdc-notched-outline">
    <span className="mdc-notched-outline__leading"></span>
    <span className="mdc-notched-outline__notch">
      <span className="mdc-floating-label" id="my-label-id">{this.props.placeholder}</span>
    </span>
    <span className="mdc-notched-outline__trailing"></span>
  </span>

                <input type="text" className={`mdc-text-field__input bg-truegray-700 ${this.props.inputClasses}`}

                    

                    onChange={e => {
                        this.sendBackToParent()
                   this.searchEmployeeJobTitle()
                        
                    }}

                   onKeyDown={e => {
                    //this.sendBackToParent()
                   }}

                   onKeyUp={e => {
                   //this.sendBackToParent()
                   }}

                    onClick={(e) => {
                        this.setState({
                            openUpBox: true
                        })
                       // this.sendBackToParent()
                    }}

                    onPaste={(e) => {
                        console.log(e)

                        this.sendBackToParent()

                        this.searchEmployeeJobTitle();
                        this.setState({
                            openUpBox: true
                        })
                       // 
                    }}

                    onKeyPress={e => {
                     //   this.sendBackToParent()

                        if (e.key === "Enter") {
                            this.setState({
                                openUpBox: false
                            })
                        } else {
                            this.setState({
                                openUpBox: true
                            })
                            
                        }

                      //
                        console.log(e)
                    }}
                    id={`inputboi-${this.props.index}`}></input>

                <div id={this.props.index + "autocomplete-list"} className="autocomplete-items max-h-64 overflow-y-scroll">

                    {
                        (this.state.outputvalue.trim().length > 0 && this.state.openUpBox) && (
                            this.state.employeesJobTitleAutocompleteResults
                                .map((eachItem, itemIndex) => (
                                    <div
                                    key={itemIndex}
                                    onClick={
                                        e => {
                                            this.switchValue(eachItem[this.props.col])
                                        }
                                    }
                                    className={`pl-1 md:pl-2 py-1 md:py-2 text-base eachautoitem bg-truegray-900 text-truegray-200 ${this.state.currentFocus === itemIndex ? 'autocomplete-active' : ""}`}>{eachItem[this.props.col]}</div>
                                ))
                        )
                    }
                </div>




                </label>
            </div>



        )
    }
}