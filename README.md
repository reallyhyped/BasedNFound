# BasedNFound

Setup:
cd into front end

    npm install

You will need Docker Desktop open in order to run the following commands.
Docker:

    docker compose up --build

If first run, need to set up the db table on a new terminal while docker is running:

    docker exec -it basednfound-backend-1 bash
    alembic upgrade head
    exit

pgAdmin credentials:

    pgadmin4@pgadmin.org

    admin

Accessing PSQL:

    docker exec -it basednfound-backend-1 bash
    psql --username=basednfound_user --dbname=basednfound_dev

View database through PSQL:

    \dt
    SELECT * FROM [datatable name]

pgAdmin add server:

    Add New Server
    Name> database
    Click Connection at the top
    Host name/address > basednfound-db-1
    Port > 5432
    Username > basednfound_user
    Password > password

    Save
