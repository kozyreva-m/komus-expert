import { getSubscribedTags, getSubscribedExperts } from "./api";

export function renderSubsTab() {
    const container = $("#tab-content").empty();

    getSubscribedTags((tags) => {
        const tagsHtml = `
      <div class="subs-section">
        <h2 class="subs-title">Подписка на темы</h2>
        <div class="subs-tags">
          ${tags
                .map(
                    (tag) => `
            <div class="tag-item">
              ${tag}
              <button class="tag-remove">×</button>
            </div>
          `
                )
                .join("")}
        </div>
        <button class="subs-add-btn">+ Подписаться на тему</button>
      </div>
    `;

        container.append(tagsHtml);

        getSubscribedExperts((experts) => {
            const expertsHtml = `
        <div class="subs-section">
          <h2 class="subs-title">Подписка на экспертов</h2>
          <div class="expert-list">
            ${experts
                    .map(
                        (exp) => `
              <div class="expert-card">
                <button class="expert-remove">×</button>
                <div class="expert-avatar" style="background-image: url('${exp.avatar}')"></div>
                <div class="expert-name">${exp.name}</div>
                <div class="expert-tags">
                  ${exp.tags
                                .map((t) => `<span class="expert-tag">${t}</span>`)
                                .join("")}
                </div>
              </div>
            `
                    )
                    .join("")}
          </div>
          <button class="subs-add-btn">+ Подписаться на эксперта</button>
        </div>
      `;

            container.append(expertsHtml);
        });
    });
}
