# **SoezTrip - Travel Planner**

This is an app for planning your tavel, app provides functionalities such as:
1) Creating trips planning them
2) Generating plans for destinations
3) Sharing your trips with your friends
4) Weather status for specific destinations

# **Installation on local environment**

To install this app on the local environment please follow this steps:
1) Unpack the ZIP file (not mandatory for cloned repository)
2) Run script **run.sh** with **root** privilages

    ``/bin/bash /home/fedora/Studies/inżynierka/SOEZ/run.sh``

3) Go `localhost:5050`
4) Login with **admin@admin.com** and **root**
5) Register new server with:
 - **Name:** soez
 - **Hostname:** postgres
 - **Port:** 5432
 - **User:** root
 - **Password:** root
6) Create new query on **soez_db**
7) Drag and drop **postgres_seed.sql** and run query
8) Enter `localhost:3000` and start using the app!

### Some functionalities might not be working becouse of api keys!
### Please contact the authors for support
