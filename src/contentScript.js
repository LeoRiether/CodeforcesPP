const b = typeof browser !== 'undefined' ? browser : chrome;
b.tabs.executeScript({
    file: 'index.js'
});