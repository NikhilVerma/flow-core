import { html, PropertyValueMap, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import eleStyle from "./f-checkbox.scss";
import { FRoot } from "../../mixins/components/f-root/f-root";
import { unsafeSVG } from "lit-html/directives/unsafe-svg.js";
import checkedMark from "../../mixins/svg/checked-mark";
import indeterminateMark from "../../mixins/svg/indeterminate-mark";
import { FDiv } from "../f-div/f-div";
import { flowElement } from "./../../utils";

export type FCheckboxState = "primary" | "default" | "success" | "warning" | "danger";
export type FCheckboxCustomEvent = {
	value: string;
};

@flowElement("f-checkbox")
export class FCheckbox extends FRoot {
	/**
	 * css loaded from scss file
	 */
	static styles = [unsafeCSS(eleStyle), ...FDiv.styles];
	/**
	 * @attribute Value of a checkbox defines if it is selected, unselected or indeterminate.
	 */
	@property({ reflect: true, type: String })
	value?: "checked" | "unchecked" | "indeterminate" = "unchecked";

	/**
	 * @attribute States are used to communicate purpose and connotations. State of an checkbox is controlled by its wrapper f-field.
	 */
	@property({ reflect: true, type: String })
	state?: FCheckboxState = "default";

	/**
	 * @attribute f-checkbox can have 2 sizes.
	 */
	@property({ reflect: true, type: String })
	size?: "small" | "medium";

	/**
	 * @attribute disables the input element
	 */
	@property({ reflect: true, type: Boolean })
	disabled?: boolean = false;

	@query(".slot-wrapper")
	slotWrapper!: FDiv;

	/**
	 * emit event.
	 */
	handleInput(e: InputEvent) {
		e.stopPropagation();
		const event = new CustomEvent<FCheckboxCustomEvent>("input", {
			detail: {
				value: this.value === "unchecked" ? "checked" : "unchecked"
			},
			bubbles: true,
			composed: true
		});
		this.value = this.value === "unchecked" ? "checked" : "unchecked";
		this.dispatchEvent(event);
	}

	render() {
		/**
		 * Final html to render
		 */
		return html`
			<f-div
				class="f-checkbox-wrapper"
				size=${this.size}
				padding="none"
				gap="x-small"
				direction="column"
				width="hug-content"
				?disabled=${this.disabled}
			>
				<f-div
					class="f-checkbox-section"
					size=${this.size}
					align="top-left"
					padding="none"
					gap="medium"
					width="hug-content"
				>
					<input
						id="f-checkbox"
						class="f-checkbox"
						type="checkbox"
						data-qa-id=${this.getAttribute("data-qa-element-id")}
						checked=${this.value === "unchecked" ? false : true}
						state=${this.state}
						@input=${this.handleInput}
					/>
					<label for="f-checkbox" value=${this.value} state=${this.state} size=${this.size}>
						${this.value === "checked"
							? html`${unsafeSVG(checkedMark)}`
							: html`${unsafeSVG(indeterminateMark)}`}
					</label>
					<f-div
						padding="none"
						class="label-wrapper slot-wrapper"
						align="middle-left"
						direction="row"
						gap="small"
					>
						<slot name="label" @click=${this.handleInput} @slotchange=${this.checkSlots}></slot>
						<slot name="icon-tooltip" @slotchange=${this.checkSlots}></slot>
						<slot name="subtitle" @slotchange=${this.checkSlots}></slot>
					</f-div>
				</f-div>
				<slot name="description" @slotchange=${this.checkSlots}></slot>
				<slot name="help" @slotchange=${this.checkSlots}></slot>
			</f-div>
		`;
	}
	protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.updated(changedProperties);

		this.checkSlots();
	}

	checkSlots() {
		const labelSlots = this.shadowRoot?.querySelectorAll<HTMLSlotElement>(
			"slot[name='label'],slot[name='icon-tooltip'],slot[name='subtitle']"
		);
		let displaySlotWrapper = false;
		labelSlots?.forEach(slot => {
			if (slot.assignedNodes().length > 0) {
				displaySlotWrapper = true;
			}
		});

		if (!displaySlotWrapper) {
			this.slotWrapper.style.display = "none";
		}
	}
}

/**
 * Required for typescript
 */
declare global {
	interface HTMLElementTagNameMap {
		"f-checkbox": FCheckbox;
	}
}
