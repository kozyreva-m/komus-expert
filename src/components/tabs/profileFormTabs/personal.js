import { API_HOST } from "../../../js/api";
import { handleFormSubmit } from "../../../js/utils";
import "./personal.css";

export function renderPersonalTab(data) {
    const $container = $("#form-tab-content").empty();

    const html = `
      <form id="personal-form" class="profile-form" enctype="multipart/form-data">
        <div class="form-row">
          <label>Фамилия <span class="required">*</span></label>
          <input name="lastName" type="text" required value="${data.lastName}" disabled />
        </div>
  
        <div class="form-row">
          <label>Имя <span class="required">*</span></label>
          <input name="firstName" type="text" required value="${data.firstName}" disabled />
        </div>
  
        <div class="form-row">
          <label>Отчество</label>
          <input name="fatherName" type="text" value="${data.fatherName}" disabled />
        </div>
  
        <div class="form-row">
          <label>Пол</label>
          <div class="radio-group">
            <label><input type="radio" name="gender" value="m" ${data.gender === "m" ? "checked" : ""} disabled /> Мужской</label>
            <label><input type="radio" name="gender" value="w" ${data.gender === "w" ? "checked" : ""} disabled /> Женский</label>
            <label><input type="radio" name="gender" value="unspecified" ${data.gender === "unspecified" ? "checked" : ""} disabled /> Не указывать</label>
          </div>
        </div>
  
        <div class="form-row">
          <label>Дата рождения</label>
          <input type="date" name="birthDate" value="${data.birthDate}" disabled />
          <div class="birth-date-options">
            <label><input type="checkbox" name="isShowYearBirthDate" ${data.isShowYearBirthDate === "on" ? "checked" : ""} /> Не показывать год</label>
            <label><input type="checkbox" name="isHiddenBirthDate" ${data.isHiddenBirthDate === "on" ? "checked" : ""} /> Не показывать дату</label>
          </div>
        </div>
  
        <div class="form-row">
          <label>Семейное положение</label>
          <div class="radio-group">
            <label><input type="radio" name="maritalStatus" value="single" ${data.maritalStatus === "single" ? "checked" : ""}/> Холост (не замужем)</label>
            <label><input type="radio" name="maritalStatus" value="married" ${data.maritalStatus === "married" ? "checked" : ""}/> Женат (замужем)</label>
            <label><input type="radio" name="maritalStatus" value="unspecified" ${data.maritalStatus === "unspecified" ? "checked" : ""}/> Не указывать</label>
          </div>
        </div>
  
        <div class="form-row">
          <label>Гражданство</label>
          <input name="citizenship" type="text" value="${data.citizenship}" />
        </div>
  
        <div class="form-row">
          <label>Регион проживания <span class="required">*</span></label>
          <input name="regionOfResidence" type="text" required value="${data.regionOfResidence}" />
        </div>
  
        <div class="form-row">
          <label>Ближайшее метро</label>
          <input name="subwayStation" type="text" value="${data.subwayStation}" />
        </div>
  
        <div class="form-row">
          <label>Адрес</label>
          <input name="address" type="text" value="${data.address}" />
        </div>
  
        <div class="form-row">
          <label>Мобильный телефон <span class="required">*</span></label>
          <input name="phone" type="tel" required value="${data.phone}" />
        </div>
  
        <div class="form-row">
          <label>Домашний телефон</label>
          <input name="additionalPhone" type="tel" value="${data.additionalPhone || ""}" />
        </div>
  
        <div class="form-row">
          <label>Email</label>
          <input name="email" type="email" value="${data.email}" />
        </div>
  
        <div class="form-row">
          <label>Telegram</label>
          <input name="telegram" type="text" value="${data.telegram}" />
        </div>
  
        <div class="form-row">
          <label>Фотография <span class="required">*</span></label>
          <div class="photo-block">
              ${data.photo ? `<img src="${data.photo}" alt="Фото" class="photo-preview" />` : ""}
              <div class="photo-upload">
                  <input type="file" name="photo" accept="image/*" ${data.photo ? "" : "required"} />
                  <small>Формат jpg, png, gif. До 10 МБ</small>
              </div>
          </div>
        </div>

        <div class="formActions">
          <button type="submit" class="submitButton">Продолжить</button>
        </div>
      </form>
    `;

    $container.append(html);

    $("input[name='photo']").on("change", function () {
        const file = this.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            const $preview = $(".photo-preview");

            if ($preview.length > 0) {
                $preview.attr("src", objectUrl);
            } else {
                $(this).before(`<img src="${objectUrl}" alt="Фото" class="photo-preview" />`);
            }
        }
    });

    // Назад
    $("#go-back").on("click", function () {
        window.history.pushState({}, "", "?tab=profile");
        window.dispatchEvent(new Event("popstate"));
    });

    // Отправка формы
    $("#personal-form").on("submit", async function (e) {
        e.preventDefault();

        const form = this;
        const formData = new FormData(form);
        const fileInput = form.querySelector("input[name='photo']");
        const hasFile = fileInput.files.length > 0;
        const existingPhotoUrl = $(".photo-preview").attr("src");

        formData.set("isHiddenBirthDate", form.querySelector("[name='isHiddenBirthDate']").checked ? "on" : "off");
        formData.set("isShowYearBirthDate", form.querySelector("[name='isShowYearBirthDate']").checked ? "on" : "off");

        if (!hasFile) {
            formData.delete("photo")
            if (!existingPhotoUrl) {
                alert("Пожалуйста, прикрепите фотографию.");
                return;
            }
        }

        if (window.resumeId) {
            formData.append("resumeId", window.resumeId);
        }

        await handleFormSubmit({
            formData,
            apiUrl: `${API_HOST}/komus_career_app/api/controller.html?action=send_resume_personal_data`,
            onSuccess: () => {
                const resumeId = window.resumeId;
                const nextUrl = `?page=profile-form&tab=experience&resume_id=${resumeId}`;
                history.pushState({}, "", nextUrl);
                window.dispatchEvent(new Event("popstate"));
            }
        });
    });
}

