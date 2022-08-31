import { html, css, LitElement } from 'lit';

customElements.define(
  'lit-component',
  class extends LitElement {
    static properties = {
      name: { type: String },
      data: { type: Object },
    };

    async getData() {
      this.data = await (
        await fetch('https://pokeapi.co/api/v2/type/ghost/?limit=5')
      ).json();
    }

    connectedCallback() {
      super.connectedCallback();
      this.getData();
    }

    render() {
      console.log(this.data);
      return this.data ? html`<p>Loaded</p>` : html`<p>Loading…</p>`;
    }
  }
);
