var xlsx = require('xlsx');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');
var argv = require('yargs').argv;
var workbook = void 0;
var cells = 0;
var URLS = [];
var HTMLS = [];
function generateNewSchema(){
    var o = new Object();
    // write schema here
    return o;
}


if(!argv.excel){
    console.log("You forgot to gimme the excel file's name. Don't know what to read now. Try this: node index --excel=theFileName.xlsx")
    process.exit(0);
}
try{
    workbook = xlsx.readFile(argv.excel);
} catch(e){
    console.log("Can't find that file. Try again.");
    process.exit();
}
if(!argv.output){
    console.log("You didn't specify the file name where you want the stuff to be compiled. I'll do it in report.xlsx");
}
Object.keys(workbook.Sheets['Sheet 1']).forEach(function(cell){
    if(cell.split('')[0] === 'A'){
        cells++;
        URLS.push(workbook.Sheets['Sheet 1']['A'+cells].v);
    }
})
console.log("Got "+URLS.length+" links. Now reading each of them.");


function fetchData(){
    var counter = 0;
    return new Promise(function(resolve, reject){
        URLS.forEach(function(url){
            //console.log("Requesting for", url);
            request(url, function(error, response, html){
                if(error){
                    console.log("Problem fetching ", url, "Skipping it");
                    counter++;
                } else {
                    console.log("fetched for", url);
                    HTMLS.push({
                        url:url,
                        html:html
                    });
                    counter++;
                }
                if(counter === URLS.length){
                    resolve(HTMLS);
                }
            })
        })
    })
}

fetchData()
    .then(function(DATA){
        console.log("Done");
    });