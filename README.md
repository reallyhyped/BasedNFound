# BasedNFound

Setup:
cd into front end

        npm install

Docker:

    docker compose up --build

If first run, need to set up the db table:

    docker exec -it basednfound-backend-1 bash
    alembic upgrade head
    exit

pgAdmin credentials:

    pgadmin4@pgadmin.org

    admin

PSQL
psql --username=basednfound_user --dbname=basednfound_dev

pgAdmin add server:

    Add New Server
    Name> database
    Click Connection at the top
    Host name/address > basednfound-db-1
    Port > 5432
    Username > basednfound_user
    Password > password

    Save
