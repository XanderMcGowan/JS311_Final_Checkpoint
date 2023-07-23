create table photo (
	id integer primary key auto_increment, 
	user_id integer,
  timezone_id integer,
  photo blob,
  text varchar(144),
  post_day timestamp,
  country varchar(2)
)

drop table users
  
  
  create table users (
  id integer primary key auto_increment,
    username varchar(30) unique,
    hash varchar(100),
    last_post timestamp
  )


select * from users


insert into entries (title, done) values ("bob123", true)

create table entries (
  id integer,
  title varchar(20),
  done boolean

)

delete from users 
