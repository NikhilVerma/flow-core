import { html, nothing, PropertyValueMap, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { FCheckbox, FDiv, FIconButton, FIcon, FRadio, FRoot, flowElement } from "@cldcvr/flow-core";
import { FTableSelectable } from "../f-table/f-table";
import eleStyle from "./f-tcell.scss";
import { FTrowChevronPosition } from "../f-trow/f-trow";
import { createRef, ref } from "lit/directives/ref.js";

export type FTcellAction = {
	icon: string;
	id: string;
	tooltip?: string;
	onClick?: (event: PointerEvent, element?: FIconButton) => void;
	onMouseOver?: (event: MouseEvent, element?: FIconButton) => void;
	onMouseLeave?: (event: MouseEvent, element?: FIconButton) => void;
};

export type FTcellActions = FTcellAction[];

@flowElement("f-tcell")
export class FTcell extends FRoot {
	/**
	 * css loaded from scss file
	 */
	static styles = [
		unsafeCSS(eleStyle),
		...FDiv.styles,
		...FCheckbox.styles,
		...FRadio.styles,
		...FIcon.styles,
		...FIconButton.styles
	];

	/**
	 * @attribute comments baout title
	 */
	@property({ type: Object, reflect: false })
	actions?: FTcellActions;

	@property({ type: Boolean, reflect: true })
	selected? = false;

	@property({ type: String, reflect: true })
	width?: string;

	@state()
	selectable?: FTableSelectable = "none";

	@state()
	isDisabled = false;

	@state()
	expandIcon = false;

	@state()
	expandIconPosition: FTrowChevronPosition = "right";

	@query("f-checkbox")
	checkbox?: FCheckbox;

	@query("f-radio")
	radio?: FRadio;

	@query(".row-toggler")
	chevron?: FIconButton;

	renderActions() {
		if (this.actions) {
			return html`${this.actions.map(ac => {
				const actionRef = createRef<FIconButton>();
				return html`<f-icon-button
					${ref(actionRef)}
					id=${ac.id}
					class="f-tcell-actions"
					size="medium"
					category="packed"
					state="neutral"
					.icon=${ac.icon}
					.tooltip=${ac.tooltip ?? undefined}
					@click=${(event: PointerEvent) => {
						if (ac.onClick) {
							ac.onClick(event, actionRef.value);
						}
					}}
					@mouseover=${(event: MouseEvent) => {
						if (ac.onMouseOver) {
							ac.onMouseOver(event, actionRef.value);
						}
					}}
					@mouseleave=${(event: MouseEvent) => {
						if (ac.onMouseLeave) {
							ac.onMouseLeave(event, actionRef.value);
						}
					}}
				></f-icon-button>`;
			})}`;
		}
		return nothing;
	}

	render() {
		return html`<div class="f-tcell-wrapper">
			${this.selectable === "multiple"
				? html`<f-checkbox
						?disabled=${this.isDisabled}
						@input=${this.handleSelection}
				  ></f-checkbox>`
				: nothing}
			${this.selectable === "single"
				? html`<f-radio
						?disabled=${this.isDisabled}
						@input=${this.handleSelection}
						class="cell-radio"
				  ></f-radio>`
				: nothing}
			${this.expandIcon && this.expandIconPosition === "left"
				? html`
						<f-icon-button
							size="medium"
							category="packed"
							class="row-toggler"
							state="neutral"
							@click=${this.toggleDetails}
							icon="i-chevron-down"
						></f-icon-button>
				  `
				: nothing}<slot></slot>
			<f-div class="details-toggle" width="hug-content" gap="medium" align="top-right">
				${this.renderActions()}
				${this.expandIcon && this.expandIconPosition === "right"
					? html`
							<f-icon-button
								size="medium"
								category="packed"
								class="row-toggler"
								state="neutral"
								@click=${this.toggleDetails}
								icon="i-chevron-down"
							></f-icon-button>
					  `
					: nothing}
			</f-div>
		</div>`;
	}

	setSelection(value = false, isDisabled = false) {
		this.isDisabled = isDisabled;
		if (value) {
			if (this.checkbox) {
				this.checkbox.value = "checked";
			}
			if (this.radio) {
				this.radio.value = "selected";
			}
		} else {
			if (this.checkbox) {
				this.checkbox.value = "unchecked";
			}
			if (this.radio) {
				this.radio.value = "unselected";
			}
		}
	}

	handleSelection(event: CustomEvent) {
		const toggle = new CustomEvent("update-row-selection", {
			detail: event.detail.value === "checked" || event.detail.value === "selected",
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(toggle);
	}
	toggleDetails() {
		const toggle = new CustomEvent("toggle-row", {
			detail: { value: this.chevron?.icon === "i-chevron-down" },
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(toggle);
	}
	protected async updated(
		changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): Promise<void> {
		super.updated(changedProperties);

		this.onmouseover = () => this.toggleColumnHighlight("add");

		this.onmouseleave = () => this.toggleColumnHighlight("remove");
		this.onclick = this.toggleColumnSelection;
		if (this.width) {
			this.style.minWidth = this.width;
			this.style.display = "block";
		}
	}

	toggleColumnSelection() {
		const row = this.closest("f-trow");
		if (row?.getAttribute("slot") === "header") {
			const columnIndex = Array.from(this.parentNode?.children ?? []).indexOf(this);
			const toggle = new CustomEvent("selected-column", {
				detail: { columnIndex },
				bubbles: true,
				composed: true
			});
			this.dispatchEvent(toggle);
		}
	}

	toggleColumnHighlight(type: "add" | "remove") {
		const row = this.closest("f-trow");
		if (row?.getAttribute("slot") === "header") {
			const columnIndex = Array.from(this.parentNode?.children ?? []).indexOf(this);
			const toggle = new CustomEvent("highlight-column", {
				detail: { columnIndex, type },
				bubbles: true,
				composed: true
			});
			this.dispatchEvent(toggle);
		}
	}
}

/**
 * Required for typescript
 */
declare global {
	export interface HTMLElementTagNameMap {
		"f-tcell": FTcell;
	}
}
