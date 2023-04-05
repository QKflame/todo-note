import {createRoot} from 'react-dom/client';

function render() {
    const root = createRoot(document.getElementById('root'));
    root.render(<h2>Hello Orange TODO</h2>)
}

render();