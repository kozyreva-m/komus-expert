import { getResumeData, getKomusCareerData } from "./api";
import { API_HOST } from "../../js/api";
import { renderEducationTab } from "./profileFormTabs/education";
import { renderExperienceTab } from "./profileFormTabs/experience";
import { renderPersonalTab } from "./profileFormTabs/personal";
import { renderSettingsTab } from "./profileFormTabs/settings";
import { renderSkillsTab } from "./profileFormTabs/skills";
import { showSpinner, hideSpinner } from "../common/spinner";
import { showModal } from "../common/modal";
import "./profileFormTabs/style.css";

// Функция для импорта данных из КОМУС Карьеры
function importFromKomusCareer() {
    showSpinner();
    
    getKomusCareerData((careerData) => {
        hideSpinner();
        
        if (!careerData) {
            showModal({
                title: 'Ошибка',
                content: 'Не удалось загрузить данные из КОМУС Карьеры. Попробуйте позже.',
                type: 'error'
            });
            return;
        }

        console.log(careerData)

        // Показываем модальное окно с подтверждением
        const $modal = showModal({
            title: 'Импорт из КОМУС Карьеры',
            content: `
                <div style="margin-bottom: 16px;">
                    <p>Будут импортированы следующие данные:</p>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        ${careerData.personalData ? '<li>Личные данные</li>' : ''}
                        ${careerData.experienceData ? '<li>Опыт работы</li>' : ''}
                        ${careerData.educationData ? '<li>Образование</li>' : ''}
                        ${careerData.skillsData ? '<li>Навыки и языки</li>' : ''}
                    </ul>
                    <p style="color: #666; font-size: 13px;">
                        Существующие данные будут заменены импортированными.
                    </p>
                </div>
            `,
            buttons: [
                {
                    text: 'Отмена',
                    type: 'cancel',
                    action: 'close'
                },
                {
                    text: 'Импортировать',
                    type: 'confirm',
                    action: 'import'
                }
            ]
        });

        // Обработчик кнопок модального окна
        $modal.find("button").on("click", function() {
            const action = $(this).data("action");
            
            if (action === "import") {
                performImport(careerData);
            }
            
            $modal.remove();
        });
    });
}

// Функция для выполнения импорта
function performImport(careerData) {
    showSpinner();
    
    // Отправляем данные на сервер для импорта
    const formData = new FormData();
    formData.append("resumeId", window.resumeId);
    formData.append("careerData", JSON.stringify(careerData));

    console.log('###careerData ',careerData)
    
    $.ajax({
        url: `${API_HOST}/komus_career_app/api/controller.html?action=import_career_data`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            hideSpinner();
            
            if (response.success) {
                showModal({
                    title: 'Успешно',
                    content: 'Данные успешно импортированы из КОМУС Карьеры!',
                    type: 'success'
                });
                
                // Перезагружаем текущую вкладку
                const currentTab = new URLSearchParams(location.search).get("tab") || "personal";
                const url = `/expert_app?page=profile-form&tab=${currentTab}&resume_id=${window.resumeId}`;
                history.pushState({}, "", url);
                window.dispatchEvent(new Event("popstate"));
            } else {
                showModal({
                    title: 'Ошибка',
                    content: response.error_text || 'Не удалось импортировать данные.',
                    type: 'error'
                });
            }
        },
        error: function() {
            hideSpinner();
            showModal({
                title: 'Ошибка',
                content: 'Произошла ошибка при импорте данных.',
                type: 'error'
            });
        }
    });
}

export function renderProfileFormPage() {
    // Скрываем основной контент
    $("#main-layout").hide();
    
    const container = $("#tab-content").empty();

    const tabParam = new URLSearchParams(location.search).get("tab") || "personal";

    const tabs = [
        { label: "Личные данные", code: "personal" },
        { label: "Опыт", code: "experience" },
        { label: "Навыки", code: "skills" },
        { label: "Образование", code: "education" },
        { label: "Управление сообществом и профилем", code: "settings" }
    ];

    const tabsHtml = `
    <div class="form-tabs">
      ${tabs
            .map(
                (tab) => `
        <a href="/expert_app?page=profile-form&tab=${tab.code}" 
           class="form-tab ${tab.code === tabParam ? "active" : ""}">
          ${tab.label}
        </a>
      `
            )
            .join("")}
    </div>
    <div id="form-tab-content" class="form-tab-content"></div>
  `;

    // Добавляем заголовок с кнопкой импорта
    const headerHtml = `
        <div class="form-header">
            <h2 class="form-title">Настройки профиля</h2>
            <button type="button" class="import-career-btn" onclick="importFromKomusCareer()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Импорт из КОМУС Карьеры
            </button>
        </div>
    `;
    
    container.append(headerHtml);
    container.append(tabsHtml);

    // Добавляем обработчик клика на табы
    $(".form-tab").on("click", function(e) {
        e.preventDefault();
        const href = $(this).attr("href");
        showSpinner();
        history.pushState({}, "", href);
        window.dispatchEvent(new Event("popstate"));
    });

    // Делаем функцию импорта доступной глобально
    window.importFromKomusCareer = importFromKomusCareer;

    showSpinner();
    getResumeData((data) => {
        if (tabParam === "personal") {
            renderPersonalTab(data.personalData);
        } else if (tabParam === "experience") {
            renderExperienceTab(data.experienceData);
        } else if (tabParam === "skills") {
            renderSkillsTab(data.skillsData);
        } else if (tabParam === "education") {
            renderEducationTab(data.educationData);
        } else if (tabParam === "settings") {
            renderSettingsTab(data.educationData);
        }
        hideSpinner();
    });
}
