import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { FRoot } from "../../mixins/components/f-root/f-root";
import eleStyle from "./f-popover.scss";
import {
  computePosition,
  autoPlacement,
  offset,
  shift,
  flip,
  autoUpdate,
  Placement,
} from "@floating-ui/dom";

// export type FPopoverVariant = "relative" | "absolute";
export type FPopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "auto";
export type FPopoverSize = "stretch" | "large" | "medium" | "small";

@customElement("f-popover")
export class FPopover extends FRoot {
  /**
   * css loaded from scss file
   */
  static styles = [unsafeCSS(eleStyle)];

  //   /**
  //    * @attribute variant defines the position of a popover. A popover can be either relative to the source or absolute to the viewport.

  //    */
  //   @property({ type: String, reflect: true })
  //   variant?: FPopoverVariant = "relative";

  /**
   * @attribute In any placement, by default the popover is centrally aligned to the source and moves according to the space available.
   */
  @property({ type: String, reflect: true })
  placement?: FPopoverPlacement = "auto";

  /**
   * @attribute A popover can have different sizes depending on the use case from the range: small, medium, large, stretch.
   */
  @property({ type: String, reflect: true })
  size?: FPopoverSize = "medium";

  /**
   * @attribute is it open?
   */
  @property({ type: Boolean, reflect: true })
  open?: boolean = false;

  /**
   * @attribute display overlay?
   */
  @property({ type: Boolean, reflect: true })
  overlay?: boolean = true;

  /**
   * @attribute query selector of target
   */
  @property({ type: String, reflect: true })
  target!: string;

  @state()
  cleanup!: () => void;

  @state()
  isEscapeClicked = false;

  get targetElement() {
    return document.querySelector<HTMLElement>(this.target);
  }
  computePlacement() {
    return this.placement === "auto" ? undefined : this.placement;
  }
  computePosition() {
    let target = document.body;
    if (this.targetElement && this.open) {
      this.targetElement.style.zIndex = "200";
      target = this.targetElement;
    }
    if (this.open) {
      this.cleanup = autoUpdate(target, this, () => {
        computePosition(target, this, {
          placement: this.computePlacement(),
          strategy: "fixed",
          middleware: [
            offset({ mainAxis: 12, crossAxis: 12, alignmentAxis: 12 }),
            this.placement === "auto"
              ? autoPlacement({ boundary: document.body })
              : flip({
                  fallbackPlacements: [
                    this.placement as Placement,
                    "bottom-start",
                    "bottom-end",
                    "top-start",
                    "top-end",
                  ],
                  crossAxis: false,
                }),
            shift({ padding: 16 }),
          ],
        }).then(({ x, y }) => {
          if (target.nodeName.toLowerCase() !== "body") {
            Object.assign(this.style, {
              top: `${y}px`,
              left: `${x}px`,
            });
          } else {
            const left = (document.body.offsetWidth - this.offsetWidth) / 2;
            const top = (document.body.offsetHeight - this.offsetHeight) / 2;

            Object.assign(this.style, {
              top: `${top}px`,
              left: `${left}px`,
            });
          }
        });
      });
    }
  }
  disconnectedCallback() {
    if (this.cleanup) {
      this.cleanup();
    }
    document.removeEventListener("keydown", (e) =>
      this.escapekeyHandle(e, this)
    );
    this.removeEventListener("click", this.dispatchEsc);
    super.disconnectedCallback();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", (e) => this.escapekeyHandle(e, this));
    this.addEventListener("click", this.dispatchEsc);
  }
  dispatchEsc() {
    if (this.isEscapeClicked) {
      const event = new CustomEvent("esc", {
        detail: {
          message: "Popover close on escape key",
        },
        bubbles: true,
        composed: true,
      });
      this.isEscapeClicked = false;
      this.open = false;
      this.dispatchEvent(event);
    }
  }
  escapekeyHandle(e: KeyboardEvent, el: HTMLElement) {
    if (e.key === "Escape") {
      this.isEscapeClicked = true;
      el.click();
    }
  }
  overlayClick() {
    const event = new CustomEvent("overlay-click", {
      detail: {
        message: "Popover overlay clicked",
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (this.open) {
      const overlay = this.overlay
        ? html`<div class="f-overlay" @click=${this.overlayClick}></div>`
        : "";
      this.computePosition();
      return html`<slot></slot>${overlay} `;
    } else {
      if (this.targetElement) {
        this.targetElement.style.zIndex = "unset";
      }
    }
    return ``;
  }
}
