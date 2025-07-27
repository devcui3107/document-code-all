import { ModalCode } from "../m-modal/modal-code.js";

export class DataJsonSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.filteredItems = [];
    this.allItems = [];
    this.searchInitialized = false;
  }

  async connectedCallback() {
    await this.render();
    this.setupEventListeners();
  }

  async render() {
    // Giá trị mặc định
    let category = "Category";
    let parent = "Parent";
    let description = "Mô tả mặc định";
    let items = [];

    // Ưu tiên thứ tự: data-url > data > attributes
    const dataUrl = this.getAttribute("data-url");
    const dataString = this.getAttribute("data");

    if (dataUrl) {
      try {
        const response = await fetch(dataUrl);
        const jsonData = await response.json();

        category = jsonData.category || category;
        parent = jsonData.parent || parent;
        description = jsonData.description || description;
        items = jsonData.items || items;
        this.allItems = [...items]; // Lưu tất cả items để filter
      } catch (error) {
        console.error("Lỗi khi fetch JSON từ URL:", error);
      }
    } else if (dataString) {
      try {
        const jsonData = JSON.parse(dataString);

        category = jsonData.category || category;
        parent = jsonData.parent || parent;
        description = jsonData.description || description;
        items = jsonData.items || items;
        this.allItems = [...items]; // Lưu tất cả items để filter
      } catch (error) {
        console.error("Lỗi khi parse data JSON string:", error);
      }
    }

    this.shadowRoot.innerHTML = `
      <style>
        section {
          padding: 24px;
          border-radius: 16px;
          background: #fdfdfd;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          margin-bottom: 32px;
          border: 1px solid #e5e7eb;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .search-container {
          margin-bottom: 20px;
          position: relative;
        }

        .search-input {
          box-sizing: border-box;
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1.2rem;
          background: #ffffff;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(var(--primary-rbg), 0.5);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filter-tag {
          padding: 6px 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 1.2rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          background: #e5e7eb;
        }

        .filter-tag.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 0px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 1.2rem;
          color: #6b7280;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 1.1rem;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .category {
          font-size: 1.2rem;
          color: var(--primary);
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .parent {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          margin-top: 12px;
        }

        .description {
          font-size: 1.2rem;
          color: #4b5563;
          margin-top: 8px;
          line-height: 1.6;
        }

        .items-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 400px;
          overflow-y: auto;
        }

        .item-card {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: start;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          transition: box-shadow 0.2s ease-in-out;
        }

        .item-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .item-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .item-description {
          font-size: 1.2rem;
          color: #6b7280;
          line-height: 1.5;
          max-width: 500px;
        }

        .item-tags{
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .action-code {
          display: flex;
          gap: 12px;
        }

        .show-code {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-code__btn,
        .show-code-button,
        .copy-code-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: background 0.2s;
          width: 24px;
          height: 24px;
        }

        .show-code-button:hover,
        .copy-code-button:hover {
          background: rgba(var(--primary-rbg), 0.2);
        }

        .modal-code {
          display: none;
          margin-top: 10px;
          background: #0f172a;
          padding: 16px;
          border-radius: 8px;
          color: #f8fafc;
          overflow-x: auto;
        }

        .modal-code pre {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .tag {
          background: #f3f4f6;
          color: #374151;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 1rem;
        }
      </style>
      
      <section>
        <div class="section-header">
          <div class="category">${category}</div>
          <div class="parent">${parent}</div>
          <div class="description">${description}</div>
        </div>
        
        <!-- Search Bar -->
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="🔍 Tìm kiếm theo tên, mô tả hoặc tags..."
            id="searchInput"
          >
        </div>

        <!-- Filter Tags -->
        <div class="filter-tags" id="filterTags">
          ${this.getUniqueTags(items)
            .map(
              (tag) => `
            <span class="filter-tag" data-tag="${tag}">${tag}</span>
          `
            )
            .join("")}
        </div>

        <!-- Stats -->
        <div class="stats">
          <span>Hiển thị <strong id="currentCount">${
            items.length
          }</strong> / <strong>${this.allItems.length}</strong> items</span>
          <span id="activeFilters"></span>
        </div>

        <!-- Items Grid -->
        <div class="items-grid" id="itemsGrid">
          ${this.renderItems(items)}
        </div>
      </section>
    `;
  }

  // Lấy tất cả tags duy nhất từ items
  getUniqueTags(items) {
    const allTags = items.flatMap((item) => item.tags || []);
    return [...new Set(allTags)];
  }

  // Render items
  renderItems(items) {
    if (items.length === 0) {
      return `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <div>Không tìm thấy kết quả nào</div>
          <div style="font-size: 0.9rem; margin-top: 8px;">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</div>
        </div>
      `;
    }

    return items
      .map(
        (item) => `
      <div class="item-card">
        <div class="item-content">
          <div class="item-title">${item.title}</div>
          <div class="item-description">${item.description}</div>
          ${
            item.tags && item.tags.length > 0
              ? `
            <div class="item-tags">
              ${item.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}
            </div>
          `
              : ""
          }
        </div>

        <div class="action-code">
          <div class="show-code">
            <button class="show-code-button" data-item-id="${
              item.id || item.title
            }">
              <img src="../../assets/icons/eye.svg" alt="eye" />
            </button>

            <div class="copy-code">
              <button class="copy-code-button" data-code="${item.code}">
                <img src="../../assets/icons/copy.svg" alt="copy" />
              </button>
            </div>
          </div>
        </div>
        <modal-code code="${item.code}" id="modal-${
          item.id || item.title
        }"></modal-code>
      </div>
    `
      )
      .join("");
  }

  // Setup event listeners
  setupEventListeners() {
    // Chỉ setup search và filter tags một lần (không thay đổi khi filter)
    if (!this.searchInitialized) {
      const searchInput = this.shadowRoot.getElementById("searchInput");
      const filterTags = this.shadowRoot.querySelectorAll(".filter-tag");

      // Search functionality
      searchInput.addEventListener("input", (e) => {
        this.filterItems();
      });

      // Filter tags
      filterTags.forEach((tag) => {
        tag.addEventListener("click", (e) => {
          e.target.classList.toggle("active");
          this.filterItems();
        });
      });

      this.searchInitialized = true;
    }

    // Setup event listeners cho items (có thể thay đổi khi filter)
    this.setupItemEventListeners();
  }

  // Setup event listeners cho items
  setupItemEventListeners() {
    const showCodeButtons =
      this.shadowRoot.querySelectorAll(".show-code-button");
    const copyCodeButtons =
      this.shadowRoot.querySelectorAll(".copy-code-button");

    // Show code functionality
    showCodeButtons.forEach((button) => {
      // Remove existing listeners to prevent duplicates
      button.replaceWith(button.cloneNode(true));
    });

    // Re-select after cloning
    const newShowCodeButtons =
      this.shadowRoot.querySelectorAll(".show-code-button");
    newShowCodeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const itemId = e.target.closest(".show-code-button").dataset.itemId;
        const modal = this.shadowRoot.querySelector(
          `modal-code[id="modal-${itemId}"]`
        );
        if (modal && typeof modal.show === "function") {
          modal.show();
        }
      });
    });

    // Copy code functionality
    copyCodeButtons.forEach((button) => {
      // Remove existing listeners to prevent duplicates
      button.replaceWith(button.cloneNode(true));
    });

    // Re-select after cloning
    const newCopyCodeButtons =
      this.shadowRoot.querySelectorAll(".copy-code-button");
    newCopyCodeButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const code = e.target.closest(".copy-code-button").dataset.code;
        try {
          await navigator.clipboard.writeText(code);
          this.showToast("Code đã được copy!");
        } catch (error) {
          console.error("Copy failed:", error);
        }
      });
    });
  }

  // Filter items based on search and tags
  filterItems() {
    const searchTerm = this.shadowRoot
      .getElementById("searchInput")
      .value.toLowerCase();
    const activeTags = Array.from(
      this.shadowRoot.querySelectorAll(".filter-tag.active")
    ).map((tag) => tag.dataset.tag);

    let filtered = this.allItems.filter((item) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        (item.tags &&
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));

      // Tag filter
      const matchesTags =
        activeTags.length === 0 ||
        (item.tags && activeTags.some((tag) => item.tags.includes(tag)));

      return matchesSearch && matchesTags;
    });

    this.filteredItems = filtered;
    this.updateDisplay();
  }

  // Update display
  updateDisplay() {
    const itemsGrid = this.shadowRoot.getElementById("itemsGrid");
    const currentCount = this.shadowRoot.getElementById("currentCount");
    const activeFilters = this.shadowRoot.getElementById("activeFilters");

    itemsGrid.innerHTML = this.renderItems(this.filteredItems);
    currentCount.textContent = this.filteredItems.length;

    // Update active filters display
    const activeTags = Array.from(
      this.shadowRoot.querySelectorAll(".filter-tag.active")
    ).map((tag) => tag.dataset.tag);

    if (activeTags.length > 0) {
      activeFilters.textContent = `Bộ lọc: ${activeTags.join(", ")}`;
    } else {
      activeFilters.textContent = "";
    }

    // Chỉ setup event listeners cho items mới (không phải search/filter)
    this.setupItemEventListeners();
  }

  // Show toast notification
  showToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-size: 0.9rem;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

customElements.define("data-json-section", DataJsonSection);
