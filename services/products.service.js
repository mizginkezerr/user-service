"use strict";

const {MoleculerClientError} = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
/**
 * create service
 */
module.exports = {

	name: "products",
	version: "v1",
	mixins: [
		DbService("products"),
		CacheCleanerMixin([
			"cache.clean.products"
		])
	],
	/**
	 * Service settings
	 */
	settings: {
		fields: [
			"_id",
			"handle",
			"title",
			"body",
			"vendor",
			"product_category",
			"type",
			"tags",
			"published",
			"option1_name",
			"option1_value",
			"option2_name",
			"option2_value",
			"option3_name",
			"option3_value",
			"variant_sku",
			"variant_grams",
			"variant_inventory_tracker",
			"variant_inventory_qty",
			"variant_inventory_policy",
			"variant_fulfillment_service",
			"variant_price",
			"variant_compare_at_price",
			"variant_requires_shipping",
			"variant_taxable",
			"variant_barcode",
			"image_src",
			"image_position",
			"image_alt_text",
			"gift_card",
			"seo_title",
			"seo_description",
			"google_shopping_google_product_category",
			"google_shopping_gender",
			"google_shopping_age_group",
			"google_shopping_mpn",
			"google_shopping_adwords_grouping",
			"google_shopping_adwords_labels",
			"google_shopping_condition",
			"google_shopping_custom_product",
			"google_shopping_custom_label_0",
			"google_shopping_custom_label_1",
			"google_shopping_custom_label_2",
			"google_shopping_custom_label_3",
			"google_shopping_custom_label_4",
			"variant_image",
			"variant_weight_unit",
			"variant_tax_code",
			"cost_per_item",
			"price_international",
			"compare_at_price_international",
			"status"
		],
		entityValidator: {
			handle: {type: "string"},
			title: {type: "string"},
			body: {type: "string"},
			vendor: {type: "string"},
			product_category: {type: "string"},
			type: {type: "string"},
			tags: {type: "string"},
			published: {type: "boolean", default: true},
			option1_name: {type: "string"},
			option1_value: {type: "string"},
			option2_name: {type: "string"},
			option2_value: {type: "string"},
			option3_name: {type: "string"},
			option3_value: {type: "string"},
			variant_sku: {type: "string"},
			variant_grams: {type: "string"},
			variant_inventory_tracker: {type: "string"},
			variant_inventory_qty: {type: "number", default: 200},
			variant_inventory_policy: {type: "string", default:"deny"},
			variant_fulfillment_service: {type: "string", default: "manual\n"},
			variant_price: {type: "number", default: 5},
			variant_compare_at_price: {type: "string"},
			variant_requires_shipping: {type: "string"},
			variant_taxable: {type: "string"},
			variant_barcode: {type: "string"},
			image_src: {type: "string"},
			image_position: {type: "string", default:1},
			image_alt_text: {type: "string"},
			gift_card: {type: "string"},
			seo_title: {type: "string"},
			seo_description: {type: "string"},
			google_shopping_google_product_category: {type: "string"},
			google_shopping_gender: {type: "string"},
			google_shopping_age_group: {type: "string"},
			google_shopping_mpn: {type: "string"},
			google_shopping_adwords_grouping: {type: "string"},
			google_shopping_adwords_labels: {type: "string"},
			google_shopping_condition: {type: "string"},
			google_shopping_custom_product: {type: "string"},
			google_shopping_custom_label_0: {type: "string"},
			google_shopping_custom_label_1: {type: "string"},
			google_shopping_custom_label_2: {type: "string"},
			google_shopping_custom_label_3: {type: "string"},
			google_shopping_custom_label_4: {type: "string"},
			variant_image: {type: "string"},
			variant_weight_unit: {type: "string"},
			variant_tax_code: {type: "string"},
			cost_per_item: {type: "string"},
			price_international: {type: "string"},
			compare_at_price_international: {type: "string"},
			status: {type: "string", default: "active"},
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
		},
		remove: {
			auth: "required",
			visibility: "private",
		},
		increaseQuantity: {
			auth: "required",
			rest: "PUT /:id/quantity/increase",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {$inc: {variant_inventory_qty: ctx.params.value}});
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			auth: "required",
			rest: "PUT /:id/quantity/decrease",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {$inc: {variant_inventory_qty: -ctx.params.value}});
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
		/**
		 * Transform the result entities to follow the API spec
		 *
		 * @param {Context} ctx
		 * @param {Array} entities
		 */
		async transformResult(ctx, entities) {
			if (Array.isArray(entities)) {
				const fraud_data = await this.Promise.all(entities.map(item => this.transformEntity(ctx, item)));
				return {
					fraud_data
				};
			} else {
				const fraud_data = await this.transformEntity(ctx, entities);
				return {fraud_data};
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
