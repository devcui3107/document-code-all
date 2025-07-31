import { getAssetPath, fixHtmlPaths } from "../../utils/path-helper.js";

export class NavbarComponent extends HTMLElement {
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
        getAssetPath("/js/components/m-navbar/m-navbar.css")
      );
      const cssText = await cssResponse.text();

      const htmlResponse = await fetch(
        getAssetPath("/templates/m-navbar.html")
      );
      const htmlText = await htmlResponse.text();

      this.shadowRoot.innerHTML = `
        <style>${cssText}</style>
        ${fixHtmlPaths(htmlText)}
      `;

      // Set active nav item based on current path
      this.setActiveNavItem();
    } catch (error) {
      console.error("Error loading m-navbar component:", error);
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

  setActiveNavItem() {
    // Get current pathname
    const currentPath = window.location.pathname;

    // Remove .html extension and get the page name
    const pageName =
      currentPath.split("/").pop()?.replace(".html", "") || "home";

    // If we're at root or index, set as home
    const activePage =
      pageName === "" || pageName === "index" ? "home" : pageName;

    // Remove active class from all nav items
    const navItems = this.shadowRoot.querySelectorAll(".nav__item");
    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to matching nav item
    const activeNavItem = this.shadowRoot.querySelector(
      `[data-page="${activePage}"]`
    );
    if (activeNavItem) {
      activeNavItem.closest(".nav__item").classList.add("active");
    } else {
      // Fallback to home if no match found
      const homeItem = this.shadowRoot.querySelector('[data-page="home"]');
      if (homeItem) {
        homeItem.closest(".nav__item").classList.add("active");
      }
    }
  }
}
customElements.define("m-navbar", NavbarComponent);
