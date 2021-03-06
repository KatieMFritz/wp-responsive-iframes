/*! jQuery ResponsiveIframe - v0.0.2 - 2012-09-28
* Original source: https://github.com/npr/responsiveiframe
* Copyright (c) 2012 inadarei; Licensed MIT, GPL
* Edited by Katie M Fritz */
console.log('responsive!')

if (typeof jQuery !== 'undefined') {
  (function ($) {
    var settings = {
      xdomain: '*',
      ie: navigator.userAgent.toLowerCase().indexOf('msie') > -1
    }

    var methods = {
      // initialization for the parent, the one housing this
      init: function () {
        return this.each(function (self) {
          var $this = $(this)

          if (window.postMessage) {
            if (window.addEventListener) {
              window.addEventListener('message', function (e) {
                privateMethods.messageHandler($this, e)
              }, false)
            } else if (window.attachEvent) {
              window.attachEvent('onmessage', function (e) {
                privateMethods.messageHandler($this, e)
              }, $this)
            }
          } else {
            setInterval(function () {
              var hash = window.location.hash
              var matches = hash.match(/^#h(\d+)(s?)$/)
              if (matches) {
                privateMethods.setHeight($this, matches[1])
                if (matches[2] === 's') {
                  scroll(0, 0)
                }
              }
            }, 150)
          }
        })
      }
    }

    var privateMethods = {
      messageHandler: function (elem, e) {
        var height
        var r
        var matches
        var strD

        if (settings.xdomain !== '*') {
          var regex = new RegExp(settings.xdomain + '$')
          var checkMatch = matches.length
          matches = e.origin.match(regex)
        }

        if (settings.xdomain === '*' || matches.length === 1) {
          strD = e.data + ''
          r = strD.match(/^(\d+)(s?)$/)
          if (r && r.length === 3) {
            height = parseInt(r[1], 10)
            if (!isNaN(height)) {
              try {
                privateMethods.setHeight(elem, height)
              } catch (ex) {}
            }
            if (r[2] === 's') {
              scroll(0, 0)
            }
          }
        }
      },

      // Sets the height of the iframe, with 150px extra padding
      setHeight: function (elem, height) {
        elem.css('height', height + 50 + 'px')
      },
      getDocHeight: function () {
        var D = document
        return Math.min(
          Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
          Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
          Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        )
      }
    }

    $.fn.responsiveIframe = function (method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
      } else if (typeof method === 'object' || !method) {
        $.extend(settings, arguments[0])
        return methods.init.apply(this)
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.responsiveIframe')
      }
    }
  }(jQuery))
}

(function () {
  var self
  var module
  var ResponsiveIframe = function () { self = this }

  ResponsiveIframe.prototype.allowResponsiveEmbedding = function () {
    window.addEventListener('load', self.messageParent, false)
    window.addEventListener('resize', self.messageParent, false)
  }

  ResponsiveIframe.prototype.messageParent = function (scrollTop) {
    var h = document.body.offsetHeight
    h = scrollTop ? h + 's' : h // might have messed this up
    if (top.postMessage) {
      top.postMessage(h, '*')
    } else {
      window.location.hash = 'h' + h
    }
  }

  function responsiveIframe () {
    return new ResponsiveIframe()
  }

  // expose
  if (typeof exports === 'undefined') {
    window.responsiveIframe = responsiveIframe
  } else {
    module.exports.responsiveIframe = responsiveIframe
  }
}())
