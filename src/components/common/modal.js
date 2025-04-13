import './modal.css';

export function showModal({ title, content, type = 'default', buttons = [] }) {
    // Создаём модалку
    const $modal = $(`
        <div class="custom-modal-overlay">
            <div class="custom-modal ${type}">
                ${title ? `<h3 class="modal-title">${title}</h3>` : ''}
                <div class="modal-content">${content}</div>
                <div class="modal-buttons">
                    ${buttons.length ? buttons.map(btn => `
                        <button class="btn-${btn.type || 'default'}" data-action="${btn.action}">${btn.text}</button>
                    `).join('') : `
                        <button class="btn-confirm" data-action="close">OK</button>
                    `}
                </div>
            </div>
        </div>
    `);

    // Добавляем в body
    $("body").append($modal);

    // Обработчики кнопок
    $modal.find("button").on("click", function() {
        const action = $(this).data("action");
        if (action === "close") {
            $modal.remove();
        }
    });

    // Возвращаем модалку для возможности дополнительной настройки
    return $modal;
} 