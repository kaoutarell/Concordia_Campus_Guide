@echo off
if "%CONDA_DEFAULT_ENV%"=="myenv" (
    cd docker-configs
    docker-compose up -d
    cd ..
    python manage.py runserver 0.0.0.0:8000    
) else (
    echo Please run "conda activate myenv"
    pause
    exit /b 1
)
