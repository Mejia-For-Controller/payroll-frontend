const editJsonFile = require("edit-json-file");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/employees.json`);

function processStringToFloat(stringin) {
    if (stringin === "" || stringin === null || stringin === NaN) {
        return 0
    }  else {
        return parseFloat(stringin)
    }
}

console.time('getfile')

var employees = file.get('employees').map((eachEmployee) => {
    //console.log(eachEmployee)
    eachEmployee.base = processStringToFloat(eachEmployee.base)
    eachEmployee.other = processStringToFloat(eachEmployee.other)
    eachEmployee.overtime = processStringToFloat(eachEmployee.overtime)    
    eachEmployee.healthcare = processStringToFloat(eachEmployee.healthcare)
    eachEmployee.retirement = processStringToFloat(eachEmployee.retirement)

    return eachEmployee;
})


console.timeEnd('getfile');

var total = 0;

var police = []

console.time('total')



employees.forEach((eachEmployee) => {
  
     //   var subtotal = eachEmployee.base + eachEmployee.other + eachEmployee.overtime + eachEmployee.healthcare + eachEmployee.retirement;
      //  if (subtotal != NaN) {
            
      //  total = subtotal + total;
      //  }
    
      if (eachEmployee.department === 'CONTROLLER') {
          police.push(eachEmployee)
      }
    

})

console.timeEnd('total');
console.log(total)