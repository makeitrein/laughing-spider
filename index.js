var express = require('express');
var fs      = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var app     = express();


app.get('/scrape', function (req, res) {
  
  var baseUrl   = 'https://forums.spacebattles.com/threads/wormverse-ideas-recs-and-fic-discussion-thread-40.311933/page-';
  var url;
  var urls      = [];
  var json      = {links: []};
  var page      = 2350;
  var outputUrl =  "./" + String(Date.now()) + ".txt";
  
  var scrapeInterval = setInterval(newPageScrape, 2000);
  
  function newPageScrape() {
    page++;
    url = baseUrl + page;
    urls.push(request(url).then(function (response) {
      var $ = cheerio.load(response);
      return $('.message').filter(function () {
        var id    = $(this).attr("id");
        var likes = (parseInt($(this).find('.LikeText .OverlayTrigger').text().replace(/\D/g,'')));
        var link = {url: url + "#" + id, likes: likes};
        if (likes > 100) {
          console.log(link);
        }
        json.links.push(link);
      });
    }).catch(function (err) {
      console.log(err);
      clearInterval(scrapeInterval);
    }))
  }
  
  
  Promise.all(urls).then(function () {
    console.log(json);
    res.send(json);
  }).catch(console.log.bind(console));
  
});


app.listen('8081')
console.log('Magic happens on port 8081');
exports     = module.exports = app;