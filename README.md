# About
Q|Anonymous is a free minimalistic Q/A service. If you'd want to do some anonymous Q/A but all other paid solutions with tons of advertisement and redundant features drive you insane then welcome.

![Home Page](.images/home.png)

# Environment Variables
Here's the list of environment variables used by _Q|Anonymous_ server.
- `PORT` - The port to start the on. Default is _1234_.
- `DATABASE_URL` - Connection string for the database. You can specify some local database `qanonymous` via something like `postgresql://postgres:0000@localhost/qanonymous`.
- `SSL` - Instructs `pg` module to use SSL for connecting to the database. Internally just compares the value with `true`, so if unspecified leads to `false`.
- `ADMIN` - Username of the admin user with the priviligies to user `debug` functionality.
- `DISABLE_REGISTRATION` - Disables the registration if set to `true`. Works the same way as `SSL`.