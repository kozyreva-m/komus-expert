import { API_HOST } from "../../../js/api";
import { handleFormSubmit } from "../../../js/utils";
import { validateForm } from "../../../js/validation";
import IMask from 'imask';
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
          <div class="radio-group gender-group">
            <label><input type="radio" name="gender" value="m" ${data.gender === "m" ? "checked" : ""} disabled /> Мужской</label>
            <label><input type="radio" name="gender" value="w" ${data.gender === "w" ? "checked" : ""} disabled /> Женский</label>
            <label><input type="radio" name="gender" value="unspecified" ${data.gender === "unspecified" ? "checked" : ""} disabled /> Не указывать</label>
          </div>
        </div>
  
        <div class="form-row">
          <label>Дата рождения</label>
          <div class="input-field">
            <div class="date-input-row">
              <input type="date" name="birthDate" value="${data.birthDate}" disabled />
              <label><input type="checkbox" name="isShowYearBirthDate" ${data.isShowYearBirthDate === "on" ? "checked" : ""} /> Не показывать год</label>
            </div>
            <div class="date-checkbox-row">
              <label><input type="checkbox" name="isHiddenBirthDate" ${data.isHiddenBirthDate === "on" ? "checked" : ""} /> Не показывать дату</label>
            </div>
          </div>
        </div>
  
        <div class="form-row">
          <label>Семейное положение</label>
          <div class="radio-group gender-group">
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
          <div class="phone-input">
            <input type="tel" name="phone" required placeholder="(999) 999-99-99" value="${data.phone ? data.phone.replace(/^\+7\s*/, '').replace(/[^\d]/g, '') : ''}" />
          </div>
        </div>
  
        <div class="form-row">
          <label>Домашний телефон</label>
          <input name="additionalPhone" type="text" inputmode="numeric" onkeypress="return /[0-9]/.test(event.key)" value="${data.additionalPhone ? data.additionalPhone.replace(/[^\d]/g, '') : ''}" />
        </div>
  
        <div class="form-row">
          <label>Email</label>
          <input 
              name="email" 
              type="email" 
              value="${data.email || ''}"
              disabled
          />
        </div>
  
        <div class="form-row">
          <label>Telegram</label>
          <input name="telegram" type="text" value="${data.telegram}" />
        </div>
  
        <div class="form-row">
          <label>Фотография <span class="required">*</span></label>
          <div class="photo-block">
            ${data.photo ? `<img src="${data.photo}" alt="Фото" class="photo-preview" />` : ""}
            <div class="file-upload">
              <button type="button" class="file-upload-button" onclick="$('input[name=photo]').click()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.3334 5.33333L8.00008 2L4.66675 5.33333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Выберите файл
              </button>
              <div class="file-info">JPG или PNG, не более 10 МБ</div>
              <input type="file" name="photo" accept="image/*" ${data.photo ? "" : "required"} style="display: none;" />
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

    // Инициализация маски для мобильного телефона
    const phoneInput = document.querySelector('input[name="phone"]');
    let phoneMask;

    if (phoneInput) {
        phoneMask = IMask(phoneInput, {
            mask: '(000) 000-00-00',
            lazy: false
        });

        // Если есть начальное значение, применяем маску
        if (phoneInput.value) {
            phoneMask.value = phoneInput.value;
        }
    }

    // Отправка формы
    $("#personal-form").on("submit", async function (e) {
        e.preventDefault();

        if (!validatePersonalForm()) {
            return;
        }

        const form = this;
        const formData = new FormData(form);
        
        // Добавляем телефон с кодом страны
        const phoneValue = phoneMask ? phoneMask.unmaskedValue : phoneInput.value;
        if (phoneValue) {
            formData.set('phone', '+7 ' + phoneMask.value);
        }

        const fileInput = form.querySelector("input[name='photo']");
        const hasFile = fileInput.files.length > 0;
        const existingPhotoUrl = $(".photo-preview").attr("src");
        const emailInput = form.querySelector("input[name='email']");

        // Добавляем email в formData, так как disabled поля не включаются автоматически
        if (emailInput && emailInput.value) {
            formData.set("email", emailInput.value);
        }

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

    // Валидация email при отправке формы
    const form = document.getElementById('personal-form');
    const emailInput = form.querySelector('input[name="email"]');

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            // Сбрасываем кастомную валидацию при каждом вводе
            this.setCustomValidity('');
        });
    }
}

function handlePhotoChange(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="uploaded-photo">
                    <div class="photo-name">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V13.3333C2 13.7015 2.29848 14 2.66667 14H13.3333C13.7015 14 14 13.7015 14 13.3333V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.33325 6.66667C6.06963 6.66667 6.66659 6.06971 6.66659 5.33333C6.66659 4.59695 6.06963 4 5.33325 4C4.59687 4 3.99992 4.59695 3.99992 5.33333C3.99992 6.06971 4.59687 6.66667 5.33325 6.66667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14.0001 10L10.6667 6.66667L2.66675 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ${file.name}
                    </div>
                    <button type="button" class="remove-photo" onclick="removePhoto()">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;
        }
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    const input = document.getElementById('photo');
    const preview = document.getElementById('photoPreview');
    input.value = '';
    preview.innerHTML = '';
}

function validatePersonalForm() {
    const fields = [
        {
            selector: $("[name='phone']"),
            name: "Мобильный телефон",
            value: $("[name='phone']").val(),
            customCheck: (value, $field) => {
                if (!value || value.replace(/[^0-9]/g, '').length < 10) {
                    return "Введите корректный номер мобильного телефона";
                }
                return null;
            }
        },
        {
            selector: $("[name='regionOfResidence']"),
            name: "Регион проживания",
            value: $("[name='regionOfResidence']").val()
        }
    ];

    return validateForm(fields);
}

