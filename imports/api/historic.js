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

        return res;
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    },
    getHistoryAlarms: async (display, startDate, endDate) => {
      check(display, String);
      check(startDate, Date);
      check(endDate, Date);

      const filters = [
        'AlarmHiVL1',
        'AlarmHiVL2',
        'AlarmHiVL3',
        'AlarmLwVL1',
        'AlarmLwVL2',
        'AlarmLwVL3',
        'AlarmIL1',
        'AlarmIL2',
        'AlarmIL3',
        'AlarmTHDV1',
        'AlarmTHDV2',
        'AlarmTHDV3',
        'AlarmTHDI1',
        'AlarmTHDI2',
        'AlarmTHDI3',
        'AlarmHiF',
        'AlarmLwF',
        'AlarmHiFP',
        'AlarmLwFP']

      let filterObj = {};
      filters.forEach((e) => {
        filterObj[e] = 1;
      });

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

        return res;
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    },
  });
}
