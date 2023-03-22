def ErrorHandler(func):
    def InnerFunc(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except MinorError as e:
            send_to_db()
            print(*args, e)
        except AverageError as e:
            send_to_db()
            send_to_telegram()
            print(*args, e)
        except SevereError as e:
            send_to_db()
            send_to_telegram()
            print(*args, e)
        except Exception as e:
            print(*args, e)
    return InnerFunc

class MinorError(Exception):
    pass
class AverageError(Exception):
    pass
class SevereError(Exception):
    pass

def send_to_telegram():
    pass
def send_to_db():
    pass