browser.runtime.onMessage.addListener(data => {
    console.log('Got message', data);

    if (data.to !== 'bg') return false;

    // does nothing!
    // for now
});