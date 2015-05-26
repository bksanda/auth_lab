###2014-2015, WDI COURSE ASSIGNMENT
####Lessons on Authentication

***In this exercise, students were put into groups of 4-5 people to research each of the key components of authentication. Each group presents their findings and help other groups to understand their given topics.***


***

#AUTH LAB

Time to implement authentication...and ... Go!

##App setup
* fork / clone repo
* npm install -- installs all modules form package.json
* dbcreate auth_lab -- creates the database
* sqlize db:migrate -- creates database tables
* nodemon -- start it up

-----

* **Everyone** signup form (store to database)

* **validation** - check password length

* **hooks / bcrypt** - encrypt password before create

* **session / bcrypt** - check password and store user in session (don't store user's password in session)

* **middleware / session** - create a getUser() method attached to req

* **Everyone** - Use the req.getUser() information to deny the user access to the /restricted page.
