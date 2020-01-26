browser.runtime.onMessage.addListener(data => {
    console.log('Got message', data);

    if (data.to !== 'bg') return false;

    let resultPromise = false;

    // { type: 'get storage', key: 'cfpp' }
    if (data.type === 'get storage') {
        resultPromise = browser.storage.sync.get([data.key]);
    }

    // { type: 'set storage', key: 'cfpp', value: 'some string' }
    if (data.type === 'set storage') {
        resultPromise = browser.storage.sync.set({ [data.key]: data.value });
    }

    if (resultPromise === false) return false;

    return resultPromise.then(r => ({
        type: 'bg result',
        id: data.id,
        result: r
    }));
});