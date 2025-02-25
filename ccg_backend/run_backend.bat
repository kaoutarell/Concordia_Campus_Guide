@echo off
if "%CONDA_DEFAULT_ENV%"=="myenv" (
    cd docker-configs
    docker pull postgis/postgis
    docker-compose up -d
    cd ..
    timeout /T 5 /NOBREAK
    python manage.py makemigrations
    python manage.py migrate
    python manage.py loaddata campus_buildings.json departments.json services.json routes.json shuttle_stops.json shuttle_schedule.json
    python manage.py runserver 0.0.0.0:8000
) else (
    echo Please run "conda activate myenv"
    pause
    exit /b 1
)

