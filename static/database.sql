DROP TABLE  if EXISTS USERS  CASCADE ;
CREATE TABLE USERS (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL);

DROP TABLE  if EXISTS planet_votes  CASCADE ;
CREATE TABLE planet_votes (
    id SERIAL PRIMARY KEY NOT NULL,
    planet_id INTEGER NOT NULL,
    planet_name VARCHAR(200) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    submission_time DATE NOT NULL);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_planet_votes_users_id FOREIGN KEY (user_id) REFERENCES users(id);
