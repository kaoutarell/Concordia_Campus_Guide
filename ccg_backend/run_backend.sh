#!/bin/bash

if [ "$CONDA_DEFAULT_ENV" == "myenv" ]; then
    cd docker-configs
    docker pull postgis/postgis
    docker-compose up -d
    cd ..
    sleep 5
    python manage.py makemigrations
    python manage.py migrate
    python manage.py loaddata campus_buildings.json routes.json shuttle_stops.json shuttle_schedule.json
    python manage.py runserver 0.0.0.0:8000
else
    echo 'Please run "conda activate myenv"'
    exit 1
fi
