import { API_HOST } from "../../../js/api";
import "./experience.css";

export function renderExperienceTab(data) {
  const $container = $("#form-tab-content").empty();

  let experiences = data.experiences && data.experiences.length > 0
    ? data.experiences
    : [{
      organizationName: "",
      position: "",
      positionLevel: "",
      responsibilities: "",
      startDate: { month: "", year: "" },
      endDate: { month: "", year: "" },
      isCurrent: false
    }];

  const formatMonthValue = ({ month, year } = {}) => {
    if (!month || !year) return "";
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  const renderExperienceBlock = (exp, index) => `
    <div class="experienceBlock" data-index="${index}">
      <div class="formField">
        <label>Название организации</label>
        <input type="text" name="organizationName" value="${exp.organizationName || ""}" />
      </div>

      <div class="formField">
        <label>Должность</label>
        <input type="text" name="position" value="${exp.position || ""}" />
      </div>

      <div class="formField">
        <label>Обязанности и достижения</label>
        <textarea name="responsibilities">${exp.responsibilities || ""}</textarea>
      </div>

      <div class="formField">
        <label>Период работы</label>
        <div class="period-inputs">
          <div class="period-row">
            <input type="month" name="startDate" value="${formatMonthValue(exp.startDate)}" max="${getTodayMonth()}" />
            <span class="separator">—</span>
            <input type="month" name="endDate" value="${formatMonthValue(exp.endDate)}" max="${getTodayMonth()}" ${exp.isCurrent ? "disabled" : ""} />
          </div>
          <div class="current-job">
            <input type="checkbox" name="isCurrent" id="current-${index}" ${exp.isCurrent ? "checked" : ""}/>
            <label for="current-${index}">По настоящее время</label>
          </div>
        </div>
      </div>

      <button type="button" class="removeExperience">Удалить место работы</button>
    </div>
  `;

  const formHtml = `
    <form id="experience-form" class="profile-form">
      <div id="experience-list">
        ${experiences.map(renderExperienceBlock).join("")}
      </div>

      <a href="#" id="add-experience" class="link">+ Добавить еще одно место работы</a>

      <div class="formField">
        <label>Общий стаж</label>
        <div class="total-duration">
          <input type="text" id="total-years" readonly />
          <span>года</span>
          <input type="text" id="total-months" readonly />
          <span>месяцев</span>
        </div>
      </div>

      <div class="formField">
        <label>Рекомендации</label>
        <textarea name="recommendations" placeholder="Если у вас есть рекомендации с предыдущих мест работы, укажите название организации и контактную информацию.">${data.recommendations || ""}</textarea>
      </div>

      <div class="formActions">
        <button type="button" id="go-back" class="btn-back">Вернуться в профиль</button>
        <button type="submit" class="submitButton">Продолжить</button>
      </div>
    </form>
  `;

  $container.append(formHtml);

  function recalculateDuration() {
    let totalMonths = 0;

    $("#experience-list .experienceBlock").each(function () {
      const isCurrent = $(this).find("[name='isCurrent']").is(":checked");
      const startDate = $(this).find("[name='startDate']").val();
      const endDate = isCurrent ? getTodayMonth() : $(this).find("[name='endDate']").val();

      if (startDate && endDate) {
        const diff = moment(endDate).diff(moment(startDate), "months", true);
        totalMonths += Math.max(0, diff);
      }
    });

    $("#total-years").val(Math.floor(totalMonths / 12));
    $("#total-months").val(Math.round(totalMonths % 12));
  }

  function getTodayMonth() {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`;
  }

  // Добавление места работы
  $("#add-experience").on("click", function (e) {
    e.preventDefault();
    const index = $("#experience-list .experienceBlock").length;
    $("#experience-list").append(renderExperienceBlock({}, index));
  });

  // Удаление места работы
  $(document).on("click", ".removeExperience", function () {
    $(this).closest(".experienceBlock").remove();
    recalculateDuration();
  });

  // Скрытие/показ блока "по"
  $("#experience-form").on("change", "[name='isCurrent']", function () {
    const $block = $(this).closest(".experienceBlock");
    const isChecked = $(this).is(":checked");
    $block.find(".end-date-block").toggle(!isChecked);
    recalculateDuration();
  });

  // Изменение даты
  $(document).on("change", "[name='startDate'], [name='endDate']", recalculateDuration);

  // Назад
  $("#go-back").on("click", function () {
    history.pushState({}, "", "?page=profile-form&tab=personal&resume_id=" + window.resumeId);
    window.dispatchEvent(new Event("popstate"));
  });

  // Отправка формы
  $("#experience-form").on("submit", function (e) {
    e.preventDefault();

    const result = {
      resumeId: window.resumeId || "",
      experiences: [],
      recommendations: $(this).find("[name='recommendations']").val(),
      totalDuration: {
        years: $("#total-years").val(),
        months: $("#total-months").val(),
      }
    };

    $("#experience-list .experienceBlock").each(function () {
      const $block = $(this);
      const startVal = $block.find("[name='startDate']").val();
      const endVal = $block.find("[name='endDate']").val();
      const start = startVal ? startVal.split("-") : ["", ""];
      const end = endVal ? endVal.split("-") : ["", ""];

      result.experiences.push({
        organizationName: $block.find("[name='organizationName']").val(),
        position: $block.find("[name='position']").val(),
        positionLevel: "",
        responsibilities: $block.find("[name='responsibilities']").val(),
        startDate: { month: start[1] || "", year: start[0] || "" },
        endDate: { month: end[1] || "", year: end[0] || "" },
        isCurrent: $block.find("[name='isCurrent']").is(":checked")
      });
    });

    const formData = new FormData();
    formData.append("resumeId", result.resumeId);
    formData.append("experiences", JSON.stringify(result.experiences));
    formData.append("totalDuration", JSON.stringify(result.totalDuration));
    formData.append("recommendations", result.recommendations);

    fetch(`${API_HOST}/komus_career_app/api/controller.html?action=send_resume_experience_data`, {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.success) {
          const nextUrl = `?page=profile-form&tab=skills&resume_id=${window.resumeId}`;
          history.pushState({}, "", nextUrl);
          window.dispatchEvent(new Event("popstate"));
        } else {
          alert("Ошибка при сохранении: " + response.error_text);
        }
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        alert("Ошибка при отправке данных");
      });
  });

  // Первичный пересчет стажа
  recalculateDuration();
}
