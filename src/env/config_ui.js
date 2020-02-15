import dom from '../helpers/dom';

export function prop(title, type, id, data) {
    return { title, type, id, data };
}

export let configProps = [
    prop('"Show Tags" button', 'toggle', 'showTags'),
    prop('Sidebar Action Box', 'toggle', 'sidebarBox'),
    prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']),
    prop('Custom Style', 'toggle', 'style'),
    prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'),
    prop('Finder keyboard shortcut', 'text', 'finder'),
    prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber'),
    prop('Dark Theme', 'toggle', 'darkTheme'),
    ...(process.env.NODE_ENV == 'development' ? [prop('Version', 'text', 'version')] : [])
];

const Toggle = ({config, id, pushChange, pullChange}) => {
    let checkbox = <>
        <input id={id}
               checked={config[id]}
               type="checkbox"
               onChange={e => pushChange(id, e.target.checked)} />
        <span/>
    </>;
    pullChange(id, value => checkbox.checked = value);
    return checkbox;
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
    const table = {
        toggle: () => <Toggle config={config} id={id} pushChange={pushChange} pullChange={pullChange} />,
        number: () => <Number config={config} id={id} pushChange={pushChange} pullChange={pullChange} />,
        select: () => <Select config={config} id={id} pushChange={pushChange} pullChange={pullChange} data={data}/>,
        text:   () => <Text   config={config} id={id} pushChange={pushChange} pullChange={pullChange} />
    };

    let el = table[type]();

    return (
        <label className={type} for={id}>
            {title}
            {el}
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
export function Config({config, pushChange, pullChange}) {
    pushChange = pushChange || function(){};
    pullChange = pullChange || function(){};
    let inner = configProps.map(p => <Prop {...p} config={config} pushChange={pushChange} pullChange={pullChange}/>);
    return inner;
}