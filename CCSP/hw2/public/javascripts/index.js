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

loadFromLocal();

mainUl.sortable({
    start: function(evt, ui) {
        $('#placeholder').toggleClass('is-dragging');
        // deleteUl.on('mouseenter', function() {
        //     console.log('damn');
        // });//cursorEnter());
        // doneUl.on('mouseenter', cursorEnter);
    },
    sort: function(evt, ui) {
        console.log(evt.pageX);
        var leftBound = deleteUl.position().left + deleteUl.outerWidth();
        var rightBound = doneUl.position().left;
        if (leftBound > evt.pageX) {
            curLiState = 'del';
        }
        if (rightBound < evt.pageX) {
            curLiState = 'done';
        }
    },
    stop: function(evt, ui) {
        $('#placeholder').toggleClass('is-dragging');
        if ('done' === curLiState) {
            ui.item.addClass('is-done').appendTo(mainUl);
        }
        else if ('del' === curLiState) {
            ui.item.remove();
        }
        curLiState = '';
        storeToLocal();
    }
});

addButton.on('click', function() {
    mainUl.find('.is-editing').remove();
    var newl = '<li class="is-editing"><input type="text" placeholder="New task..."><span></span></li>';
//    mainUl.prepend(newl);
    var newlElem = $(newl).prependTo(mainUl).on('keyup', function(evt) {
        if (13 === evt.keyCode) {
            mainUlAddLi(this);
            storeToLocal();
        }
    }).find('input').focus();
});

function mainUlAddLi(thisEl) {
    var $this = $(thisEl);
    var thisInput = $this.find('input');
    $this.removeClass('is-editing');
    $this.find('span').addClass('text')
        .html(thisInput.val());}

function loadFromLocal() {
    if (!localStorage.getItem('todoitems'))
        return;
    var liObj = JSON.parse(localStorage.todoitems);
    var len = liObj.length;
    for (var i = 0; i < len; i++) {
        var isDone = (liObj[i].done)? 'is-done' : '';
        mainUl.append('<li class="' + isDone + '">' +
            '<span>' + liObj[i].text + '</span></li>');
    }
}

function storeToLocal() {
    liArray = [];
    $('ul.main li').each(function(i, el) {
        var $el = $(el);
        console.log($el.find('span').html());
        liArray.push({
            'done': $el.hasClass('is-done'),
            'text': $el.find('span').html(),
        });
    });
    localStorage.todoitems = JSON.stringify(liArray);
}
}());