import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";
import { apiGet } from "./api.js";
import { setupTabs } from "../components/tabs/tabs.js";
import { renderProfileFormPage } from "../components/tabs/profileFormPage.js";

$(document).ready(function () {
    // Проверяем, находимся ли мы на правильном пути
    if (window.location.pathname !== '/komus_expert' && !window.location.pathname.startsWith('/komus_expert/')) {
        window.location.replace('/komus_expert');
        return;
    }

    apiGet("get_current_user", function (user) {
        const fullName = `${user.firstName} ${user.lastName}`;
        const avatarUrl = user.avatar.startsWith("http")
            ? user.avatar
            : `https://sdo.komus.net${user.avatar}`;

        $("#user-name").text(fullName);
        $("#user-avatar").css("background-image", `url(${avatarUrl})`);
    });

    const renderPage = () => {
        const page = new URLSearchParams(location.search).get("page");
        const tab = new URLSearchParams(location.search).get("tab");

        // Скрываем основной контент сразу, если мы на странице профиля
        if (page === "profile-form") {
            $("#main-layout").hide();
            renderProfileFormPage();
        } else {
            $("#main-layout").show();
            setupTabs();
        }
    };

    renderPage(); // начальный рендер

    // Обработчик смены адреса
    window.addEventListener("popstate", (e) => {
        e.preventDefault();
        renderPage();
    });
});
