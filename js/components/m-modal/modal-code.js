export class ModalCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    const code = this.getAttribute("code");

    const html = `
      <style>
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }

        .modal-code {
          background: #1e293b;
          border-radius: 12px;
          max-width: 90%;
          max-height: 90%;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-code__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #334155;
          background: #0f172a;
        }

        .modal-code__title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .modal-code__close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .modal-code__close:hover {
          color: #f1f5f9;
          background: #334155;
        }

        .modal-code__content {
          padding: 20px;
          overflow-x: auto;
          max-height: 60vh;
        }

        .modal-code__content pre {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.6;
          color: #f1f5f9;
        }

        .modal-code__content code {
          font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
      </style>
      <div class="modal-code">
        <div class="modal-code__header">
          <h2 class="modal-code__title">Code Preview</h2>
          <button class="modal-code__close" id="closeModal">&times;</button>
        </div>
        <div class="modal-code__content">
          <pre><code class="language-dart">${code}</code></pre>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = html;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.getElementById("closeModal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
      });
    }

    // Close modal when clicking outside
    this.addEventListener("click", (e) => {
      if (e.target === this) {
        this.hide();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible()) {
        this.hide();
      }
    });
  }

  show() {
    this.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  hide() {
    this.style.display = "none";
    document.body.style.overflow = ""; // Restore background scroll
  }

  isVisible() {
    return this.style.display === "flex";
  }
}

customElements.define("modal-code", ModalCode);
