export class FrontendContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    try {
      const cssResponse = await fetch(
        "../../js/components/m-frontend/m-frontend.css"
      );
      const cssText = await cssResponse.text();

      const htmlResponse = await fetch("../../templates/pages/m-frontend.html");
      const htmlText = await htmlResponse.text();

      this.shadowRoot.innerHTML = `
        <style>${cssText}</style>
        ${htmlText}
      `;
    } catch (error) {
      console.error("Error loading m-frontend component:", error);
      // Fallback content
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background: #fff;
            border-bottom: 1px solid #e8ebed;
            padding: 10px;
          }
        </style>
        <div>Navbar Component Error</div>
      `;
    }
  }
}
customElements.define("m-frontend", FrontendContent);
