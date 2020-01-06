from psycopg2 import sql
import database_common
import bcrypt
from datetime import datetime


def get_real_time():
    now = datetime.now()
    return now.replace(microsecond=0)


@database_common.connection_handler
def get_user_id(cursor, username):
    cursor.execute('''SELECT id FROM users WHERE username = %(username)s''',
                   {'username': username})
    user_id = cursor.fetchall()
    return user_id


@database_common.connection_handler
def create_new_user(cursor, list_of_values):
    sql_insert = sql.SQL("INSERT INTO users (id, username, password) VALUES ({})").format(
        sql.SQL(", ").join(sql.Placeholder() * len(list_of_values))
    )
    cursor.execute(sql_insert, list_of_values)


@database_common.connection_handler
def get_usernames(cursor):
    sql_select = sql.SQL("SELECT username FROM users")
    cursor.execute(sql_select)
    user_names = cursor.fetchall()
    return user_names


@database_common.connection_handler
def generate_new_id(cursor, table):
    sql_select = sql.SQL("SELECT MAX(id) FROM {}").format(
        sql.Identifier(table)
    )
    cursor.execute(sql_select)
    response = cursor.fetchall()
    last_id = response[0]['max']
    return 1 if last_id is None else last_id + 1


@database_common.connection_handler
def get_username_password(cursor, username):
    cursor.execute('''SELECT password FROM users WHERE username = %(username)s ''',
                   {'username': username})
    password = cursor.fetchall()
    return password[0]['password']


@database_common.connection_handler
def get_user_id(cursor, username):
    cursor.execute('''SELECT id FROM users WHERE username = %(username)s''',
                   {"username": username})
    user_id = cursor.fetchall()
    return user_id[0]['id']


@database_common.connection_handler
def save_votes(cursor, planet_name, planet_id, user_id):
    sql_insert = sql.SQL("INSERT INTO planet_votes (id, planet_id, planet_name, user_id, submission_time)"
                         "VALUES ({})").format(
        sql.SQL(", ").join(sql.Placeholder() * 5)
    )
    submission_time = get_real_time()
    the_id = str(generate_new_id('planet_votes'))
    cursor.execute(sql_insert, [the_id, planet_id, planet_name, user_id, submission_time])


@database_common.connection_handler
def get_planets_votes(cursor):
    cursor.execute('''SELECT planet_name, COUNT(planet_name) as votes FROM planet_votes GROUP BY planet_name''')
    planet_votes = cursor.fetchall()
    return planet_votes

def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)

