class EventProvider(object):
    def __init__(self, msgType) -> None:
        self.__observers = set()
        self.status = False
        self.msgType = msgType
        pass
    def attach(self, observer):
        self.__observers.add(observer)

    def detach(self, observer):
        self.__observers.remove(observer)

    def notify_updating(self, msg):
        for observer in self.__observers:
            observer.emit(self.msgType, msg)

    def set_status(self, arg):
        self.status = arg
    
    