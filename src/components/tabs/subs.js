import { getSubscribedTopics, getSubscribedExperts } from "./api";
import "./subs.css";

export function renderSubsTab() {
    const $container = $("#tab-content").empty();

    const $content = $(`
        <div class="subs-container">
            <div class="subs-section topics-section">
                <h2>ПОДПИСКА НА ТЕМЫ</h2>
                <div class="topics-list loading">Загрузка...</div>
                <button class="subscribe-button">+ ПОДПИСАТЬСЯ НА ТЕМУ</button>
            </div>
            <div class="subs-section experts-section">
                <h2>ПОДПИСКА НА ЭКСПЕРТОВ</h2>
                <div class="experts-list loading">Загрузка...</div>
                <button class="subscribe-button">+ ПОДПИСАТЬСЯ НА ЭКСПЕРТА</button>
            </div>
        </div>
    `);

    $container.append($content);

    // Загрузка тем
    getSubscribedTopics((topics) => {
        const $topicsList = $content.find(".topics-list").empty().removeClass("loading");

        if (!topics.length) {
            $topicsList.text("Нет подписок на темы");
            return;
        }

        topics.forEach(topic => {
            const title = topic.title || topic; // на случай строкового массива
            $topicsList.append(`
                <div class="topic-tag">
                    ${title}
                    <button class="remove-topic">×</button>
                </div>
            `);
        });

        $(".remove-topic").on("click", function () {
            $(this).closest(".topic-tag").fadeOut(300, function () {
                $(this).remove();
            });
        });
    });

    // Загрузка экспертов
    getSubscribedExperts((experts) => {
        const $expertsList = $content.find(".experts-list").empty().removeClass("loading");

        if (!experts.length) {
            $expertsList.text("Нет подписок на экспертов");
            return;
        }

        experts.forEach(expert => {
            const firstName = expert.firstName || expert.name?.split(" ")[0] || "";
            const lastName = expert.lastName || expert.name?.split(" ")[1] || "";
            const avatar = expert.avatar || "";
            const topics = expert.topics || expert.tags || [];

            $expertsList.append(`
                <div class="expert-card">
                    <button class="remove-expert">×</button>
                    <div class="expert-name">${firstName}</div>
                    <div class="expert-name">${lastName}</div>
                    <img src="${avatar}" alt="${firstName} ${lastName}" class="expert-avatar">
                    <div class="expert-info">
                        <div class="expert-topics">
                            ${topics.map(({title, id}) => `<span class="topic-label">${title}</span>`).join("")}
                        </div>
                    </div>
                </div>
            `);
        });

        $(".remove-expert").on("click", function (e) {
            e.stopPropagation();
            $(this).closest(".expert-card").fadeOut(300, function () {
                $(this).remove();
            });
        });
    });

    // Кнопки подписки
    $content.find(".subscribe-button").on("click", function () {
        alert("Здесь будет форма подписки");
    });
}
