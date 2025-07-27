export class InfoSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    this.shadowRoot.innerHTML = `
      <style>
        .info-section {
          margin-bottom: 20px;
        }

        .info-section h1 {
          font-size: 2.6rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
      </style>
      <div class="info-section">
        <h1>${this.getAttribute("title")}</h1>
        <p>${this.getAttribute("description")}</p>
      </div>
    `;
  }
}

customElements.define("info-section", InfoSection);
