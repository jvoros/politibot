"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Twit = require('twit');
var Bot = /** @class */ (function () {
    function Bot(name, botconfig) {
        this.name = name;
        this.twit = new Twit(botconfig);
        console.log('STARTING UP:', this.name);
    }
    // HELPERS
    Bot.prototype.extractStatus = function (tweet) {
        return tweet.truncated === true ? tweet.extended_tweet.full_text : tweet.text;
    };
    Bot.prototype.tweetCallback = function (err, data) {
        if (err) {
            console.log("--- ERROR (" + this.name + ")", err);
            return null;
        }
        console.log("+++ Status updated (" + this.name + ")");
        return data;
    };
    // THE BUSINESS
    // Utility funx
    Bot.prototype.getUsersIdsString = function (users, callback) {
        var _this = this;
        var users_array = Array.isArray(users) ? users : [users];
        this.twit.get('users/lookup', { screen_name: users_array.join() }, function (err, data) {
            if (err) {
                console.log("--- ERROR (" + _this.name + ")", err);
                callback(err);
            }
            callback(null, data.map(function (u) { return u.id_str; }).join());
        });
    };
    Bot.prototype.startStream = function (endpoint, params, callback) {
        var _this = this;
        this.stream = this.twit.stream(endpoint, params, callback);
        this.stream.on('tweet', function (tweet) {
            console.log(">>> Tweet received (" + _this.name + "): " + tweet.created_at + " by @" + tweet.screen_name);
            callback(tweet);
        });
        this.stream.on('connect', function () {
            console.log("::: Stream connected (" + _this.name + ")");
        });
        this.stream.on('reconnect', function (request, response, connectInterval) {
            console.log("xxx Reconnect Request (" + _this.name + "):", request);
            console.log("xxx Reconnect Response (" + _this.name + "):", response);
            console.log("xxx Reconnect Interval (" + _this.name + "):", connectInterval);
        });
        this.stream.on('error', function (err) {
            console.log("--- ERROR (" + _this.name + ") stream: ", err);
        });
    };
    // Tweeting funx
    Bot.prototype.tweet = function (status) {
        if (typeof status !== 'string') {
            return callback(new Error('tweet must be of type String'));
        }
        else if (status.length > 280) {
            return callback(new Error('tweet is too long: ' + status.length));
        }
        this.twit.post('statuses/update', { status: status }, this.tweetCallback.bind(this));
    };
    ;
    Bot.prototype.oldSchoolRetweet = function (tweet) {
        var rt_slug = "RT @" + tweet.user.screen_name + ": ";
        var status = this.extractStatus(tweet);
        var overage = status.length - (280 - rt_slug.length);
        var new_status;
        if (overage > 0) {
            var trim_position = status.length - overage - 3;
            new_status = status.slice(0, trim_position) + "...";
        }
        else {
            new_status = status;
        }
        console.log("::: Retweeting (" + this.name + "): " + new_status);
        return this.tweet("" + rt_slug + new_status);
    };
    // React to users' funx
    Bot.prototype.streamTweeterTweets = function (screen_names, callback) {
        var _this = this;
        var follow_ids = this.getUsersIdsString(screen_names, function (err, ids) {
            if (err)
                return;
            var stream = _this.startStream('statuses/filter', { follow: ids, tweet_mode: 'extended' }, function (tweet) {
                // only send tweets by user, not replies or RT by other users
                if (ids.split(',').includes(tweet.user.id_str))
                    callback(tweet);
            });
        });
    };
    Bot.prototype.getSomeTweetersTweets = function (screen_name, options, callback) {
        var params = __assign({ screen_name: screen_name, tweet_mode: 'extended' }, options);
        this.twit.get('statuses/user_timeline', params, function (err, data, response) {
            console.log("::: Received tweets from @" + screen_name);
            callback(err, data, response);
        });
    };
    return Bot;
}());
exports.default = Bot;
//# sourceMappingURL=Bot.js.map