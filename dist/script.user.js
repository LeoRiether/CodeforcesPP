// ==UserScript==
// @name         Codeforces++
// @namespace    cfpp
// @version      1.6.0
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
})({"dom.js":[function(require,module,exports) {
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
        } else if (c) {
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
          frag.appendChild(document.createTextNode(c));
        } else if (c instanceof Array) {
          for (let cc of c) frag.appendChild(cc);
        } else if (c) {
          frag.appendChild(c);
        }
      }
    }

    return frag;
  }

};
},{}],"Functional.js":[function(require,module,exports) {
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
  map: fn => arr => [].map.call(arr, fn),

  /**
   * Curried version of Array.prototype.forEach
   */
  forEach: fn => arr => [].forEach.call(arr, fn),

  /**
   * @example zipBy2([1,2,3,4,5,6]) == [[1,2], [3,4], [5,6]]
   * @example zipBy2([1,2,3]) == [[1,2], [3, undefined]]
   * @return {Array}
   */
  zipBy2(list) {
    let r = [];

    for (let i = 0; i < list.length; i += 2) {
      r.push([list[i], list[i + 1]]);
    }

    return r;
  },

  flatten: list => list.reduce((acc, a) => acc.concat([].slice.call(a)), [])
};
},{}],"events.js":[function(require,module,exports) {
/**
 * @file Minimalistic event-bus
 */
let {
  safe
} = require('./Functional');

let listeners = {};
module.exports = {
  listen(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(safe(callback));
  },

  async fire(event, data) {
    (listeners[event] || []).forEach(cb => cb(data));
  }

};
},{"./Functional":"Functional.js"}],"config.js":[function(require,module,exports) {
/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */
let dom = require('./dom');

const {
  safe
} = require('./Functional');

let events = require('./events');

let config = {};
const defaultConfig = {
  showTags: true,
  style: true,
  searchBtn: true,
  finder: 'Ctrl+Space',
  darkMode: false,
  standingsItv: 0,
  defStandings: 'Common',
  hideTestNumber: false,
  sidebarBox: true
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

function commit(id) {
  events.fire(id, config[id]);
  save();
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

  let modalProps = [prop('"Show Tags" button', 'toggle', 'showTags'), prop('Sidebar Action Box', 'toggle', 'sidebarBox'), prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']), prop('Custom Style', 'toggle', 'style'), prop('"Google It" button', 'toggle', 'searchBtn'), prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'), prop('Finder keyboard shortcut', 'text', 'finder'), prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber')];

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
      commit(id);
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
      commit(id);
    });
    return input;
  }

  function makeSelect({
    id,
    data
  }) {
    let select = dom.element("select", {
      id: id
    });
    data.map(option => dom.element("option", {
      value: option,
      selected: option == config[id]
    }, option)).forEach(opt => select.appendChild(opt));
    dom.on(select, 'change', () => {
      // Update property value when the number changes
      config[id] = select.value;
      commit(id);
    });
    return select;
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
      commit(id);
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
  }, modalProps)); // Create the button that shows the modal

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
    commit(key);
  },
  load,
  reset,
  save,
  // Events stuff
  listen: events.listen,
  fire: events.fire
};
},{"./dom":"dom.js","./Functional":"Functional.js","./events":"events.js"}],"show_tags.js":[function(require,module,exports) {
/**
 * @file Adds a "Show Tags" button to a problem's page
 */
let dom = require('./dom');

let config = require('./config');

function install() {
  if (!config.get('showTags') || !dom.$('.tag-box')) return; // If the user has already AC'd this problem, there's no need to hide the tags

  let hasAC = dom.$('.verdict-accepted');

  if (hasAC) {
    return;
  }

  let tbox = dom.$('.tag-box'); // individual tag

  let container = tbox.parentNode.parentNode; // actual container for all the tags

  container.style.display = 'none';

  function ShowTagsButton() {
    let btn = dom.element("button", {
      className: "caption showTagsBtn",
      style: "background: transparent; border: none; cursor: pointer;"
    }, "Show");
    dom.on(btn, 'click', uninstall);
    return btn;
  }

  container.parentNode.appendChild(dom.element(ShowTagsButton, null));
}

function uninstall() {
  let btn = dom.$('.showTagsBtn');

  if (btn) {
    btn.remove();
    let container = dom.$('.tag-box').parentNode.parentNode; // container for all the tags

    container.style.display = 'block';
  }
}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"problemset.js":[function(require,module,exports) {
/**
 * @file Hides tags on the /problemset page for the problems you didn't solve yet
 */
let dom = require('./dom');

let config = require('./config');

function changeNoACsDisplay(display) {
  // Get problems that don't have an AC
  let noACs = dom.$$('.problems tr:not(.accepted-problem)');

  for (let p of noACs) {
    // Hide them hackfully!
    let k = p.children[1].children[1] || {};
    k = k.style || {};
    k.display = display;
  }
}

function install() {
  if (config.get('showTags') && dom.$('.problems')) changeNoACsDisplay('none');
}

let uninstall = changeNoACsDisplay.bind(null, 'block');
module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"search_button.js":[function(require,module,exports) {
/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */
let dom = require('./dom');

let config = require('./config');

function install() {
  let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page

  if (!config.get('searchBtn') || !searchableRegex.test(location.pathname)) return;
  let problemName = dom.$('.problem-statement .title').innerText;
  problemName = problemName.split('.').slice(1).join('.');
  problemName += ' codeforces';
  const href = `https://google.com/search?q=${problemName.replace(/ /g, '+')}`;
  dom.$('.second-level-menu-list').appendChild(dom.element("li", null, dom.element("a", {
    href: href,
    target: "_blank",
    className: "searchBtn"
  }, " Google It ")));
}

function uninstall() {
  let btn = dom.$('.searchBtn');
  if (btn) btn.remove();
}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"show_tutorial.js":[function(require,module,exports) {
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


function install() {
  const problemRegex = /\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i;
  if (!problemRegex.test(location.pathname)) return;
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
}

function uninstall() {}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js"}],"navbar.js":[function(require,module,exports) {
/**
 * @file Provides drowdown menus for the main navbar, for better site navigation
 */
let dom = require('./dom');

function install() {
  // Get user handle
  const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
  let oldNav = dom.$('.main-menu-list');
  let newNav = dom.element("nav", {
    className: "cfpp-navbar"
  }); // Without this the dropdowns don't appear

  oldNav.parentNode.parentNode.style.overflow = 'visible';
  let keys = {
    "/": {},
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
  };
  let other = dom.element("div", {
    className: "cfpp-navbar-item"
  }, dom.element("a", {
    href: "#"
  }, "Other"));
  let ddOther = dom.element("div", {
    className: "cfpp-dropdown"
  }); // Iterate over all nav items and include them the new navbar

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

      if (dropdown.children.length) {
        newItem.appendChild(dropdown);
      }

      newNav.appendChild(newItem);
    } else {
      ddOther.appendChild(dom.element("a", {
        href: href
      }, link));
    }
  }

  other.appendChild(ddOther);
  newNav.appendChild(other);
  oldNav.replaceWith(newNav); // Change Codeforces logo to Codeforces++

  let logo = dom.$('#header img');

  if (logo && logo.getAttribute('src').endsWith('codeforces-logo-with-telegram.png')) {
    logo.setAttribute('src', 'https://github.com/LeoRiether/CodeforcesPP/raw/master/assets/codeforcespp.png');
  }
}

function uninstall() {}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js"}],"redirector.js":[function(require,module,exports) {
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

function install() {
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
}

function uninstall() {}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"update_standings.js":[function(require,module,exports) {
/**
 * @file Updates the standings page automatically after some given interval
 */
let dom = require('./dom');

let config = require('./config'); // FIXME: cf-predictor deltas dissapear after reloading standings


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

let intervalID = 0;

function install() {
  if (intervalID) uninstall();
  const standingsItv = +config.get('standingsItv');
  if (standingsItv <= 0 || !/\/standings/i.test(location.pathname)) return;
  intervalID = setInterval(update, standingsItv * 1000);
}

function uninstall() {
  clearInterval(intervalID);
  intervalID = 0;
}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"style.js":[function(require,module,exports) {
/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */
const dom = require("./dom");

let config = require('./config');

function applyCustomCSS() {
  let customCSS = ''; // Contenders for the new background:
  // background: url('https://resources.urionlinejudge.com.br/judge/img/5.0/background.jpg') top left #f5f5f5;
  // background: url("https://www.toptal.com/designers/subtlepatterns/patterns/embossed-diamond.png;
  // background: url("https://www.toptal.com/designers/subtlepatterns/patterns/morocco.png;
  // background: url("https://www.toptal.com/designers/subtlepatterns/patterns/stripes-light.png") #f5f5f5;
  // background: url("https://www.toptal.com/designers/subtlepatterns/patterns/dust_scratches.png") #f2f2f2;

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
        font-family: 'Libre Franklin', 'Roboto', sans-serif !important;
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

    /* Background */
    body {
        background: url("https://www.toptal.com/designers/subtlepatterns/patterns/dust_scratches.png") #f2f2f2;
    }
    #pageContent {
        background: white;
        padding: 1.5em !important;
        border-radius: 6px;
        box-shadow: 1px 1px 5px rgba(108, 108, 108, 0.17);
    }
    .problem-statement .header, div.ttypography {
        margin: 0 0 1em 0 !important;
    }

    ::selection {
        background: ${['#fbca4a', '#1e8dcc', '#b81f24'][~~(Math.random() * 3)]};
        color: white;
    }

    `, customCSS));
}

function applyCommonCSS() {
  document.body.appendChild(dom.element("style", null, `
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    body {
        margin: 0;
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
        color: #212121 !important;
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
        color: #E0E0E0 !important;
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
        font-family: 'Libre Franklin', 'Roboto', sans-serif;
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

    /* Sidebar Box */
    .boxRow a, .boxRow input {
        color: black !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
    }
    .boxRow form {
        margin: 0 !important;
    }
    `));
} // Applies only to custom css, which is configurable.


function install() {
  if (config.get('style')) {
    applyCustomCSS();
  }
}

function uninstall() {
  let custom = dom.$('.cfpp-style');
  if (custom) custom.remove();
}

module.exports = {
  common: applyCommonCSS,
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js"}],"verdict_test_number.js":[function(require,module,exports) {
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

const pluckVerdictOnNode = safe(n => {
  let c = n.childNodes[0];
  c.nodeValue = pluckVerdict(c.nodeValue);
}, '');
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

function install() {
  if (!config.get('hideTestNumber')) return;
  init();
  document.documentElement.classList.add('verdict-hide-number');
  dom.$$('.verdict-rejected,.verdict-waiting').forEach(pluckVerdictOnNode);
}

function uninstall() {
  if (!document.documentElement.classList.contains('verdict-hide-number')) return;
  document.documentElement.classList.remove('verdict-hide-number');
  dom.$$('.verdict-rejected,.verdict-waiting').forEach(e => {
    e.childNodes[0].nodeValue += ' on test ';
  });
}

function toggle() {
  config.set('hideTestNumber', !config.get('hideTestNumber'));
}

module.exports = {
  install,
  uninstall,
  toggle,
  init
};
},{"./dom":"dom.js","./config":"config.js","./Functional":"Functional.js"}],"finder.js":[function(require,module,exports) {
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
      key: "invoc",
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
  }

  const contestMatch = location.href.match(/\/contest\/(\d+)/i);
  const gymMatch = contestMatch || location.href.match(/\/gym\/(\d+)/i); // only executes if contest didn't match

  if (contestMatch) {
    // Is it a contest?
    const baseURL = location.href.substring(0, location.href.indexOf('contest'));
    data = data.concat(extensions.contest(baseURL, contestMatch[1], false));
  } else if (gymMatch) {
    // Is it a gym contest?
    const baseURL = location.href.substring(0, location.href.indexOf('gym'));
    data = data.concat(extensions.contest(baseURL, gymMatch[1], true));
  } else {
    // If it's neither, we have to put the problemset's Custom Invocation in the data
    data.push({
      key: "invoc",
      title: "Custom Invocation",
      href: "/problemset/customtest"
    });
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
},{"./dom":"dom.js","./config":"config.js","./Functional":"Functional.js"}],"shortcuts.js":[function(require,module,exports) {
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

let isFKey = key => key.length == 2 && key[0] == 'F' && key[1] >= '0' && key[1] <= '9';

function install() {
  let finderValue = config.get('finder').toLowerCase();
  shortcuts[finderValue] = finder.open;
  config.listen('finder', newValue => {
    delete shortcuts[finderValue];
    finderValue = newValue.toLowerCase();
    shortcuts[finderValue] = finder.open;
  });
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
}

function uninstall() {}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./finder":"finder.js","./config":"config.js","./verdict_test_number":"verdict_test_number.js"}],"sidebar.js":[function(require,module,exports) {
/**
 * @file Creates an action box on the sidebar (like URI has for submitting, ranking, ...)
 */
let dom = require('./dom');

let config = require('./config');

let {
  zipBy2,
  flatten,
  pipe,
  forEach,
  map
} = require('./Functional');

let addToBox = box => cols => {
  // Note: each col is *moved* into the box, there's no cloneNode here.
  // This is done to keep event listeners attached, but prevents uninstall() from ever existing
  let row = dom.element("div", {
    style: "display: flex;"
  });
  cols.map(col => dom.element("div", {
    style: "display: inline-block; flex: 1;"
  }, col || dom.element("span", null))).forEach(div => row.appendChild(div));
  box.appendChild(dom.element("tr", {
    className: "boxRow"
  }, " ", dom.element("td", null, row), " "));
};

function fixStyling(sidebar, forms, menu) {
  let pageContent = dom.$('#pageContent'); // Hide containers that will have it's links moved to the sidebar

  menu.style.display = 'none';
  forms.forEach(e => e.closest('.sidebox').style.display = 'none'); // Fix alignment issues

  sidebar.style.marginTop = 0;
  pageContent.style.paddingTop = 0;
} // Move the "favourite problem" star to after the contest name


function moveStar() {
  let star = dom.$('.toggle-favourite', sidebar),
      starRow = star && star.closest('tr');
  if (!star) return;
  star.style.height = "14px";
  dom.$('tr a', sidebar).appendChild(star);
  starRow.remove();
}

let installed = false;

function install() {
  if (!config.get('sidebarBox')) return; // TODO: try to remove this in production, or at least make a good whitelist

  if (!/\/(problem|gym)\//.test(location.href)) return;
  let sidebar = dom.$('#sidebar'),
      box = dom.$('.sidebox .rtable tbody', sidebar),
      forms = [].slice.call(dom.$$('.sidebox form', sidebar)),
      menu = dom.$('.second-level-menu'),
      menuLinks = dom.$$('.second-level-menu-list li>a', menu);
  if (!sidebar || !box || !menu) return;
  if (installed) return notifyPageNeedsRefresh(); // can't install twice

  installed = true;
  fixStyling(sidebar, forms, menu);
  let submitForm;

  if (forms.length && dom.$('.submit', forms[forms.length - 1])) {
    submitForm = forms.pop();
  }

  const addAllToBox = pipe(flatten, // zipBy2,
  map(e => [e]), forEach(addToBox(box)));
  addAllToBox([menuLinks, forms]);
  if (submitForm) addToBox(box)([submitForm]);
  moveStar();
}

function uninstall() {
  notifyPageNeedsRefresh();
}

function notifyPageNeedsRefresh() {
  Codeforces && Codeforces.showMessage("Please refresh the page to see changes");
}

module.exports = {
  install,
  uninstall
};
},{"./dom":"dom.js","./config":"config.js","./Functional":"Functional.js"}],"index.js":[function(require,module,exports) {
/**
 * @file Installs the modules
 */
let tries = 0;

(function run() {
  Codeforces = unsafeWindow.Codeforces;

  if (!Codeforces && tries < 15) {
    tries++;
    setTimeout(run, 200);
    return;
  }

  console.log("Codeforces++ is running!");

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
  // ParcelJS doesn't bundle correctly without all of the requires...


  let modules = [[require('./show_tags'), 'showTags'], [require('./problemset'), 'showTags'], [require('./search_button'), 'searchBtn'], [require('./show_tutorial'), ''], [require('./navbar'), ''], [require('./redirector'), ''], [require('./update_standings'), 'standingsItv'], [require('./style'), 'style'], [require('./verdict_test_number'), 'hideTestNumber'], [require('./shortcuts'), ''], [require('./sidebar'), 'sidebarBox']];

  function registerConfigCallback(m, id) {
    config.listen(id, value => {
      if (value === true || value === false) {
        value ? m.install() : m.uninstall();
      } else {
        m.uninstall();
        m.install(value);
      }
    });
  }

  modules.forEach(([m, configID]) => {
    m.install();

    if (configID) {
      registerConfigCallback(m, configID);
    }
  });

  require('./style').common();

  require('./finder').updateGroups(); // Exported to a global cfpp variable


  module.exports = {
    debug: {
      resetConfig: config.reset
    },
    version: config.get('version'),
    listen: config.listen,
    fire: config.fire
  };
})();
},{"./config":"config.js","./show_tags":"show_tags.js","./problemset":"problemset.js","./search_button":"search_button.js","./show_tutorial":"show_tutorial.js","./navbar":"navbar.js","./redirector":"redirector.js","./update_standings":"update_standings.js","./style":"style.js","./verdict_test_number":"verdict_test_number.js","./shortcuts":"shortcuts.js","./sidebar":"sidebar.js","./finder":"finder.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61248" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], "cfpp")