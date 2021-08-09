let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let path = require("path");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
function Scorecardfn(url) {
    request(url, cb);
}
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
//  let batting = searchTool(".table.batsman tbody tr");

//     console.log(
//         " name  Runs  Balls  four  six  strike");
//  for (let i = 0; i < batting.length; i++) {
//      let cols = searchTool(batting[i]).find("td");
//      //if (cols.length < 8) {
//          let name = searchTool(cols[0]).text();
         
//          let Runs = searchTool(cols[2]).text();
//          let Balls = searchTool(cols[3]).text();
//          let four= searchTool(cols[4]).text();
//          let six = searchTool(cols[5]).text();
//          let strike = searchTool(cols[6]).text();
//          console.log(name+" "+ Runs+" "+ Balls+" "+four+" "+six+" "+strike);
//     // }

//    //let wickets = searchTool(cols[4]).text();

    let bothInningsArr=searchTool(".Collapsible");
    for (let i = 0; i < bothInningsArr.length; i++){
        let teamNameE1 = searchTool(bothInningsArr[i]).find("h5");
        let teamname = teamNameE1.text();
            teamname=teamname.split("INNINGS")[0];
        teamname = teamname.trim();
      console.log(teamname);
      let opponentTeamName = i == 0 ? searchTool(bothInningsArr[1]).text() : searchTool(bothInningsArr[0]).text();
      opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();

      
      
      
        let theading = searchTool(bothInningsArr[i]).find(".thead-light.bg-light tr");
        for (let j = 0; j < theading.length; j++){
            let tableheading = searchTool(theading[j]).find("th");
            if (tableheading.length == 8) {
                let Batting = searchTool(tableheading[0]).text();
                let Runs = searchTool(tableheading[2]).text();
                let Balls = searchTool(tableheading[3]).text();
                let four = searchTool(tableheading[5]).text();
                let six = searchTool(tableheading[6]).text();
                let strikeRate = searchTool(tableheading[7]).text();
                console.log("---------------------------------------------------------------------------")
                console.log(
                  Batting.padEnd(20, " ") +
                    "        " +
                    Runs.padEnd(3, " ") +
                    "     " +
                    Balls.padEnd(3, " ") +
                    "   " +
                    four.padEnd(3, " ") +
                    "     " +
                    six.padEnd(3, " ") +
                    "    " +
                    strikeRate
                );
                 console.log(
                   "---------------------------------------------------------------------------"
                 );
            }
            
        }
        let bothInningsRows = searchTool(bothInningsArr[i]).find(".table.batsman tbody tr");
        //console.log(bothInningsRows.length);
        
        
        for (let j = 0; j < bothInningsRows.length; j++){
            
            
            let inningsTd = searchTool(bothInningsRows[j]).find("td");
            if (inningsTd.length == 8) {
              let playername = searchTool(inningsTd[0]).text();
              let Runs = searchTool(inningsTd[2]).text();
                       let Balls = searchTool(inningsTd[3]).text();
                       let four= searchTool(inningsTd[5]).text();
                       let six = searchTool(inningsTd[6]).text();
                let strike = searchTool(inningsTd[7]).text();
                
                       console.log(
                         playername.padEnd(20, " ") +
                           "        " +
                           Runs.padEnd(3, " ") +
                           "     " +
                           Balls.padEnd(3, " ") +
                           "    " +
                           four.padEnd(3, " ") +
                           "    " +
                           six.padEnd(3, " ") +
                           "   " +
                           strike
                       );

             // console.log(playername);
              playerprocess(teamname, playername,opponentTeamName, Runs, Balls, four, six, strike);
            }
           
        }
         console.log(
           "***************************************************************************"
         );
    }
 
}
function playerprocess(teamname, playername, opponentTeamName,Runs, Balls, four, six, strike) {
  let dirname = process.cwd();
  let folderpath = path.join(dirname, "ipl", teamname);
  dircreator(folderpath);
  let filepath = path.join(folderpath, playername + ".json");
  //let content = jsoncreator(filepath, playername);
  let content = [];
  let matchobj = {
    teamname,
    playername,
    opponentTeamName,
    Runs,
    Balls,
    four,
    six,
    strike,
  };
  content.push(matchobj);
  if (fs.existsSync(filepath)) {
    let buffer = fs.readFileSync(filepath);
    content = JSON.parse(buffer);
  }
  content.push(matchobj);
  fs.writeFileSync(filepath, JSON.stringify(content));
}
function dircreator(folderpath) {
  if (fs.existsSync(folderpath) == false) {
    fs.mkdirSync(folderpath);
  }
}

module.exports={
    Scorecardfn
}
Scorecardfn(url);