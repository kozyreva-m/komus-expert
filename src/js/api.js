export const API_HOST = "https://sdo.komus.net";
const API_PREFIX = "/komus_expert_app/api/controller.html";

/**
 * Простой GET-запрос без параметров
 */
export function apiGet(action, onSuccess, onError) {
    $.get(`${API_HOST}${API_PREFIX}?action=${action}`, (response) => {
        handleApiResponse(response, onSuccess, onError);
    }).fail((err) => handleApiError(err, onError));
}

/**
 * GET-запрос с параметрами
 */
export function apiGetWithParams(action, params, onSuccess, onError) {
    const queryString = new URLSearchParams(params).toString();
    $.get(`${API_HOST}${API_PREFIX}?action=${action}&${queryString}`, (response) => {
        handleApiResponse(response, onSuccess, onError);
    }).fail((err) => handleApiError(err, onError));
}

/**
 * POST-запрос
 */
export function apiPost(action, data, onSuccess, onError) {
    $.post(`${API_HOST}${API_PREFIX}?action=${action}`, data, (response) => {
        handleApiResponse(response, onSuccess, onError);
    }, "json").fail((err) => handleApiError(err, onError));
}

/**
 * Загрузка файлов через FormData
 */
export function apiUpload(action, formData, onSuccess, onError) {
    $.ajax({
        url: `${API_HOST}${API_PREFIX}?action=${action}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => handleApiResponse(response, onSuccess, onError),
        error: (err) => handleApiError(err, onError),
    });
}

function handleApiResponse(response, onSuccess, onError) {
    if (response.success) {
        onSuccess(response.data);
    } else {
        console.error("API Error:", response.error_text);
        if (onError) onError(response.error_text);
    }
}

function handleApiError(err, onError) {
    console.error("Ошибка запроса:", err);
    if (onError) onError(err);
}
