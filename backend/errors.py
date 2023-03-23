
QUANTITY_ERROR = "Quantity Not Found"
PRICE_ERROR = "Price Not Found"
PAGE_NOT_FOUND_ERROR = "Page not found"
PATH_FOR_PRICE_QUANTITY = "No path for price or quantity"

def ErrorHandler(func):
    def InnerFunc(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except MinorError as e:
            send_to_db()
            print(e)
        except AverageError as e:
            send_to_db()
            condition = True
            if condition:
                send_to_telegram()
            print(e)
        except SevereError as e:
            send_to_db()
            send_to_telegram()
            print(e)
        except Exception as e:
            print(e)
            send_to_telegram()
    return InnerFunc

class MinorError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.ErrorArguments = args
class AverageError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.ErrorArguments = args
class SevereError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.ErrorArguments = args


def send_to_telegram():
    # Make separate module telegram.py
    pass
def send_to_db():
    # Add function to mongo.py
    pass