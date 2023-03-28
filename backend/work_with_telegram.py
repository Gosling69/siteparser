import telebot
from event_provider import *
import threading

API_KEY = '***REMOVED***'
USER_ID = ***REMOVED***
GROUP_ID = ***REMOVED***

bot = telebot.TeleBot(API_KEY, threaded=False)
# hohol = EventProvider()

# @bot.message_handler(commands=['hoholon'])
# def start(message):
#     if message.from_user.id == USER_ID:
#         hohol.set_status(True)
#         hohol.notify_hohol(hohol.status)
#         bot.send_message(message.chat.id, 'hohol on')
#     else:
#         bot.send_message(message.chat.id, 'Access denied')


# @bot.message_handler(commands=['hoholoff'])
# def start(message):
#     if message.from_user.id == USER_ID:
#         hohol.set_status(False)
#         hohol.notify_hohol(hohol.status)
#         bot.send_message(message.chat.id, 'hohol off')
#     else:
#         bot.send_message(message.chat.id, 'Access denied')

def send_message_to_group(msg):
    bot.send_message(chat_id=GROUP_ID, text=msg)

def send_message(msg):
    bot.send_message(chat_id=USER_ID, text=msg)

t = threading.Thread(target=bot.infinity_polling, daemon=True)
t.start()  # start the bot in a thread instead


# bot.polling()
