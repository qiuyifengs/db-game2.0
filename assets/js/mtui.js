

$(function () {
  var ModalEffects = (function() {

    function init() {

      var overlay = document.querySelector( '.md-overlay' );

      [].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {

        var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),close = modal.querySelector( '.md-close' );

        function removeModal( hasPerspective ) {
          classie.remove( modal, 'md-show' );

          if( hasPerspective ) {
            classie.remove( document.documentElement, 'md-perspective' );
          }
        }

        function removeModalHandler() {
          removeModal( classie.has( el, 'md-setperspective' ) );
        }

        el.addEventListener( 'click', function( ev ) {
          classie.add( modal, 'md-show' );
          overlay.removeEventListener( 'click', removeModalHandler );
          overlay.addEventListener( 'click', removeModalHandler );

          if( classie.has( el, 'md-setperspective' ) ) {
            setTimeout( function() {
              classie.add( document.documentElement, 'md-perspective' );
            }, 25 );
          }
        });

        close.addEventListener( 'click', function( ev ) {
          ev.stopPropagation();
          removeModalHandler();
        });

      } );

    }

    init();

  })();

})

/**
 * ybio main
 */
!function (window) {
  "use strict";
  var doc=window.document,
    ybui={};
  /**
   * 直接绑定FastClick
   */
  $(window).on('load',function(){
    typeof FastClick == 'function' && FastClick.attach(doc.body);
    ybui.util.pageScroll.lock();
  });
  var util = ybui.util = {
    /**
     * 格式化参数
     * @param string
     */
    parseOptions: function (string) {
      if ($.isPlainObject(string)) {
        return string;
      }
      var start = (string ? string.indexOf('{') : -1),
        options = {};
      if (start != -1) {
        try {
          options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
        } catch (e) {
        }
      }
      return options;
    },
    /**
     * 页面滚动方法【移动端】
     * @type {{lock,unlock}}
     * lock:禁止页面滚动，unlock:释放页面滚动
     */
    pageScroll: function () {
      var fn = function (e) {
        e.preventDefault();
        e.stopPropagation();
      };
      var islock = false;

      return {
        lock: function () {
          if (islock) return;
          islock = true;
          doc.addEventListener('touchmove', fn);
        },
        unlock: function () {
          islock = false;
          doc.removeEventListener('touchmove', fn);
        }
      };
    }(),
    /**
     * 本地存储
     */
    localStorage: function () {
      return storage(window.localStorage);
    }(),
    /**
     * Session 存储
     */
    sessionStorage: function () {
      return storage(window.sessionStorage);
    }(),
    /**
     * 序列化
     * @param value
     * @returns {string}
     */
    serialize: function (value) {
      if (typeof value === 'string') return value;
      return JSON.stringify(value);
    },
    /**
     * 反序列化
     * @param value
     * @returns {*}
     */
    deserialize: function (value) {
      if (typeof value !== 'string') return undefined;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value || undefined;
      }
    }
  };

  /**
   * HTML5 存储
   */
  function storage(ls) {
    return {
      set: function (key, value) {
        ls.setItem(key,util.serialize(value));
      },
      get: function (key) {
        return util.deserialize(ls.getItem(key));
      },
      remove: function (key) {
        ls.removeItem(key);
      },
      clear: function () {
        ls.clear();
      }
    }
  }

  if (typeof define === 'function') {
    define(ybui);
  } else {
    window.YBUI = ybui;
  }

}(window); //window end

  /**
   * Dialog
   */
  !function (window, ybui) {
    "use strict";

    var dialog = ybui.dialog = ybui.dialog || {},
      $body = $(window.document.body);

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
      var ID = 'YBUI_CONFRIM';

      $('#' + ID).remove();

      var args = arguments.length;
      if (args < 2) {
        console.error('From YBUI\'s confirm: Please set two or three parameters!!!');
        return;
      }

      if (typeof arguments[1] != 'function' && args == 2 && !arguments[1] instanceof Array) {
        console.error('From YBUI\'s confirm: The second parameter must be a function or array!!!');
        return;
      }

      if (args == 2) {
        opts = mes;
        mes = title;
        title = '提示';
      }

      var btnArr = opts;
      if (typeof opts === 'function') {
        btnArr = [{
          txt: '取消',
          color: false
        }, {
          txt: '确定',
          color: true,
          callback: function () {
            opts && opts();
          }
        }];
      }

      var $dom = $('' +
        '<div class="mask-black-dialog" id="' + ID + '">' +
        '   <div class="m-confirm">' +
        '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
        '       <div class="confirm-bd">' + mes + '</div>' +
        '   </div>' +
        '</div>');

      // 遍历按钮数组
      var $btnBox = $('<div class="confirm-ft"></div>');

      $.each(btnArr, function (i, val) {
        var $btn;
        // 指定按钮颜色
        if (typeof val.color == 'boolean') {
          $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
        } else if (typeof val.color == 'string') {
          $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
        }

        // 给对应按钮添加点击事件
        (function (p) {
          $btn.on('click', function (e) {
            e.stopPropagation();

            // 是否保留弹窗
            if (!btnArr[p].stay) {
              // 释放页面滚动
              ybui.util.pageScroll.unlock();
              $dom.remove();
            }
            btnArr[p].callback && btnArr[p].callback();
          });
        })(i);
        $btnBox.append($btn);
      });

      $dom.find('.m-confirm').append($btnBox);

      // 禁止滚动屏幕【移动端】
      ybui.util.pageScroll.lock();

      $body.append($dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {

      var ID = 'YBUI_ALERT';

      $('#' + ID).remove();

      var $dom = $('' +
        '<div id="' + ID + '">' +
        '   <div class="mask-black-dialog">' +
        '       <div class="m-confirm m-alert">' +
        '           <div class="confirm-bd">' + (mes || 'YBUI Touch') + '</div>' +
        '           <div class="confirm-ft">' +
        '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>');

      ybui.util.pageScroll.lock();

      $body.append($dom);

      $dom.find('a').on('click', function () {
        $dom.remove();
        ybui.util.pageScroll.unlock();
        typeof callback === 'function' && callback();
      });
    };

    /**
     * 弹出提示层
     */
    dialog.toast = function () {
      var timer = null;
      /**
       * @param mes       提示文字String 【必填】
       * @param type      类型String success or error 【必填】
       * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
       * @param callback  回调函数Function 【可选】
       */
      return function (mes, type, timeout, callback) {

        clearTimeout(timer);

        var ID = 'YBUI_TOAST';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
          console.error('From YBUI\'s toast: Please set two or more parameters!!!');
          return;
        }

        var iconHtml = '';
        if (type == 'success' || type == 'error') {
          iconHtml = '<div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>';
        }

        var $dom = $('' +
          '<div class="mask-white-dialog" id="' + ID + '">' +
          '    <div class="m-toast ' + (iconHtml == '' ? 'none-icon' : '') + '">' + iconHtml +
          '        <p class="toast-content">' + (mes || '') + '</p>' +
          '    </div>' +
          '</div>');

        ybui.util.pageScroll.lock();

        $body.append($dom);

        if (typeof timeout === 'function' && arguments.length >= 3) {
          callback = timeout;
          timeout = 2000;
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          ybui.util.pageScroll.unlock();
          $dom.remove();
          typeof callback === 'function' && callback();
        }, (~~timeout || 2000) + 100);//100为动画时间
      };
    }();

    /**
     * 顶部提示层
     */
    dialog.notify = function () {

      var timer = null;

      /**
       * @param mes       提示文字String 【必填】
       * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
       */
      return function (mes, timeout, callback) {

        clearTimeout(timer);

        var ID = 'YBUI_NOTIFY';

        $('#' + ID).remove();

        var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

        $body.append($dom);

        var next = function () {
          $dom.remove();
          typeof callback == 'function' && callback();
        };

        var closeNotify = function () {
          clearTimeout(timer);

          $dom.find('.m-notify').addClass('notify-out');

          $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
        };

        $dom.on('click', closeNotify);

        if (~~timeout > 0) {
          timer = setTimeout(closeNotify, timeout + 200);
        }
      }
    }();

    /**
     * 加载中提示框
     */
    dialog.loading = function () {

      var ID = 'YBUI_LOADING';

      return {
        /**
         * 加载中 - 显示
         * @param text 显示文字String 【可选】
         */
        open: function (text) {
          $('#' + ID).remove();

          var $dom = $('' +
            '<div class="mask-white-dialog" id="' + ID + '">' +
            '   <div class="m-loading">' +
            '       <div class="loading-icon"></div>' +
            '       <div class="loading-txt">' + (text || '数据加载中') + '</div>' +
            '   </div>' +
            '</div>').remove();

          ybui.util.pageScroll.lock();
          $body.append($dom);
        },
        /**
         * 加载中 - 隐藏
         */
        close: function () {
          ybui.util.pageScroll.unlock();
          $('#' + ID).remove();
        }
      };
    }();
  }(window, YBUI);

/**
 * 解决:active这个高端洋气的CSS伪类不能使用问题
 */
!function (window) {
  window.document.addEventListener('touchstart', function (event) {
    /* Do Nothing */
  }, false);
}(window);



