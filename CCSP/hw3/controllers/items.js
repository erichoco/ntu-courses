var fs = require('fs');

exports.list = function (req, res) {
  //fs.open('list.json', 'a+');
  fs.readFile('list.json', {encoding: 'utf-8', flag: 'a+'}, function(err, data) {
    if (err) throw err;
    if ('' !== data) {
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  });
};

exports.create = function (req, res) {
  var newTodo = req.body;
  //newTodo.id = 0;

  //fs.open('list.json', 'a+');
  fs.readFile('list.json', {encoding: 'utf-8', flag: 'a+'}, function(err, data) {
    if (err) throw err;

    console.log(data);
    var curList = [];
    newTodo.id = 0;
    if ('' !== data) {
      curList = JSON.parse(data);
      var maxId = 0;
      for (var i = curList.length - 1; i >= 0; i--) {
        if (curList[i].id >= maxId) {
            maxId = curList[i].id + 1;
        }
        //curList[i].id++;
      };
      newTodo.id = maxId;
    }

    curList.push(newTodo);
    fs.writeFile('list.json', JSON.stringify(curList), function(err) {
      if (err) throw err;
      console.log('New Todo Added!');
      res.send('success');
    });
  });

  //res.json(newTodo);
  // var newTodo = req.body;
  // newTodo.id = 1;// 2, 3, .....

  // res.json(newTodo);
};

exports.update = function (req, res) {
  console.log(req.params['id']);
  var doneId = parseInt(req.params['id']);

  fs.readFile('list.json', {encoding: 'utf-8',}, function(err, data) {
    if (err) throw err;
    if ('' === data) return;

    var curList = JSON.parse(data);
    for (var i = curList.length - 1; i >= 0; i--) {
      if (doneId === curList[i].id) {
        curList[i].done = true;
      }
    };
    fs.writeFile('list.json', JSON.stringify(curList), function(err) {
      if (err) throw err;
      res.send('success');
    });
  });
};

exports.reposition = function (req, res) {
  console.log('reposition from %d to %d', req.params['id'], req.params['new_position']);
  var origId = parseInt(req.params['id']),
      newId = parseInt(req.params['new_position']);
  var targetId = parseInt(req.params['id']),
      newPos = parseInt(req.params['new_position']);

  fs.readFile('list.json', {encoding: 'utf-8'}, function(err, data) {
    if (err) throw err;
    if ('' === data) return;

    var curList = JSON.parse(data);
    var target = {};
    for (var i = curList.length - 1; i >= 0; i--) {
      if (targetId === curList[i].id) {
        target = curList.splice(i, 1)[0];
        break;
      }
    }
    curList.splice(newPos, 0, target);
    /*  if (origId === curList[i].id) {
        curList[i].id = newId;
      } else {
        if (origId < curList[i].id) {
          curList[i].id--;
        }
        if (newId <= curList[i].id) {
          curList[i].id++;
        }
      }
    };*/
    fs.writeFile('list.json', JSON.stringify(curList), function(err) {
      if (err) throw err;
      res.send('success');
    });
  });
};

exports.delete = function (req, res) {
  console.log(req.params['id']);
  var delId = parseInt(req.params['id']);

  fs.readFile('list.json', {encoding: 'utf-8'}, function(err, data) {
    if (err) throw err;
    if ('' === data) return;

    var curList = JSON.parse(data);
    var delIdx = 0;
    for (var i = curList.length - 1; i >= 0; i--) {
      if (delId === curList[i].id) {
        delIdx = i;
      }
      if (delId < curList[i].id) {
        curList[i].id--;
      }
    };
    curList.splice(delIdx, 1);
    fs.writeFile('list.json', JSON.stringify(curList), function(err) {
      if (err) throw err;
      res.send('success');
    });
  });
};
