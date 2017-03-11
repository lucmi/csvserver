/*
 Table plugin for jQuery
 Copyright (c) 2016 Gabriel Rodrigues e Gabriel Leite (http://gabrielr47.github.io/)
 Licensed under the MIT license
 Version: 0.2
 */

$.fn.easyTable = function (options) {
   var trIndex = 'all';
   this.options = {
      tableStyle: 'table easyTable',
      hover: 'btn-success',
      buttons: true,
      select: true,
      sortable: true,
      scroll: {active: false, height: '400px'}
   };
   this.message = {
      all: 'Select All',
      clear: 'Clear',
      search: 'Search'
   };
   
   this.sortable = function () {
      function sortTr(table, col, reverse) {
         var tb = table.tBodies[0];
         var tr = Array.prototype.slice.call(tb.rows, 0);
         var i;
         reverse = -((+reverse) || -1);
         var str1;
         var str2;
         tr = tr.sort(function (a, b) {

            if (a.cells[col].children[0] === undefined) {
               str1 = a.cells[col].textContent.trim();
               str2 = b.cells[col].textContent.trim();
            } else {
               str1 = a.cells[col].getElementsByTagName(a.cells[col].children[0].tagName)[0].value;
               str2 = b.cells[col].getElementsByTagName(a.cells[col].children[0].tagName)[0].value;
            }

            if (!isNaN(str1)) {
               if (str1.length === 1) {
                  str1 = '0' + str1;
               }
               if (str2.length === 1) {
                  str2 = '0' + str2;
               }
            }
            return reverse * (str1.localeCompare(str2));
         });

         for (i = 0; i < tr.length; ++i) {
            tb.appendChild(tr[i]);
         }
      }

      this.makeSortable = function (table) {
         var th = table.tHead;
         var tablePlugin = this;
         var i;
         th && (th = th.rows[0]) && (th = th.cells);

         if (th) {
            i = th.length;
         } else {
            return;
         }

         while (--i >= 0) {
            (function (i) {
               var dir = 1;
               $(th[i]).prepend(' <i class="fa fa-sort" data-order="unsorted"></i>');
               $(th[i]).prepend(' <i class="fa fa-sort-amount-asc hidden" data-order="up"></i>');
               $(th[i]).prepend(' <i class="fa fa-sort-amount-desc hidden" data-order="down"></i>');
               $(th[i]).children(".fa").click(function () {
                  trIndex = $(th[i]).index();
                  $("#search").attr('placeholder', tablePlugin.message.search + ' ' + $(th[i]).text());
                  sortTr(table, i, (dir = 1 - dir));
                  if ((1 - dir) === 1) {
                     $(th).find('i[data-order=down],i[data-order=up]').addClass('hidden');
                     $(th).find('i[data-order=unsorted]').removeClass('hidden');
                     $(th[i]).find('i[data-order=unsorted]').addClass('hidden')
                     $(th[i]).find('i[data-order=up]').removeClass('hidden');
                  } else {
                     $(th).find('i[data-order=down],i[data-order=up], i[class=sort]').addClass('hidden');
                     $(th).find('i[data-order=unsorted]').removeClass('hidden');
                     $(th[i]).find('i[data-order=unsorted]').addClass('hidden')
                     $(th[i]).find('i[data-order=down]').removeClass('hidden');
                  }
               });
            }(i));
         }
      };

      this.makeAllSortable = function (table) {
         var t = table;
         var i = t.length;
         while (--i >= 0) {
            this.makeSortable(t[i]);
         }
      };

      this.makeAllSortable(this);

   };
   
   this.create = function () {
      $("#easyMenuTable").remove();
      this.options = $.extend({}, this.options, options);
      this.attr('tabindex', 0);

      if (this.options.sortable) {
         this.sortable();
      }
   };
   this.create();
   return this;
};

(function($) {

$.fn.ddTableFilter = function(options) {
  options = $.extend(true, $.fn.ddTableFilter.defaultOptions, options);

  return this.each(function() {
    if($(this).hasClass('ddtf-processed')) {
      refreshFilters(this);
      return;
    }
    var table = $(this);
    var start = new Date();

    $('th:visible', table).each(function(index) {
      if($(this).hasClass('skip-filter')) return;
      var selectbox = $('<select class="form-control" style="float:left">');
      var values = [];
      var opts = [];
      selectbox.append('<option value="--all--">' + $(this).text() + '</option>');

      var col = $('tr:not(.skip-filter) td:nth-child(' + (index + 1) + ')', table).each(function() {
        var cellVal = options.valueCallback.apply(this);
        if(cellVal.length == 0) {
          cellVal = '--empty--';
        }
        $(this).attr('ddtf-value', cellVal);

        if($.inArray(cellVal, values) === -1) {
          var cellText = options.textCallback.apply(this);
          if(cellText.length == 0) {cellText = options.emptyText;}
          values.push(cellVal);
          opts.push({val:cellVal, text:cellText});
        }
      });
      if(opts.length < options.minOptions){
        return;
      }
      if(options.sortOpt) {
        opts.sort(options.sortOptCallback);
      }
      $.each(opts, function() {
        $(selectbox).append('<option value="' + this.val + '">' + this.text + '</option>')
      });

      $(this).wrapInner('<div style="display:none" style="float:left">');
      $(this).append(selectbox);

      selectbox.bind('change', {column:col}, function(event) {
        var changeStart = new Date();
        var value = $(this).val();

        event.data.column.each(function() {
          if($(this).attr('ddtf-value') === value || value == '--all--') {
            $(this).removeClass('ddtf-filtered');
          }
          else {
            $(this).addClass('ddtf-filtered');
          }
        });
        var changeStop = new Date();
        if(options.debug) {
          console.log('Search: ' + (changeStop.getTime() - changeStart.getTime()) + 'ms');
        }
        refreshFilters(table);

      });
      table.addClass('ddtf-processed');
      if($.isFunction(options.afterBuild)) {
        options.afterBuild.apply(table);
      }
    });

    function refreshFilters(table) {
      var refreshStart = new Date();
      $('tr', table).each(function() {
        var row = $(this);
        if($('td.ddtf-filtered', row).length > 0) {
          options.transition.hide.apply(row, options.transition.options);
        }
        else {
          options.transition.show.apply(row, options.transition.options);
        }
      });

      if($.isFunction(options.afterFilter)) {
        options.afterFilter.apply(table);
      }

      if(options.debug) {
        var refreshEnd = new Date();
        console.log('Refresh: ' + (refreshEnd.getTime() - refreshStart.getTime()) + 'ms');
      }
    }

    if(options.debug) {
      var stop = new Date();
      console.log('Build: ' + (stop.getTime() - start.getTime()) + 'ms');
    }
  });
};

$.fn.ddTableFilter.defaultOptions = {
  valueCallback:function() {
    return encodeURIComponent($.trim($(this).text()));
  },
  textCallback:function() {
    return $.trim($(this).text());
  },
  sortOptCallback: function(a, b) {
    return a.text.toLowerCase() > b.text.toLowerCase();
  },
  afterFilter: null,
  afterBuild: null,
  transition: {
    hide:$.fn.hide,
    show:$.fn.show,
    options: []
  },
  emptyText:'--Empty--',
  sortOpt:true,
  debug:false,
  minOptions:0
}

})(jQuery);

$.fn.buildTable = function(headers, data){
  var table = $(this);
  var thead ='<thead><tr>';
  for (header of headers){
    thead += '<th>'+header+'</th>';
  }
  thead += '</tr></thead>';
  table.append(thead);
  var tbody = '<tbody>';
  for(drow of data){
    tbody += '<tr>';
    for(cell of drow){
      tbody += '<td>'+cell+'</td>';
    }
    tbody += '</tr>';
  }
  tbody += '</tbody>';
  table.append(tbody);
  table.styleTable();
}

$.fn.styleTable = function(){
  $(this).ddTableFilter();
  $(this).easyTable();
}