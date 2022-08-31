import { html, LitElement } from 'lit';

customElements.define(
  'pokemon-type-select',
  class extends LitElement {
    static properties = {
      pokemonTypes: { type: Array },
    };

    connectedCallback() {
      super.connectedCallback();
      this.pokemonTypes = [
        'Dark',
        'Electric',
        'Fire',
        'Flying',
        'Ghost',
        'Grass',
        'Ground',
        'Ice',
        'Poison',
        'Rock',
        'Steel',
      ];
    }

    handleChange(e) {
      let selectEvent = new CustomEvent('pokemon-type-selected', {
        detail: { message: e.target.value },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(selectEvent);
    }

    render() {
      return html`
        <select name="pokemon-type" @change=${this.handleChange}>
          ${this.pokemonTypes.map(
            (t) => html`<option value=${t.toLowerCase()}>${t}</option>`
          )}
        </select>
      `;
    }
  }
);
