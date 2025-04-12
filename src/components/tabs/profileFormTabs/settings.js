import "./settings.css";

export function renderSettingsTab() {
  const $container = $("#form-tab-content").empty();

  const mockData = {
    communityName: "Блог Василия Пупкина",
    communityType: "public", // public | private
    profileVisibility: {
      all: true,
      hr: false
    }
  };

  const formHtml = `
    <form id="final-form" class="profile-form">

      <h3 class="sectionTitle">НАСТРОЙКИ СООБЩЕСТВА</h3>
      <div class="finalBlock">
        <div class="formField" style="display: flex; flex-direction: row; gap: 12px;">
          <label style="width: 200px; flex-shrink: 0;">Название сообщества</label>
          <div style="flex-grow: 1;">
            <input type="text" name="communityName" value="${mockData.communityName}" style="width: 100%;" />
          </div>
        </div>

        <div class="formField" style="display: flex; flex-direction: row; gap: 12px;">
          <label style="width: 200px; flex-shrink: 0;">Категория сообщества</label>
          <div style="display: flex; flex-direction: column; gap: 24px; flex-grow: 1;">
            <label class="radioLabel">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="radio" name="communityType" value="public" ${mockData.communityType === "public" ? "checked" : ""} />
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span>Открытое сообщество</span>
                    <span class="desc" style="margin: 0;">Может читать и подписываться любой желающий</span>
                  </div>
                </div>
              </div>
            </label>
            <label class="radioLabel">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="radio" name="communityType" value="private" ${mockData.communityType === "private" ? "checked" : ""} />
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span>Закрытое сообщество</span>
                    <span class="desc" style="margin: 0;">Могут читать только избранные вами люди</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <h3 class="sectionTitle">НАСТРОЙКИ ПРОФИЛЯ</h3>
      <div class="finalBlock">
        <div class="formField" style="display: flex; flex-direction: row; gap: 12px;">
          <label style="width: 200px; flex-shrink: 0;">Видимость профиля</label>
          <div style="display: flex; flex-direction: column; gap: 24px; flex-grow: 1;">
            <label class="checkboxLabel">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="checkbox" name="profileVisibility" value="all" ${mockData.profileVisibility.all ? "checked" : ""} />
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span>Видно всем</span>
                    <span class="desc" style="margin: 0;">Данные профиля может посмотреть любой зарегистрированный пользователь</span>
                  </div>
                </div>
              </div>
            </label>
            <label class="checkboxLabel">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="checkbox" name="profileVisibility" value="hr" ${mockData.profileVisibility.hr ? "checked" : ""} />
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span>Видно только HR-BP и Кадровой службе</span>
                    <span class="desc" style="margin: 0;">Просматривать могут только вы, HR BP администраторы системы и службы персонала</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="formActions">
        <a href="?page=profile-form&tab=education&resume_id=${window.resumeId}" class="link">Вернуться в профиль</a>
        <button type="submit" class="submitButton">Сохранить</button>
      </div>
    </form>
  `;

  $container.append(formHtml);

  $("#final-form").on("submit", function (e) {
    e.preventDefault();

    const result = {
      resumeId: window.resumeId,
      communitySettings: {
        name: $("[name='communityName']").val(),
        type: $("[name='communityType']:checked").val(),
      },
      profileSettings: {
        visibility: {
          all: $("[name='profileVisibility'][value='all']").is(":checked"),
          hr: $("[name='profileVisibility'][value='hr']").is(":checked")
        }
      },
    };

    console.log("Отправка данных (моки):", result);

    // тут в будущем будет реальный fetch
    alert("Данные сохранены (моки)");
  });
}
