// Crawling Apple Daily news pages

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var appledaily = [];

var requestURLs = [
    'http://www.appledaily.com.tw/realtimenews/section/new/1',
    'http://www.appledaily.com.tw/realtimenews/section/new/2',
    'http://www.appledaily.com.tw/realtimenews/section/new/3',
    'http://www.appledaily.com.tw/realtimenews/section/new/4',
    'http://www.appledaily.com.tw/realtimenews/section/new/5'
];
var crawlCnt = 0;
var domainURL = 'www.appledaily.com.tw';

for (var i = requestURLs.length - 1; i >= 0; i--) {
    request(requestURLs[i], function(err, rep, html) {
        if (!err && 200 === rep.statusCode) {
            var $ = cheerio.load(html);
            $('ul.rtddd.slvl li').each(function() {
                var thisNews = {};
                var $this = $(this);
                thisNews.title = $this.find('h1 font').text();
                thisNews.url = domainURL + $this.find('a').attr('href');
                thisNews.time = $this.find('time').text();
                thisNews.video = $this.hasClass('hsv');

                var cat = $this.find('h2').text();
                pushNewsObj(thisNews, cat);
            });
            if (++crawlCnt === requestURLs.length) {
                // console.log(appledaily);
                fs.writeFile('appledaily.json', JSON.stringify(appledaily, null, 4), {'flag': 'w+'});
                findMaxCat();
            }
        }
    })
};

function pushNewsObj(newsObj, cat) {
    var catExist = false;
    for (var i = appledaily.length - 1; i >= 0; i--) {
        if (appledaily[i].category === cat) {
            appledaily[i].news_count++;
            appledaily[i].news.push(newsObj);
            catExist = true;
        }
    };
    if (!catExist) {
        // console.log('cat does not exist');
        appledaily.push({
            'category': cat,
            'news_count': 1,
            'news': [newsObj,]
        });
    }
};

function findMaxCat() {
    var maxCount = Math.max.apply(Math, appledaily.map(function(o) {
                    return o.news_count;
    }));
    console.log('Category with the most news:');
    for (var i = appledaily.length - 1; i >= 0; i--) {
        if (maxCount === appledaily[i].news_count) {
            console.log(appledaily[i].category + ' / ' + maxCount + ' items');
        }
    };
}