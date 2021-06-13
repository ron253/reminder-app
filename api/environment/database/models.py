

from datetime import datetime
from database import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20),  nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    number = db.Column(db.String(13), unique=True, nullable=False)
    reminders = db.relationship('Reminder', backref="person", lazy=True)
    subscription = db.Column(db.String(1000), nullable=True)
    

class Reminder(db.Model):
    __tablename__ = 'Reminder'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)    
    date = db.Column(db.DateTime,default=datetime.utcnow, nullable = False)

    reminderDate = db.Column(db.String(100), nullable =False)
    reminderTime = db.Column(db.String(100), nullable = False)

    notifyDesktop = db.Column(db.Boolean)
    numberOfDaysUntilAppointment = db.Column(db.Integer, nullable= False)
    subscriptionId = db.Column(db.String(100), nullable=False)


    dailyReminder = db.Column(db.Boolean)
    weeklyReminder = db.Column(db.Boolean)
    monthlyReminder = db.Column(db.Boolean)
    yearlyReminder = db.Column(db.Boolean)
    unsubscribe = db.Column(db.Boolean)

    person_id = db.Column(db.Integer, db.ForeignKey('user.id'))


   