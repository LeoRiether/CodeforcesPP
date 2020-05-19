import dom from '../helpers/dom';
import { formatShortcut, debounce, nop } from '../helpers/Functional';

export function prop(title, type, id, data) {
    return { title, type, id, data };
}

export let configProps = [
    prop('"Show Tags" button', 'toggle', 'showTags'),
    prop('Sidebar Action Box', 'toggle', 'sidebarBox'),
    prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']),
    prop('Custom Style', 'toggle', 'style'),
    prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'),
    prop('Join div1 and div2 standings', 'toggle', 'standingsTwin'),
    prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber'),
    prop('Dark Theme', 'toggle', 'darkTheme'),
    ...(process.env.NODE_ENV == 'development' ? [prop('Version', 'text', 'version')] : [])
];

export function scProp(title, id) {
    return { title, id };
}

export let shortcutProps = [
    scProp('Submit', 'submit'),
    scProp('Dark Theme', 'darkTheme'),
    scProp('Open Finder', 'finder'),
    scProp('Scroll to Content', 'scrollToContent'),
    scProp('Hide Test Number', 'hideTestNumber'),
];

const Toggle = ({config, id, pushChange, pullChange}) => {
    let checkbox = (
        <input id={id}
               checked={config[id]}
               type="checkbox"
               onChange={e => pushChange(id, e.target.checked)} />
    );
    pullChange(id, value => checkbox.checked = value);
    return (<>
        {checkbox}
        <span />
    </>);
};

const Number = ({config, id, pushChange}) =>
    <input id={id}
           value={config[id] || 0}
           type="number"
           onInput={e => pushChange(id, +e.target.value)}/>;

const Select = ({config, id, data, pushChange}) =>
    <select id={id}
            onChange={e => pushChange(id, e.target.value)}>
        {
            data.map(option =>
                <option value={option}
                        selected={option == config[id]}>
                    {option}
                </option>)
        }
    </select>;

const Text = ({config, id, pushChange}) =>
    <input id={id}
           value={config[id]}
           type="text"
           onChange={e => pushChange(id, e.target.value)}/>;

function Prop({ title, type, id, data, config, pushChange, pullChange }) {
    let props = { config, id, pushChange, pullChange };
    const table = {
        toggle: () => <Toggle {...props} />,
        number: () => <Number {...props} />,
        select: () => <Select {...props} data={data}/>,
        text:   () => <Text   {...props} />
    };

    let el = table[type]();

    return (
        <label className={type} for={id}>
            {title}
            {el}
        </label>
    );
}

function Shortcut({ title, id, shortcuts, pushChange }) {
    const pushDebounced = debounce(pushChange, 250);
    function handleKeyDown(e) {
        e.preventDefault();

        let sc = formatShortcut(e);
        if (sc != 'Escape') { // would conflict with other CF++ default shortcuts and prevent exiting the popup/config modal
            e.target.value = sc;
            pushDebounced(id, sc);
        }
    }

    return (
        <label className="shortcut" for={`sc-${id}`}>
            {title}
            <input id={`sc-${id}`}
               value={shortcuts[id]}
               type="text"
               onKeyDown={handleKeyDown} />
        </label>
    );
}

/**
 * Creates the UI's core, toggles, inputs, labels, and everything
 * @param {Object} config JSON object with the user config e.g. `config = { darkTheme: true, showTags: false }`
 * @param {Function(id, value)} pushChange will be called when the `id` config changes in the UI
 * @param {Function(id, callback)} pullChange registers an event listener/callback for any `id` config changes
 * @example <Config pushChange={(id, value) => console.log("Toggle was set to", value)}
 *                  pullChange={(id, cb) => events.listen(id, cb)}/>
 */
export function Config({config, pushChange=nop, pullChange=nop}) {
    return configProps.map(p =>
        <Prop {...p} config={config} pushChange={pushChange} pullChange={pullChange}/>);
}

export function Shortcuts({shortcuts, pushChange=nop}) {
    return shortcutProps.map(p =>
        <Shortcut {...p} shortcuts={shortcuts} pushChange={pushChange}/>)
}