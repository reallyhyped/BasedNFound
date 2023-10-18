# BasedNFound

Setup:

    create a .env in the backend and insert into it:
        DATABASE_URL=postgresql://basednfound_user:password@db/basednfound_dev

    cd into front end
        npm install

Docker:

    docker compose up --build

If first run, need to set up the db table:

    docker exec -it basednfound-backend-1 bash
    alembic upgrade head
    exit
