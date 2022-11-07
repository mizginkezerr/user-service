const config = require("config");
const RuleConfig = config.get("RULES");

const rules = [
	{
		"name": "transaction daily fail count",
		"on": true,
		"ignoreFactChanges": false,
		"condition": function (R) {
			R.when(this.transaction_fail_count >= RuleConfig.default.fail_count);
		},
		"consequence": function (R) {
			this.result = false;
			this.reason = "Daily failed transaction exceed";
			this.score = this.score + 25;
			R.stop();
		}
	},
	{
		"name": "transaction daily success count",
		"on": true,
		"ignoreFactChanges": false,
		"condition": function (R) {
			R.when(this.transaction_success_count >= RuleConfig.default.success_count);
		},
		"consequence": function (R) {
			this.result = false;
			this.reason = "Daily success transaction exceed";
			this.score = this.score + 25;
			R.stop();
		}
	},
	{
		"name": "transaction daily volume",
		"on": true,
		"ignoreFactChanges": false,
		"condition": function (R) {
			R.when(this.users_daily_volume >= RuleConfig.default.total_volume);
		},
		"consequence": function (R) {
			this.result = false;
			this.reason = "Daily volume exceed";
			this.score = this.score + 25;
			R.stop();
		}
	},
	{
		"name": "transaction daily ip count",
		"on": true,
		"condition": function (R) {
			R.when(this.daily_ip_count.length > RuleConfig.default.ip_count);
		},
		"consequence": function (R) {
			this.result = false;
			this.reason = "Too many ip changed ";
			this.score = this.score + 25;

			R.stop();
		}
	}
];

module.exports = rules;
