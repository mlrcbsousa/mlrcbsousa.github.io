function OnToggleExpand ({ target }) {
    const icon = target.nextElementSibling.querySelector("i");
    const newIcon = document.createElement("i");

    newIcon.className = "fas";
    target.checked
        ? newIcon.classList.add("fa-compress-alt")
        : newIcon.classList.add("fa-expand-alt");
    icon.replaceWith(newIcon);
}

function OnToggleExpandAll ({ target }) {
    const items = target.parentElement.nextElementSibling.querySelectorAll("input");
    const newIcon = document.createElement("i");

    newIcon.className = "fas";
    newIcon.addEventListener("click", OnToggleExpandAll);

    if(target.classList.contains("fa-expand-arrows-alt")) {
        items.forEach(el => el.checked = true);
        newIcon.classList.add("fa-compress-arrows-alt");
    } else {
        items.forEach(el => el.checked = false);
        newIcon.classList.add("fa-expand-arrows-alt");
    }
    target.replaceWith(newIcon);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const items = document.querySelectorAll(".vertical-accordion input");
    items.forEach(el => el.addEventListener("change", OnToggleExpand));

    const allButtons = document.querySelectorAll(".fa-expand-arrows-alt");
    allButtons.forEach(el => el.addEventListener("click", OnToggleExpandAll));
});