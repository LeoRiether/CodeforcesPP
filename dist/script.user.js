// ==UserScript==
// @name         Codeforces++
// @namespace    cfpp
// @version      1.5.5
// @description  Codeforces extension pack
// @author       LeoRiether
// @source       https://github.com/LeoRiether/CodeforcesPP
// @icon         https://github.com/LeoRiether/CodeforcesPP/raw/master/assets/cf%2B%2B%20logo.png
// @match        *://codeforces.com/*
// @grant        unsafeWindow
// @updateURL    https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.meta.js
// @downloadURL  https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.user.js
// @run-at       document-end
// ==/UserScript==

////////////////////////////// ESSE UPDATE É IMPORTANTE //////////////////////////////////
// Dê update agora ou nunca mais! Mudei o downloadURL pro que era antes e quem não aceitar
// esse update vai parar de receber atualizações até reinstalar o cf++
// You have been warned
//////////////////////////////////////////////////////////////////////////////////////////

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"fRxd":[function(require,module,exports) {
/**
 * @file Utilities to manipulate the DOM
 */
function isEvent(str) {
  return str.length > 2 && str[0] == 'o' && str[1] == 'n' && str[2] >= 'A' && str[2] <= 'Z';
}

module.exports = {
  $(query, element) {
    return (element || document).querySelector(query);
  },

  $$(query, element) {
    return (element || document).querySelectorAll(query);
  },

  on(element, event, handler, options) {
    element.addEventListener(event, handler, options || {});
  },

  /**
   * Works like React.createElement
   * Doesn't support a set of features, like dataset attributions, but should work for most purposes
   */
  element(tag, props, ...children) {
    let el;

    if (typeof tag === 'string') {
      el = document.createElement(tag);
      Object.assign(el, props); // Some properties like data-* and onClick won't do anything here...

      if (props) {
        // ...so we have to consider them here
        for (let key in props) {
          if (key.startsWith('data-') || key == 'for') el.setAttribute(key, props[key]);else if (isEvent(key)) el.addEventListener(key.substr(2).toLowerCase(), props[key]);
        }
      }
    } else if (typeof tag === 'function') {
      el = tag(props);
    }

    if (children) {
      for (let c of children) {
        if (typeof c === 'string') {
          el.appendChild(document.createTextNode(c));
        } else if (c instanceof Array) {
          el.append(...c);
        } else {
          el.appendChild(c);
        }
      }
    }

    return el;
  },

  fragment(...children) {
    let frag = document.createDocumentFragment();

    if (children) {
      for (let c of children) {
        if (typeof c === 'string') {
          el.appendChild(document.createTextNode(c));
        } else if (c instanceof Array) {
          for (let cc of c) el.appendChild(cc);
        } else {
          el.appendChild(c);
        }
      }
    }

    return frag;
  }

};
},{}],"gzCE":[function(require,module,exports) {
/**
 * @file Experimental functional library, kinda like Ramda, but not as sound
 */
function curry(fn, arity = fn.length, ...args) {
  return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
}

module.exports = {
  curry: curry,

  /**
   * The same as Ramda's tryCatch:
   * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
   * function evaluates the `tryer`; if it does not throw, it simply returns the
   * result. If the `tryer` *does* throw, the returned function evaluates the
   * `catcher` function and returns its result. Note that for effective
   * composition with this function, both the `tryer` and `catcher` functions
   * must return the same type of results.
   *
   * @param {Function} tryer The function that may throw.
   * @param {Function} catcher The function that will be evaluated if `tryer` throws.
   * @return {Function} A new function that will catch exceptions and send then to the catcher.
   */
  tryCatch(tryer, catcher) {
    return (...args) => {
      try {
        return tryer(...args);
      } catch (err) {
        return catcher(err);
      }
    };
  },

  /**
   * Returns a new function that, when called, will try to call `fn`.
   * If `fn` throws, `def` will be returned instead
   * @param {Function} fn The function to try executing
   * @param {any} def The default value to return if `fn` throws
   * @return {Function}
   */
  safe(fn, def) {
    return (...args) => {
      try {
        return fn(...args);
      } catch {
        return def;
      }
    };
  },

  /**
   * Takes a list of functions and returns a function that executes them in
   * left-to-right order, passing the return value of one to the next
   * @param {[]Function} fns The functions to be piped
   * @return {Function} The piped composition of the input functions
   */
  pipe(...fns) {
    return arg => fns.reduce((acc, f) => f(acc), arg);
  },

  /**
   * Curried version of Array.prototype.map
   */
  map(fn) {
    return arr => [].map.call(arr, fn);
  }

};
},{}],"itQ5":[function(require,module,exports) {
/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */
let dom = require('./dom');

const {
  safe
} = require('./Functional');

let config = {};
const defaultConfig = {
  showTags: true,
  style: true,
  searchBtn: true,
  finder: 'Ctrl+Space',
  darkMode: false,
  standingsItv: 0,
  defStandings: 'Common',
  hideTestNumber: false
};

function load() {
  config = safe(JSON.parse, {})(localStorage.cfpp); // Settings auto-extend when more are added in the script

  config = Object.assign({}, defaultConfig, config);
  save();
}

function reset() {
  config = defaultConfig;
  save();
}

function save() {
  localStorage.cfpp = JSON.stringify(config);
}
/**
 * Creates the interface to change the settings.
 */


function createUI() {
  // Some pages, like error pages and m2.codeforces, don't have a header
  // As there's no place to put the settings button, just abort
  if (!dom.$('.lang-chooser')) return;

  function prop(title, type, id, data) {
    return {
      title,
      type,
      id,
      data
    };
  }

  let modalProps = [prop('"Show Tags" button', 'toggle', 'showTags'), prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']), prop('Custom Style', 'toggle', 'style'), prop('"Google It" button', 'toggle', 'searchBtn'), prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'), prop('Finder keyboard shortcut', 'text', 'finder'), prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber')];

  function makeToggle({
    id
  }) {
    let checkbox = dom.element("input", {
      id: id,
      checked: config[id],
      type: "checkbox"
    });
    dom.on(checkbox, 'change', () => {
      // Update property value when the checkbox is toggled
      config[id] = checkbox.checked;
      save();
    });
    return checkbox;
  }

  function makeNumber({
    id
  }) {
    let input = dom.element("input", {
      id: id,
      value: config[id] || 0,
      type: "number"
    });
    dom.on(input, 'input', () => {
      // Update property value when the number changes
      config[id] = +input.value;
      save();
    });
    return input;
  }

  function makeSelect({
    id,
    data
  }) {
    let input = dom.element("select", {
      id: id
    });
    data.map(option => dom.element("option", {
      value: option,
      selected: option == config[id]
    }, option)).forEach(opt => input.appendChild(opt));
    dom.on(input, 'change', () => {
      // Update property value when the number changes
      config[id] = input.value;
      save();
    });
    return input;
  }

  function makeText({
    id
  }) {
    let input = dom.element("input", {
      id: id,
      value: config[id],
      type: "text"
    });
    dom.on(input, 'change', () => {
      config[id] = input.value;
      save();
    });
    return input;
  }

  let make = {
    'toggle': makeToggle,
    'number': makeNumber,
    'select': makeSelect,
    'text': makeText
  }; // Create the actual nodes based on the props

  modalProps = modalProps.map(p => {
    let node;

    if (typeof make[p.type] === 'function') {
      node = make[p.type](p);
    } else {
      node = document.createTextNode(`${p.type} does not have a make function! Please check the createUI function on config.js`);
    }

    return dom.element("div", null, dom.element("label", {
      for: p.id
    }, p.title), node);
  });
  let modal = dom.element("div", {
    className: "cfpp-config cfpp-modal cfpp-hidden"
  }, dom.element("div", {
    className: "cfpp-modal-background",
    onClick: closeUI
  }), dom.element("div", {
    className: "cfpp-modal-inner"
  }, modalProps, "Refresh the page to apply changes")); // Create the button that shows the modal

  let modalBtn = dom.element("a", {
    className: "cfpp-config-btn"
  }, "[++]");
  dom.on(modalBtn, 'click', ev => {
    ev.preventDefault();
    modal.classList.remove('cfpp-hidden');
  });
  dom.on(document, 'keyup', keyupEvent => {
    // pressing ESC also closes the UI
    if (keyupEvent.key == 'Escape') closeUI();
  }); // Append the created elements to the DOM

  document.body.appendChild(modal);
  dom.$('.lang-chooser').children[0].prepend(modalBtn);
}

function closeUI() {
  dom.$('.cfpp-config').classList.add('cfpp-hidden');
  save();
}

module.exports = {
  createUI,
  closeUI,
  get: key => config[key],
  set: (key, value) => {
    config[key] = value;
    save();
  },
  load,
  reset,
  save
};
},{"./dom":"fRxd","./Functional":"gzCE"}],"D31m":[function(require,module,exports) {
/**
 * @file Adds a "Show Tags" button to a problem's page
 */
let dom = require('./dom');

module.exports = function () {
  // If the user has already AC'd this problem, there's no need to hide the tags
  let hasAC = dom.$('.verdict-accepted');

  if (hasAC) {
    return;
  }

  let tbox = dom.$('.tag-box'); // individual tag

  let container = tbox.parentNode.parentNode; // actual container for all the tags

  container.style.display = 'none';

  function ShowTagsButton() {
    let btn = dom.element("button", {
      className: "caption",
      style: "background: transparent; border: none; cursor: pointer;"
    }, "Show");
    dom.on(btn, 'click', () => {
      btn.remove();
      container.style.display = 'block';
    });
    return btn;
  }

  container.parentNode.appendChild(dom.element(ShowTagsButton, null));
};
},{"./dom":"fRxd"}],"Dd2r":[function(require,module,exports) {
/**
 * @file Hides tags on the /problemset page for the problems you didn't solve yet
 */
let dom = require('./dom');

module.exports = function () {
  // Get problems that don't have an AC
  let noACs = dom.$$('.problems tr:not(.accepted-problem)');

  for (let p of noACs) {
    // Hide them hackfully!
    let k = p.children[1].children[1] || {};
    k = k.style || {};
    k.display = 'none';
  }
};
},{"./dom":"fRxd"}],"ZTd0":[function(require,module,exports) {
/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */
let dom = require('./dom');

module.exports = function () {
  let problemName = dom.$('.problem-statement .title').innerText;
  problemName = problemName.split('.').slice(1).join('.');
  problemName += ' codeforces';
  const href = `https://google.com/search?q=${problemName.replace(/ /g, '+')}`;
  dom.$('.second-level-menu-list').appendChild(dom.element("li", null, dom.element("a", {
    href: href,
    target: "_blank"
  }, " Google It ")));
};
},{"./dom":"fRxd"}],"h9M9":[function(require,module,exports) {
/**
 * @file Adds a button to easily check the editorial/tutorial for a problem
 */
let dom = require('./dom');

let modalLoaded = false;

function showModal() {
  dom.$('.cfpp-tutorial').classList.remove('cfpp-hidden');
}

function closeModal() {
  dom.$('.cfpp-tutorial').classList.add('cfpp-hidden');
}

function loadModal(deadline) {
  if (modalLoaded && !deadline) {
    showModal();
    return;
  }

  if (deadline && deadline.timeRemaining() <= 0) return;
  modalLoaded = true; // Create the modal and its children

  let modalInner = dom.element("div", {
    className: "cfpp-modal-inner"
  }, "loading...");
  let modal = dom.element("div", {
    className: "cfpp-modal cfpp-tutorial cfpp-hidden"
  }, dom.element("div", {
    className: "cfpp-modal-background",
    onClick: closeModal
  }), modalInner);
  dom.on(document, 'keyup', keyupEvent => {
    if (keyupEvent.key == 'Escape') closeModal();
  });
  document.body.appendChild(modal); // Get the problem ID

  let matches = location.pathname.match(/\/problemset\/problem\/(\d+)\/(.+)|\/contest\/(\d+)\/problem\/(.+)/i);
  let pcode;
  if (matches[1]) pcode = matches[1] + matches[2];else if (matches[3]) pcode = matches[3] + matches[4];else {
    modalInner.innerText = `Failed to get the problem code...`;
    return;
  } // Get the CSRF Token

  const csrf = Codeforces && Codeforces.getCsrfToken() || document.querySelector('.csrf-token').dataset.csrf; // Finally, load the tutorial

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/data/problemTutorial');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhr.setRequestHeader('X-Csrf-Token', csrf);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.responseType = 'json';

  xhr.onload = () => {
    if (xhr.response && xhr.response.success) {
      modalInner.innerHTML = xhr.response.html;
      MathJax.Hub.Queue(() => MathJax.Hub.Typeset(modalInner));
    } else {
      modalInner.innerText = "Something went wrong!";
    }
  };

  xhr.onerror = () => {
    modalInner.innerText = `Failed to fetch tutorial! Here's an error code: ${xhr.status}`;
  };

  xhr.send(`problemCode=${pcode}&csrf_token=${csrf}`);
}
/**
 * Creates a "Tutorial" button.
 * When clicked, the button will create a modal and fill it with the tutorial's content
 */


module.exports = function createBtn() {
  let btn = dom.element("a", {
    className: "cfpp-tutorial-btn",
    style: "cursor: pointer;"
  }, " Tutorial ");
  dom.on(btn, 'click', () => {
    loadModal();
    showModal();
  }); // Load the tutorial if we're idle

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadModal, {
      timeout: 10000
    });
  }

  dom.$('.second-level-menu-list').appendChild(dom.element("li", null, btn));
};
},{"./dom":"fRxd"}],"JhvP":[function(require,module,exports) {
/**
 * @file Provides drowdown menus for the main navbar, for better site navigation
 */
let dom = require('./dom');

module.exports = function () {
  // Get user handle
  const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
  let oldNav = dom.$('.main-menu-list');
  let newNav = dom.element("nav", {
    className: "cfpp-navbar"
  }); // Without this the dropdowns don't appear

  oldNav.parentNode.parentNode.style.overflow = 'visible';
  let keys = {
    "/groups": {
      "My Groups": `/groups/with/${handle}`,
      "My Teams": `/teams/with/${handle}`
    },
    "/problemset": {
      "Status": "/problemset/status",
      "Friends Status": "/problemset/status?friends=on",
      "My Submissions": `/submissions/${handle}`,
      "Favourites": `/favourite/problems`,
      "ACM SGU": "/problemsets/acmsguru"
    },
    "/contests": {
      "My Contests": `/contests/with/${handle}`,
      "My Problems": `/contests/writer/${handle}`
    },
    "/gyms": {
      "Mashups": "/mashups"
    },
    "/ratings": {
      "Friends": "/ratings/friends/true"
    }
  }; // Iterate over all nav items and include them the new navbar

  for (let item of oldNav.children) {
    let link = item.children[0]; // <a> tag

    let newItem = dom.element("div", {
      className: "cfpp-navbar-item"
    }, link); // Add dropdown menu, if needed

    const href = link.getAttribute('href');

    if (keys[href]) {
      let dropdown = dom.element("div", {
        className: "cfpp-dropdown"
      });

      for (let ddText in keys[href]) {
        dropdown.appendChild(dom.element("a", {
          href: keys[href][ddText]
        }, ddText));
      }

      newItem.appendChild(dropdown);
    }

    newNav.appendChild(newItem);
  }

  oldNav.replaceWith(newNav); // Change Codeforces logo to Codeforces++

  let logo = dom.$('#header img');

  if (logo && logo.getAttribute('src').endsWith('codeforces-logo-with-telegram.png')) {
    logo.setAttribute('src', 'https://github.com/LeoRiether/CodeforcesPP/raw/master/assets/codeforcespp.png');
  }
};
},{"./dom":"fRxd"}],"aNBT":[function(require,module,exports) {
/**
 * @file Replaces links to pages you often don't want to go to. e.g. '/members' in the groups page, where you'd rather go directly to '/contests'
 */
let dom = require('./dom');

let config = require('./config'); // Replaces /members by /contests on the groups page


function groups() {
  dom.$$('.datatable a.groupName').forEach(link => link.href = link.href.replace('/members', '/contests'));
} // Redirects every /standings page to a 'friends only' standings page


function friendsStandings() {
  let links = document.getElementsByTagName('a');

  for (let link of links) {
    if (link.href.endsWith('/standings')) {
      link.href += '/friends/true';
    }
  }
} // Redirects contest registrants to friends registrants


function registrants() {
  dom.$$('.contestParticipantCountLinkMargin').forEach(e => e.href += '/friends/true');
} // Redirects /problemset/standings to the contest standings you actually want


function problemsetStandings(contestID) {
  let links = dom.$$('.second-level-menu-list a');

  for (let link of links) {
    if (link.href.endsWith('/problemset/standings')) {
      link.href = link.href.replace('problemset', 'contest/' + contestID);
      return;
    }
  }
} // Adds a /virtual button on gym pages


function gymVirtual() {
  dom.$('#sidebar').children[0].insertAdjacentHTML('afterend', `
        <div class="roundbox sidebox">
            <div class="caption titled">→ Virtual participation</div>
            <form style="text-align:center; margin:1em;" action="${location.href}/virtual" method="get">
                <input type="submit" value="Start virtual contest">
            </form>
        </div>
    `);
}

module.exports = function () {
  if (/\/groups\/with\//i.test(location.pathname)) {
    groups();
  } // Always do this *before* friendsStandings() because of endsWith('/problemset/standings')


  const contestIDMatch = location.pathname.match(/problemset\/problem\/(\d+)/i);

  if (contestIDMatch) {
    problemsetStandings(contestIDMatch[1]);
  }

  if (config.get('defStandings') == 'Friends' && !/\/standings/i.test(location.pathname)) {
    friendsStandings();
  }

  if (dom.$('.contestParticipantCountLinkMargin')) {
    registrants();
  } // /gym/:ID or /group/:GroupID/contest/:ID


  if (/gym\/\d+$/i.test(location.pathname) || /group\/[a-zA-Z0-9]+\/contest\/\d+$/i.test(location.pathname)) {
    gymVirtual();
  }
};
},{"./dom":"fRxd","./config":"itQ5"}],"W2EC":[function(require,module,exports) {
/**
 * @file Updates the standings page automatically after some given interval
 */
let dom = require('./dom'); // FIXME: cf-predictor deltas dissapear after reloading standings


function update() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', location.href);
  xhr.responseType = 'document';

  xhr.onload = function () {
    if (!xhr.response || xhr.responseURL.includes('/offline')) {
      return console.log("Codeforces++ wasn't able to reload the standings. Please your internet connection");
    }

    dom.$('#pageContent .standings').replaceWith(dom.$('#pageContent .standings', xhr.response));
    const scripts = dom.$$('#pageContent script');

    for (const script of scripts) {
      eval(script.innerHTML); // Might not work in some browsers
    }
  };

  xhr.onerror = function () {// Not sure what to do
    // Gracefully stop? Notify user? Try again?
  };

  xhr.send();
}
/**
 * @param delay - Interval to the update function in seconds
 */


module.exports = function (delay) {
  if (delay > 0) setInterval(update, delay * 1000);
};
},{"./dom":"fRxd"}],"IwUp":[function(require,module,exports) {
/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */
const dom = require("./dom");

const fontFamily = 'Libre Franklin';

function applyCustomCSS() {
  let customCSS = '';
  document.body.appendChild(dom.element("style", {
    className: "cfpp-style"
  }, `
    @import url('https://fonts.googleapis.com/css?family=Libre+Franklin&display=swap');

    a, a:visited, .contest-state-phase {
        text-decoration: none !important;
        /* color: #0000EE; */ /* default link color */
        color: #2c63d5;
    }
    .titled, .caption {
        color: #2c63d5 !important;
    }

    p, span:not(.tex-span), a, div {
        font-family: '${fontFamily}', 'Roboto', sans-serif !important;
    }

    /* Put smallcaps on the navbar */
    .menu-list-container a {
        text-transform: none !important;
        font-variant: small-caps;
    }

    /* Remove CF's image borders */
    .roundbox-lt, .roundbox-lb, .roundbox-rt, .roundbox-rb,
    .lt, .lb, .rt, .rb,
    .ilt, .ilb, .irt, .irb {
        display: none;
    }
    /* Replace them by real borders */
    .roundbox {
        border-radius: 6px;
        overflow: hidden;
        border: none;
        box-shadow: 1px 1px 5px rgba(108, 108, 108, 0.17);
    }
    .titled {
        border: none !important;
    }

    /* Remove borders between cells on tables */
    table th, table td {
        border: none !important;
    }

    /* Better table border color */
    .datatable {
        background-color: #f8f8f8 !important;
    }

    /* Remove borders on profile page */
    .title-photo div:first-child, .userbox {
        border: none !important;
    }

    /* Make .nav-links prettier */
    .nav-links li {
        list-style: none !important;
    }

    /* Weird thing on nav menus that move with the mouse */
    .backLava {
        display: none !important;
    }

    /* Better buttons */
    input[type=submit] {
        background: #d2d2d245;
        border: none;
        border-bottom: 3px solid #b6b6b678;
        padding: 0.4em 1.1em !important;
        border-radius: 6px;
        cursor: pointer;
    }
    input[type=submit]:active {
        border-bottom: 1px solid #b6b6b678;
    }

    /* Better selects */
    .submitForm input, .submitForm select {
        border: none;
    }

    /* Copy button */
    .input-output-copier {
        text-transform: lowercase;
        font-variant: small-caps;
        border: none;
    }

    /* Weird divisors next to the Logout button */
    .lang-chooser {
        font-size: 0;
    }
    .lang-chooser a {
        font-size: small;
        margin-left: 0.3em;
    }

    /* Better problem statement */
    .problem-statement {
        margin: 0; /* why did it have a 4-side margin in first place?? */
        margin-right: 1.5em; /* better separation */
    }
    .problem-statement .property-title {
        display: none;
    }
    /*.problem-statement .header .title {
        font-size: 180%;
    }
    .problem-statement .header {
        margin: 2em 0;
    }*/
    .problem-statement .header .title {
        font-size: 200%;
        margin-bottom: 0;
    }
    .problem-statement .header {
        margin: 2.5em 0 1.5em 0;
        text-align: left;
    }
    .problem-statement .header>div {
        display: inline-block !important;
        margin-right: 0.5em;
    }
    .problem-statement .header>div:not(.title) {
        color: #9E9E9E;
    }
    .problem-statement .header>div:not(:last-child)::after {
        content: ",";
    }
    div.ttypography p, .sample-test {
        margin-bottom: 1.5em !important;
    }
    .problem-statement .section-title {
        font-size: 150%;
        margin-bottom: 0.25em;
    }

    .source-and-history-div {
        border: none;
    }
    #facebox {
        position: fixed;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50% , -50%);
    }

    `, customCSS));
}

function applyCommonCSS() {
  document.body.appendChild(dom.element("style", null, `
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    /** Config **/
    .cfpp-hidden {
        display: none;
    }

    .cfpp-config-btn {
        font-size: 22px !important;
        cursor: pointer;
    }

    .cfpp-modal {
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 101;
    }
    .cfpp-modal-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #00000087;
        animation: fadeIn 0.15s forwards;
    }
    html.cfpp-dark-mode .cfpp-modal-background { background: #ffffff87; }
    .cfpp-modal-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60vw;
        max-height: 80vh;
        background: white;
        padding: 2em;
        border-radius: 6px;
        overflow: auto;
        animation: fadeIn 0.15s forwards;
    }
    .cfpp-config .cfpp-modal-inner>div {
        margin-bottom: 0.5em;
    }

    .cfpp-config label {
        margin-right: 0.75em;
    }

    /** Navbar **/
    .cfpp-navbar {
        margin-left: 1.5em;
    }
    .cfpp-navbar-item {
        display: inline-block;
        position: relative;
        margin-right: 1.5em;
    }
    .cfpp-navbar-item>a {
        color: #212121;
    }
    .cfpp-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 200%;
        z-index: 99;
        display: none;
        background: #212121;
        padding: 1em;
        box-shadow: 1px 7px 19px #00000054;
    }
    .cfpp-dropdown a {
        display: block;
        color: #E0E0E0;
    }
    .cfpp-navbar-item:hover .cfpp-dropdown,
    .cfpp-navbar-item:focus-within .cfpp-dropdown {
        display: block;
    }

    /** Finder **/
    .finder-inner {
        position: absolute;
        top: 8%;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 60vw;
        animation: fadeIn 0.15s forwards;
    }
    .finder-input, .finder-results {
        box-sizing: border-box;
        width: 100%;
        border: none;
        border-radius: 6px;
        font-family: '${fontFamily}', 'Roboto', sans-serif;
        font-size: 1.25em;
    }
    .finder-input {
        padding: 1em 1.25em;
        margin-bottom: 1.5em;
        outline: none;
        transition: box-shadow 0.2s;
    }
    .finder-input:focus {
        box-shadow: 0px 6px 19px #0b28667a;
    }
    .finder-results {
        background: white;
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 75vh;
        overflow: auto;
    }
    .finder-results a {
        cursor: pointer;
        color: #282828;
        display: block;
        padding: 1em 1.25em;
        transition: color, margin-left 0.1s;
        outline: none;
    }
    .finder-results a:focus {
        color: #2c63d5;
        margin-left: 0.25em;
    }

    .inverted {
        filter: invert(1);
    }
    html.cfpp-dark-mode, html.cfpp-dark-mode img {
        filter: invert(1) hue-rotate(180deg);
    }
    html.cfpp-dark-mode .MathJax img:not(.inverted),
    html.cfpp-dark-mode .tex-formula:not(.inverted) {
        filter: none !important;
    }
    #header img { filter: none; }
    html.cfpp-dark-mode {
        background: black;
    }

    .verdict-hide-number .verdict-format-judged,
    .verdict-hide-number .diagnosticsHint {
        display: none !important;
    }

    `));
}

module.exports = {
  custom: applyCustomCSS,
  common: applyCommonCSS
};
},{"./dom":"fRxd"}],"tTEz":[function(require,module,exports) {
/**
 * @file Hides/Shows "on test X" in verdicts
 */
let dom = require('./dom');

let config = require('./config');

let {
  safe
} = require('./Functional');

const pluckVerdictRegex = / on (pre)?test ?\d*$/;

const pluckVerdict = s => s.replace(pluckVerdictRegex, '');

function pluckVerdictOnNode(n) {
  let c = n.childNodes[0];
  c.nodeValue = pluckVerdict(c.nodeValue);
}

pluckVerdictOnNode = safe(pluckVerdictOnNode, ''); // so it doesn't throw if something is undefined

let ready = false;

function init() {
  if (ready) return;
  ready = true; // Proxy Codeforces.showMessage to hide the test case

  if (Codeforces && Codeforces.showMessage) {
    let _showMessage = Codeforces.showMessage;

    Codeforces.showMessage = function (message) {
      if (config.get('hideTestNumber')) {
        message = pluckVerdict(message);
      }

      _showMessage(message);
    };
  } // Subscribe to Codeforces submisions pubsub


  if (unsafeWindow.submissionsEventCatcher) {
    const channel = unsafeWindow.submissionsEventCatcher.channels[0];
    unsafeWindow.submissionsEventCatcher.subscribe(channel, data => {
      if (!config.get('hideTestNumber')) return;

      if (data.t === 's') {
        const el = dom.$(`[data-a='${data.d[0]}'] .status-verdict-cell span`);
        pluckVerdictOnNode(el);
      }
    });
  }
}

function hide() {
  init();
  config.set('hideTestNumber', true);
  document.documentElement.classList.add('verdict-hide-number');
  dom.$$('.verdict-rejected,.verdict-waiting').forEach(pluckVerdictOnNode);
}

function show() {
  config.set('hideTestNumber', false);
  if (!document.documentElement.classList.contains('verdict-hide-number')) return;
  document.documentElement.classList.remove('verdict-hide-number');
  dom.$$('.verdict-rejected,.verdict-waiting').forEach(e => {
    e.childNodes[0].nodeValue += ' on test ';
  });
}

function toggle() {
  if (config.get('hideTestNumber')) {
    show();
  } else {
    hide();
  }
}

module.exports = {
  hide,
  show,
  toggle,
  init
};
},{"./dom":"fRxd","./config":"itQ5","./Functional":"gzCE"}],"EYnA":[function(require,module,exports) {
/**
 * @file Adds a search pop-up to navigate Codeforces
 */
let dom = require('./dom');

let config = require('./config');

const F = require('./Functional');

let isOpen = false;
const safeJSONParse = F.safe(JSON.parse, {}); // TODO: every info I need is pulled from the DOM. Refactor to have a JS model of the search that syncs with the html

/**
 * Kinda like a React component
 * I'm basically rolling my own React at this point
 */

function Result(props) {
  if (!props.href && !props.onClick) {
    console.error(`Codeforces++ Error!\n` + `Please report this on the GitHub: github.com/LeoRiether/CodeforcesPP\n` + `<Result> was created without any action attached. title=${props.title}.`);
  }

  return dom.element("li", {
    "data-key": props.key,
    "data-search": props.title.toLowerCase()
  }, props.href ? dom.element("a", {
    href: props.href
  }, props.title) : dom.element("a", {
    href: "#",
    onClick: props.onClick
  }, props.title));
}

let extensions = {
  common(handle) {
    // TODO: consider changing to JSON.parse for performance reasons
    return [{
      key: "contests",
      title: "Contests",
      href: "/contests"
    }, {
      key: "problemset",
      title: "Problemset",
      href: "/problemset"
    }, {
      key: "psetting",
      title: "Problemsetting",
      href: `/contests/with/${handle}`
    }, {
      key: "subms",
      title: "Submissions",
      href: `/submissions/${handle}`
    }, {
      key: "groups",
      title: "Groups",
      href: `/groups/with/${handle}`
    }, {
      key: "profile",
      title: "Profile",
      href: `/profile/${handle}`
    }, {
      key: "cfviz",
      title: "CfViz",
      href: "https://cfviz.netlify.com"
    }, {
      key: "a2oj",
      title: "A2Oj",
      href: "https://a2oj.com"
    }, {
      key: "favs",
      title: "Favourites",
      href: "/favourite/problems"
    }, {
      key: "teams",
      title: "Teams",
      href: `/teams/with/${handle}`
    }, {
      key: "status",
      title: "Status",
      href: "/problemset/status"
    }, {
      key: "fstatus",
      title: "Friends Status",
      href: "/problemset/status?friends=on"
    }, {
      key: "gym",
      title: "Gym",
      href: "/gyms"
    }, {
      key: "blog",
      title: "Blog",
      href: `/blog/handle/${handle}`
    }, {
      key: "mashups",
      title: "Mashups",
      href: "/mashups"
    }, {
      key: "rating",
      title: "Rating",
      href: "/ratings"
    }];
  },

  problem() {
    return [{
      key: "tutorial",
      title: "Problem: Tutorial",

      onClick() {
        close();
        dom.$('.cfpp-tutorial-btn').click();
      }

    }, {
      key: "submit",
      title: "Problem: Submit",

      onClick() {
        close();
        dom.$('#sidebar [name=sourceFile]').click();
      }

    }];
  },

  contest(baseURL, id, isGym) {
    const name = isGym ? 'Gym' : 'Contest';
    baseURL += `${name.toLowerCase()}/${id}`;
    const standingsFriends = config.get('defStandings') === 'Friends' ? '/friends/true' : '';
    return [{
      key: "cstandings",
      title: `${name}: Standings`,
      href: `${baseURL}/standings/${standingsFriends}`
    }, {
      key: "cproblems",
      title: `${name}: Problems`,
      href: `${baseURL}`
    }, {
      key: "csubmit",
      title: `${name}: Submit`,
      href: `${baseURL}/submit`
    }, {
      key: "csubmissions",
      title: `${name}: Submissions`,
      href: `${baseURL}/my`
    }, {
      key: "cinvoc",
      title: `${name}: Custom Invocation`,
      href: `${baseURL}/customtest`
    }, {
      key: "cstatus",
      title: `${name}: Status`,
      href: `${baseURL}/status`
    }, {
      key: "virtual",
      title: `${name}: Virtual`,
      href: `${baseURL}/virtual`
    }];
  },

  groups() {
    function makeRecordFromGroup([name, id]) {
      if (!/^[\d\w]+$/.test(id)) {
        // Convert [name, href], used in previous versions, to [name, id]
        id = id.match(/\/group\/([\d\w]+)/)[1];
      }

      return {
        key: `group_${id}`,
        title: `Group: ${name}`,
        href: `/group/${id}/contests`
      };
    }

    const makeGroups = F.pipe(F.safe(JSON.parse, []), F.map(makeRecordFromGroup));
    return makeGroups(localStorage.userGroups);
  }

};
/**
 * Bind search and navigation events (Input, ArrowDown, ArrowUp, ...)
 */

function bindEvents(input, results) {
  function updateDisplay(value) {
    value = value.toLowerCase();
    return result => result.style.display = includesSubseq(result.dataset.search, value) ? "" : "none";
  }

  dom.on(input, 'input', () => {
    [].forEach.call(results.children, updateDisplay(input.value));
  });
  dom.on(input, 'keydown', e => {
    if (e.key == 'Enter') {
      for (let r of results.children) {
        if (r.style.display == "") {
          r.children[0].click();
          increasePriority(r.dataset.key);
          close();
          break;
        }
      }
    } else if (e.key == 'ArrowUp') {
      let focus = results.children[results.children.length - 1];

      while (focus && focus.style.display != "") focus = focus.previousElementSibling;

      if (focus !== null) {
        focus.children[0].focus();
        focus.children[0].scrollIntoViewIfNeeded();
      }

      e.preventDefault();
    } else if (e.key == 'ArrowDown') {
      let focus = results.children[0];

      while (focus && focus.style.display != "") focus = focus.nextElementSibling;

      if (focus !== null) {
        focus.children[0].focus();
        focus.children[0].scrollIntoViewIfNeeded();
      }

      e.preventDefault();
    }
  });
  dom.on(results, 'keydown', e => {
    let sibling = undefined;

    if (e.key == 'ArrowDown') {
      sibling = document.activeElement.parentElement.nextElementSibling;

      while (sibling && sibling.style.display != "") {
        sibling = sibling.nextElementSibling;
      }
    } else if (e.key == 'ArrowUp') {
      sibling = document.activeElement.parentElement.previousElementSibling;

      while (sibling && sibling.style.display != "") {
        sibling = sibling.previousElementSibling;
      }
    }

    if (sibling === null) {
      // no sibling
      input.focus();
      putCursorAtEnd(input);
      results.scrollTop = 0;
      e.preventDefault(); // prevent putCursorAtEnd from not working correctly, and scrolling
    } else if (sibling !== undefined) {
      // there's a sibling
      sibling.children[0].focus();
      sibling.children[0].scrollIntoViewIfNeeded();
      e.preventDefault(); // prevent scrolling
    }
  });
  dom.on(results, 'click', e => {
    increasePriority(e.target.parentElement.dataset.key);
  });
}

function resultList() {
  // Get user handle
  const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
  let data = [];

  if (/\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i.test(location.pathname)) {
    data = data.concat(extensions.problem());
  } // Is it a contest?


  let contestMatch = location.href.match(/\/contest\/(\d+)/i);

  if (contestMatch) {
    const baseURL = location.href.substring(0, location.href.indexOf('contest'));
    data = data.concat(extensions.contest(baseURL, contestMatch[1], false));
  } // Is it a gym contest?


  contestMatch = location.href.match(/\/gym\/(\d+)/i);

  if (contestMatch) {
    const baseURL = location.href.substring(0, location.href.indexOf('gym'));
    data = data.concat(extensions.contest(baseURL, contestMatch[1], true));
  }

  data = data.concat(extensions.groups());
  data = data.concat(extensions.common(handle)); // Sort the data by priority

  let priority = safeJSONParse(localStorage.finderPriority);
  data = data.sort((a, b) => (priority[b.key] || 0) - (priority[a.key] || 0));
  return data;
} // Create can be called many times, but will only create the finder once
// Returns a promise


let createPromise = undefined;

function create() {
  if (createPromise !== undefined) {
    return createPromise;
  }

  createPromise = new Promise((res, rej) => {
    let input = dom.element("input", {
      type: "text",
      className: "finder-input",
      placeholder: "Search anything"
    });
    let results = dom.element("ul", {
      className: "finder-results"
    });
    let modal = dom.element("div", {
      className: "cfpp-modal cfpp-hidden",
      tabindex: "0"
    }, dom.element("div", {
      className: "cfpp-modal-background",
      onClick: close
    }), dom.element("div", {
      className: "finder-inner",
      tabindex: "0"
    }, input, results));
    dom.on(document, 'keyup', e => {
      if (e.key == 'Escape') close();
    });
    results.append(...resultList().map(props => dom.element(Result, props)));
    bindEvents(input, results);
    document.body.appendChild(modal);
    res({
      modal,
      input,
      results
    });
  });
  return createPromise;
}

async function open() {
  if (isOpen) return;
  isOpen = true;
  let {
    modal,
    input
  } = await create();
  modal.classList.remove('cfpp-hidden');
  input.focus();
}

async function close() {
  if (!isOpen) return;
  isOpen = false;
  let {
    modal,
    input,
    results
  } = await create();
  modal.classList.add('cfpp-hidden');
  input.value = "";
  [].forEach.call(results.children, r => r.style.display = "");
}
/**
 * Increases the priority of a finder key in localStorage.finderPriority
 */


function increasePriority(key) {
  let fp = safeJSONParse(localStorage.finderPriority);
  const maxValue = Object.values(fp).reduce((x, y) => Math.max(x, y), 0);
  fp[key] = maxValue + 1;
  localStorage.finderPriority = JSON.stringify(fp);
}
/**
 * Puts the cursor at the end in an input element
 */


function putCursorAtEnd(input) {
  let pos = input.value.length;

  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(pos, pos);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

function includesSubseq(text, pattern) {
  if (pattern.length == 0) {
    return true;
  }

  let p = pattern.length - 1;

  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] == pattern[p]) {
      p--;
    }

    if (p < 0) {
      return true;
    }
  }

  return false;
}

function updateGroups() {
  const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();

  if (location.href.endsWith(`/groups/with/${handle}`)) {
    // Opportune moment to update the user's groups
    const idRegex = /\/group\/([\d\w]+)/;

    let extractID = group => {
      return idRegex.exec(group)[1];
    };

    let groups = [].map.call(dom.$$('.groupName'), el => [el.innerText.trim(), extractID(el.href)]);
    localStorage.userGroups = JSON.stringify(groups);
  }
}

module.exports = {
  create,
  open,
  close,
  updateGroups
};
},{"./dom":"fRxd","./config":"itQ5","./Functional":"gzCE"}],"YDQW":[function(require,module,exports) {
/**
 * @file Defines keyboards shortcuts to be used on all codeforces pages
 */
let dom = require('./dom');

let finder = require('./finder');

let config = require('./config'); //
// Commands
//
// Opens the file picker and focuses the submit button


function submit() {
  // Try getting the [choose a file] input
  let fileInput = document.getElementsByName('sourceFile');
  if (fileInput.length == 0) return;
  fileInput = fileInput[0];
  dom.on(window, 'focus', () => {
    const submitBtn = dom.$('.submit', fileInput.parentNode.parentNode.parentNode); // cool huh?

    submitBtn.focus();
  }, {
    once: true
  });
  fileInput.click(); // open the file picker
}

function scrollToPageContent() {
  const pageContent = dom.$('#pageContent');
  if (!pageContent) return;
  pageContent.scrollIntoView();
  document.documentElement.scrollBy(0, -20);
}

function darkMode() {
  if (dom.$('.darkreader')) {
    // Only invert images
    if (dom.$('img.inverted')) {
      dom.$$('img').forEach(i => i.classList.remove('inverted'));
    } else {
      dom.$$('img').forEach(i => i.classList.add('inverted'));
    }

    return;
  }

  let html = document.documentElement;
  let isDark = html.classList.contains('cfpp-dark-mode');
  html.classList.toggle('cfpp-dark-mode');
  config.set('darkMode', !isDark);
}

let shortcuts = {
  'ctrl+s': submit,
  'ctrl+shift+v': scrollToPageContent,
  // V => view
  'ctrl+alt+v': scrollToPageContent,
  'ctrl+i': darkMode,
  'ctrl+shift+h': require('./verdict_test_number').toggle // H => hard mode | hide test cases

};
shortcuts[config.get('finder').toLowerCase()] = finder.open;

function isFKey(key) {
  return key.length == 2 && key[0] == 'F' && key[1] >= '0' && key[1] <= '9';
}

module.exports = function () {
  dom.on(document, 'keydown', e => {
    // Not going to use precious cycles when there's not even a ctrl or shift
    if (!e.ctrlKey && !isFKey(e.key)) return; // Build the key sequence string (like 'ctrl+shift+p')

    let key = "";
    if (e.metaKey) key += 'meta+';
    if (e.ctrlKey) key += 'ctrl+';
    if (e.altKey) key += 'alt+';
    if (e.shiftKey) key += 'shift+';
    key += e.key == ' ' ? 'space' : e.key.toLowerCase();
    const fn = shortcuts[key];

    if (fn) {
      e.preventDefault();
      e.stopPropagation();
      fn();
    }
  });

  if (config.get('darkMode')) {
    darkMode();
  }
};
},{"./dom":"fRxd","./finder":"EYnA","./config":"itQ5","./verdict_test_number":"tTEz"}],"Focm":[function(require,module,exports) {
/**
 * @file Calls the appropriate modules according to the current page
 */
let tries = 0;

(function run() {
  Codeforces = unsafeWindow.Codeforces;
  console.log('Codeforces++ is trying to run...');

  if (!Codeforces && tries < 15) {
    tries++;
    setTimeout(run, 200);
    return;
  }

  console.log("Codeforces++ is running!");

  let dom = require('./dom');

  let config = require('./config');

  config.load();
  config.createUI();

  try {
    // Update version
    if (GM_info && config.get('version') != GM_info.script.version) {
      config.set('version', GM_info.script.version);
      config.save();

      if (Codeforces && Codeforces.showMessage) {
        Codeforces.showMessage(`Codeforces++ was updated to version ${config.get('version')}!
                Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">changelog</a>`);
      }
    }
  } catch {} // gracefully do nothing
  // Execute features according to the current page


  if (config.get('showTags') && dom.$('.tag-box')) {
    require('./show_tags')();
  } else if (config.get('showTags') && dom.$('.problems')) {
    require('./problemset')();
  }

  let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page

  if (config.get('searchBtn') && searchableRegex.test(location.pathname)) require('./search_button')(); // Regex matches a page of a problem in the problemset (most of these have tutorials)

  let problemRegex = /\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i;
  if (problemRegex.test(location.pathname)) require('./show_tutorial')();

  require('./navbar')();

  require('./redirector')();

  const standingsItv = +config.get('standingsItv');
  if (standingsItv > 0 && /\/standings/i.test(location.pathname)) require('./update_standings')(standingsItv);

  const style = require('./style');

  if (config.get('style')) {
    style.custom();
  }

  style.common();

  if (config.get('hideTestNumber')) {
    require('./verdict_test_number').hide();
  }

  require('./finder').updateGroups();

  require('./shortcuts')(); // Exported to a global cfpp variable


  module.exports = {
    debug: {
      resetConfig: config.reset
    },
    dom: dom,
    version: config.get('version')
  };
})();
},{"./dom":"fRxd","./config":"itQ5","./show_tags":"D31m","./problemset":"Dd2r","./search_button":"ZTd0","./show_tutorial":"h9M9","./navbar":"JhvP","./redirector":"aNBT","./update_standings":"W2EC","./style":"IwUp","./verdict_test_number":"tTEz","./finder":"EYnA","./shortcuts":"YDQW"}]},{},["Focm"], "cfpp")