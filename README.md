# MapView Application

This project is a full-stack map-based application with a Python backend and a React Native frontend using Expo. It provides location-based functionality with real-time rendering.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
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

   1. Run The following commands:
      ```bash
      python --version
      conda --version
      docker --version
      docker-compose --version
      npm --version
   2. If any of the above commands doesn't display the program's version, check that it is correctly installed and that the executables are defined in your system path


---

### Getting Started

To set up and run the project locally, follow the instructions below.

---

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:kaoutarell/Concordia_Campus_Guide.git
   cd Concordia_Campus_Guide/ccg_backend/
   
2. **Create a .env file in the ccg_backend/ directory and the following (change <ipv4> with your local ip address)**:    
   ```bash
   ALLOWED_HOSTS=<ipv4>,127.0.0.1

3. **Set Up the Database with Docker**:
   ```bash
   cd docker_configs
   docker-compose up -d

4. **Issues : In case the image is not pulled try adding this to docker engine config**
   
   ```bash
     "experimental": false,
     "registry-mirrors": [
    "https://dockerhub.azk8s.cn"
     ]   

5.**Create the Python Environment**:
   - Use the provided environment.yml file to create a Conda environment:
     ```bash
     conda env create -f environment.yml
     
   - Before activating the environment, you may need to run this command for Windows 10/11:
     ```bash
       %conda_root_directory%/Library/bin/conda.bat init cmd.exe
       # OR
       %conda_root_directory%/Library/bin/conda.bat init powershell
    
    
   - Activate the environment:
     ``` bash
     conda activate myenv

**IMPORTANT: For Mac Users, you will need to run the following commands to install GDAL:**
   ```bash
   brew install gdal
   pip install gdal
   python
   >>> import gdal # in python
   ```

6.**Run the Python Backend**:
   - python migration
     ```bash
     pip install python-decouple
     python manage.py makemigrations
     python manage.py migrate
     python manage.py loaddata buildings.json
     python manage.py loaddata routes.json
     python manage.py loaddata shuttle_stops.json
   - run python
     ```bash
     python manage.py createsuperuser
     python manage.py runserver <ipv4>:8000 # change <ipv4> to your local ip address

   -  http://<ipv4>:8000/admin
   -  http://<ipv4>:8000/api/buildings
   -  http://<ipv4>:8000/api/routes
   -  http://<ipv4>:8000/api/shuttle-stops
---

### Frontend Setup

   1. **Create a .env file in ccg_mobile/ directory and add the following (change <ipv4> with your local ip address):**
      ```bash
      EXPO_PUBLIC_BASE_URL=http://<ipv4>:8000/api/
   2. **Install dependencies:**
      ```bash
      npm install
   3. **Run frontend**
      ```bash
      npm start

