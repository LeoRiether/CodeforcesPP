let b = (typeof browser !== 'undefined' ? browser : chrome);
let script = document.createElement('script');
script.src = b.runtime.getURL('index.js');
script.id = 'codeforces++';
(document.body || document.head || document.documentElement).appendChild(script);