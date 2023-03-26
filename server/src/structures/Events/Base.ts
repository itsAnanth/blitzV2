import EventTypes from "./EventTypes";

abstract class Base {
    abstract eventType: EventTypes;
    abstract callback: (...args: any[]) => void;
}

export default Base;