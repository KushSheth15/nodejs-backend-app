const {createObjectCsvStringifier} = require('csv-writer');

const generateDynamicCSV = (data)=>{
    const headers = Object.keys(data).map(key=>({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    const csvStringifier = createObjectCsvStringifier({
        header: headers
    });

    const records = [data];

    return csvStringifier.getHeaderString()+csvStringifier.stringifyRecords(records); 
};

module.exports = {
    generateDynamicCSV
}