
from database.models import User
from pywebpush import webpush, WebPushException
import datetime
import time
import requests
import schedule

from redis import Redis
from rq import Queue, Retry
from rq_scheduler import Scheduler 
from database import jobs
from rq.job import Job


q = Queue(connection=jobs.conn)
scheduler = Scheduler(queue=q, connection=jobs.conn)

def cal_days_diff(appointmentDate,todayDate):
  return (appointmentDate - todayDate).days






def send_web_push(subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS):
  print("Web push activated", flush = True)
  webpush(
    subscription_info= subscription_information,
    data= message_body,
    vapid_private_key= VAPID_PRIVATE_KEY,
    vapid_claims=VAPID_CLAIMS
  )


def convertTimeTo12Hr(__time__):
  splitTimeByHourAndMinute = __time__.split(":")
  h, m = int(splitTimeByHourAndMinute[0]), int(splitTimeByHourAndMinute[1])

  postfix = 'am'

  if h > 12:
    postfix = 'pm'
    h -= 12

  return '{}:{:02d}{}'.format(h or 12, m, postfix)





def getQuotes(dailyQuote, author):
  try:
    response = requests.get('https://zenquotes.io/api/random')
    jsn = response.json()
    dailyQuote[0] = jsn[0]["q"]
    author[0] = jsn[0]["a"]
    response.raise_for_status()
  except requests.exceptions.HTTPError as err:
    raise SystemExit(err)




def sendWeekly(_time, subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS):
  schedule.every(1).weeks.at(_time).do(lambda:send_web_push(subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS))
  while True:
    schedule.run_pending()
    time.sleep(1)
    


def sendDaily(_time, subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS):
    schedule.every(1).days.at(_time).do(lambda:send_web_push(subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS))
    while True:
      schedule.run_pending()
      time.sleep(1)


def sendMonthly(_time, subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS):
    schedule.every(4).weeks.at(_time).do(lambda:send_web_push(subscription_information, message_body, VAPID_PRIVATE_KEY, VAPID_CLAIMS))
    while True:
      schedule.run_pending()
      time.sleep(1)
