let dom = require('./dom');

module.exports = function () {
    let tbox = dom.$('.tag-box');
    let container = tbox.parentNode.parentNode;
    container.style.display = 'none';
    container.classList.add('tag-container');

    let hasAC = document.querySelector('.verdict-accepted');
    if (hasAC) {
        container.style.display = 'block';
        return;
    }

    let btn = document.createElement('button');
    btn.innerText = "Show";
    Object.assign(btn.style, {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
    });
    btn.classList.add('caption');
    btn.addEventListener('click', _ => {
        btn.remove();
        container.style.display = 'block';
    });
    
    container.parentNode.appendChild(btn);
}