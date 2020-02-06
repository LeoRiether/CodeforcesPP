import dom from './helpers/dom';
import { prop, configProps } from './env/config_props';

function changed(id, value) {
    console.log(`#${id} changed to ${value}. Notifying clients (not really, not implemented)`);
}

let config = {}; // meh

const Toggle = ({id}) =>
    <input id={id}
            checked={config[id]}
            type="checkbox"
            onChange={e => changed(id, e.target.checked)} />;

const Number = ({id}) =>
    <input id={id}
           value={config[id] || 0}
           type="number"
           onInput={e => changed(id, +e.target.value)}/>;

const Select = ({id, data}) =>
    <select id={id}
            onChange={e => changed(id, e.target.value)}>
        {
            data.map(option =>
                <option value={option}
                        selected={option == config[id]}>
                    {option}
                </option>)
        }
    </select>;

const Text = ({id}) =>
    <input id={id}
           value={config[id]}
           type="text"
           onChange={e => changed(id, e.target.value)}/>;

function Prop({ title, type, id, data }) {
    const table = {
        toggle: () => <Toggle id={id}/>,
        number: () => <Number id={id}/>,
        select: () => <Select id={id} data={data}/>,
        text:   () => <Text   id={id}/>
    };

    let el = table[type]();

    if (type == 'toggle') {
        // Checkbox comes before toggle
        return <div>
            {el}
            <label for={id}>{title}</label>
        </div>;
    }
    return <div>
        <label for={id}>{title}</label>
        {el}
    </div>;
}

function Config() {
    if (process.env.NODE_ENV == 'development') {
        configProps.push(
            prop('Version', 'text', 'version')
        );
    }

    let inner = configProps.map(p => <Prop {...p}/>);

    return <div>
        {inner}
    </div>;
}

document.body.appendChild(<Config />);