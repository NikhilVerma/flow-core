/* eslint-disable no-mixed-spaces-and-tabs */
import { html, fixture, expect } from "@open-wc/testing";
import IconPack from "@cldcvr/flow-system-icon/dist/types/icon-pack";
// import flow-core elements
import "@cldcvr/flow-core";

import { ConfigUtil } from "@cldcvr/flow-core";
import {
	FTableSchema,
	FTableSchemaData,
	FTableSchemaDataRow,
	FTableSchemaCell
} from "@cldcvr/flow-table";

ConfigUtil.setConfig({ iconPack: IconPack });

import { HTMLTemplateResult } from "lit";

export default function getFakeUsers(count = 100): FTableSchemaData {
	const users = [];

	for (let i = 0; i < count; i++) {
		const firstName = { value: `Vikas ${i}` };
		const lastName = { value: `Last name ${i}` };
		const email: FTableSchemaCell & { value: string } = {
			value: `vikas${i}@cldcvr.com`,
			template: function () {
				return html`<f-div gap="x-small"
					><f-icon state="warning" source="i-hashtag"></f-icon
					><f-text inline state="warning">${this.value}</f-text></f-div
				>` as HTMLTemplateResult;
			},
			actions: [
				{
					icon: "i-chat"
				},
				{
					icon: "i-mail"
				},
				{
					icon: "i-star"
				}
			]
		};
		const mobile = { value: `8989899981` };
		const sex = { value: `male` };
		const age = { value: `33` };
		const birthDate: FTableSchemaCell & { value: Date } = {
			value: new Date("December 17, 1995 03:24:00"),
			template: function () {
				return html`<f-div gap="small" width="hug-content">
					<f-icon source="i-date-time"></f-icon>
					<f-text inline
						>${this.value.getDate()}-${this.value.getMonth()}-${this.value.getFullYear()}</f-text
					></f-div
				>` as HTMLTemplateResult;
			},
			toString: function () {
				return this.value.toString();
			}
		};

		const address = {
			value: `Wagholi Pune 412207`
		};

		const userRow: FTableSchemaDataRow = {
			data: { firstName, lastName, age, birthDate, email, mobile, sex, address },
			selected: true,
			details: function () {
				return html`<f-div padding="large"
					><f-text state="danger">This is Details slot</f-text></f-div
				>` as HTMLTemplateResult;
			}
		};
		users.push(userRow);
	}

	return {
		header: {
			firstName: { value: "First name", sticky: true },
			lastName: { value: "Last name" },
			age: { value: "Age" },
			birthDate: { value: "Birth Date" },
			email: { value: "Email" },
			mobile: { value: "Mobile" },
			sex: { value: "Sex" },
			address: { value: "Address", width: "300px", selected: true, sticky: true }
		},
		rows: users
	};
}

describe("f-table-schema", () => {
	it("is defined", () => {
		const el = document.createElement("f-table-schema");
		expect(el).instanceOf(FTableSchema);
	});
	it("should display rows and column based on data", async () => {
		const el = await fixture<FTableSchema>(
			html`<f-table-schema .data=${getFakeUsers(2)}></f-table-schema>`
		);
		await el.updateComplete;

		await expect(el).shadowDom.to.equalSnapshot();
	});
});
