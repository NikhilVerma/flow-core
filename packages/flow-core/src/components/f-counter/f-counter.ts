import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import eleStyle from "./f-counter.scss";
import { FRoot } from "../../mixins/components/f-root/f-root";
import { unsafeSVG } from "lit-html/directives/unsafe-svg.js";
import loader from "../../mixins/svg/loader";
import { classMap } from "lit-html/directives/class-map.js";

@customElement("f-counter")
export class FCounter extends FRoot {
  /**
   * css loaded from scss file
   */
  static styles = [unsafeCSS(eleStyle)];
  /**
   * @attribute A counter label denotes the numeric count of the entity associated with it
   */
  @property({ type: Number })
  label!: number;

  /**
   * @attribute The medium size is the default.
   */
  @property({ type: String })
  size?: "large" | "medium" | "small" = "medium";

  /**
   * @attribute The state of a counter helps in indicating the degree of emphasis of the parent component. The counter component inherits the state from the parent component. By default it is subtle.
   */
  @property({ type: String })
  state?: "primary" | "success" | "warning" | "danger" | "neutral" = "neutral";

  /**
   * @attribute Loader icon replaces the content of the counter .
   */
  @property({ type: Boolean })
  loading?: boolean = false;

  /**
   * @attribute The disabled attribute can be set to keep a user from clicking on the counter.
   */
  @property({ type: Boolean })
  disabled?: boolean = false;

  /**
   * mention required fields here
   */
  readonly required = ["label"];

  validateProperties() {
    if (!this.label) {
      throw new Error("f-counter : label is mandatory field");
    }
  }
  // this will abbreviate long labels to short
  get computedLabel() {
    if (this.label < 10) {
      return `0${this.label}`;
    } else if (this.label >= 10 && this.label < 1000) {
      return this.label;
    } else if (this.label >= 1000 && this.label < 10000) {
      return this.abbrNum(this.label, 1);
    } else if (this.label >= 10000 && this.label < 1000000) {
      return this.abbrNum(this.label, 0);
    } else if (this.label >= 1000000 && this.label < 10000000) {
      return this.abbrNum(this.label, 1);
    } else {
      return this.abbrNum(this.label, 0);
    }
  }

  abbrNum(number: number, decPlaces: number) {
    decPlaces = Math.pow(10, decPlaces);
    let fixedNumber = "";
    const abbrev = ["K", "M", "B", "T"];
    for (let i = abbrev.length - 1; i >= 0; i--) {
      const size = Math.pow(10, (i + 1) * 3);
      if (size <= number) {
        number = Math.round((number * decPlaces) / size) / decPlaces;
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }
        fixedNumber = String(number);
        fixedNumber += abbrev[i];
        break;
      }
    }

    return fixedNumber;
  }
  render() {
    // validate props/attributes and throws errors if required
    this.validateProperties();
    // classes to apply on inner element
    const classes: Record<string, boolean> = {
      "f-counter": true,
    };
    // merging host classes
    this.classList.forEach((cl) => {
      classes[cl] = true;
    });

    /**
     * Final html to render
     */
    return html`<div
      class=${classMap(classes)}
      size=${this.size}
      state=${this.state}
      ?loading=${this.loading}
      ?disabled=${this.disabled}
    >
      ${this.loading ? html`${unsafeSVG(loader)}` : html`${this.computedLabel}`}
    </div>`;
  }
}
/**
 * Required for typescript
 */
declare global {
  interface HTMLElementTagNameMap {
    "f-counter": FCounter;
  }
}
