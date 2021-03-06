'use strict';

var util = require('util');
var statsd = require('./statsdLogger');

var decorate = (s, c) => {
  s.tags = c.tags || {};
  s.prefix = c.prefix;
  return s;
};

var isIgnored = (s, ignored) => {
  var ignore = false;
  ignored.forEach((p)=> {
    if (p.test(s.SubscriptionName)){
      ignore = true;
    }
  });

  return ignore;
};

module.exports = (topic, client, done) => {
  client.listSubscriptions(topic.TopicName, (err, subs) => {
    if(err){
      return done(err);
    }

    subs.filter((o) => {
      return !isIgnored(o, client.ignoredsubscriptions);
    }).forEach((s) => {
      statsd.subscription(decorate(s, client));
    });

    return done();
  });
};
