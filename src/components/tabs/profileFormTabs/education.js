import { API_HOST } from "../../../js/api";
import { handleFormSubmit } from "../../../js/utils";
import { validateForm } from "../../../js/validation";
import "./education.css";


const currentYear = new Date().getFullYear();
const yearsOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);


export function renderEducationTab(data) {
  const $container = $("#form-tab-content").empty();

  const renderEducationBlock = (education, index) => `
    <div class="education-block" data-index="${index}">
      <div class="formField">
        <label>Учебное заведение <span style="color: red">*</span></label>
        <input type="text" name="institution" value="${education.institution || ""}" />
      </div>

      <div class="formField">
        <label>Уровень образования</label>
        <select name="educationLevel">
          <option value="">Выберите уровень</option>
          <option value="higher" ${education.educationLevel === "higher" ? "selected" : ""}>Высшее</option>
          <option value="secondary" ${education.educationLevel === "secondary" ? "selected" : ""}>Среднее</option>
          <option value="bachelor" ${education.educationLevel === "bachelor" ? "selected" : ""}>Бакалавриат</option>
          <option value="course" ${education.educationLevel === "course" ? "selected" : ""}>Курсы</option>
          <option value="incomplete_higher" ${education.educationLevel === "incomplete_higher" ? "selected" : ""}>Неоконченное высшее</option>
          <option value="master" ${education.educationLevel === "master" ? "selected" : ""}>Магистратура</option>
          <option value="mba" ${education.educationLevel === "mba" ? "selected" : ""}>MBA</option>
          <option value="specialized_secondary" ${education.educationLevel === "specialized_secondary" ? "selected" : ""}>Средне-специальное</option>
        </select>
      </div>


      <div class="formField">
        <label>Специальность <span style="color: red">*</span></label>
        <input type="text" name="specialization" value="${education.specialization || ""}" />
      </div>

      <div class="formField">
        <label>Год окончания</label>
        <select name="graduationYear">
          <option value="">Выберите год</option>
          ${yearsOptions.map(year => `
            <option value="${year}" ${String(education.graduationYear) === String(year) ? "selected" : ""}>${year}</option>
          `).join("")}
        </select>
      </div>

      <button type="button" class="removeEducation">Удалить</button>
    </div>
  `;

  const formHtml = `
    <form id="education-form" class="profile-form">
      <div id="education-list">
        ${(data.educations?.length ? data.educations : [{}])
      .map(renderEducationBlock)
      .join("")}
      </div>

      <a href="#" id="add-education" class="link">+ Добавить учебное заведение</a>

      <div class="formField">
        <label>Дополнительная информация</label>
        <textarea name="additionalInfo">${data.additionalInfo || ""}</textarea>
      </div>

      <div class="formActions">
        <button type="button" id="go-back" class="btn-back">Назад</button>
        <button type="submit" class="submitButton">Продолжить</button>
      </div>
    </form>
  `;

  $container.append(formHtml);

  // Добавить блок
  $("#add-education").on("click", function (e) {
    e.preventDefault();
    const index = $("#education-list .education-block").length;
    $("#education-list").append(renderEducationBlock({}, index));
  });

  // Удалить блок
  $(document).on("click", ".removeEducation", function () {
    $(this).closest(".education-block").remove();
  });

  // Назад
  $("#go-back").on("click", function () {
    history.pushState({}, "", `?page=profile-form&tab=skills&resume_id=${window.resumeId}`);
    window.dispatchEvent(new Event("popstate"));
  });

  function validateEducationForm() {
    const fields = [];

    $("#education-list .education-block").each(function(index) {
        const blockNumber = index + 1;
        const $block = $(this);
        
        fields.push(
            {
                selector: $block.find("[name='institution']"),
                name: `Учебное заведение (блок ${blockNumber})`,
                value: $block.find("[name='institution']").val()
            },
            {
                selector: $block.find("[name='educationLevel']"),
                name: `Уровень образования (блок ${blockNumber})`,
                value: $block.find("[name='educationLevel']").val()
            },
            {
                selector: $block.find("[name='specialization']"),
                name: `Специальность (блок ${blockNumber})`,
                value: $block.find("[name='specialization']").val(),
                required: true,
                customCheck: (value, $field) => {
                    if (!value || value.trim() === '') {
                        $field.addClass('error');
                        // Прокручиваем к полю с ошибкой
                        setTimeout(() => {
                            $('html, body').animate({
                                scrollTop: $field.offset().top - 100
                            }, 300);
                        }, 100);
                        return 'Поле обязательно для заполнения';
                    }
                    $field.removeClass('error');
                    return null;
                }
            },
            {
                selector: $block.find("[name='graduationYear']"),
                name: `Год окончания (блок ${blockNumber})`,
                value: $block.find("[name='graduationYear']").val()
            }
        );
    });

    return validateForm(fields);
  }

  // Добавляем стили для полей с ошибками
  const style = document.createElement('style');
  style.textContent = `
      .error {
          border-color: #FF0000 !important;
      }
      .error:focus {
          border-color: #FF0000 !important;
          outline-color: #FF0000 !important;
      }
  `;
  document.head.appendChild(style);

  // Отправка
  $("#education-form").on("submit", async function (e) {
    e.preventDefault();

    if (!validateEducationForm()) {
        return;
    }

    const educations = [];
    $("#education-list .education-block").each(function () {
        educations.push({
            educationLevel: $(this).find("[name='educationLevel']").val(),
            institution: $(this).find("[name='institution']").val(),
            specialization: $(this).find("[name='specialization']").val(),
            graduationYear: $(this).find("[name='graduationYear']").val(),
        });
    });

    const formData = new FormData();
    formData.append("resumeId", window.resumeId);
    formData.append("educations", JSON.stringify(educations));
    formData.append(
      "additionalInfo",
      $("[name='additionalInfo']").val() || ""
    );

    await handleFormSubmit({
      formData,
      apiUrl: `${API_HOST}/komus_career_app/api/controller.html?action=send_resume_educations_data`,
      onSuccess: () => {
        const nextUrl = `?page=profile-form&tab=settings&resume_id=${window.resumeId}`;
        history.pushState({}, "", nextUrl);
        window.dispatchEvent(new Event("popstate"));
      }
    });
  });
}
