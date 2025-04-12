// диспетчер табов

import { renderFollowersTab } from "./followers";
import { renderPostsTab } from "./posts";
import { renderProfileTab } from "./profile";
import { renderSubsTab } from "./subs";

import "./style.css";

const tabMap = {
  "Моя страница": { code: "profile", render: renderProfileTab },
  "Мои записи": { code: "posts", render: renderPostsTab },
  "Подписки": { code: "subs", render: renderSubsTab },
  "Мои подписчики": { code: "followers", render: renderFollowersTab }
};

const reverseTabMap = Object.fromEntries(
  Object.entries(tabMap).map(([k, v]) => [v.code, k])
);

export function setupTabs() {
  $(".tab-link").on("click", function (e) {
    e.preventDefault();
    const tabName = $(this).text().trim();
    const tabData = tabMap[tabName];

    if (tabData) {
      history.pushState({ tab: tabData.code }, "", `?tab=${tabData.code}`);
      setActiveTab(tabName);
      tabData.render();
    }
  });

  const currentTabCode = new URLSearchParams(location.search).get("tab");
  const initialTabName = reverseTabMap[currentTabCode] || "Моя страница";
  setActiveTab(initialTabName);
  tabMap[initialTabName].render();

  window.addEventListener("popstate", () => {
    const newTabCode = new URLSearchParams(location.search).get("tab");
    const newTabName = reverseTabMap[newTabCode] || "Моя страница";
    setActiveTab(newTabName);
    tabMap[newTabName].render();
  });
}

function setActiveTab(tabName) {
  $(".tab-link").removeClass("active");
  $(".tab-link").each(function () {
    if ($(this).text().trim() === tabName) {
      $(this).addClass("active");
    }
  });
}