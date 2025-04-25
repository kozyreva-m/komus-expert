import { API_HOST } from "../../js/api";
import "./followers.css";

// Моковые данные для имитации ответа API
const MOCK_RESPONSE = {
    status: "success",
    data: {
        followers: [
            {
                id: 1,
                name: "Анжелика Варламова",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
            },
            {
                id: 2,
                name: "Дмитрий Богачев",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            },
            {
                id: 3,
                name: "Игорь Васильев",
                avatar: "https://randomuser.me/api/portraits/men/31.jpg",
            },
            {
                id: 4,
                name: "Виталий Арсеньев",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            },
            {
                id: 5,
                name: "Алексей Антонов",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
                id: 6,
                name: "Мария Белкина",
                avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            },
            {
                id: 7,
                name: "Сергей Волков",
                avatar: "https://randomuser.me/api/portraits/men/33.jpg",
            },
            {
                id: 8,
                name: "Екатерина Громова",
                avatar: "https://randomuser.me/api/portraits/women/23.jpg",
            },
            {
                id: 9,
                name: "Андрей Дмитриев",
                avatar: "https://randomuser.me/api/portraits/men/34.jpg",
            },
            {
                id: 10,
                name: "Ольга Ежова",
                avatar: "https://randomuser.me/api/portraits/women/24.jpg",
            },
            {
                id: 11,
                name: "Павел Жуков",
                avatar: "https://randomuser.me/api/portraits/men/35.jpg",
            },
            {
                id: 12,
                name: "Наталья Зайцева",
                avatar: "https://randomuser.me/api/portraits/women/25.jpg",
            },
            {
                id: 13,
                name: "Максим Иванов",
                avatar: "https://randomuser.me/api/portraits/men/36.jpg",
            },
            {
                id: 14,
                name: "Татьяна Климова",
                avatar: "https://randomuser.me/api/portraits/women/26.jpg",
            },
            {
                id: 15,
                name: "Роман Лебедев",
                avatar: "https://randomuser.me/api/portraits/men/37.jpg",
            },
            {
                id: 16,
                name: "Анна Морозова",
                avatar: "https://randomuser.me/api/portraits/women/27.jpg",
            },
            {
                id: 17,
                name: "Денис Новиков",
                avatar: "https://randomuser.me/api/portraits/men/38.jpg",
            },
            {
                id: 18,
                name: "Юлия Орлова",
                avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            },
            {
                id: 19,
                name: "Артем Петров",
                avatar: "https://randomuser.me/api/portraits/men/39.jpg",
            },
            {
                id: 20,
                name: "Светлана Романова",
                avatar: "https://randomuser.me/api/portraits/women/29.jpg",
            },
            {
                id: 21,
                name: "Кирилл Соколов",
                avatar: "https://randomuser.me/api/portraits/men/40.jpg",
            },
            {
                id: 22,
                name: "Марина Титова",
                avatar: "https://randomuser.me/api/portraits/women/30.jpg",
            },
            {
                id: 23,
                name: "Владимир Ушаков",
                avatar: "https://randomuser.me/api/portraits/men/41.jpg",
            },
            {
                id: 24,
                name: "Ирина Федорова",
                avatar: "https://randomuser.me/api/portraits/women/31.jpg",
            },
            {
                id: 25,
                name: "Григорий Харитонов",
                avatar: "https://randomuser.me/api/portraits/men/42.jpg",
            },
            {
                id: 26,
                name: "Елена Цветкова",
                avatar: "https://randomuser.me/api/portraits/women/32.jpg",
            },
            {
                id: 27,
                name: "Борис Чернов",
                avatar: "https://randomuser.me/api/portraits/men/43.jpg",
            },
            {
                id: 28,
                name: "Полина Шевцова",
                avatar: "https://randomuser.me/api/portraits/women/33.jpg",
            },
            {
                id: 29,
                name: "Антон Щукин",
                avatar: "https://randomuser.me/api/portraits/men/44.jpg",
            },
            {
                id: 30,
                name: "Дарья Яковлева",
                avatar: "https://randomuser.me/api/portraits/women/34.jpg",
            }
        ]
    }
};

// Функция для получения подписчиков (имитация API запроса)
async function fetchFollowers() {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Логируем URL, к которому будем обращаться в будущем
    console.log(`GET ${API_HOST}/komus_career_app/api/controller.html?action=get_followers`);
    
    // В будущем здесь будет реальный fetch запрос
    return MOCK_RESPONSE.data.followers;
}

// Функция для группировки подписчиков по первой букве фамилии
function groupFollowersByLetter(followers) {
    const groups = {};
    followers.forEach(follower => {
        const lastName = follower.name.split(" ")[1];
        const letter = lastName.charAt(0).toUpperCase();
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(follower);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
}

export async function renderFollowersTab() {
    const $container = $("#tab-content").empty();
    
    // Добавляем базовую структуру
    $container.append(`
        <div class="followers-container">
            <div class="followers-header">
                <button class="invite-button">+ ПРИГЛАСИТЬ ПОДПИСЧИКА</button>
            </div>
            <div class="followers-letters"></div>
        </div>
    `);

    try {
        // Загружаем и отображаем подписчиков
        const followers = await fetchFollowers();
        const groupedFollowers = groupFollowersByLetter(followers);
        const $followersContainer = $(".followers-letters");

        groupedFollowers.forEach(([letter, letterFollowers]) => {
            const letterSection = `
                <div class="letter-section">
                    <div class="letter-title">${letter}</div>
                    <div class="followers-grid">
                        ${letterFollowers.map(follower => {
                            const [firstName, lastName] = follower.name.split(" ");
                            return `
                                <div class="follower-card" data-id="${follower.id}">
                                    <img src="${follower.avatar}" alt="${follower.name}" class="follower-avatar">
                                    <div class="follower-info">
                                        <div class="follower-firstname">${firstName}</div>
                                        <div class="follower-lastname">${lastName}</div>
                                    </div>
                                    <button class="remove-follower" title="Удалить подписчика">×</button>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
            $followersContainer.append(letterSection);
        });

        // Обработчик удаления подписчика
        $(".remove-follower").on("click", function(e) {
            e.stopPropagation();
            const $card = $(this).closest(".follower-card");
            const followerId = $card.data("id");
            
            // Логируем URL для будущего API запроса
            console.log(`DELETE ${API_HOST}/komus_career_app/api/controller.html?action=remove_follower&id=${followerId}`);
            
            $card.fadeOut(300, function() {
                $(this).remove();
                $(".letter-section").each(function() {
                    if ($(this).find(".follower-card:visible").length === 0) {
                        $(this).remove();
                    }
                });
            });
        });

        // Обработчик кнопки приглашения
        $(".invite-button").on("click", function() {
            alert("Здесь будет форма приглашения подписчика");
        });

        // Обработчик клика по карточке
        $(".follower-card").on("click", function() {
            const followerId = $(this).data("id");
            console.log(`GET ${API_HOST}/komus_career_app/api/controller.html?action=get_follower_profile&id=${followerId}`);
        });
    } catch (error) {
        console.error('Error loading followers:', error);
        $(".followers-letters").append('<div class="error-message">Ошибка загрузки подписчиков</div>');
    }
}