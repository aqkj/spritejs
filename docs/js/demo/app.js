"use strict";

function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var timer = null;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(_this, args);
    }, wait);
  };
}

var editor = CodeMirror.fromTextArea(document.querySelector('#code textarea'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'seti'
});
var output = document.getElementById('output');
editor.on('change', debounce(function (evt) {
  output.innerHTML = '';
  var hash = Date.now();

  if (window.location.hash.startsWith('#d3_')) {
    window.frames[0].location.href = "/demo/sandbox2.html?t=".concat(hash);
  } else if (window.location.hash.startsWith('#matterjs_')) {
    window.frames[0].location.href = "/demo/sandbox3.html?t=".concat(hash);
  } else if (window.location.hash.startsWith('#proton')) {
    window.frames[0].location.href = "/demo/sandbox4.html?t=".concat(hash);
  } else if (window.location.hash.startsWith('#curvejs')) {
    window.frames[0].location.href = "/demo/sandboxCurvejs.html?t=".concat(hash);
  } else if (window.location.hash.startsWith('#echart')) {
    window.frames[0].location.href = "/demo/sandboxECharts.html?t=".concat(hash);
  } else if (window.location.hash.startsWith('#qchart')) {
    window.frames[0].location.href = "/demo/sandboxQCharts.html?t=".concat(hash);
  } else {
    window.frames[0].location.href = "/demo/sandbox.html?t=".concat(hash);
  }
}));
var loadingState = document.querySelector('#paper .loading');

window.codeChange = function () {
  window.frames[0].exec(editor.getValue()); // const scriptPath = frames[0].document.querySelector('script').src
  // let versionInfo = frames[0].spritejs.version
  // if(versionInfo){
  // versionInfo = versionInfo.replace(/-.*$/g, '')
  //   libVersion.innerHTML = 'v' + versionInfo
  //   libVersion.href = scriptPath
  // }

  loadingState.className = 'loading hide';
  setTimeout(function () {
    loadingState.style.display = 'none';
  }, 500);
  menuFade();
};

var clearBtn = document.querySelector('#console-panel a');
clearBtn.addEventListener('click', function (evt) {
  output.innerHTML = '';
});
var menu = document.getElementById('menu');

function menuFade() {
  menu.className = 'fade';
  menu.timer = setTimeout(function () {
    menu.className = 'hide';
  }, 500);
}

var menuWrap = menu.querySelector('.wrap');
var i = 0;
menu.addEventListener('mouseenter', function (evt) {
  clearTimeout(menu.timer);
  menu.className = '';
  menuWrap.className = "wrap d".concat(++i % 4);
});
menu.addEventListener('mouseleave', function (evt) {
  clearTimeout(menu.timer);
  menuFade();
});
var menuLinks = document.querySelectorAll('#menu a');

function updateMenuState() {
  menuLinks.forEach(function (link) {
    if (!link.parentElement.className) {
      if (link.hash === window.location.hash) {
        link.className = 'selected';
        var codefile = link.hash ? link.hash.slice(1) : 'index';
        loadingState.style.display = 'block';
        loadingState.className = 'loading';
        fetch("/demo/static/code/".concat(codefile, ".js")).then(function (res) {
          return res.text();
        }).then(function (code) {
          editor.setValue(code);
        });
      } else {
        link.className = '';
      }
    }
  });
}

updateMenuState();
window.addEventListener('hashchange', function (evt) {
  // console.log(evt)
  updateMenuState();
});