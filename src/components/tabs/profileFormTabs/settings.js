import "./settings.css";

export function renderSettingsTab() {
  const $container = $("#form-tab-content").empty();

  const mockData = {
    communityName: "Блог Василия Пупкина",
    communityType: "public", // public | private
    profileVisibility: "all", // all | hr
  };

  const formHtml = `
    <form id="final-form" class="profile-form">

      <h3 class="sectionTitle">НАСТРОЙКИ СООБЩЕСТВА</h3>
      <div class="finalBlock">
        <div class="formField">
          <label>Название сообщества</label>
          <input type="text" name="communityName" value="${mockData.communityName}" />
        </div>

        <div class="formField vertical">
          <label>Категория сообщества</label>
          <label class="radioLabel">
            <input type="radio" name="communityType" value="public" ${mockData.communityType === "public" ? "checked" : ""} />
            Открытое сообщество
            <span class="desc">Может читать и подписываться любой желающий</span>
          </label>
          <label class="radioLabel">
            <input type="radio" name="communityType" value="private" ${mockData.communityType === "private" ? "checked" : ""} />
            Закрытое сообщество
            <span class="desc">Могут читать только избранные вами люди</span>
          </label>
        </div>
      </div>

      <h3 class="sectionTitle">НАСТРОЙКИ ПРОФИЛЯ</h3>
      <div class="finalBlock">
        <div class="formField vertical">
          <label>Видимость профиля</label>
          <label class="checkboxLabel">
            <input type="radio" name="profileVisibility" value="all" ${mockData.profileVisibility === "all" ? "checked" : ""} />
            Видно всем
            <span class="desc">Данные профиля может посмотреть любой зарегистрированный пользователь</span>
          </label>
          <label class="checkboxLabel">
            <input type="radio" name="profileVisibility" value="hr" ${mockData.profileVisibility === "hr" ? "checked" : ""} />
            Видно только HR-BP и Кадровой службе
            <span class="desc">Просматривать могут только вы, HR BP администраторы системы и службы персонала</span>
          </label>
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
        visibility: $("[name='profileVisibility']:checked").val(),
      },
    };

    console.log("Отправка данных (моки):", result);

    // тут в будущем будет реальный fetch
    alert("Данные сохранены (моки)");
  });
}
