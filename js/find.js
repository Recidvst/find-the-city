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
    // check ready before allowing pin adds
    if (document.readyState == 'complete') {

/* settings area */

        // city constructor
        function city(top, left) {
            this.top = top;
            this.left = left;
        }
        // set city list
        var cities = {
            'London' : new city(169,660),
            'New York' : new city(240,305),
            'Los Angeles' : new city(270,110),
            'Buenos Aires' : new city(660,380),
            'Port Stanley' : new city(760,412)
        };
        // set city initial locations
        function setCityLocs() {
            $.each(cities, function(key, value){
                var top = this.top,
                left = this.left,
                width = '1600',
                height = '824';
                value.topPos = ( $('#map').height() * (top / height) );
                value.leftPos = ( $('#map').width() * (left / width) );
                /* temp fn adding pins to help add cities
                    var city = $('<div class="city-' + key + '"></div>');
                    $('#map-box').append(city);
                    $(city).css({
                        top : value.topPos,
                        left : value.leftPos
                    })
                */
            });
        }
        setCityLocs();

        // set questions!
        var questions = new Array();
        questions.push('London');
        questions.push('New York');
        questions.push('Los Angeles');
        questions.push('Buenos Aires');
        questions.push('Port Stanley');

        window.currentQn = questions[0];
        console.log(currentQn);

/* action area */

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
          listAdd(itr, [e.clientY - this.getBoundingClientRect().top, e.clientX - this.getBoundingClientRect().left] );
          checkAccuracy( window.currentQn, e.clientY - this.getBoundingClientRect().top, e.clientX - this.getBoundingClientRect().left );
        itr++;
        });
        function listAdd(itr, coords) {
          list += '<li pin=' + itr + '>';
          list += 'Pin ' + itr;
          list += ' -  [' + coords + ']';
          list += '</li>';
          $('#pin-list').html(list);
        };

        function checkAccuracy(qn,t,l) {
                function closeCheck(a,b) {
                    if ( (a - b) < 50 && (a - b) > -50 ) {
                        return true;
                    }
                }
            if ( closeCheck(cities[qn].topPos,t) && closeCheck(cities[qn].leftPos,l) ) {
                console.log('close');
            }
            else {
                console.log('far');
            }
        }


        // resize call
        var reziseFn = debounce(function() {
            // move pins loc
            var pinsAll = $('div[class*=pin-]');
            $.each(pinsAll, function(key, item){
                $(this).css({
                    top: ( this.getAttribute('top-percent') * $('#map').height() ) + 'px',
                    left: ( this.getAttribute('left-percent') * $('#map').width() ) + 'px'
                })
            });
            // update cities loc
            setCityLocs();
        }, 100);
        window.addEventListener('resize', function(e) {
            reziseFn();
        });

    }
}
