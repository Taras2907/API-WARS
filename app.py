from flask import Flask, session, render_template, request, redirect, url_for
from data_manager import *
from util import json_response

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
def show_table():
    return render_template('main.html')


@app.route('/get-planet-votes')
@json_response
def get_votes_for_planet():
    return get_planets_votes()


@app.route('/register', methods=["GET", "POST"])
def registration():
    if request.method == "POST":
        usernames = get_usernames()
        usernames = [username for username in usernames[0].values()]
        if request.form['username'] in usernames:
            user_already_exists = 'User already exists'
            print(user_already_exists)
            return render_template("registration.html", user_already_exists=user_already_exists)
        else:
            new_id = generate_new_id()
            hashed_password = hash_password(request.form['password'])
            create_new_user([new_id, request.form['username'], hashed_password])
            return redirect(url_for('login'))
    return render_template('registration.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = get_username_password(username)
        if verify_password(request.form['password'], password):
            session['username'] = username
            session['password'] = password
            session['logged in'] = True
            user_is_logged_in = True
            return render_template("main.html", username=username, user_is_logged_in=user_is_logged_in)
        else:
            wrong_password_or_login = 'Wrong password or login'
            return render_template('login.html', wrong_password_or_login=wrong_password_or_login)
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('show_table'))


@app.route('/vote/<planet_id>/<planet_name>', methods=["GET", "POST"])
@json_response
def vote(planet_id, planet_name):
    if request.method == "GET":
        # user_id = get_user_id(session["username"])
        user_id = 1
        save_votes(planet_name, planet_id, user_id)
    return render_template('main.html')


if __name__ == '__main__':
    app.run()
