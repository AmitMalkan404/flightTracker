import { injectable } from "inversify";
import * as log from "loglevel";

//@injectable()
export class EventBus {
    private subscriptions: any;
    constructor() {
        this.subscriptions = {};
      }
      public subscribe(
        subscriberId: string,
        eventTopic: string,
        callback: any,
      ): boolean {
        let retFlag = true;
    
        try {
          if (
            subscriberId === undefined ||
            eventTopic === undefined ||
            callback === undefined
          ) {
            throw new Error(`eventTopic-is undefined or callback is undefined`);
          } else if (!this.subscriptions[subscriberId])
            this.subscriptions[subscriberId] = [];
    
          if (!this.subscriptions[subscriberId][eventTopic])
            this.subscriptions[subscriberId][eventTopic] = [];
    
          this.subscriptions[subscriberId][eventTopic].push(callback);
        } catch (e) {
          log.error(e);
          retFlag = false;
        }
    
        return retFlag;
      }
    
      public subscribers(eventsObject: Array<any> = []): boolean {
        let retFlag = true;
        try {
          if (eventsObject.length === 0) {
            throw new Error(`eventsObject is empty`);
          } else {
            for (let i = 0; i < eventsObject.length; i++) {
              this.subscribe(
                eventsObject[i].subscriberId,
                eventsObject[i].key,
                eventsObject[i].callback,
              );
            }
          }
        } catch (e) {
          log.error(e);
          retFlag = false;
        }
    
        return retFlag;
      }
    
      public publish(eventTopic: string, arg: any): void {
        const subscribers = Object.keys(this.subscriptions);
    
        for (let index = 0; index < subscribers.length; index++) {
          if (!this.subscriptions[subscribers[index]][eventTopic]) continue;
    
          this.subscriptions[subscribers[index]][eventTopic].forEach((callback) => {
            callback(arg);
          });
        }
      }
      public unsubscribe(subscriberId: string, eventTopic: string): boolean {
        let retFlag = true;
        try {
          if (subscriberId === undefined || eventTopic === undefined) {
            throw new Error(`eventTopic is undefined`);
          } else if (this.subscriptions[subscriberId] !== undefined) {
            this.subscriptions[subscriberId][eventTopic] = [];
          }
        } catch (e) {
          log.error(e);
          retFlag = false;
        }
        return retFlag;
      }
}