import { getAssetPath, fixHtmlPaths } from "../../utils/path-helper.js";

export class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const profile = this.shadowRoot.querySelector(".profile");
    const dropdown = this.shadowRoot.querySelector(".profile__dropdown");

    if (profile && dropdown) {
      let timeoutId;

      // Show dropdown on mouse enter
      profile.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
        dropdown.style.display = "block";
      });

      // Hide dropdown on mouse leave with delay
      profile.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
          dropdown.style.display = "none";
        }, 150); // 150ms delay to allow moving to dropdown
      });

      // Keep dropdown visible when hovering over it
      dropdown.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
      });

      dropdown.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
          dropdown.style.display = "none";
        }, 150);
      });
    }
  }

  async render() {
    try {
      // Load CSS
      const cssResponse = await fetch(
        getAssetPath("/js/components/m-header/m-header.css")
      );
      const cssText = await cssResponse.text();

      // Load HTML template
      const htmlResponse = await fetch(
        getAssetPath("/templates/m-header.html")
      );
      const htmlText = await htmlResponse.text();

      this.shadowRoot.innerHTML = `
        <style>${cssText}</style>
        ${fixHtmlPaths(htmlText)}
      `;
    } catch (error) {
      console.error("Error loading m-header component:", error);
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
        <div>Header Component Error</div>
      `;
    }
  }
}

customElements.define("m-header", HeaderComponent);
