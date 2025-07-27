export class CardParent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "";

    this.shadowRoot.innerHTML = `
      
      <style>
        /* Reset */
        @import url("../../../css/base/reset.css");

        .card-parent {
          padding: 16px;
          border-radius: 8px;
          background-color: #ccc;
        }
        .card-parent__title {
          font-size: 1.6rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        input {
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      </style>
      <div class="card-parent">
        <h2 class="card-parent__title">${title}</h2>
        <input type="search" />
      </div>
    `;
  }
}

customElements.define("card-parent", CardParent);
