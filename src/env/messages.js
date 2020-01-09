export function post(type, data) {
    window.postMessage({ type, data }, '*');
}