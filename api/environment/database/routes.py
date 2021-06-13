from database.models import User, Reminder
from database import app, request, bcrypt, db
import json
from flask_login import login_user, logout_user, current_user, login_required
from flask import jsonify, send_from_directory, session
import sys
import jwt
from functools import wraps
import datetime
import datetime
import time
from database import modules
import base64
import schedule
from dotenv import load_dotenv
from pathlib import Path
import os

from redis import Redis
from rq import Queue, Retry
from rq_scheduler import Scheduler 
from database import jobs
from rq.job import Job

import sys
sys.path.append('../')



q = Queue(connection=jobs.conn)
scheduler = Scheduler(queue=q, connection=jobs.conn)



load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

VAPID_PUBLIC_KEY = "BJC37iFk2x1EjU-lVHrivl3QsFe2AiI43rBuXcT-3HX7lElLL4k3xNlmxr7k7tjPDiuzoFcZ8zB4PJB_7opIyW0"
VAPID_PRIVATE_KEY = PRIVATE_KEY




@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory("../frontend/build",'index.html')

@app.route("/index.css", defaults={'path':''})
def serve1(path):
    return send_from_directory("../frontend/build",'index.css')

@app.route("/static/css/2.6d358c49.chunk.css", defaults={'path':''})
def serve2(path):
    return send_from_directory("../frontend/build/static/css",'2.6d358c49.chunk.css')




@app.route("/static/js/2.0607854a.chunk.js", defaults={'path':''})
def serve3(path):
    return send_from_directory("../frontend/build/static/js",'2.0607854a.chunk.js')

@app.route("/static/js/2.0607854a.chunk.js.map", defaults={'path':''})
def serveMap(path):
    return send_from_directory("../frontend/build/static/js",'2.0607854a.chunk.js.map')



@app.route("/static/js/main.0b27e75e.chunk.js", defaults={'path':''})
def serve4(path):
    return send_from_directory("../frontend/build/static/js",'main.0b27e75e.chunk.js')


@app.route("/sw.js", defaults={'path':''})
def serve5(path):
    return send_from_directory("../frontend/build",'sw.js')

@app.route("/static/js/runtime-main.39535011.js", defaults={'path':''})
def serve6(path):
    return send_from_directory("../frontend/build/static/js",'runtime-main.39535011.js')



@app.route("/static/js/main.0b27e75e.chunk.js.map", defaults={'path':''})
def serve7(path):
    return send_from_directory("../frontend/build/static/js",'main.0b27e75e.chunk.js.map')




@app.route("/static/css/2.6d358c49.chunk.css.map", defaults={'path':''})
def serve9(path):
    return send_from_directory("../frontend/build/static/css",'2.6d358c49.chunk.css.map')



@app.route("/build/asset-manifest.json", defaults={'path':''})
def manifest(path):
    return send_from_directory("../frontend/build",'asset-manifest.json')


@app.route("/build/precache-manifest.a1fb29b041010b8d342245f4a70912d4.js", defaults={'path':''})
def maifest_Cache(path):
    return send_from_directory("../frontend/build",'precache-manifest.a1fb29b041010b8d342245f4a70912d4.js')

@app.route("/static/js/runtime-main.39535011.js.map", defaults={'path':''})
def serve10(path):
    return send_from_directory("../frontend/build/static/js",'runtime-main.39535011.js.map')

@app.route("/register", methods= ['POST', 'GET'])
def registerForm():
    if request.method == 'POST':
        name = request.form["personName"]
        number = request.form["phoneNumber"]
        email = request.form["personEmail"]
        password = request.form["password"]
        confirmPassword = request.form["confirmPassword"]
        duplicateEmail =  User.query.filter_by(email=email).first()

        if password != confirmPassword:
            return json.dumps({"passwordError": "Passwords Do Not Match! "}), 403
        if  duplicateEmail is not None:
            return json.dumps({"duplicateEmailError": "E-mail Already Exists! Please sign in."}), 409

        pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(name = name, email = email, password = pw_hash, number = number)
        
        db.session.add(user)
        db.session.commit()
        return json.dumps({"message": "Successfully Registered"}),200


@app.route("/login", methods = ['POST', 'GET'])
def logInForm():
    if request.method == 'POST':
        email = request.form['personEmail']
        password = request.form['password']
        getPerson = User.query.filter_by(email=email).first()
        
    
        if getPerson != None:
            hash_pass = getPerson.password
        if getPerson and bcrypt.check_password_hash(hash_pass, password):
            login_user(getPerson)
            token = jwt.encode({'public_id': getPerson.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365)}, app.config['SECRET_KEY'] )
            return jsonify({'token':token.decode('UTF-8')})
        
        return json.dumps({"errorMessage":"E-mail Does Not Exist or Password Is Incorrect"}), 404


@app.route("/logout", methods = ['POST', 'GET'])

def logout():
    return json.dumps({"logOut": True})

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        req_data = {}
        req_data['headers'] = dict(request.headers)
        token = req_data['headers']['Authorization']
        if token == "undefined":
            return jsonify({'message': 'Token is missing.'}), 404
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(id=data['public_id']).first()
        except:
            return jsonify({'message': 'token is invalid'}), 401

        return f(current_user, token, *args, **kwargs)
    return decorator

@app.route("/reminders", methods =['POST', 'GET'])
@token_required
def createReminders(current_user, token):
    if request.method == 'POST':
        form = json.loads(request.data.decode('UTF-8'))
        date = form['reminderDate'].split("-")
        regularDate = form['reminderDate']
        regularTime = form['reminderTime']
        time = form['reminderTime'].split(":")
    
        dateAndTime = datetime.datetime(int(date[0]), int(date[1]), int(date[2]), int(time[0]), int(time[1]))
 
        
        text = form['reminderText']
        enableDesktopNotification = True if form['enableDesktopNotification'] is True else False
        reminderId = form['id']
        
        appointmentDate = datetime.datetime(int(date[0]), int(date[1]), int(date[2]))
        getTodayDate =  datetime.datetime.today().strftime('%Y-%m-%d').split("-")
        todayDate = datetime.datetime(int(getTodayDate[0]), int(getTodayDate[1]), int(getTodayDate[2]))

        dailyReminder = True if form['daily'] is True else False
        weeklyReminder = True if form['weekly'] is True else False
        monthlyReminder = True if form['monthly'] is True else False
        yearlyReminder = True if form['yearly'] is True else False
        unsubscribe = True if form['unsubscribe'] is True else False
 


        createReminder = Reminder(
            text=text, 
            date = dateAndTime, 
            reminderDate = regularDate,
            reminderTime = regularTime,
            notifyDesktop = enableDesktopNotification,
            numberOfDaysUntilAppointment = modules.cal_days_diff(appointmentDate, todayDate),
            subscriptionId = reminderId,
            dailyReminder = dailyReminder,
            weeklyReminder = weeklyReminder,
            monthlyReminder = monthlyReminder,
            yearlyReminder = yearlyReminder,
            unsubscribe = unsubscribe,
            person_id = current_user.id
        )
        db.session.add(createReminder)
        db.session.commit()
        return jsonify({"message": "Successfully Updated"}), 200

    if request.method == 'GET':
        _Id = request.args.get('SubscriptionId') 
        subscriptionId = _Id
        reminder = db.session.query(Reminder).filter(Reminder.subscriptionId  ==  subscriptionId).first()
        date = reminder.date
        stripDate = date.strftime("%m/%d/%Y, %H:%M:%S").split(",")
        reminderContent = "{text} on {date} at {time} ".format(text = reminder.text, date = stripDate[0],
        time = modules.convertTimeTo12Hr(stripDate[1]))
        
        return jsonify({"content": reminderContent}), 200

@app.route("/notification", methods = ['POST', 'DELETE'])
@token_required
def setNotifications(current_user, token):
    if request.method == 'POST':
        form = json.loads(request.data.decode('UTF-8'))
        subscription = form["subscription"]
        subscriptionId = form["subscriptionId"]
        dailyReminder = True if form['daily'] is True else False
        weeklyReminder = True if form['weekly'] is True else False
        monthlyReminder = True if form['monthly'] is True else False
        yearlyReminder = True if form['yearly'] is True else False
        createNotif = db.session.query(User).filter(User.id == current_user.id).first()
        reminder = db.session.query(Reminder).filter(Reminder.subscriptionId  ==  subscriptionId).first()
        message = json.dumps({"token": token, "subscriptionId": subscriptionId})

 
    
        VAPID_CLAIMS = {
            "sub": "mailto:wong69256@gmail.com"
        }

        

        if(createNotif.subscription == " " or createNotif.subscription == None):
            createNotif.subscription = json.dumps(subscription)
            db.session.commit()

        if(not dailyReminder and not weeklyReminder and not monthlyReminder and not yearlyReminder):
            try:
    
                futureDate = reminder.date 
                currentDate = datetime.datetime.now()
                print(f'future date {futureDate}', flush= True)
                print(f'current date {currentDate}', flush=True)
                _diff  = abs(int((futureDate - currentDate).total_seconds()))
                diff  = int((futureDate - currentDate).total_seconds())
                print(f'absolute diff {_diff}', flush=True)
                print(f'no absolute diff {diff}', flush=True)
                q.enqueue_in(datetime.timedelta(seconds=diff),modules.send_web_push, args=[json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS] )
              
                
                print("Sending web push", flush = True)


                return jsonify({'success':1}), 200
            except Exception as e:
                return jsonify({'failed':str(e)}), 400
        else:

            if(dailyReminder):
                try:
                    stripDate = reminder.date.strftime("%m/%d/%Y, %H:%M:%S")
                    _time = stripDate.split(",")[1]
                    splitTime = _time.split(":")
                    splitTime[0] = splitTime[0].split()[0]
                    newTime = ':'.join(splitTime)

                    futureDate = reminder.date 
                    currentDate = datetime.datetime.now()
                    diff  = int((futureDate - currentDate).total_seconds())
                    q.enqueue_in(datetime.timedelta(seconds=diff),modules.sendDaily, args=[newTime, json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS] )
            
                    
                except Exception as e:
                    print("error",e)
                    return jsonify({'Daily reminder failed to create':str(e)}), 400
            
            if(weeklyReminder):
                try:
                    stripDate = reminder.date.strftime("%m/%d/%Y, %H:%M:%S")
                    _time = stripDate.split(",")[1]
                    splitTime = _time.split(":")
                    splitTime[0] = splitTime[0].split()[0]
                    newTime = ':'.join(splitTime)

                    futureDate = reminder.date 
                    currentDate = datetime.datetime.now()
                    diff  = int((futureDate - currentDate).total_seconds())

                    q.enqueue_in(datetime.timedelta(seconds=diff),modules.sendWeekly, args=[newTime, json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS] )
                  
             
                    
                
            
                except Exception as e:
                    print("error",e)
                    return jsonify({'Weekly reminder failed to create':str(e)}), 400

            if(monthlyReminder):
                try:
                    stripDate = reminder.date.strftime("%m/%d/%Y, %H:%M:%S")
                    _time = stripDate.split(",")[1]
                    splitTime = _time.split(":")
                    splitTime[0] = splitTime[0].split()[0]
                    newTime = ':'.join(splitTime)

                    futureDate = reminder.date 
                    currentDate = datetime.datetime.now()
                    diff  = int((futureDate - currentDate).total_seconds())


                    modules.sendMonthly(newTime, json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS)

                    q.enqueue_in(datetime.timedelta(seconds=diff),modules.sendMonthly, args=[newTime, json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS] )
                 
              

               
                except Exception as e:
                    print("error",e)
                    return jsonify({'Monthly reminder failed to create':str(e)}), 400
                    
            if(yearlyReminder):
                try:
                    q.enqueue_in(datetime.timedelta(days=365),modules.send_web_push, args=[json.loads(createNotif.subscription),message, VAPID_PRIVATE_KEY,VAPID_CLAIMS] )
                
                    
        
                except Exception as e:
                    print("error",e)
                    return jsonify({'Yearly reminder failed to create':str(e)}), 400

    if request.method == 'DELETE':
        removeSubscription = db.session.query(User).filter(User.id == current_user.id).first()
        removeSubscription.subscription = " "
        db.session.commit()
        return jsonify({"success": "push notification has been updated"}), 200



@app.route("/quote", methods = ['GET'])
@token_required
def quotes(current_user, token):
    if request.method == 'GET':
        dailyQuote = ['quote']
        author = ['author']
        modules.getQuotes(dailyQuote, author)
        return jsonify({'quote':dailyQuote, 'author':author}), 200



@app.route("/reminders/user", methods =['GET', 'DELETE'])
@token_required
def readReminders(current_user, token):
    if request.method == 'GET':
        item = [  ]
        person = db.session.query(User).filter(User.id == current_user.id).first()
        for itm in person.reminders:
            reminder = {
                "subscriptionId":itm.subscriptionId,
                "text":itm.text,
                "reminderDate": itm.reminderDate,
                "reminderTime": itm.reminderTime,
                "notifyDesktop": itm.notifyDesktop,
                "dailyReminder": itm.dailyReminder,
                "weeklyReminder": itm.weeklyReminder,
                "monthlyReminder": itm.monthlyReminder,
                "yearlyReminder": itm.yearlyReminder,
                "unsubscribe": itm.unsubscribe
            }

            item.append(reminder)

        
        return jsonify({"items": item}), 200
    
    if request.method == 'DELETE':
        _Id = request.args.getlist('SubscriptionIds')[0].split(",")

        try:
            print(f'list of ids {_Id}', flush=True)
            for ids in _Id:
                itemToDelete = db.session.query(Reminder).filter(Reminder.subscriptionId == ids).first()
                if(itemToDelete):
                    db.session.delete(itemToDelete)
                    db.session.commit()
            return jsonify({"success": "reminders have been deleted"}), 204
        except:
            return jsonify({"failure": "could not delete"}), 404


