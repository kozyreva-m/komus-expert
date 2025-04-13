import { API_HOST } from "../../../js/api";
import { handleFormSubmit } from "../../../js/utils";
import { showModal } from "../../common/modal";
import { validateForm } from "../../../js/validation";
import "./skills.css";

export async function renderSkillsTab(data) {
    const $container = $("#form-tab-content").empty();

    const langs = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_langs`).then(r => r.json()).then(r => r.data);
    const levels = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_levels`).then(r => r.json()).then(r => r.data);
    const docs = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_skills_docs&resume_id=${window.resumeId}`).then(r => r.json()).then(r => r.data);

    const renderLanguageBlock = (lang, index) => `
    <div class="form-row">
      <label>${index === 0 ? 'Иностранные языки' : ''}</label>
      <div class="language-block">
        <div class="language-row">
          <select name="language_id">
            <option value="">Выберите язык</option>
            ${langs.map(l => `
                <option value="${l.language_id}" 
                        data-name="${l.language_name}"
                        ${l.language_id === lang.language_id ? "selected" : ""}>
                ${l.language_name}
                </option>`).join("")}
          </select>
          <select name="level_id">
            <option value="">Выберите уровень</option>
            ${levels.map(l => `
                <option value="${l.level_id}" 
                        data-name="${l.level_name}" 
                        ${l.level_id === lang.level_id ? "selected" : ""}>
                ${l.level_name}
                </option>`).join("")}
          </select>
        </div>
        <button type="button" class="removeLanguage">Удалить</button>
      </div>
    </div>
  `;

    const formHtml = `
    <form id="skills-form" class="profile-form">
      <div class="form-row">
        <label>Если вы владеете специфическими навыками, обязательно напишите о них!</label>
        <div class="input-field">
          <textarea name="uniqueSkills">${data.uniqueSkills || ""}</textarea>
        </div>
      </div>

      <div id="languages-list">
        ${(data.languages?.length ? data.languages : [{}]).map(renderLanguageBlock).join("")}
      </div>
      <div class="form-row">
        <label></label>
        <a href="#" id="add-language" class="link">+ Добавить язык</a>
      </div>

      <div class="form-row">
        <label>Водительские права</label>
        <div class="driver-license-block">
          <div class="license-options">
            ${['A', 'B', 'C', 'D', 'E'].map(letter => `
              <label><input type="checkbox" name="driverLicense" value="${letter}" ${data.driverLicense?.join('').includes(letter) ? "checked" : ""}/> ${letter}</label>
            `).join("")}
          </div>
          <label class="car-option"><input type="checkbox" name="hasOwnCar" ${data.hasOwnCar ? "checked" : ""}/> Есть личный автомобиль</label>
        </div>
      </div>

      <div class="form-row">
        <label>Прикрепленные документы</label>
        <div class="documents-block">
            <div class="file-upload">
                <button type="button" class="file-upload-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="#0066CC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Выбрать файл
                </button>
                <input type="file" name="documents" multiple style="display: none;" />
                <div class="file-info">Файл может быть в формате jpg, png, gif и объемом не более 10 МБ</div>
            </div>
            <ul class="uploaded-docs">
                ${docs.map(doc => `
                    <li data-id="${doc.id}">
                        <span class="doc-name">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6.5M8.5 1L14 6.5M8.5 1V6.5H14" stroke="#666666" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                            ${doc.name}
                        </span>
                        <button type="button" class="remove-doc" data-id="${doc.id}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </li>
                `).join("")}
            </ul>
        </div>
      </div>

      <div class="formActions">
        <button type="button" id="go-back" class="btn-back">Назад</button>
        <button type="submit" class="submitButton">Продолжить</button>
      </div>
    </form>
  `;

    $container.append(formHtml);

    // Обработчик для кнопки выбора файла
    $(".file-upload-button").on("click", function() {
        $(this).siblings("input[type='file']").click();
    });

    $("#add-language").on("click", function (e) {
        e.preventDefault();
        const index = $("#languages-list .language-block").length;
        $("#languages-list").append(renderLanguageBlock({}, index));
    });

    $(document).on("click", ".removeLanguage", function () {
        $(this).closest(".language-block").remove();
    });


    $("#go-back").on("click", function () {
        history.pushState({}, "", `?page=profile-form&tab=experience&resume_id=${window.resumeId}`);
        window.dispatchEvent(new Event("popstate"));
    });

    $("#skills-form").on("submit", async function(e) {
        e.preventDefault();

        if (!validateSkillsForm()) {
            return;
        }

        const result = {
            resumeId: window.resumeId,
            uniqueSkills: $("[name='uniqueSkills']").val(),
            hasOwnCar: $("#has-own-car").is(":checked"),
            languages: [],
            driverLicense: [],
            documents: []
        };

        $("input[name='driverLicense']:checked").each(function() {
            result.driverLicense.push($(this).val());
        });

        $(".language-block").each(function () {
            const $block = $(this);
            const $languageSelect = $block.find("[name='language_id']");
            const $levelSelect = $block.find("[name='level_id']");
            
            const selectedLanguage = $languageSelect.find("option:selected");
            const selectedLevel = $levelSelect.find("option:selected");

            result.languages.push({
                language_id: selectedLanguage.val(),
                language_name: selectedLanguage.data("name"),
                level_id: selectedLevel.val(),
                level_name: selectedLevel.data("name")
            });
        });

        const files = $("input[name='documents']")[0].files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const doc = {
                name: file.name,
                file: file
            };
            result.documents.push(doc);
        }

        const formData = new FormData();
        formData.append("resumeId", result.resumeId);
        formData.append("uniqueSkills", result.uniqueSkills);
        formData.append("hasOwnCar", result.hasOwnCar);
        formData.append("languages", JSON.stringify(result.languages));
        formData.append("driverLicense", JSON.stringify(result.driverLicense));
        
        result.documents.forEach((doc, index) => {
            formData.append(`documents[${index}]`, doc.file);
        });

        await handleFormSubmit({
            formData,
            apiUrl: `${API_HOST}/komus_career_app/api/controller.html?action=send_resume_skills_data`,
            onSuccess: () => {
                const nextUrl = `?page=profile-form&tab=education&resume_id=${window.resumeId}`;
                history.pushState({}, "", nextUrl);
                window.dispatchEvent(new Event("popstate"));
            }
        });
    });

    // Обработчик загрузки файлов - только для превью
    $("input[name='documents']").on("change", function(e) {
        const files = e.target.files;
        if (!files.length) return;

        // Добавляем новые файлы в список для превью
        const $docsList = $(".uploaded-docs");
        
        Array.from(files).forEach(file => {
            const docHtml = `
                <li data-file-name="${file.name}">
                    <span class="doc-name">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6.5M8.5 1L14 6.5M8.5 1V6.5H14" stroke="#666666" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                        ${file.name}
                    </span>
                    <button type="button" class="remove-doc">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </li>
            `;
            $docsList.append(docHtml);
        });
    });

    // Обработчик удаления документа (как для превью, так и для загруженных файлов)
    $(document).on("click", ".remove-doc", function() {
        const $docItem = $(this).closest("li");
        const fileName = $docItem.find(".doc-name").text().trim();
        const fileId = $(this).data("id");

        showModal({
            title: 'Подтверждение удаления',
            content: `Вы уверены, что хотите удалить документ?`,
            buttons: [
                {
                    text: 'Отмена',
                    type: 'cancel',
                    action: 'close'
                },
                {
                    text: 'Удалить',
                    type: 'confirm',
                    action: 'delete'
                }
            ]
        }).find("button").on("click", function() {
            const action = $(this).data("action");
            const $modal = $(this).closest(".custom-modal-overlay");
            
            if (action === "delete") {
                if (fileId) {
                    // Если есть fileId - это загруженный файл, удаляем с сервера
                    fetch(`${API_HOST}/komus_career_app/api/controller.html?action=remove_uploaded_file&resume_id=${window.resumeId}&file_id=${fileId}`)
                        .then(() => {
                            $docItem.remove();
                            $modal.remove();
                        })
                        .catch(() => {
                            showModal({
                                title: 'Ошибка',
                                content: 'Не удалось удалить файл',
                                type: 'error'
                            });
                            $modal.remove();
                        });
                } else {
                    // Если нет fileId - это превью, просто удаляем из DOM
                    $docItem.remove();
                    $modal.remove();
                }
            } else {
                $modal.remove();
            }
        });
    });
}

function validateSkillsForm() {
    const fields = [
        {
            selector: $("[name='uniqueSkills']"),
            name: "Уникальные навыки",
            value: $("[name='uniqueSkills']").val()
        }
    ];

    // Добавляем проверку языков, если они есть
    $(".language-block").each(function(index) {
        const blockNumber = index + 1;
        fields.push(
            {
                selector: $(this).find("[name='language_id']"),
                name: `Язык (блок ${blockNumber})`,
                value: $(this).find("[name='language_id']").val()
            },
            {
                selector: $(this).find("[name='level_id']"),
                name: `Уровень владения (блок ${blockNumber})`,
                value: $(this).find("[name='level_id']").val()
            }
        );
    });

    return validateForm(fields);
}

