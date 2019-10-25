/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */

const dom = require("./dom");

const fontFamily = 'Libre Franklin'; 

function applyCustomCSS() {
    let customCSS = '';

    document.body.appendChild(<style className="cfpp-style">{`
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

    `}
    {customCSS}
    </style>);
}

function applyCommonCSS() {
    document.body.appendChild(<style>{`
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
    html.cfpp-dark-mode .MathJax img, html.cfpp-dark-mode .tex-formula {
        filter: none;
    }
    #header img { filter: none; }
    html.cfpp-dark-mode {
        background: black;
    }

    `}</style>);
}

module.exports  = {
    custom: applyCustomCSS,
    common: applyCommonCSS
};