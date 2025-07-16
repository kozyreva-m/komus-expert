import { getFollowers } from "./api";
import "./followers.css";

export function renderFollowersTab() {
    const $container = $("#tab-content").empty();

    $container.append(`
        <div class="followers-container">
            <div class="followers-header">
                <button class="invite-button">+ ПРИГЛАСИТЬ ПОДПИСЧИКА</button>
            </div>
            <div class="followers-letters">Загрузка...</div>
        </div>
    `);

    getFollowers((followers) => {
        const $followersContainer = $(".followers-letters").empty();

        if (!followers.length) {
            $followersContainer.append(`<div class="empty-message">У вас пока нет подписчиков</div>`);
            return;
        }

        const grouped = groupFollowersByLetter(followers);
        grouped.forEach(([letter, group]) => {
            const sectionHTML = `
                <div class="letter-section">
                    <div class="letter-title">${letter}</div>
                    <div class="followers-grid">
                        ${group.map(f => `
                            <div class="follower-card" data-id="${f.id}">
                                <img src="${f.avatar}" alt="${f.name}" class="follower-avatar">
                                <div class="follower-info">
                                    <div class="follower-firstname">${f.firstName || ""}</div>
                                    <div class="follower-lastname">${f.lastName || ""}</div>
                                </div>
                                <button class="remove-follower">×</button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
            $followersContainer.append(sectionHTML);
        });

        $(".remove-follower").on("click", function (e) {
            e.stopPropagation();
            const $card = $(this).closest(".follower-card");
            const id = $card.data("id");
            console.log(`DELETE ${API_HOST}/komus_expert_app/api/controller.html?action=remove_follower&id=${id}`);
            $card.fadeOut(300, function () {
                $(this).remove();
                $(".letter-section").each(function () {
                    if ($(this).find(".follower-card:visible").length === 0) {
                        $(this).remove();
                    }
                });
            });
        });

        $(".invite-button").on("click", function () {
            alert("Здесь будет форма приглашения подписчика");
        });

        $(".follower-card").on("click", function () {
            const id = $(this).data("id");
            console.log(`GET ${API_HOST}/komus_expert_app/api/controller.html?action=get_follower_profile&id=${id}`);
        });
    });
}

// Группировка по первой букве фамилии
function groupFollowersByLetter(followers) {
    const groups = {};
    followers.forEach(f => {
        const lastName = f.lastName || "";
        const letter = lastName.charAt(0).toUpperCase();
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(f);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
}
