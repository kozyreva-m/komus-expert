import { getProfile, getPosts } from "./api";

export function renderProfileTab() {
    const container = $("#tab-content").empty();

    getProfile((profile) => {
        const profileHtml = `
      <div class="profile-layout">
        <div class="profile-card">
          <div class="profile-title">${profile.blog.title}</div>
          <div class="profile-avatar-wrapper">
            <img src="${profile.avatar}" alt="${profile.name}" class="profile-avatar" />
          </div>
          <div class="profile-name">${profile.name}</div>
          <div class="profile-age">${profile.age} года</div>
          <div class="profile-position">${profile.position}</div>
          <div class="profile-badges">
          ${profile.badges
                .map(
                    (badge) => `
                  <div class="profile-badge">
                  ${badge.icon
                            ? `<img src="${badge.icon}" alt="${badge.label}" class="profile-badge-icon" />`
                            : ""
                        }
                  <div class="profile-badge-label">${badge.label}</div>
                  </div>
              `
                )
                .join("")}
          </div>
          <a href="/expert_app?page=profile-form&tab=personal" class="profile-edit-btn">Редактировать профиль</a>


          <div class="profile-tags">
            ${profile.tags.map((tag) => `<span class="profile-tag">${tag}</span>`).join("")}
          </div>

          <div class="profile-about">
            <div class="profile-about-title">О себе</div>
            <p>${profile.about}</p>
          </div>
        </div>
        <div id="post-feed" class="profile-feed"></div>
      </div>
    `;

        container.append(profileHtml);

        getPosts((posts) => {
            const feed = $("#post-feed");
            posts.forEach((post) => {
                const postHtml = `
          <div class="post-card">
            <div class="post-header">
              <strong>${post.blog.title}</strong>
              <span class="post-time">${post.time}</span>
            </div>
            <div class="post-tags">${post.tags.map(t => `<span class="post-tag">${t}</span>`).join("")}</div>
            <h5 class="post-title">${post.title}</h5>
            <p class="post-text">${post.content}</p>
            ${post.image ? `<img src="${post.image}" class="post-image" />` : ""}
            <div class="post-footer">❤️ ${post.likes} · 💬 ${post.comments}</div>
          </div>
        `;
                feed.append(postHtml);
            });
        });
    });
}
