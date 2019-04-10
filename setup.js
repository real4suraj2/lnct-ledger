var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
function setup(username, password, callback) {
  var days = 0;
  var freedays = 0;
  var percentage = 0;
  var imgPath = "";
  var garbage = [];
  var login = {
    ctl00$ScriptManager1: "ctl00$cph1$UpdatePanel5|ctl00$cph1$btnStuLogin",
    ctl00$cph1$rdbtnlType: 2,
    ctl00$cph1$txtStuUser: username,
    ctl00$cph1$txtStuPsw: password,
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __LASTFOCUS: "",
    __VIEWSTATE:
      "/wEPDwUJNzA0MDQwNTMxD2QWAmYPZBYCAgMPZBYEAgcPZBYGAgMPZBYCZg9kFgICAQ8QZGQWAQIBZAIFD2QWAmYPZBYCAgEPFgIeB1Zpc2libGVnZAIHD2QWAmYPZBYCAgEPFgIfAGgWBGYPZBYCZg9kFgICAQ9kFgJmD2QWAgIBDw8WAh4EVGV4dAUDMTExZGQCBA9kFgJmD2QWAgIBD2QWAmYPZBYCAgEPZBYEZg9kFgJmD2QWAgIBD2QWAmYPZBYCAgEPEA8WBh4NRGF0YVRleHRGaWVsZAUHRmluWWVhch4ORGF0YVZhbHVlRmllbGQFCUZpblllYXJJRB4LXyFEYXRhQm91bmRnZBAVDwotLVNlbGVjdC0tCjIwMTktMjAyMCAKMjAxOC0yMDE5IAoyMDE3LTIwMTggCjIwMTYtMjAxNyAKMjAxNS0yMDE2IAoyMDE0LTIwMTUgCjIwMTMtMjAxNCAKMjAxMi0yMDEzIAoyMDExLTIwMTIgCjIwMTAtMjAxMSAKMjAwOS0yMDEwIAoyMDA4LTIwMDkgCjIwMDctMjAwOCAKMjAwNi0yMDA3IBUPATACMTQCMTMCMTICMTECMTABOQE4ATcBNgE1ATQBMwEyATEUKwMPZ2dnZ2dnZ2dnZ2dnZ2dnFgECAmQCAQ9kFgJmD2QWAgIBD2QWAmYPZBYCAgEPEGRkFgBkAgkPDxYCHwEFCzI2LUZlYi0yMDE5ZGRkAmZ1rlhOvwZaFnn/SvVIXUoVRKLQnzv3Cfb9lnAXYPc=",

    __EVENTVALIDATION:
      "/wEdAAcgE47fAmzqbHNijZM3YirpM53Y8ZOLfkHDcm83dIGbmLHg4zuDo887rMmdulsCaAPs0I8Mn+YPuHswTYNssJXEVkWObqnKYQNrJjyTxcyx5/pqPUldr/0h7YqHATFqu3Du6Lub2srira+f5x0vKRpFQf16Mz3wc6zH4ymZ8drhx0lLotq53UUx1lCq7WAPW8Q=",
    __ASYNCPOST: "false",
    ctl00$cph1$btnStuLogin: "Login >>"
  };

  var cookie = request.jar();
  request(
    {
      url: "http://lnct.lnct.ac.in/Accsoft2/Login.aspx",
      form: login,
      method: "POST",
      jar: cookie
    },
    (error, response, body) => {
      request.get(
        {
          url:
            "http://lnct.lnct.ac.in/Accsoft2/Parents/StuAttendanceStatus.aspx",

          jar: cookie
        },
        (error, response, body) => {
          var $ = cheerio.load(body);
          var total = $("#ctl00_ContentPlaceHolder1_lbltotperiod").text();
          total = parseInt(
            total
              .split("")
              .splice(total.length - 3, total.length)
              .join("")
              .trim()
          );
          var present = $("#ctl00_ContentPlaceHolder1_lbltotalp").text();
          present = parseInt(
            present
              .split("")
              .splice(present.length - 3, present.length)
              .join("")
              .trim()
          );

          percentage = present / total;
          garbage = [present, total, present, total, percentage, percentage];
          while (garbage[4] <= 0.75) {
            garbage[4] = (garbage[0] += 7) / (garbage[1] += 7);
            days++;
          }
          while (garbage[5] >= 0.75) {
            garbage[5] = garbage[2] / (garbage[3] += 7);
            freedays++;
          }
          freedays--;
          garbage[5] = present / (total + 7 * freedays);
          imgPath = "";
		if(total)
		{
          	request(
            	{
              	url:
                	"http://lnct.lnct.ac.in/Accsoft2/Parents/ParentDashBoard.aspx",
              	jar: cookie
            	},
            	(err, res, body) => {
              		var $ = cheerio.load(body);
              		var img = $("img");
              		imgPath = img[3].attribs.src;
				      imgPath =
				        "http://lnct.lnct.ac.in/Accsoft2" +
				        imgPath.substr(2, imgPath.length);
				      if (total) {
				        var name = $(
				          'td[class="TopMenuTD_2"]'
				        )[2].children[0].data.trim();
				        var branch = $(
				          'td[class="TopMenuTD_2"]'
				        )[6].children[0].data.trim();
				      }
				      if(freedays<0)
				      {
				      garbage[5]=percentage;
				      freedays='Sorry but taking more leaves will result in further fall of your attendence'
				      }
				      else
				      freedays='You can have leave for '+freedays+' day(s), your attendance will be still '+(garbage[5]*100).toFixed(2)+ " %";
				      callback(
				        days,
				        freedays,
				        (percentage * 100).toFixed(2),
				        imgPath,
				        total,
				        present,
				        (garbage[4] * 100).toFixed(2),
				        (garbage[5] * 100).toFixed(2),
				        name,
				        branch
				      );
            }
          );
	}
else
			callback(
				        0,
				        0,
				        0,
				        0,
				        0,
				        0,
				        0,
				        0,
				        0,
				        0
				      );

        }
      );
    }
  );
}

module.exports = {
  setup
};

