// debounce fn
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


document.onreadystatechange = function () {
    // check reaady before allowing pin adds
    if (document.readyState == 'complete') {

        // controls for pin adding
        var itr = 1;
        var list = '';
        $('#map').click(function(e) {
          var point = $('<div class="pin-' + itr + '"></div>');
          $('#map-box').append(point);
          $(point).css({
            top: e.clientY - this.getBoundingClientRect().top,
            left: e.clientX - this.getBoundingClientRect().left
          });
          $(point).attr( 'top-percent' , ( parseInt($(point).css('top'), 10) / $('#map').height() ) );
          $(point).attr( 'left-percent' , ( parseInt($(point).css('left'), 10) / $('#map').width() ) );
          listAdd(itr, [event.clientY, event.clientX]);
        itr++;
        });
        function listAdd(itr, coords) {
          list += '<li pin=' + itr + '>';
          list += 'Pin ' + itr;
          list += ' -  [' + coords + ']';
          list += '</li>';
          $('#pin-list').html(list);
        };

        var reziseFn = debounce(function() {

            var pinsAll = $('div[class*=pin-]');
            $.each(pinsAll, function(key, item){
                $(this).css({
                    top: ( this.getAttribute('top-percent') * $('#map').height() ) + 'px',
                    left: ( this.getAttribute('left-percent') * $('#map').width() ) + 'px'
                })
            });

        }, 100);
        window.addEventListener('resize', function(e) {
            reziseFn();
        });
    }
}
