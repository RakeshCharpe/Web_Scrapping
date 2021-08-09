let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let ScorecardObj=require("./Scorecard")

let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else if (response.statusCode == 404) {
    console.log("Page Not Found");
  } else {
    dataExtracter(html);
  }
}
function dataExtracter(html) {
  //search tool
  let searchTool = cheerio.load(html);
    let adelement = searchTool(".widget-items.cta-link");
    let anchorlink = searchTool(adelement).find("a");
    let hrefattr = anchorlink.attr("href");
    let fullAllMatchLink = `https://www.espncricinfo.com${hrefattr}`;
   // console.log(viewalllink);
  //go to all macth page
   request(fullAllMatchLink, newcb);
  
}
function newcb(error, response, html) {
if (error) {
  console.log(error);
} else if (response.statusCode == 404) {
  console.log("Page Not Found");
} else {
  getallscorecard(html);
}
}
function getallscorecard(html) {
    let searchTool = cheerio.load(html);
    let chooseelement = searchTool("a[data-hover='Scorecard']");
    for (let i = 0; i < chooseelement.length; i++) {
        let scorelink = searchTool(chooseelement[i]).attr("href");
        let AllMatchScorelink = `https://www.espncricinfo.com${scorelink}`;
       // console.log(AllMatchScorelink);
        ScorecardObj.Scorecardfn(AllMatchScorelink);
    }
    
     //request(fullAllMatchLink, newcb);
}