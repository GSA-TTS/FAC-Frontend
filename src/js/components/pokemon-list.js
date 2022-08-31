import { html, LitElement } from 'lit';

customElements.define(
  'pokemon-list',
  class extends LitElement {
    static properties = {
      str: { type: String },
      pokemon: { type: Object },
      foo: { type: Object },
    };

    render() {
      return html`
        <ul>
          ${this.pokemon.pokemon.map((p) => html`<li>${p.pokemon.name}</li>`)}
        </ul>
      `;
    }
  }
);
