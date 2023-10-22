# BA-ground-truth-editor

#### A Web-based application designed to collect data for Machine Learning Research. 
Given some image files containing a human-(un)readable text, the application should allow the users 
to view some of the images and type the text they can read in a textbox. Later their inputs are revsied by an expert user to provide a ground truth for what is inside the image
before doing research on their inputs.    

## Agenda:
1) Application Architecture with Express.js, React.js, and MariaDB </br>
    - Express JS: Backend. <a> <img width ='23px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/express.svg'> </a>
    - React JS: Frontend. <a> <img width ='23px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/reactjs.svg'> </a>
    - Maria DB: Database. <a> <img width ='23px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/mariadb.svg'> </a>
2) How to use. 🔧

## Application Architecture with Express.js, React.js, and MariaDB:

The architecture of this web project, which uses Express.js, React.js, and MariaDB, is widely recognized for its scalability and maintainability. 
The client-server model allows for easy integration with other systems and services, while the use of MariaDB provides a reliable and flexible database solution. 
This architecture is popular among developers and is widely used for building modern web applications.</br>
</br>Let's take a deeper look at each component of this architecture... 

### Express JS: Backend. <a> <img width ='25px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/express.svg'> </a>:
* The Server Side of the application is composed of 4 main components:
    * **Models** and **DB Configurations** 📁 :</br>
        | Sub-Componoent | Description| 
        | --- | --- | 
        | [db_config.js](./backend/db_config.js)| Where you can find the configurations for creating a connection pool with MariaDB | 
        | [models](./backend/models) | Where you can find the schema creation queries and their executer (if not existed) once the server mounts | 

    * **Services** 🛠️ : to ensure Single Responsibility, it is divided as follows: </br>
        | Sub-Componoent | Responsibility| 
        | --- | --- |
        | [login-service](./backend/services/login-service.js) | Where you can find **user-related functions** such as _updating last login date_, _verifying user account_, and _generating JWT_|
        | [tasks-service](./backend/services/tasks-service.js) | Which queries the Database to get tasks (files) in a **paged manner**.  |
        | [task-detail-service](./backend/services/task-detail-service.js) |Which queries the Database to **get information about the task**: _modification history_, _readability_, _task_page_...| 
        | [task-manipulation-service](./backend/services/task-manipul-service.js) | which updates the Database for each user input on a certain image (task). |
       
    * **Controllers and Routes** ↔️ . 
        * Controllers are divided in a similar manner to Services Component and act as a Facade as follows:
          | Sub-Componoent | Responsibility| 
          | --- | --- |
          | [login-controller](./backend/controllers-routes/login-controller-route/login-contoller.js)| User login and Authorization. |
          | [tasks-controller](./backend/controllers-routes/task-controller-route/tasks-controller.js) | Getting all tasks (images) within a certain page together wiih the maximum and minimum available page number. |
          | [task-details-controller](./backend/controllers-routes/task-controller-route/task-details-controller.js) | Getting Information about a certain task: text written, readabiliy, history.|
          | [task-manipulation-controller](./backend/controllers-routes/task-controller-route/task-manipul-controller.js)| Saving user actions w.r.t to a given task.|
        * For Modularity, Routes are also divided into [login-route](./backend/controllers-routes/login-controller-route/login-route.js) and [task-route](./backend/controllers-routes/task-controller-route/task-route.js).
            
    * **Authentication**. 🔒
        * Mainly used to protect users from any Security Vulnerablilities.
        * Regarding the Implementation, We have used **JSON WEB TOKEN _(JWT)_** that is generated using **username** and **last_login_time** by [JWT](https://www.npmjs.com/package/jwt).
        * Once the **login process is done successfully**, the **_JWT_** is incorporated inside the **_auth-token_** header in the server response message.
                <p align="center"> <img src="https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/0f7ae49b-2eb9-4858-9e55-8cf16dd53578" /> </p>
        * In **further User Requests**, this token must be **incorporated in the same header to authenticate the user**. It is **also used to deduce the username if needed** in any request.
        * In case **the token is lost**, the **user should login again** to get another token using the most recent login time.
          
* #### Some Security Measures: 🛡️🔒 
    * We have used [bcryptJS](https://www.npmjs.com/package/bcryptjs) to hash user passwords before being stored in the Database.
    ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/2bbdeb96-ce87-483d-b564-3d007f82dd38)
    * In fact, **bcryptJS** provides a seemless approach in comparing the raw user-entered password and the hashed ones **during login process**.
    * Once user verification is done, the JWT is generated and sent to the user. to be cached in the browser local storage.
    * For more details. see [login-controller](./backend/controllers-routes/login-controller-route/login-contoller.js) and [login-service](./backend/services/login-service.js).

* #### Some Design Decisions 💡 :
  1. **The Logic for saving user changes** </br>
    * Our application allows only two modification by **two different users** for the input regarding a specific image 
    * Thus, for the first modifying user, he can modify his input for several times till someone else revises his changes by another modifcation.
    * Once the second modification is done, a **second record is inserted in the DB** to prevent further updates w.r.t. to the image text.
  2. **The image store** </br>
    * Image files are stored somewhere on the Backend server, with their names being stored in the DB.
    * You can find the image store in **file-store** field of **node environment variables** in [.env](./backend/.env).

         
### Maria DB: Database. <a> <img width ='25px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/mariadb.svg'> </a>
* While development, the server has been connected to a **Dockerised MariaDB-Server container** via [mariadb library](https://www.npmjs.com/package/mariadb).
* All the **information need for the connection (i.e., host, user, password, and database)** and more can be found in the node environment file [.env](./backend/.env).
* It is worth mentioning that the **server side would not listen on any port** till the **connection pool with the DB server and the necessary tables are created**.
* Here is the Database Schema of the appliction:
    <p align="center"> <img src="https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/2268b5cf-1526-4854-b5d7-4562dac37e13" /> </p>
* You can also find the schema-creation queries in [models](./backend/models).


### React JS: Frontend. <a> <img width ='25px' src ='https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/reactjs.svg'> </a>
* The frontend is composed of 3 Main Components: </br>
  a. **Sign-In Component**: </br>
     ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/e1c6c647-5000-4ef6-aad1-7622423a0814)

     ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/c1ca7518-530d-4135-9ed6-ab06c85413fc)

    * If user logged in successuly, the JWT will be sent from the server side inside **auth-token** header of the response, then it is cached in browser local storage. So, the user is encourages to login again **if the JWT is lost or modified**.
      ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/ad29de72-b799-4a43-abdb-79df71f15ec1)
    * Note that: the user will not be allowed to view other components without the JWT. and will receive a **401: Unauthorized** Message for **every non-authenticated request**. 
    * If the user was **not registered**, or has **entered an incorrect password**, the window will alert these to him respectively:
      ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/21653f2b-9e00-4939-a9d1-0f0201f7116d)

      ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/05fd57a9-bb0d-4bfd-baec-074b96e10557)
  
  b. **Task List Component**: </br>
     ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/d7d72990-d07d-4101-bcbb-50ba23ed4132)
    * This component is designed to **carry only 13 task per page** ordered by their IDs in the DB. 
    * As seen, the user **can not edit the revised tasks**. Even he managed to view them using the **Task Edit Component**, he can not save any changes to any revised task.
  
  c. **Task Edit Component**: </br>
     ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/99ab7581-13bf-4e35-b9aa-3f33b87671f3)
     * The **upper table **shows the file name and its readability according to the last modification.
     * It also shows who has modified and revised this image with their respective date and time.
     * The **text box**, is used by the user to type what he can see in the previewed image. (**Disabled if changes are revised!**)
       ![image](https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/99fddb79-4a4b-47fd-80c3-46924d180c08)

     * The **Save Button** is used to save the current changes to the DB if not revised
     * The **Revert Button** is used to get the last saved changes of some task from the DB.
     * The **Mark As (UN)Readable Button** is used to mark the image as readable or unreadable respectively. However, the user must click on save button later to ensure the image is marked so in the DB.  

## How to Use:
1. **Clone** this repositiry:
* `git clone git@github.com:LouayMagdy/BA-ground-truth-editor.git` or
* `git clone https://github.com/LouayMagdy/BA-ground-truth-editor.git`.   
2. **Start the Maria DB server** and **create a database** of a certain name. e.g., `revapp`.
3. Edit the following fields in the **node environment variables file** [.env](./backend/.env) according to yours:
   <p align="enter"> <img src="https://github.com/LouayMagdy/BA-ground-truth-editor/assets/95547833/6f61b0c7-7426-4244-8a18-f877ef616e4e"> </p>
   
* If port 3001 is not appropriate for you, make sure to change it for API requests in: [login_page.js](./frontend/src/login_component/login_page.js), [task_edit.js](./frontend/src/task_edit_component/task_edit.js) , and [task_list.js](./frontend/src/task_list_component/task_list.js)
4. Install the required packages for the backend:
* `cd backend`
* `sudo npm install` 
5. **Prepare a CSV file of the user data** (each record is comma separated **without spaces** as [here](./backend/data-to-import/users.csv)) to import into the DB. 
6. **Rename** the CSV file into **users.csv** and store it [backend/data-to-import]('./backend/backend/data-to-import')
7. Run [password_importer.js](./backend/password_importer.js) to import user data into the DB: `sudo node password_imported.js` </br>
* This step is hashing passwords into the DB as well using bcrypt library.
* Thus, if the passwords in [users.csv](./backend/data-to-import/users.csv) are encrypted using another method, make sure to add your encryption method before the **bcrypt comparison** in    **validate_password method** in [login-service.js](./backend/services/login-service.js) 
8. **Start the backend** server: `sudo node start app.js`. This by default will start the server at port 3001
9. Install the required packages for the frontend:
* `cd ../frontend`
* `sudo npm install`
10. Start the frontend client: `sudo npm start`. This by default will start the client at port 3000. 
   
