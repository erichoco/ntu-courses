(function(){

// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>
var curLiState = '';
var movingLiIdx = null;

loadOldList();

mainUl.sortable({
    start: function(evt, ui) {
        $('#placeholder').toggleClass('is-dragging');
        movingLiIdx = ui.item.index();
    },
    sort: function(evt, ui) {
        console.log(evt.pageX);
        var leftBound = deleteUl.position().left + deleteUl.outerWidth();
        var rightBound = doneUl.position().left;
        if (leftBound > evt.pageX) {
            curLiState = 'del';
        }
        else if (rightBound < evt.pageX) {
            curLiState = 'done';
        }
        else {
            curLiState = '';
        }
    },
    stop: function(evt, ui) {
        $('#placeholder').toggleClass('is-dragging');
        var newIdx = ui.item.index();
        if ('del' === curLiState) {
            $.ajax({
                url: '/items/' + movingLiIdx,
                type: 'DELETE',
                success: function() {
                    console.log('delete success!');
                    curLiState = '';
                    movingLiIdx = null;
                },
            });
            ui.item.remove();
        } else {
            var repos = function() {
                $.ajax({
                    url: '/items/' + movingLiIdx + '/reposition/' + newIdx,
                    type: 'PUT',
                    success: function() {
                        console.log('reposition success!');
                        curLiState = '';
                        movingLiIdx = null;
                    }
                });
            };
            if ('done' === curLiState) {
                ui.item.addClass('is-done').appendTo(mainUl);
                newIdx = ui.item.index();
                $.ajax({
                    url: '/items/' + movingLiIdx,
                    type: 'PUT',
                    success: function() {
                        console.log('update success!');
                        if (movingLiIdx !== newIdx) {
                            console.log('changed');
                            repos();
                        } else {
                            curLiState = '';
                            movingLiIdx = null;
                        }
                    },
                });
            }
            else if (movingLiIdx !== newIdx) {
                repos();
            }
        }
    }
});

addButton.on('click', function() {
    mainUl.find('.is-editing').remove();
    var newl = '<li class="is-editing"><input type="text" placeholder="New task..."><span></span></li>';
    var newlElem = $(newl).prependTo(mainUl).on('keyup', function(evt) {
        if (13 === evt.keyCode) {
            mainUlAddLi(this);
            $this = $(this);
            var newTodo = {
                'done': false,
                'text': $this.find('span').html(),
            };

            $.ajax({
                url: '/items',
                type: 'POST',
                data: JSON.stringify(newTodo),
                contentType: 'application/json; charset=utf-8',
                success: function(rep) {
                    console.log('create success!');
                },
            });
        }
    }).find('input').focus();
});

function mainUlAddLi(thisEl) {
    var $this = $(thisEl);
    var thisInput = $this.find('input');
    $this.removeClass('is-editing');
    $this.find('span').addClass('text')
        .html(thisInput.val());
}

function loadOldList() {
    $.ajax({
        url: '/items',
        type: 'GET',
        success: function(res) {
            console.log('load success!');
            //JSON.parse(res);
            console.log(res);
            var liObj = res;
            if (0 === liObj.length) return;
            compareId = function(li1, li2) {
                return li1.id - li2.id;
            }
            liObj.sort(compareId);
            var len = liObj.length;
            for (var i = 0; i < len; i++) {
                var isDone = (liObj[i].done)? 'is-done' : '';
                mainUl.append('<li class="' + isDone + '">' +
                    '<span>' + liObj[i].text + '</span></li>');
            }
        }
    });
}
}());