<div align="center">
  <img width="60%" src="https://github.com/ojg1993/Wiring/assets/61238157/228d5af9-0f12-4de6-90c6-7722dbf780f7">
</div>


## 1. Summary
Wiring is a live webchat application clone project providing a platform where people can find like minded people and chat or discuss about their interests. The backend server is developed with Django Rest Framework(DRF) leveraging django channles to provide seamless live communication environment. The frontend client is built with React, providing a great user experience through a single-page application environment.
<br>

## 2. Project Demo
  #### Page Explore, Registeration, Authentication, Permission, Dark Mode
  <img src="https://github.com/ojg1993/Wiring/assets/61238157/55497973-901f-430d-b994-39341a42869d" width="600">

  #### Live chat and membership restriction
  <img src="https://github.com/ojg1993/Wiring/assets/61238157/13d49ee9-8549-4d2a-b3c8-ce2e0922a25f" width="600">

<br>

## 3. Project Overview
### 3.2 API Documentation:
API document is auto generated by drf-spectacular on deployment, and the doc/schema can be accessed by clicking the links below.
- [API Documentation](http://127.0.0.1:8000/api/docs/schema/ui/)
- [API Schema](http://127.0.0.1:8000/api/docs/schema/ui/)
- API Document Example
<br>

![API docs](https://github.com/ojg1993/SaversHaven/assets/61238157/46cf71f0-1b25-4190-af2e-8129d9978a15)

<br>

### 3.3 Tech Stack
  - Frontend: TypeScript, React
  - Backend: Django(DRF), SQLite
  - Lint: Flake8, Black, Isort
  - Others: Git, Github
  
### 3.4 Features
  #### 3.4.1 Authentication
  - **Registration:** Users can create an account by submitting a username and password on the registration page.
  - **Login:** Users can log in by submitting their username and password. Wiring provides JWT authentication, storing access and refresh tokens in cookies. Token information is not returned in responses to minimize potential security risks.
  - **Logout:** Users can log out by clicking the logout button, which triggers cookie flushing logic to prevent unauthorized access.
  #### 3.4.2 Live Chat
  - **Real-time communication:** Users can access chatrooms and actively participate in live chat discussions with other users in real-time.

  #### 3.4.3 Permission
  - **Server page access:** Unauthenticated users are not allowed to access the server landing page. The application will redirect them to the login page.
  - **Sending Message:** Authenticated users are required to join the server membership to participate in the chat. Otherwise, users can only view the chat log but cannot send messages to the channel.

  #### 3.4.4 Darkmode
  - Wiring provides darkmode offering a better user-experience. the dark mode will be passed down to the components as context and reverse the current mode on clicking toggle button.

  #### 3.4.5 Admin Page
  - **Admin page functionalities:** Admin users can add categories, servers, and channels for users to enter and chat, as well as manage users, chatrooms, and messages.

  #### 3.4.6 Model & API Test
  - **Backend Server Testing:**
  Comprehensive testing is performed on both database models and API endpoints to ensure the reliability and functionality of Wiring's backend system. This includes validating model methods and attributes, as well as testing the behavior of API endpoints under various scenarios. 
<br>

## 4. Challenges & Leanrinings
  ### 4.1 First project experience in React and TypeScript programming
  <span>
    I have been holding a big curiosity how the real-world developers would collaborate on projects with separate responsibilities while understanding each other's requirements and expectations. To satisfy this curiosity, I decided to explore frontend engineering, specifically JavaScript and React. After completing a beginner tutorial on frontend development, I immediately started programming with the tech stack I desired: React and Django. The goal was to build Wiring and learn how to interact with the frontend using WebSocket protocol and JWT authentication. Although my frontend skills are still at a fundamental level, developing experiences such as building a JWT Interceptor to provide a smooth authentication process and figuring out how data is passed in WebSocket protocol have provided me with new insights and perspectives as someone new to software engineering.
  </span>
    <br>

  ### 4.2 Structural understanding of modularization and directory mapping
  <span>
    As a beginner in React and new to TypeScript, I faced significant challenges in understanding and applying these technologies together. My initial experience was with a React tutorial using JavaScript, so transitioning to TypeScript and implementing types and interfaces was a new and difficult process. Additionally, despite being a novice with React, I chose to use an external library, MUI (Material-UI), which added another layer of complexity due to my lack of deep understanding. 
    During these challenges, I struggled significantly with the complexities of modularizing various functionalities and mapping directories appropriately. However, because this project was a clone coding exercise, my focus was more on understanding the structural decisions rather than purely on implementation. By continuously questioning why certain structures were necessary throughout the project, I gained a much deeper understanding by the end compared to when I started.
  </span>
    <br>

  ### 4.3 Improvement in understanding in JWT utilisation
  <span>
  I had limited experience with how JWT was used on the client side, which left me curious about how to properly configure JWT on the server side and manage login states. Through this project, I learned how to enhance security by storing JWTs in cookies instead of session or local storage in Django as well as avoiding the exposure of token information in responses. On the React side, I learned how to access JWTs from cookies and include tokens in CRUD requests. I also implemented logic to refresh access tokens when they expire. These experiences significantly deepened my understanding of the entire JWT lifecycle.
  </span>
  <br>

  ### 4.4 WebSocket interaction with the client side
  <span>
  Initially, I only had knowledge of how to implement server-side WebSocket protocols, but managing the request-response cycle on the client side was new to me. I discovered that the `react-use-websocket` package can be used to handle WebSocket connections. By understanding the client-side WebSocket interaction, I figured out how to appropriately configure the server-side (Django Channels) to allow connections and how to format and process messages sent from the client to the server.This experience helped me understand how the consumer handles connections and the necessity of collaboration between frontend and backend engineers to negotiate message formats and group communications. Through this project, I gained a comprehensive understanding of WebSocket interactions between the client and server, including the importance of defining clear communication protocols and message handling strategies.
  </span>
<br>

## 5. Local Deployment
### 5.1 Pre-requisites
1. Install Python.
2. Install Node.js.
3. Install an IDE of your choice, such as PyCharm, Visual Studio Code, or Atom.

### 5.2 Steps
###### A.  Clone the project repository:
```bash
git clone https://github.com/ojg1993/Wiring.git
```
###### B.  Navigate to the project directory:

```bash
cd Wring
```
###### C.  Set venv and install dependencies :
```bash
# Backend Server
py -m venv venv
./venv/Scripts/activate 
cd backend
pip install -r ./requirements.txt

# Frontend Client
cd ../frontend
npm install
```


###### D. Test backend server 
```bash
cd ../backend
python manage.py test
```

###### E. Run the projects
```bash
# Frontend Client
cd ../frontend
npm run dev

# Backend Server
cd ../backend
uvicorn config.asgi:application --port 8000 --workers 4 --log-level debug --reload
```

###### F. Create a admin user

```bash
cd ../backend
python manage.py createsuperuser
# Enter the username and password when prompted
# username: admin
# password: adminpassword
```

###### G.  Open your browser and visit `127.0.0.1:8000/api/docs/schema/ui/` to access API documentation.

###### H.  Open your browser and visit `127.0.0.1:5173/` to access Wring application.
