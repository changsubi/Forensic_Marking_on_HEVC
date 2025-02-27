
/*view/js/videojs-persistvolume/videojs.persistvolume.js created local with systemRootPath */
"use strict";
(function(factory){
  /*!
   * Custom Universal Module Definition (UMD)
   *
   * Video.js will never be a non-browser lib so we can simplify UMD a bunch and
   * still support requirejs and browserify. This also needs to be closure
   * compiler compatible, so string keys are used.
   */
  if (typeof define === 'function' && define['amd']) {
    define(['./video'], function(vjs){ factory(window, document, vjs) });
  // checking that module is an object too because of umdjs/umd#35
  } else if (typeof exports === 'object' && typeof module === 'object') {
    factory(window, document, require('video.js'));
  } else {
    factory(window, document, videojs);
  }

})(function(window, document, vjs) {
  //cookie functions from https://developer.mozilla.org/en-US/docs/DOM/document.cookie
  var
  getCookieItem = function(sKey) {
    if (!sKey || !hasCookieItem(sKey)) { return null; }
    var reg_ex = new RegExp(
      "(?:^|.*;\\s*)" +
      window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
      "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
    );
    return window.unescape(document.cookie.replace(reg_ex,"$1"));
  },

  setCookieItem = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toGMTString();
          break;
      }
    }
    document.cookie =
      window.escape(sKey) + "=" +
      window.escape(sValue) +
      sExpires +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "") +
      (bSecure ? "; secure" : "");
  },

  hasCookieItem = function(sKey) {
    return (new RegExp(
      "(?:^|;\\s*)" +
      window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
      "\\s*\\=")
    ).test(document.cookie);
  },

  hasLocalStorage = function() {
    try {
      window.localStorage.setItem('persistVolume', 'persistVolume');
      window.localStorage.removeItem('persistVolume');
      return true;
    } catch(e) {
      return false;
    }
  },
  getStorageItem = function(key) {
    return hasLocalStorage() ? window.localStorage.getItem(key) : getCookieItem(key);
  },
  setStorageItem = function(key, value) {
    return hasLocalStorage() ? window.localStorage.setItem(key, value) : setCookieItem(key, value, Infinity, '/');
  },

  extend = function(obj) {
    var arg, i, k;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  },

  defaults = {
    namespace: ""
  },

  volumePersister = function(options) {
    var player = this;
    var settings = extend({}, defaults, options || {});

    var key = settings.namespace + '-' + 'volume';
    var muteKey = settings.namespace + '-' + 'mute';

    player.on("volumechange", function() {
      setStorageItem(key, player.volume());
      setStorageItem(muteKey, player.muted());
    });

    var persistedVolume = getStorageItem(key);
    if(persistedVolume !== null){
      player.volume(persistedVolume);
    }

    var persistedMute = getStorageItem(muteKey);
    if(persistedMute !== null){
      player.muted('true' === persistedMute);
    }
  };

  vjs.plugin("persistvolume", volumePersister);

});
/*view/js/BootstrapMenu.min.js created local with systemRootPath */
!function(t){function n(e){if(o[e])return o[e].exports;var i=o[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var o={};return n.m=t,n.c=o,n.p="",n(0)}([function(t,n,o){window.BootstrapMenu=o(1)},function(t,n,o){"use strict";function e(t){var n=f('<div class="dropdown bootstrapMenu" style="z-index:10000;position:absolute;" />'),o=f('<ul class="dropdown-menu" style="position:static;display:block;font-size:0.9em;" />'),e=[];e[0]=[],p.each(t.options.actionsGroups,function(t,n){e[n+1]=[]});var i=!1;p.each(t.options.actions,function(n,o){var r=!1;p.each(t.options.actionsGroups,function(t,n){p.contains(t,o)&&(e[n+1].push(o),r=!0)}),r===!1&&e[0].push(o),"undefined"!=typeof n.iconClass&&(i=!0)});var r=!0;return p.each(e,function(n){0!=n.length&&(r===!1&&o.append('<li class="divider"></li>'),r=!1,p.each(n,function(n){var e=t.options.actions[n];i===!0?o.append('<li role="presentation" data-action="'+n+'"><a href="#" role="menuitem"><i class="fa fa-fw fa-lg '+(e.iconClass||"")+'"></i> <span class="actionName"></span></a></li>'):o.append('<li role="presentation" data-action="'+n+'"><a href="#" role="menuitem"><span class="actionName"></span></a></li>')}),o.append('<li role="presentation" class="noActionsMessage disabled"><a href="#" role="menuitem"><span>'+t.options.noActionsMessage+"</span></a></li>"))}),n.append(o)}function i(t){var n=null;switch(t.options.menuEvent){case"click":n="click";break;case"right-click":n="contextmenu";break;case"hover":n="mouseenter";break;default:throw new Error("Unknown BootstrapMenu 'menuEvent' option")}t.$container.on(n+t.namespace,t.selector,function(n){var o=f(this);return t.open(o,n),!1})}function r(t){t.$container.off(t.namespace)}function s(t){var n=t.options._actionSelectEvent+t.namespace;t.$menu.on(n,function(n){n.preventDefault(),n.stopPropagation();var o=f(n.target),e=o.closest("[data-action]");if(e&&e.length&&!e.is(".disabled")){var i=e.data("action"),r=t.options.fetchElementData(t.$openTarget);t.options.actions[i].onClick(r),t.close()}})}function c(t){t.$menu.off(t.namespace)}function a(t){switch(t.options.menuEvent){case"click":break;case"right-click":break;case"hover":var n=t.$openTarget.add(t.$menu);n.on("mouseleave"+t.closeNamespace,function(o){var e=o.toElement||o.relatedTarget;t.$openTarget.is(e)||t.$menu.is(e)||(n.off(t.closeNamespace),t.close())});break;default:throw new Error("Unknown BootstrapMenu 'menuEvent' option")}t.$container.on("click"+t.closeNamespace,function(){t.close()})}function u(t){t.$container.off(t.closeNamespace)}var l=o(2),f=o(3);o(4);var p=function(){throw new Error("Custom lodash build for BootstrapMenu. lodash chaining is not included")};p.noop=o(6),p.each=o(7),p.contains=o(34),p.extend=o(42),p.uniqueId=o(49),p.isFunction=o(19);var h={container:"body",fetchElementData:p.noop,menuSource:"mouse",menuPosition:"belowLeft",menuEvent:"right-click",actionsGroups:[],noActionsMessage:"No available actions",_actionSelectEvent:"click"},d=function(t,n){this.selector=t,this.options=p.extend({},h,n),this.namespace=p.uniqueId(".BootstrapMenu_"),this.closeNamespace=p.uniqueId(".BootstrapMenuClose_"),this.init()},v=[];d.prototype.init=function(){this.$container=f(this.options.container),this.$menu=e(this),this.$menuList=this.$menu.children(),this.$menu.hide().appendTo(this.$container),this.$openTarget=null,this.openEvent=null,i(this),s(this),v.push(this)},d.prototype.updatePosition=function(){var t=null,n=null,o=null;switch(this.options.menuSource){case"element":n=this.$openTarget;break;case"mouse":n=this.openEvent;break;default:throw new Error("Unknown BootstrapMenu 'menuSource' option")}switch(this.options.menuPosition){case"belowRight":t="right top",o="right bottom";break;case"belowLeft":t="left top",o="left bottom";break;case"aboveRight":t="right bottom",o="right top";break;case"aboveLeft":t="left bottom",o="left top";break;default:throw new Error("Unknown BootstrapMenu 'menuPosition' option")}this.$menu.css({display:"block"}),this.$menu.css({height:this.$menuList.height(),width:this.$menuList.width()}),this.$menu.position({my:t,at:o,of:n})},d.prototype.open=function(t,n){var o=this;d.closeAll(),this.$openTarget=t,this.openEvent=n;var e=o.options.fetchElementData(o.$openTarget),i=this.$menu.find("[data-action]"),r=this.$menu.find(".noActionsMessage");i.show(),r.hide();var s=0;i.each(function(){var t=f(this),n=t.data("action"),i=o.options.actions[n],r=i.classNames||null;return r&&p.isFunction(r)&&(r=r(e)),t.attr("class",l(r||"")),i.isShown&&i.isShown(e)===!1?void t.hide():(s++,t.find(".actionName").html(p.isFunction(i.name)&&i.name(e)||i.name),void(i.isEnabled&&i.isEnabled(e)===!1&&t.addClass("disabled")))}),0===s&&r.show(),this.updatePosition(),this.$menu.show(),a(this)},d.prototype.close=function(){this.$menu.hide(),u(this)},d.prototype.destroy=function(){this.close(),r(this),c(this)},d.closeAll=function(){p.each(v,function(t){t.close()})},t.exports=d},function(t,n,o){var e,i;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
!function(){"use strict";function o(){for(var t=[],n=0;n<arguments.length;n++){var e=arguments[n];if(e){var i=typeof e;if("string"===i||"number"===i)t.push(e);else if(Array.isArray(e))t.push(o.apply(null,e));else if("object"===i)for(var s in e)r.call(e,s)&&e[s]&&t.push(s)}}return t.join(" ")}var r={}.hasOwnProperty;"undefined"!=typeof t&&t.exports?t.exports=o:(e=[],i=function(){return o}.apply(n,e),!(void 0!==i&&(t.exports=i)))}()},function(t,n){t.exports=jQuery},function(t,n,o){var e,i,r;/*!
	 * jQuery UI Position 1.12.0
	 * http://jqueryui.com
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/position/
	 */
!function(s){i=[o(3),o(5)],e=s,r="function"==typeof e?e.apply(n,i):e,!(void 0!==r&&(t.exports=r))}(function(t){return function(){function n(t,n,o){return[parseFloat(t[0])*(h.test(t[0])?n/100:1),parseFloat(t[1])*(h.test(t[1])?o/100:1)]}function o(n,o){return parseInt(t.css(n,o),10)||0}function e(n){var o=n[0];return 9===o.nodeType?{width:n.width(),height:n.height(),offset:{top:0,left:0}}:t.isWindow(o)?{width:n.width(),height:n.height(),offset:{top:n.scrollTop(),left:n.scrollLeft()}}:o.preventDefault?{width:0,height:0,offset:{top:o.pageY,left:o.pageX}}:{width:n.outerWidth(),height:n.outerHeight(),offset:n.offset()}}var i,r,s=Math.max,c=Math.abs,a=Math.round,u=/left|center|right/,l=/top|center|bottom/,f=/[\+\-]\d+(\.[\d]+)?%?/,p=/^\w+/,h=/%$/,d=t.fn.position;r=function(){var n=t("<div>").css("position","absolute").appendTo("body").offset({top:1.5,left:1.5}),o=1.5===n.offset().top;return n.remove(),r=function(){return o},o},t.position={scrollbarWidth:function(){if(void 0!==i)return i;var n,o,e=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),r=e.children()[0];return t("body").append(e),n=r.offsetWidth,e.css("overflow","scroll"),o=r.offsetWidth,n===o&&(o=e[0].clientWidth),e.remove(),i=n-o},getScrollInfo:function(n){var o=n.isWindow||n.isDocument?"":n.element.css("overflow-x"),e=n.isWindow||n.isDocument?"":n.element.css("overflow-y"),i="scroll"===o||"auto"===o&&n.width<n.element[0].scrollWidth,r="scroll"===e||"auto"===e&&n.height<n.element[0].scrollHeight;return{width:r?t.position.scrollbarWidth():0,height:i?t.position.scrollbarWidth():0}},getWithinInfo:function(n){var o=t(n||window),e=t.isWindow(o[0]),i=!!o[0]&&9===o[0].nodeType,r=!e&&!i;return{element:o,isWindow:e,isDocument:i,offset:r?t(n).offset():{left:0,top:0},scrollLeft:o.scrollLeft(),scrollTop:o.scrollTop(),width:o.outerWidth(),height:o.outerHeight()}}},t.fn.position=function(i){if(!i||!i.of)return d.apply(this,arguments);i=t.extend({},i);var h,v,m,g,y,w,x=t(i.of),b=t.position.getWithinInfo(i.within),$=t.position.getScrollInfo(b),W=(i.collision||"flip").split(" "),k={};return w=e(x),x[0].preventDefault&&(i.at="left top"),v=w.width,m=w.height,g=w.offset,y=t.extend({},g),t.each(["my","at"],function(){var t,n,o=(i[this]||"").split(" ");1===o.length&&(o=u.test(o[0])?o.concat(["center"]):l.test(o[0])?["center"].concat(o):["center","center"]),o[0]=u.test(o[0])?o[0]:"center",o[1]=l.test(o[1])?o[1]:"center",t=f.exec(o[0]),n=f.exec(o[1]),k[this]=[t?t[0]:0,n?n[0]:0],i[this]=[p.exec(o[0])[0],p.exec(o[1])[0]]}),1===W.length&&(W[1]=W[0]),"right"===i.at[0]?y.left+=v:"center"===i.at[0]&&(y.left+=v/2),"bottom"===i.at[1]?y.top+=m:"center"===i.at[1]&&(y.top+=m/2),h=n(k.at,v,m),y.left+=h[0],y.top+=h[1],this.each(function(){var e,u,l=t(this),f=l.outerWidth(),p=l.outerHeight(),d=o(this,"marginLeft"),w=o(this,"marginTop"),E=f+d+o(this,"marginRight")+$.width,T=p+w+o(this,"marginBottom")+$.height,j=t.extend({},y),P=n(k.my,l.outerWidth(),l.outerHeight());"right"===i.my[0]?j.left-=f:"center"===i.my[0]&&(j.left-=f/2),"bottom"===i.my[1]?j.top-=p:"center"===i.my[1]&&(j.top-=p/2),j.left+=P[0],j.top+=P[1],r()||(j.left=a(j.left),j.top=a(j.top)),e={marginLeft:d,marginTop:w},t.each(["left","top"],function(n,o){t.ui.position[W[n]]&&t.ui.position[W[n]][o](j,{targetWidth:v,targetHeight:m,elemWidth:f,elemHeight:p,collisionPosition:e,collisionWidth:E,collisionHeight:T,offset:[h[0]+P[0],h[1]+P[1]],my:i.my,at:i.at,within:b,elem:l})}),i.using&&(u=function(t){var n=g.left-j.left,o=n+v-f,e=g.top-j.top,r=e+m-p,a={target:{element:x,left:g.left,top:g.top,width:v,height:m},element:{element:l,left:j.left,top:j.top,width:f,height:p},horizontal:o<0?"left":n>0?"right":"center",vertical:r<0?"top":e>0?"bottom":"middle"};v<f&&c(n+o)<v&&(a.horizontal="center"),m<p&&c(e+r)<m&&(a.vertical="middle"),s(c(n),c(o))>s(c(e),c(r))?a.important="horizontal":a.important="vertical",i.using.call(this,t,a)}),l.offset(t.extend(j,{using:u}))})},t.ui.position={fit:{left:function(t,n){var o,e=n.within,i=e.isWindow?e.scrollLeft:e.offset.left,r=e.width,c=t.left-n.collisionPosition.marginLeft,a=i-c,u=c+n.collisionWidth-r-i;n.collisionWidth>r?a>0&&u<=0?(o=t.left+a+n.collisionWidth-r-i,t.left+=a-o):u>0&&a<=0?t.left=i:a>u?t.left=i+r-n.collisionWidth:t.left=i:a>0?t.left+=a:u>0?t.left-=u:t.left=s(t.left-c,t.left)},top:function(t,n){var o,e=n.within,i=e.isWindow?e.scrollTop:e.offset.top,r=n.within.height,c=t.top-n.collisionPosition.marginTop,a=i-c,u=c+n.collisionHeight-r-i;n.collisionHeight>r?a>0&&u<=0?(o=t.top+a+n.collisionHeight-r-i,t.top+=a-o):u>0&&a<=0?t.top=i:a>u?t.top=i+r-n.collisionHeight:t.top=i:a>0?t.top+=a:u>0?t.top-=u:t.top=s(t.top-c,t.top)}},flip:{left:function(t,n){var o,e,i=n.within,r=i.offset.left+i.scrollLeft,s=i.width,a=i.isWindow?i.scrollLeft:i.offset.left,u=t.left-n.collisionPosition.marginLeft,l=u-a,f=u+n.collisionWidth-s-a,p="left"===n.my[0]?-n.elemWidth:"right"===n.my[0]?n.elemWidth:0,h="left"===n.at[0]?n.targetWidth:"right"===n.at[0]?-n.targetWidth:0,d=-2*n.offset[0];l<0?(o=t.left+p+h+d+n.collisionWidth-s-r,(o<0||o<c(l))&&(t.left+=p+h+d)):f>0&&(e=t.left-n.collisionPosition.marginLeft+p+h+d-a,(e>0||c(e)<f)&&(t.left+=p+h+d))},top:function(t,n){var o,e,i=n.within,r=i.offset.top+i.scrollTop,s=i.height,a=i.isWindow?i.scrollTop:i.offset.top,u=t.top-n.collisionPosition.marginTop,l=u-a,f=u+n.collisionHeight-s-a,p="top"===n.my[1],h=p?-n.elemHeight:"bottom"===n.my[1]?n.elemHeight:0,d="top"===n.at[1]?n.targetHeight:"bottom"===n.at[1]?-n.targetHeight:0,v=-2*n.offset[1];l<0?(e=t.top+h+d+v+n.collisionHeight-s-r,(e<0||e<c(l))&&(t.top+=h+d+v)):f>0&&(o=t.top-n.collisionPosition.marginTop+h+d+v-a,(o>0||c(o)<f)&&(t.top+=h+d+v))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position})},function(t,n,o){var e,i,r;!function(s){i=[o(3)],e=s,r="function"==typeof e?e.apply(n,i):e,!(void 0!==r&&(t.exports=r))}(function(t){return t.ui=t.ui||{},t.ui.version="1.12.0"})},function(t,n){function o(){}t.exports=o},function(t,n,o){t.exports=o(8)},function(t,n,o){var e=o(9),i=o(10),r=o(31),s=r(e,i);t.exports=s},function(t,n){function o(t,n){for(var o=-1,e=t.length;++o<e&&n(t[o],o,t)!==!1;);return t}t.exports=o},function(t,n,o){var e=o(11),i=o(30),r=i(e);t.exports=r},function(t,n,o){function e(t,n){return i(t,n,r)}var i=o(12),r=o(16);t.exports=e},function(t,n,o){var e=o(13),i=e();t.exports=i},function(t,n,o){function e(t){return function(n,o,e){for(var r=i(n),s=e(n),c=s.length,a=t?c:-1;t?a--:++a<c;){var u=s[a];if(o(r[u],u,r)===!1)break}return n}}var i=o(14);t.exports=e},function(t,n,o){function e(t){return i(t)?t:Object(t)}var i=o(15);t.exports=e},function(t,n){function o(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}t.exports=o},function(t,n,o){var e=o(17),i=o(21),r=o(15),s=o(25),c=e(Object,"keys"),a=c?function(t){var n=null==t?void 0:t.constructor;return"function"==typeof n&&n.prototype===t||"function"!=typeof t&&i(t)?s(t):r(t)?c(t):[]}:s;t.exports=a},function(t,n,o){function e(t,n){var o=null==t?void 0:t[n];return i(o)?o:void 0}var i=o(18);t.exports=e},function(t,n,o){function e(t){return null!=t&&(i(t)?l.test(a.call(t)):r(t)&&s.test(t))}var i=o(19),r=o(20),s=/^\[object .+?Constructor\]$/,c=Object.prototype,a=Function.prototype.toString,u=c.hasOwnProperty,l=RegExp("^"+a.call(u).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=e},function(t,n,o){function e(t){return i(t)&&c.call(t)==r}var i=o(15),r="[object Function]",s=Object.prototype,c=s.toString;t.exports=e},function(t,n){function o(t){return!!t&&"object"==typeof t}t.exports=o},function(t,n,o){function e(t){return null!=t&&r(i(t))}var i=o(22),r=o(24);t.exports=e},function(t,n,o){var e=o(23),i=e("length");t.exports=i},function(t,n){function o(t){return function(n){return null==n?void 0:n[t]}}t.exports=o},function(t,n){function o(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=e}var e=9007199254740991;t.exports=o},function(t,n,o){function e(t){for(var n=a(t),o=n.length,e=o&&t.length,u=!!e&&c(e)&&(r(t)||i(t)),f=-1,p=[];++f<o;){var h=n[f];(u&&s(h,e)||l.call(t,h))&&p.push(h)}return p}var i=o(26),r=o(27),s=o(28),c=o(24),a=o(29),u=Object.prototype,l=u.hasOwnProperty;t.exports=e},function(t,n,o){function e(t){return r(t)&&i(t)&&c.call(t,"callee")&&!a.call(t,"callee")}var i=o(21),r=o(20),s=Object.prototype,c=s.hasOwnProperty,a=s.propertyIsEnumerable;t.exports=e},function(t,n,o){var e=o(17),i=o(24),r=o(20),s="[object Array]",c=Object.prototype,a=c.toString,u=e(Array,"isArray"),l=u||function(t){return r(t)&&i(t.length)&&a.call(t)==s};t.exports=l},function(t,n){function o(t,n){return t="number"==typeof t||e.test(t)?+t:-1,n=null==n?i:n,t>-1&&t%1==0&&t<n}var e=/^\d+$/,i=9007199254740991;t.exports=o},function(t,n,o){function e(t){if(null==t)return[];a(t)||(t=Object(t));var n=t.length;n=n&&c(n)&&(r(t)||i(t))&&n||0;for(var o=t.constructor,e=-1,u="function"==typeof o&&o.prototype===t,f=Array(n),p=n>0;++e<n;)f[e]=e+"";for(var h in t)p&&s(h,n)||"constructor"==h&&(u||!l.call(t,h))||f.push(h);return f}var i=o(26),r=o(27),s=o(28),c=o(24),a=o(15),u=Object.prototype,l=u.hasOwnProperty;t.exports=e},function(t,n,o){function e(t,n){return function(o,e){var c=o?i(o):0;if(!r(c))return t(o,e);for(var a=n?c:-1,u=s(o);(n?a--:++a<c)&&e(u[a],a,u)!==!1;);return o}}var i=o(22),r=o(24),s=o(14);t.exports=e},function(t,n,o){function e(t,n){return function(o,e,s){return"function"==typeof e&&void 0===s&&r(o)?t(o,e):n(o,i(e,s,3))}}var i=o(32),r=o(27);t.exports=e},function(t,n,o){function e(t,n,o){if("function"!=typeof t)return i;if(void 0===n)return t;switch(o){case 1:return function(o){return t.call(n,o)};case 3:return function(o,e,i){return t.call(n,o,e,i)};case 4:return function(o,e,i,r){return t.call(n,o,e,i,r)};case 5:return function(o,e,i,r,s){return t.call(n,o,e,i,r,s)}}return function(){return t.apply(n,arguments)}}var i=o(33);t.exports=e},function(t,n){function o(t){return t}t.exports=o},function(t,n,o){t.exports=o(35)},function(t,n,o){function e(t,n,o,e){var p=t?r(t):0;return a(p)||(t=l(t),p=t.length),o="number"!=typeof o||e&&c(n,o,e)?0:o<0?f(p+o,0):o||0,"string"==typeof t||!s(t)&&u(t)?o<=p&&t.indexOf(n,o)>-1:!!p&&i(t,n,o)>-1}var i=o(36),r=o(22),s=o(27),c=o(38),a=o(24),u=o(39),l=o(40),f=Math.max;t.exports=e},function(t,n,o){function e(t,n,o){if(n!==n)return i(t,o);for(var e=o-1,r=t.length;++e<r;)if(t[e]===n)return e;return-1}var i=o(37);t.exports=e},function(t,n){function o(t,n,o){for(var e=t.length,i=n+(o?0:-1);o?i--:++i<e;){var r=t[i];if(r!==r)return i}return-1}t.exports=o},function(t,n,o){function e(t,n,o){if(!s(o))return!1;var e=typeof n;if("number"==e?i(o)&&r(n,o.length):"string"==e&&n in o){var c=o[n];return t===t?t===c:c!==c}return!1}var i=o(21),r=o(28),s=o(15);t.exports=e},function(t,n,o){function e(t){return"string"==typeof t||i(t)&&c.call(t)==r}var i=o(20),r="[object String]",s=Object.prototype,c=s.toString;t.exports=e},function(t,n,o){function e(t){return i(t,r(t))}var i=o(41),r=o(16);t.exports=e},function(t,n){function o(t,n){for(var o=-1,e=n.length,i=Array(e);++o<e;)i[o]=t[n[o]];return i}t.exports=o},function(t,n,o){t.exports=o(43)},function(t,n,o){var e=o(44),i=o(45),r=o(47),s=r(function(t,n,o){return o?e(t,n,o):i(t,n)});t.exports=s},function(t,n,o){function e(t,n,o){for(var e=-1,r=i(n),s=r.length;++e<s;){var c=r[e],a=t[c],u=o(a,n[c],c,t,n);(u===u?u===a:a!==a)&&(void 0!==a||c in t)||(t[c]=u)}return t}var i=o(16);t.exports=e},function(t,n,o){function e(t,n){return null==n?t:i(n,r(n),t)}var i=o(46),r=o(16);t.exports=e},function(t,n){function o(t,n,o){o||(o={});for(var e=-1,i=n.length;++e<i;){var r=n[e];o[r]=t[r]}return o}t.exports=o},function(t,n,o){function e(t){return s(function(n,o){var e=-1,s=null==n?0:o.length,c=s>2?o[s-2]:void 0,a=s>2?o[2]:void 0,u=s>1?o[s-1]:void 0;for("function"==typeof c?(c=i(c,u,5),s-=2):(c="function"==typeof u?u:void 0,s-=c?1:0),a&&r(o[0],o[1],a)&&(c=s<3?void 0:c,s=1);++e<s;){var l=o[e];l&&t(n,l,c)}return n})}var i=o(32),r=o(38),s=o(48);t.exports=e},function(t,n){function o(t,n){if("function"!=typeof t)throw new TypeError(e);return n=i(void 0===n?t.length-1:+n||0,0),function(){for(var o=arguments,e=-1,r=i(o.length-n,0),s=Array(r);++e<r;)s[e]=o[n+e];switch(n){case 0:return t.call(this,s);case 1:return t.call(this,o[0],s);case 2:return t.call(this,o[0],o[1],s)}var c=Array(n+1);for(e=-1;++e<n;)c[e]=o[e];return c[n]=s,t.apply(this,c)}}var e="Expected a function",i=Math.max;t.exports=o},function(t,n,o){function e(t){var n=++r;return i(t)+n}var i=o(50),r=0;t.exports=e},function(t,n){function o(t){return null==t?"":t+""}t.exports=o}]);