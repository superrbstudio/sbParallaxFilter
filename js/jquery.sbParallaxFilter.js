(function($){
 
    $.fn.extend({ 
         
        //pass the options variable to the function
        sbParallaxFilter: function(options) {
 
 
          //Set the default values, use comma to separate the settings, example:
          var defaults = {
            fadeToOpacity           : 0.3,
            parallaxAmount          : 0.2,
            movement                : 30,
            columnNum               : 5,
            transTime               : 250,
            itemContainer           : 'article',
            itemContainerInner      : '.inner',
            resultsContainer        : this,
            filterNavigation        : 'nav#filter-nav ul',
            filterNavigationItem    : 'nav#filter-nav ul li a',
            filterNavigationCurrent : 'current',
            notActiveClass          : 'not-active',
            huddleItems             : true
          }
                 
          var options =  $.extend(defaults, options);

          return this.each(function() {
            var o = options;

            var i = 1;
            var j = 1;
            var items = 1;
            var rows = 1;
            var evenRows;
            var evenCols;
            var active;
            var fixedPosition;
            var containerHeight;
            var midRow;
            var midCol;
            var multiple;
            var sideMultiple;
            var originalTop;
            var originalLeft;
            var itemContainerInnerWidth;

            //Add classes to First and Last items
            //and add unique ID's to all
            $(o.itemContainer).each(function(){

              $(this).attr('data-row',rows);
              $(this).attr('data-col',i);

              if(i == o.columnNum){
                $(this).addClass('last');
                $(this).attr('data-row',rows);
                rows = rows+1;
                i = 0;
              } else if(i == 1) {
                $(this).addClass('first');
              }

              $(this).attr('id', 'result-'+items);

              //Find the relative postition of each element...
              fixedPosition = $(this).position();

              //Add the position to each element and store for later...
              $(this).css('top', fixedPosition.top);
              $(this).css('left', fixedPosition.left);
              $(this).attr('data-top', fixedPosition.top);
              $(this).attr('data-left', fixedPosition.left);

              itemContainerInnerWidth = $(this).find(o.itemContainerInner).width();

            i = i+1;
            items = items+1;
            });

              //check if even or odd row number
              midRow = rows/2;
              isIntRow(midRow);

              //check if even or odd column number
              midCol = o.columnNum/2;
              isIntCol(midCol);

            //fix the height of the container
            containerHeight = $(o.resultsContainer).height();

            $(o.resultsContainer).height(containerHeight);

            //Make each element Absolute...
            $(o.itemContainer).each(function(){
              $(this).css('position', 'absolute');
            });


            $(o.filterNavigationItem).click(function(e){
              
              if($(this).parent().hasClass('current')) {return false;} 

              //define the active elements
              active = $(this).parent().attr('class');

              //clear current button 
              $(o.filterNavigation).find('.'+o.filterNavigationCurrent).removeClass(o.filterNavigationCurrent);

              //style the current button 
              $(this).parent().addClass(o.filterNavigationCurrent);

              //Run the selection function        
              deActivate(active)

              e.preventDefault();
            });

              function deActivate(activeClass) {

                  if(activeClass == 'all'){

                    //Activate all
                    $(o.itemContainer).each(function(){
                      reActiveate($(this));
                    });        

                  } else {

                    $(o.itemContainer).each(function(){

                      if($(this).hasClass(activeClass) && $(this).hasClass(o.notActiveClass)){
                        //Not Active to Active
                        reActiveate($(this));
                      } else if($(this).hasClass(o.notActiveClass) && $(this).not('.' + activeClass)) {
                        //Not Active to Not Active
                      } else if($(this).hasClass(activeClass)){
                        //Active to Active
                      } else if($(this).not('.'+activeClass)) {
                        //Active to Not Active
                        if(evenRows == true) {
                          multiple = Math.floor((rows/2)-1)-($(this).attr('data-row')-1);
                        } else {
                          multiple = Math.floor(rows/2)-($(this).attr('data-row')-1);
                        }

                        if(evenCols == true) {
                          sideMultiple = Math.floor((o.columnNum/2)-1)-($(this).attr('data-col')-1);
                        } else {
                          sideMultiple = Math.floor(o.columnNum/2)-($(this).attr('data-col')-1);
                        }
                        
                          if(o.huddleItems == true) {
                            huddleNonActive($(this), multiple, sideMultiple);
                          } else {

                          }

                          shrinkNonActive($(this));             
                      }

                    });       

                  }

                function huddleNonActive(huddleItem, position, leftPosition) {

                  var topMove;
                  var leftMove;

                  //work out the movement based on whether there are even/odd rows/columns
                  if(evenCols == true){
                    leftMove = (o.movement*leftPosition)+(o.movement/2); //centres the gather between columns
                  } else {
                    leftMove = (o.movement*leftPosition); //centres the gather around the middle column
                  }

                  if(evenRows == true) {
                    topMove = (o.movement*position)+(o.movement/2);
                  } else {
                    topMove = (o.movement*position);
                  }

                    huddleItem.animate({
                      top: '+='+topMove,
                      left: '+='+leftMove
                    }, o.transTime);


                }

                function shrinkNonActive(shrinkItem) {
                  shrinkItem.find(o.itemContainerInner).animate({
                    width: (itemContainerInnerWidth-o.movement)+'px',
                    left: (o.movement/2),
                    top: (o.movement/2),
                    opacity: o.fadeToOpacity
                  }, o.transTime, function(){
                    shrinkItem.addClass(o.notActiveClass);
                    parallax();
                  });   
                }

                function reActiveate(activateItem) {
                  originalTop  = activateItem.attr('data-top');
                  originalLeft = activateItem.attr('data-left');
                  activateItem.css('z-index', '500');

                  activateItem.animate({
                    top: originalTop,
                    left: originalLeft
                  }, o.transTime);

                  activateItem.find(o.itemContainerInner).animate({
                    width: itemContainerInnerWidth+'px',
                    top: 0,
                    left: 0,
                    opacity: 1
                  }, o.transTime, function(){
                    activateItem.removeClass(o.notActiveClass);
                    activateItem.css('z-index', '');
                  }); 
                }

              }

              //Check for integer on Rows
              function isIntRow(value){ 
                if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
                  evenRows = true;
                } else { 
                  evenRows = false;
                  midRow = midRow+0.5
                } 
              }

              //Check for integer on Columns
              function isIntCol(value){ 
                if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
                  evenCols = true;
                } else { 
                  evenCols = false;
                  midRow = midCol+0.5
                } 
              }


              function parallax() {

                $(window).bind('scroll',function(){
                  parallaxScroll();
                });

                function parallaxScroll(){
                  var scrolled = $(window).scrollTop();
                    $(o.itemContainer+':not(.'+o.notActiveClass+') '+o.itemContainerInner).css('top', 0-(scrolled*o.parallaxAmount)+'px');
                }
              }


          });
        
        
        }
    });
     
})(jQuery);
