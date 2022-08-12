import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FElement } from "./../../mixins/components/f-element/f-element";

/**
 * @summary Text component includes Headings, titles, body texts and links.
 */
@customElement("f-text-backup")
export class FTextBackup extends FElement {
  /**
   * @attribute is text editatble
   */
  @property({ reflect: true, type: Boolean })
  editable?: boolean = false;

  /**
   * @attribute will display `more` link after 2 lines
   */
  @property({ reflect: true, type: Boolean })
  expandable?: boolean = false;

  protected _contentBeforeFocus = "";
  protected value = "";

  constructor() {
    super();
    this.addEventListener("focusin", this._handleFocusIn);
    this.addEventListener("keyup", this._handleKeyUp);
  }
  _handleFocusIn() {
    if (this.editable) {
      this._contentBeforeFocus = this.innerHTML;
    }
  }
  _handleKeyUp(event: KeyboardEvent) {
    if (this.editable) {
      if (event.key === "Escape") {
        this.blur();
        this.innerHTML = this._contentBeforeFocus;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        this.value = this.innerHTML;
        this.blur();
        this.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }
  get isTextClamped() {
    return this.scrollHeight > this.clientHeight && this.expandable;
  }
  render() {
    if (this.editable) {
      this.contentEditable = "true";
    } else {
      this.contentEditable = "false";
    }

    // if (this.isTextClamped) {
    //   const span = document.createElement("span");
    //   span.innerHTML = "more";
    //   this.appendChild(span);
    // }
    return html``;
  }
}
