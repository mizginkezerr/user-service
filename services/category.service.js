"use strict";

const {MoleculerClientError} = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");
/*const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");*/
/**
 * create service
 */
module.exports = {

	name: "category",
	version: "v1",
	mixins: [
		DbService("categories"),
		/*		CacheCleanerMixin([
					"cache.clean.categories"
				])*/
	],
	/**
	 * Service settings
	 */
	settings: {
		fields: [
			"_id",
			"language",
			"external_id",
			"main_category",
			"sub_1",
			"sub_2",
			"sub_3",
			"sub_4",
			"sub_5",
			"sub_6",
			"sub_7",
			"sub_8",
			"sub_9",
			"sub_10",
		],
		entityValidator: {
			language: {type: "string", default: "TR"},
			external_id: {type: "string"},
			main_category: {type: "string"},
			sub_1: {type: "string"},
			sub_2: {type: "string"},
			sub_3: {type: "string"},
			sub_4: {type: "string"},
			sub_5: {type: "string"},
			sub_6: {type: "string"},
			sub_7: {type: "string"},
			sub_8: {type: "string"},
			sub_9: {type: "string"},
			sub_10: {type: "string"}
		}
	},

	/**
	 * Service metadata
	 */
	metadata: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],
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
				/*ctx.params.fraud_data.status = false;*/
			}
		}
	},
	/**
	 * Actions
	 */
	actions: {
		get: {
			auth: "required",
		},
		create: {
			auth: "required",
		},
		list: {
			auth: "required",
		},
		find: {
			auth: "required",
			rest: "POST /search",
			params: {
				search: "string|required",
				page: "string"
			},
			async handler(ctx) {
				const doc = await this.adapter.find(
					{
						limit: 20,
						offset:ctx.params.page ?? 0,
						search: ctx.params.search
					}
				);
				return await this.transformDocuments(ctx, ctx.params, doc);
			}
		},
		count: {
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
			visibility: "private",
		},

	},
	/**
	 * Methods
	 */
	methods: {
		/**
		 * Transform the result entities to follow the API spec
		 *
		 * @param {Context} ctx
		 * @param {Array} entities
		 */
		async transformResult(ctx, entities) {
			if (Array.isArray(entities)) {
				const category_data = await this.Promise.all(entities.map(item => this.transformEntity(ctx, item)));
				return {
					category_data
				};
			} else {
				const category_data = await this.transformEntity(ctx, entities);
				return {category_data};
			}
		},

		/**
		 * Transform a result entity to follow the API spec
		 *
		 * @param {Context} ctx
		 * @param {Object} entity
		 */
		async transformEntity(ctx, entity) {
			if (!entity) return null;
			return entity;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
	}
};
