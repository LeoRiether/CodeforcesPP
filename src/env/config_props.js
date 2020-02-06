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
];