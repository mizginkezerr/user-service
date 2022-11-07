"use strict";

const {MoleculerClientError} = require("moleculer").Errors;

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import("moleculer").Context} Context Moleculer's Context
 */

module.exports = {
    name: "subscribes",


    mixins: [DbMixin("subscribes")],
    whitelist: [
        "subscribe.create"
    ],
    /**
     * Settings
     */
    settings: {

        fields: ["_id","name","email","phone"],


        entityValidator: {
            name:{type:"string"},
            email:{type:"email"},
            phone:{type: "string", optional: true}
        },
    },

    /**
     * Action
     */
    hooks: {
        before: {
            /**
             * @param {Context} ctx
             */
            create(ctx) {
            }
        }
    },

    /**
     * Actions
     */
    actions: {
        create: {
            rest: "POST /subscribes",
            params: {
                user: {
                    type: "object", props: {
                        name: {type: "string"},
                        phone: {type: "string"},
                        email: {type: "email"},
                    }
                }
            },
            async handler(ctx) {
                let entity = ctx.params.user;
                await this.validateEntity(entity);
                if (entity.name) {
                    const found = await this.adapter.findOne({name: entity.name});
                    if (found)
                        throw new MoleculerClientError("Name is exist!", 422, "", [{
                            field: "Name",
                            message: "is exist"
                        }]);
                }

                if (entity.email) {
                    const found = await this.adapter.findOne({email: entity.email});
                    if (found)
                        throw new MoleculerClientError("Email is exist!", 422, "", [{
                            field: "email",
                            message: "is exist"
                        }]);
                }

                if (entity.phone) {
                    const found = await this.adapter.findOne({phone: entity.phone});
                    if (found)
                        throw new MoleculerClientError("phone is exist!", 422, "", [{
                            field: "phone",
                            message: "is exist"
                        }]);
                }

                const doc = await this.adapter.insert(entity);
                const subscribe = await this.transformDocuments(ctx, {}, doc);

                const json = await this.transformEntity(subscribe, true, ctx.meta.token);
                await this.entityChanged("created", json, ctx);
                await ctx.call("subscribe.create", {
                    subscribe: {
                        subscribe: json.subscribe._id.toString(),
                        amount: 0.000001,
                        currency: "try"
                    }
                });

                return json;
            }
        },

    },

    /**
     * Methods
     */
    methods: {
        /**
         *
         * @param {String} subscribe
         *
         * @results
         */
        findByUser(subscribe) {
            return this.adapter.findOne({subscribe});
        },

        /**
         *
         * @param {Context} ctx
         * @param {Array} entities
         * @param {Object} subscribe
         */
        async transformResult(ctx, entities, subscribe) {
            if (Array.isArray(entities)) {
                const subscribe = await this.Promise.all(entities.map(item => this.transformEntity(ctx, item, subscribe)));
                return {
                    subscribe
                };
            } else {
                const subscribe = await this.transformEntity(ctx, entities, usersubscribe);
                return {subscribe};
            }
        },


        async transformEntity(ctx, entity, subscribe) {
            if (!entity) return null;

            return entity;
        }
    },


};