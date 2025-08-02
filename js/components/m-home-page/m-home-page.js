export class HomePageContent extends HTMLElement {
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
        "../../js/components/m-home-page/m-home-page.css"
      );
      const cssText = await cssResponse.text();

      const htmlResponse = await fetch(
        "../../templates/pages/m-home-page.html"
      );
      const htmlText = await htmlResponse.text();

      this.shadowRoot.innerHTML = `
        <style>${cssText}</style>
        ${htmlText}
      `;
    } catch (error) {
      console.error("Error loading m-home-page component:", error);
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
customElements.define("m-home-page", HomePageContent);
