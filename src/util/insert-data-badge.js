function insertUnivariateBadge(containerEl, cardId, title) {
  if (!containerEl || !cardId || !title) return;

  const card = document.createElement("div");
  card.id = cardId;
  card.className = "card data-badge univariate-badge mt-3 col-md-6 shadow-sm";

  card.innerHTML = `
            <div class="card-body">
                <h5 class="badge-header card-title">Title</h5>
                <div class="btn-group w-100" role="group" aria-label="Chart Type Selection">
                    <button class="btn btn-primary active">Histogram</button>
                    <button class="btn btn-primary">Box Plot</button>
                    <button class="btn btn-primary">Measures of Center</button>
                    <button class="btn btn-primary">Measures of Spread</button>
                </div>
                <canvas id="${cardId}Canvas" class="badge-content w-100"></canvas>
                <span id="${cardId}Text" class="badge-content card-text d-none">Loading...</span>
           </div>`;

  containerEl.appendChild(card);
}