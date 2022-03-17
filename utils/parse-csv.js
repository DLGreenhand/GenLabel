const csv = require('fast-csv');

const parseCSV = (pathname) => new Promise((resolve, reject) => {
    let data = [];
    try {
        csv.parseFile(pathname)
            .on('error', error => console.error(error))
            .on('data', row => data = data.concat(row))
            .on('end', rowCount => { console.log(`Successfully parse ${pathname}. ${rowCount} rows in all.`); resolve(data); });
    } catch (err) {
        console.error(err);
        reject(err);
    }
})

export default parseCSV;
