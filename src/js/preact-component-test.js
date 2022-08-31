import { render } from 'preact';
import { html } from 'htm/preact';

function App(props) {
  return html`<p>Hello, ${props.name}</p>`;
}

export default function (el) {
  render(html`<${App} name="from Preact" />`, el);
}
