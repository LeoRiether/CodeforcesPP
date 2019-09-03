/**
 * @file Injects some CSS when `require`d
 */

const dom = require("./dom");

let fontFamily = 'Libre Franklin';
let customCSS = '';

// TODO: Check if having the style on github and appendind a <link> isn't better. Probably is
let style = document.createElement('style');
style.className = 'cfpp-style';

// TODO: group border:none 

let css = `
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

/* Remove weird person icon on the problemset page */
.problems td:last-child img, .contests-table td:last-child img {
    display: none;
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
.nav-links a {
    text-decoration: none; /* TODO: remove this if global a{text-decoration:none;} is kept */
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
}

${customCSS}
`;

style.append(css);
document.body.appendChild(style);