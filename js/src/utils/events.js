const listeners = new Map();

export const createEventEmitter = () => {
  return {
    addListener(event, cb) {
      const allEvents = listeners.get(event) || [];
      listeners.set(event, [...allEvents, cb]);

      return () => {
        const events = listeners.get(event) || [];

        if (events.length === 1) {
          listeners.delete(event);
          return;
        }

        listeners.set(
          event,
          events.filter((e) => e !== cb)
        );
      };
    },

    emit(event, data) {
      if (!listeners.has(event)) {
        return;
      }

      const allEvents = listeners.get(event) || [];
      allEvents.forEach((cb) => cb(data));
    },

    removeAllListeners() {
      listeners.clear();
    },
  };
};

export default createEventEmitter;