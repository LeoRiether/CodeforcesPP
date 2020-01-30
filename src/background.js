import { onMessage, storage } from './min-browser-polyfill';

onMessage(data => {
    console.log('Got message', data);

    if (data.to !== 'bg') return false;

    // return Promise.resolve({
    //     type: 'bg result',
    //     id: data.id,
    //     result: JSON.stringify({
    //         cfpp: {
    //             darkTheme: true
    //         }
    //     })
    // });

    let resultPromise = false;

    // { type: 'get storage', key: 'cfpp' }
    if (data.type === 'get storage') {
        resultPromise = storage.get([data.key]);
    }

    // { type: 'set storage', key: 'cfpp', value: 'some string' }
    if (data.type === 'set storage') {
        resultPromise = storage.set({ [data.key]: data.value });
    }

    if (resultPromise === false) return false;

    return resultPromise.then(r => ({
        type: 'bg result',
        id: data.id,
        result: r
    })).catch(console.error);
});