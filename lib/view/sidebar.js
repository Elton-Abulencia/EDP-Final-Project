export function sidebarInit(view, elemId = "sidebarButtons") {
  const elem = document.getElementById(elemId);

  function onSidebarLinksClick(e) {
    // console.log(e.target);
    const target = e.target;
    if (target.classList.contains("sidebar-link")) {
      if (target.dataset.view) {
        view.goto(target.dataset.view);
      }
    }
  }
  elem.addEventListener("click", onSidebarLinksClick);
}
