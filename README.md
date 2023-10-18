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
