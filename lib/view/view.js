export class View {
  constructor(rootElemId = "root") {
    this._root = document.getElementById(rootElemId);
    if (!this._root) throw new Error("Root element not found");
    this._init();
    this._views = new Map();
  }

  registerView(key, elemId, callback = () => {}) {
    const element = document.getElementById(elemId);
    if (!element) throw new Error(`Template with ID: ${elemId} not found.`);
    this._views.set(key, { element, callback });
  }

  _replaceView(template, data = null) {
    this._root.replaceChildren();
    const clone = template.element.content.cloneNode(true);
    this._root.appendChild(clone);
    template.callback?.(this._root, data);
  }
  goto(key, data = null) {
    history.pushState({ key, data }, null, "");
    const template = this._views.get(key);
    if (!template) {
      this._root.innerHTML = "view not found";
      return;
    }
    this._replaceView(template, data);
  }

  _init() {
    window.addEventListener("popstate", (e) => {
      console.log(e);
      const template = this._views.get(e.state.key);
      if (!template) {
        this._root.innerHTML = "view not found";
        return;
      }
      this._replaceView(template, e.state.data);
    });
  }
}
