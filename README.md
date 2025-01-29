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

---

### Getting Started

To set up and run the project locally, follow the instructions below.

---

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:kaoutarell/Concordia_Campus_Guide.git
   cd Concordia_Campus_Guide/ccg_backend/
   
2. **Create a .env file in the ccg_backend/ directory and the following**:    
   ```bash
         ALLOWED_HOSTS=<ipv4>,127.0.0.1

3. **Set Up the Database with Docker**:
   ```bash
      cd docker_configs
      docker-compose up -d

0. **Issues : In case the image is not pulled try adding this to docker engine config**
   
   ```bash
        "experimental": false,
        "registry-mirrors": [
       "https://dockerhub.azk8s.cn"
        ]   

4.**Create the Python Environment**:
   - Use the provided environment.yml file to create a Conda environment:
     ```bash
        conda env create -f environment.yml
        conda activate myenv

5.**Run the Python Backend**:
   - python migration
     ```bash
        python manage.py makemigrations
        python manage.py migrate
        python manage.py loaddata buildings.json  # Do that for all files inside fixtures folder
   - run python
     ```bash
        python manage.py createsuperuser
        python manage.py runserver ip:8000

   -  http://ip:8000/admin    
