import { API_HOST } from "../../js/api";

export function getProfile(callback) {
    setTimeout(() => {
        callback({
            blog: {
                id: 123,
                title: "КЛУБ ПЕРВООТКРЫВАТЕЛЕЙ"
            },
            name: "Игорь Васильев",
            age: 34,
            position: "Менеджер по продажам",
            avatar: "https://randomuser.me/api/portraits/men/31.jpg",
            tags: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"],
            about:
                "Ваше резюме будет доступно для просмотра всем компаниям и кадровым агентствам, которые зарегистрированы на HeadHunter, за исключением тех, которые вы отметите в специальном окне. Таким резюме вы сможете откликаться на все вакансии сайта HeadHunter, однако те компании, которым вы запретили просматривать свое резюме, не будут иметь к нему доступ через поиск по базе данных и по прямой ссылке. При отклике на конкретную вакансию компании «N», внесенной вами в stop-список, настройки видимости вашего резюме автоматически изменятся, и компания «N» удалится из stop-списка.",
            badges: [
                {
                    label: "Какой-то бейдж",
                    icon: "https://media.komus.ru/image/icons/mrp-giraffe.png"
                },
                {
                    label: "Дорос до МРП!",
                    icon: "https://media.komus.ru/image/icons/mrp-giraffe.png"
                }
            ]
        });
    }, 300);
}

export function getPosts(callback) {
    setTimeout(() => {
        callback([
            {
                blog: {
                    id: 123,
                    title: "КЛУБ ПЕРВООТКРЫВАТЕЛЕЙ"
                },
                time: "07.11.2016",
                tags: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"],
                title: "Новый проект – Экспертум",
                content:
                    "Клуб предлагает уникальную возможность для обмена знаниями и идеями...",
                likes: 6,
                comments: 1,
                image: "https://via.placeholder.com/400x200"
            },
            {
                blog: {
                    id: 123,
                    title: "КЛУБ ПЕРВООТКРЫВАТЕЛЕЙ"
                },
                time: "04.11.2016",
                tags: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"],
                title: "Новый проект – Экспертум",
                content:
                    "Клуб предлагает уникальную возможность для обмена знаниями и идеями...",
                likes: 7,
                comments: 2,
                image: null
            }
        ]);
    }, 300);
}

export function getSubscribedTags(callback) {
    setTimeout(() => {
        callback(["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]);
    }, 300);
}

export function getSubscribedExperts(callback) {
    setTimeout(() => {
        callback([
            {
                name: "Анжелика Варламова",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                tags: ["БЭКОФИС", "МЕДИЦИНА"]
            },
            {
                name: "Дмитрий Богачев",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                tags: ["БЭКОФИС", "ОБРАЗОВАНИЕ"]
            },
            {
                name: "Игорь Васильев",
                avatar: "https://randomuser.me/api/portraits/men/31.jpg",
                tags: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
            },
            {
                name: "Виталий Арсеньев",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                tags: ["БЭКОФИС", "МЕДИЦИНА", "ОБРАЗОВАНИЕ"]
            }
        ]);
    }, 300);
}

// https://sdo.komus.net/komus_career_app/api/controller.html?action=get_employee_resume&user_id=null&resume_id=null
export function getResumeData(callback) {
    const url = `${API_HOST}/komus_career_app/api/controller.html?action=get_employee_resume&user_id=null&resume_id=null`;

    $.get(url, function (response) {
        if (response.success && response.data && response.data.length > 0) {
            const resume = response.data[0];
            window.resumeId = resume.id;
            callback(resume);
        } else {
            console.error("Ошибка загрузки резюме:", response.error_text);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса:", err);
    });
}