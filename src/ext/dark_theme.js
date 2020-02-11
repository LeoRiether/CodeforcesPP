import * as config from '../env/config';

export function install() {
    if (config.get('darkTheme'))
        document.documentElement.classList.add('cfpp-dark-mode');
}

export function uninstall() {
    document.documentElement.classList.remove('cfpp-dark-mode');
}