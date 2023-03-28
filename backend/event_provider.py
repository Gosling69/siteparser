class EventProvider(object):
    def __init__(self) -> None:
        self.__observers = set()
        self.status = False
        pass

    def attach(self, observer):
        self.__observers.add(observer)

    def detach(self, observer):
        self.__observers.remove(observer)

    def notify_hohol(self, msg):
        for observer in self.__observers:
            observer.emit("hohol",msg)

    def notify_updating(self, msg):
        for observer in self.__observers:
            observer.emit("isupdating",msg)

    def set_status(self, arg):
        self.status = arg
    
    