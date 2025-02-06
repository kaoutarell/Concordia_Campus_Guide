# MapView Application

This project is a full-stack map-based application with a Python backend and a React Native frontend using Expo. It provides location-based functionality with real-time rendering.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the project](#running-the-project)
- [Unit Test Prerequisites](#unit-test-prerequisites)
- [Contributing](#contributing)
- [License](#license)

---

### Prerequisites

#### Backend

Make sure you have the following tools installed for the backend:

- **Python 3**: Required for running the backend code.
- **MiniConda**: For managing Python environments and dependencies.
- **PostGIS**: A spatial database extender for PostgreSQL, used for geospatial data storage and queries.
- **Docker**: For containerizing and running the backend services.

#### Frontend

Ensure you have the following tools installed for the frontend:

- **React**: A JavaScript library for building user interfaces.
- **Expo**: A framework and platform for universal React applications.
- **React Native**: For building native mobile applications.
- **Expo App**: Install the expo app in your device.

#### How to make sure that all the Prerequisites are correctly installed

1.  Run The following commands:
    ```bash
    python --version
    conda --version
    docker --version
    docker-compose --version
    npm --version
    ```
2.  If any of the above commands doesn't display the program's version, check that it is correctly installed and that the executables are defined in your system path

---

### Getting Started

To set up and run the project locally, follow the instructions below.

---

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kaoutarell/Concordia_Campus_Guide
   cd Concordia_Campus_Guide/ccg_backend/

   ```

2. **Set Up the Database with Docker**:

   ```bash
   cd docker-configs
   docker-compose up -d

   ```

3. **Issues : In case the image is not pulled try adding this to docker engine config**

   ```bash
     "experimental": false,
     "registry-mirrors": [
    "https://dockerhub.azk8s.cn"
     ]
   ```

4.**Create the Python Environment**:

- Use the provided environment.yml file to create a Conda environment:
  ```bash
  # For Windows 10/11
  conda env create -f environment-win.yml
  # For MacOS
  conda env create -f environment-mac.yml

  ```
- Before activating the environment, you may need to run the following command (conda_root_directory is the directory where you installed conda):

  ```bash
    # For Windows 10/11
    %conda_root_directory%/Library/bin/conda.bat init cmd.exe
    # AND/OR
    %conda_root_directory%/Library/bin/conda.bat init powershell
    # For MacOS
    conda init zsh

  ```

- Activate the environment:
  ```bash
  conda activate myenv
  ```

5.**Run the Python Backend**:

- python migration
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  python manage.py loaddata campus_buildings.json
  ```
- run python

  ```bash
  python manage.py createsuperuser
  python manage.py runserver 0.0.0.0:8000

  ```

- http://<ipv4>:8000/admin
- http://<ipv4>:8000/api/buildings-by-campus/?campus=LOY
- http://<ipv4>:8000/api/buildings-by-campus/?campus=SGW

---

### Frontend Setup

1.  **Create a .env file in ccg_mobile/ directory and add the following (change <ipv4> with your local ip address):**
    ```bash
    EXPO_PUBLIC_BASE_URL=http://<ipv4>:8000/api/
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run frontend**
    ```bash
    npm start
    ```
Error fix (start not found , try npm run) command :
```bash
npm install -g expo-cli
``` 

### Running the project

#### Backend

Run the following:

```bash
conda activate myenv
cd ccg_backend
# For Windows
run_backend.bat
# For Mac/Linux
./run_backend.sh
```

#### Frontend

```bash
cd ccg_frontend\ccg_mobile
# If ip address changed, edit .env
# EXPO_PUBLIC_BASE_URL=http://<ip>:8000/api/
npm start
```
### Unit Test Prerequisites
#### Backend
Make sure you have the following tools installed for the backend:

- **Pytest 8.3.4**: Required for running the backend unit tests.

Run the following command to install:
    ```bash
    pip install -U pytest
    ```

#### Frontend
Make sure you have the following tools installed for the frontend:

- **Jest**: Required for running the backend unit tests.

Run the following command to install:
    ```bash
    npm install --save-dev jest
    ```