import datetime
import json

import jewish
from flask import Flask, render_template, request

from hebrew_calendar import get_months_of_year, is_pregnant

app = Flask(__name__)


@app.route('/')
def home():
    today = jewish.JewishDate.from_date(datetime.datetime.today())
    return render_template('index.html', year=today.year, month=today.month - 2, day=today.day)


@app.route('/get_year', methods=['POST'])
def get_year():
    year = request.get_json().get('year')
    year_list = get_months_of_year(int(year))
    return json.dumps(dict(year_list=year_list,
                           is_pregnant=is_pregnant(year)))


if __name__ == '__main__':
    app.run(port=8080)
