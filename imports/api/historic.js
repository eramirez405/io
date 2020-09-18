import { Meteor } from 'meteor/meteor';
import WebSocket from 'ws';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const bound = Meteor.bindEnvironment((callback) => {
  callback();
});

export const Historic = new Mongo.Collection('historic');

if (Meteor.isServer) {
  Meteor.publish('historic', function historicPublication() {
    if (this.userId) {
      return Historic.find({}, { sort: { timestamp: -1 } });
    } else {
      return [];
    }
  });

  Meteor.startup(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    var ws;
    wsUri = 'wss://192.168.1.150:1880/ws/io';

    function wsConnect() {
      ws = new WebSocket(wsUri);
      ws.onmessage = Meteor.bindEnvironment(function (msg) {
        // console.log(JSON.parse(msg.data));
        Historic.insert({ ...JSON.parse(msg.data), date: new Date() });
      });
      ws.onopen = function () {
        console.log('Conection established');
      };
      ws.onclose = function () {
        console.log('Connection losted');
        setTimeout(() => {
          console.log('Reconnect called');
          bound(() => wsConnect());
        }, 10000);
      };
    }

    wsConnect();
  });

  Meteor.methods({
    getHistory: async (display, startDate, endDate, filters) => {
      check(display, String);
      check(startDate, Date);
      check(endDate, Date);
      check(filters, Array);

      let filterObj = {};
      filters.forEach((e) => {
        filterObj[e.value] = 1;
      });

      console.log(filterObj);

      try {
        const res = await Historic.find(
          {
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
          { fields: { ...filterObj, date: 1 }, limit: 8000 }
        ).fetch();

        console.log(display, startDate, endDate, filters);

        return res;
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    },
  });
}
