"use strict";

const DbMixin = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

/**
 * @typedef {import("moleculer").Context} Context Moleculer's Context
 */

module.exports = {
	name: "transactions",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [
		DbMixin("transactions"),
		CacheCleanerMixin([
			"cache.clean.transactions"
		])
	],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"uuid",
			"merchant_id",
			"payment_method_id",
			"pos_id",
			"admin_id",
			"second_admin_id",
			"payment_url",

			"merchant_transaction_id",
			"merchant_user_id",
			"merchant_username",
			"merchant_user_firstname",
			"merchant_user_lastname",
			"merchant_user_gov_id",
			"merchant_user_phone",
			"merchant_user_email",
			"merchant_user_birth_year",
			"merchant_account_id",
			"cc_last_four",

			"amount",
			"paid_amount",
			"currency",
			"description",

			"provider_data_status",
			"provider_data_status_description",
			"provider_data_created_at",
			"provider_data_updated_at",
			"provider_data_id",

			"api_request",
			"api_response",
			"api_callback_request",

			"status",
			"notify",
			"createdAt",
			"updatedAt"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive"
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx) {
				ctx.params.status = false;
				ctx.params.notify = false;
				ctx.params.createdAt = new Date();
				ctx.params.updatedAt = new Date();

			}
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		list: {
			auth: "required",
		},
		find: {
			auth: "required"
		},
		count: {
			auth: "required",
			visibility: "private",
		},
		create: {
			auth: "required",
			visibility: "private",
		},
		insert: {
			auth: "required",
			visibility: "private",
		},
		update: {
			auth: "required",
			visibility: "private",
		},
		remove: {
			auth: "required",
			visibility: "private"
		},

		statusUpdate: {
			auth: "required",
			rest: "PUT /:id/:status",
			visibility: "private",
			params: {
				id: "string",
				status: "string"
			},
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {$inc: {status: ctx.params.status}});
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
