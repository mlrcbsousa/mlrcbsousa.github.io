function OnToggleExpand ({ target }) {
    const icon = target.nextElementSibling.querySelector("i");
    const newIcon = document.createElement("i");

    newIcon.className = "fa";
    target.checked
        ? newIcon.classList.add("fa-angle-up")
        : newIcon.classList.add("fa-angle-down");
    icon.replaceWith(newIcon);
}

function OnToggleExpandAll ({ target }) {
    const items = target.parentElement.nextElementSibling.querySelectorAll("input");
    const newIcon = document.createElement("i");

    newIcon.className = "fa";
    newIcon.addEventListener("click", OnToggleExpandAll);

    if(target.classList.contains("fa-angle-double-down")) {
        items.forEach(el => el.checked = true);
        newIcon.classList.add("fa-angle-double-up");
    } else {
        items.forEach(el => el.checked = false);
        newIcon.classList.add("fa-angle-double-down");
    }
    target.replaceWith(newIcon);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const items = document.querySelectorAll(".vertical-accordion input");
    items.forEach(el => el.addEventListener("change", OnToggleExpand));

    const allButtons = document.querySelectorAll(".fa-angle-double-down");
    allButtons.forEach(el => el.addEventListener("click", OnToggleExpandAll));
});