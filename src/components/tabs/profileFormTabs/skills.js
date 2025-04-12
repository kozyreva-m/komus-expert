import { API_HOST } from "../../../js/api";
import "./skills.css";

export async function renderSkillsTab(data) {
    const $container = $("#form-tab-content").empty();

    const langs = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_langs`).then(r => r.json()).then(r => r.data);
    const levels = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_levels`).then(r => r.json()).then(r => r.data);
    const docs = await fetch(`${API_HOST}/komus_career_app/api/controller.html?action=get_skills_docs&resume_id=${window.resumeId}`).then(r => r.json()).then(r => r.data);

    const renderLanguageBlock = (lang, index) => `
    <div class="language-block" data-index="${index}">
      <div class="formField">
        <label>Язык</label>
        <select name="language_id">
        <option value="">Выберите язык</option>
        ${langs.map(l => `
            <option value="${l.language_id}" 
                    data-name="${l.language_name}"
                    ${l.language_id === lang.language_id ? "selected" : ""}>
            ${l.language_name}
            </option>`).join("")}
        </select>
      </div>
      <div class="formField">
        <label>Уровень</label>
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
  `;

    const formHtml = `
    <form id="skills-form" class="profile-form">
      <div class="formField">
        <label>Если вы владеете специфическими навыками, обязательно напишите о них!</label>
        <textarea name="uniqueSkills">${data.uniqueSkills || ""}</textarea>
      </div>

      <div id="languages-list">
        ${(data.languages?.length ? data.languages : [{}]).map(renderLanguageBlock).join("")}
      </div>
      <a href="#" id="add-language" class="link">+ Добавить язык</a>

      <div class="formField">
        <label>Водительские права</label>
        ${['A', 'B', 'C', 'D', 'E'].map(letter => `
          <label><input type="checkbox" name="driverLicense" value="${letter}" ${data.driverLicense?.join('').includes(letter) ? "checked" : ""}/> ${letter}</label>
        `).join("")}
        <label><input type="checkbox" name="hasOwnCar" ${data.hasOwnCar ? "checked" : ""}/> Есть личный автомобиль</label>
      </div>

      <div>
        <div class="formField">
            <label>Прикрепленные документы ( не больше 5-ти файлов )</label>
            <input type="file" name="documents" multiple />
        </div>
        <ul class="uploaded-docs">
            ${docs.map(doc => `<li data-id="${doc.id}">${doc.name} <button class="remove-doc" data-id="${doc.id}">Удалить</button></li>`).join("")}
        </ul>
      </div>      
      <div class="formActions">
        <button type="button" id="go-back" class="btn-back">Назад</button>
        <button type="submit" class="submitButton">Продолжить</button>
      </div>
    </form>
  `;

    $container.append(formHtml);

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

    $("#skills-form").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("resumeId", window.resumeId);
        formData.append("uniqueSkills", $("[name='uniqueSkills']").val());
        formData.append("hasOwnCar", $("[name='hasOwnCar']").is(":checked"));

        const languages = [];
        $(".language-block").each(function () {
            const $block = $(this);
            const $languageSelect = $block.find("[name='language_id'] option:selected");
            const $levelSelect = $block.find("[name='level_id'] option:selected");

            languages.push({
                language_id: $languageSelect.val(),
                language_name: $languageSelect.data("name"),
                level_id: $levelSelect.val(),
                level_name: $levelSelect.data("name"),
            });
        });
        formData.append("languages", JSON.stringify(languages));

        const licenses = [];
        $("[name='driverLicense']:checked").each(function () {
            licenses.push($(this).val());
        });
        formData.append("driverLicense", JSON.stringify(licenses));

        const files = $("input[name='documents']")[0].files;
        for (let i = 0; i < files.length; i++) {
            formData.append(`documents[${i}]`, files[i]);
        }

        fetch(`${API_HOST}/komus_career_app/api/controller.html?action=send_resume_skills_data`, {
            method: "POST",
            body: formData,
        })
            .then(r => r.json())
            .then(response => {
                if (response.success) {
                    const nextUrl = `?page=profile-form&tab=education&resume_id=${window.resumeId}`;
                    history.pushState({}, "", nextUrl);
                    window.dispatchEvent(new Event("popstate"));
                } else {
                    // alert("Ошибка при сохранении: " + response.error_text);
                }
            })
            .catch(err => {
                console.error("Ошибка запроса:", err);
                alert("Ошибка при отправке данных");
            });
    });
}

$(document).on("click", ".remove-doc", function () {
    const fileId = $(this).data("id");
    const $docItem = $(this).closest("li");

    const fileName = $docItem.contents().filter(function () {
        return this.nodeType === 3;
    }).text().trim();

    // Создаём модалку подтверждения
    const $modal = $(`
        <div class="custom-modal-overlay">
            <div class="custom-modal">
                <p>Вы уверены, что хотите удалить документ <strong>${fileName}</strong>?</p>
                <div class="modal-buttons">
                    <button class="btn-cancel">Отмена</button>
                    <button class="btn-confirm">Удалить</button>
                </div>
            </div>
        </div>
    `);

    $("body").append($modal);

    $modal.find(".btn-cancel").on("click", function () {
        $modal.remove();
    });

    $modal.find(".btn-confirm").on("click", function () {
        fetch(`${API_HOST}/komus_career_app/api/controller.html?action=remove_uploaded_file&resume_id=${window.resumeId}&file_id=${fileId}`)
            .then(() => {
                $docItem.remove();
                $modal.remove();
            })
            .catch(() => {
                alert("Ошибка удаления файла");
                $modal.remove();
            });
    });
});
