import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import eleStyle from "./f-tab-node.scss";
import { FRoot } from "../../mixins/components/f-root/f-root";
import { FDiv } from "../f-div/f-div";
import { FTabNodeWidthProp } from "../f-tab/f-tab";
import { flowElement } from "./../../utils";

@flowElement("f-tab-node")
export class FTabNode extends FRoot {
	/**
	 * css loaded from scss file
	 */
	static styles = [unsafeCSS(eleStyle), ...FDiv.styles];

	/**
	 * @attribute width of `f-tab-node`
	 */
	@state()
	width?: FTabNodeWidthProp = "hug-content";

	/**
	 * @attribute id specifying which content to be shown matching the `id` of f-tab-node-content.
	 */
	@property({ type: String, reflect: true, attribute: "content-id" })
	contentId!: string;

	/**
	 * @attribute active selected f-tab-node
	 */
	@property({ type: Boolean, reflect: true })
	active?: boolean = false;

	/**
	 * tab-width
	 */
	get tabWidth() {
		if (this.width === "fill") {
			return "fill-container";
		} else if (this.width === "hug-content") {
			return this.width;
		} else {
			return `${this.width}px`;
		}
	}

	render() {
		/**
		 * setting up width attribute for applying css.
		 */
		this.setAttribute("width", this.width ?? "fill");
		/**
		 * logic for showing content based on content-id's
		 */
		const tabContentElement = document.getElementById(this.contentId);
		if (!this.active) {
			if (tabContentElement) {
				tabContentElement.style.display = "none";
			}
		} else {
			if (tabContentElement) {
				tabContentElement?.style?.removeProperty("display");
			}
		}

		/**
		 * Final html to render
		 */
		return html`<f-div data-qa-tab .width=${this.tabWidth} padding="medium" class="f-tab-node"
			><slot></slot
		></f-div>`;
	}
}

/**
 * Required for typescript
 */
declare global {
	interface HTMLElementTagNameMap {
		"f-tab-node": FTabNode;
	}
}
