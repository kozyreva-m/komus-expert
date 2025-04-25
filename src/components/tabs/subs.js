import { API_HOST } from "../../js/api";
import "./subs.css";

// Моковые данные для тем
const TOPICS = ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"];

// Моковые данные для экспертов
const EXPERTS = [
    {
        id: 1,
        firstName: "Анжелика",
        lastName: "Варламова",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        topics: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
    },
    {
        id: 2,
        firstName: "Дмитрий",
        lastName: "Богачев",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        topics: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
    },
    {
        id: 3,
        firstName: "Игорь",
        lastName: "Васильев",
        avatar: "https://randomuser.me/api/portraits/men/31.jpg",
        topics: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
    },
    {
        id: 4,
        firstName: "Виталий",
        lastName: "Арсеньев",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        topics: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
    }
];

export function renderSubsTab() {
    const $container = $("#tab-content").empty();
    
    // Добавляем базовую структуру
    $container.append(`
        <div class="subs-container">
            <!-- Подписка на темы -->
            <div class="subs-section">
                <h2>ПОДПИСКА НА ТЕМЫ</h2>
                <div class="topics-list">
                    ${TOPICS.map(topic => `
                        <div class="topic-tag">
                            ${topic}
                            <button class="remove-topic">×</button>
                        </div>
                    `).join('')}
                </div>
                <button class="subscribe-button">+ ПОДПИСАТЬСЯ НА ТЕМУ</button>
            </div>

            <!-- Подписка на экспертов -->
            <div class="subs-section">
                <h2>ПОДПИСКА НА ЭКСПЕРТОВ</h2>
                <div class="experts-list">
                    ${EXPERTS.map(expert => `
                        <div class="expert-card">
                            <button class="remove-expert">×</button>
                            <div class="expert-name">${expert.firstName}</div>
                            <div class="expert-name">${expert.lastName}</div>
                            <img src="${expert.avatar}" alt="${expert.firstName} ${expert.lastName}" class="expert-avatar">
                            <div class="expert-info">

                                <div class="expert-topics">
                                    ${expert.topics.map(topic => 
                                        `<span class="topic-label">${topic}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="subscribe-button">+ ПОДПИСАТЬСЯ НА ЭКСПЕРТА</button>
            </div>
        </div>
    `);

    // Обработчики событий
    $(".remove-topic").on("click", function() {
        $(this).closest(".topic-tag").fadeOut(300, function() {
            $(this).remove();
        });
    });

    $(".remove-expert").on("click", function(e) {
        e.stopPropagation();
        $(this).closest(".expert-card").fadeOut(300, function() {
            $(this).remove();
        });
    });

    $(".subscribe-button").on("click", function() {
        alert("Здесь будет форма подписки");
    });
}
