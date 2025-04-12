import { getResumeData } from "./api";
import { renderEducationTab } from "./profileFormTabs/education";
import { renderExperienceTab } from "./profileFormTabs/experience";
import { renderPersonalTab } from "./profileFormTabs/personal";
import { renderSettingsTab } from "./profileFormTabs/settings";
import { renderSkillsTab } from "./profileFormTabs/skills";

export function renderProfileFormPage() {
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
        <a href="?page=profile-form&tab=${tab.code}" 
           class="form-tab ${tab.code === tabParam ? "active" : ""}">
          ${tab.label}
        </a>
      `
            )
            .join("")}
    </div>
    <div id="form-tab-content" class="form-tab-content"></div>
  `;

    container.append(`<h2 class="form-title">Настройки профиля</h2>`);
    container.append(tabsHtml);

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
    });
}
