const csvFilePath = './employeesv8.csv'

const editJsonFile = require("edit-json-file");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/employees8.json`);

const csv = require('csvtojson')
csv(
    {
        noheader:false,
        //output:"line",
        downstreamFormat: "array",
        delimiter: "|"
    }
)
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        console.log(jsonObj);
        var correctedJson = jsonObj.map((eachEmployee) => {
            eachEmployee['base'] = parseFloat(eachEmployee['base'])
            eachEmployee['overtime'] = parseFloat(eachEmployee['overtime'])
            eachEmployee['other'] = parseFloat(eachEmployee['other'])
            eachEmployee['healthcare'] = parseFloat(eachEmployee['healthcare'])

            eachEmployee['retirement'] = parseFloat(eachEmployee['retirement'])
            return eachEmployee
        })
        file.set("employees", correctedJson);
        // Save the data to the disk
        file.save();
    })
