import { API_HOST } from "../../js/api";

export function getProfile(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_profile`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data);
        } else {
            console.error("Ошибка загрузки профиля:", response.error_text);
            callback(null);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса профиля:", err);
        callback(null);
    });
}


export function getPosts(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_blog_posts`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data);
        } else {
            console.error("Ошибка загрузки постов:", response.error_text);
            callback([]);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса постов:", err);
        callback([]);
    });
}

export function getSubscribedExperts(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_subscribed_experts`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data);
        } else {
            console.error("Ошибка загрузки экспертов:", response.error_text);
            callback([]);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса экспертов:", err);
        callback([]);
    });
}

export function getSubscribedTopics(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_subscribed_topics`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data);
        } else {
            console.error("Ошибка загрузки топиков:", response.error_text);
            callback([]);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса топиков:", err);
        callback([]);
    });
}


// https://sdo.komus.net/komus_expert_app/api/controller.html?action=get_employee_resume&user_id=null&resume_id=null
export function getResumeData(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_employee_resume&user_id=null&resume_id=null`;

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

// Функция для получения данных из КОМУС Карьеры для импорта
export function getKomusCareerData(callback) {
    const url = `${API_HOST}/komus_career_app/api/controller.html?action=get_employee_resume&user_id=null&resume_id=null`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data[0]);
        } else {
            console.error("Ошибка загрузки данных КОМУС Карьеры:", response.error_text);
            callback(null);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса данных КОМУС Карьеры:", err);
        callback(null);
    });
}

/**
 * Получает список подписчиков с сервера
 * @param {function} callback
 */
export function getFollowers(callback) {
    const url = `${API_HOST}/komus_expert_app/api/controller.html?action=get_followers`;

    $.get(url, function (response) {
        if (response.success && response.data) {
            callback(response.data || []);
        } else {
            console.error("Ошибка загрузки подписчиков:", response.error_text);
            callback([]);
        }
    }).fail(function (err) {
        console.error("Ошибка запроса подписчиков:", err);
        callback([]);
    });
}