var express = require('express');

var items = require('./controllers/items');


var app = express();

// app.get('/', function(req, res) {
//     console.log(req);
//     res.send('Hello World Ya Ya');
// });
/*
 * 把public資料夾下的所有東西expose出來給app，當Browser要找靜態檔案的時候，
 * 會先從此資料夾底下開始找（所以我們把index.html放在這底下）
 * 同時也注意，在index.html內的stylesheets/javascripts的路徑，前面少了public/路徑，
 * 這是因為當我們使用express.static('./public')時，對瀏覽器來講的相對路徑就已經是從public/底下開始算了
 */
app.use(express.static('./public'));

app.use(express.bodyParser());

app.get('/items', items.list);

app.post('/items',items.create);

app.put('/items/:id', items.update);

app.put('/items/:id/reposition/:new_position', items.reposition);

app.delete('/items/:id', items.delete);

app.listen(5000, function () { console.log('Express server started at port 5000'); });
