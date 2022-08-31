import { html, css, LitElement } from 'lit';
import './pokemon-list';
import './pokemon-type-select';

customElements.define(
  'lit-component',
  class extends LitElement {
    static properties = {
      pokemonType: { type: String },
      name: { type: String },
      data: { type: Object },
    };

    constructor() {
      super();
      this.pokemonType = 'ghost';
    }

    async getData() {
      this.data = await (
        await fetch(`https://pokeapi.co/api/v2/type/${this.pokemonType}`)
      ).json();
    }

    connectedCallback() {
      super.connectedCallback();
      this.getData();
    }

    firstUpdated() {
      const selectList = this.renderRoot.querySelector('pokemon-type-select');
      selectList.addEventListener('pokemon-type-selected', (e) => {
        this.pokemonType = e.detail.message;
        this.getData();
      });
    }

    render() {
      return html`<pokemon-type-select></pokemon-type-select> ${this.data
          ? html`<pokemon-list .pokemon=${this.data}></pokemon-list>`
          : html`<p>Loading…</p>`}`;
    }
  }
);
