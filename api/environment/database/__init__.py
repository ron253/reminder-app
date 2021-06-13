from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from sqlalchemy import *
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from dotenv import load_dotenv
from pathlib import Path
import os

app = Flask(__name__,  static_url_path='', static_folder='../static')
bcrypt = Bcrypt(app)
CORS(app)

load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)
SECRET_KEY = os.getenv("SECRET_KEY")

app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

migrate=Migrate(app,db) #Initializing migrate.
manager = Manager(app)
manager.add_command('db',MigrateCommand)





@app.before_first_request
def create_tables():
    db.create_all()




from database import routes



