# Book My Class

Book My Class helps students and teachers to connect and encourages greater collaboration and engagement in times of a pandemic. It provides various functionalities that help to make the learning process easy to follow in times like these. For in-depth information about the website, view the below given <strong>About the website</strong> and <strong>Functionalities of the website</strong> sections.

## Getting started

- Prerequisite
  Node.js

- Clone this repository <br/>

```bash
git clone https://github.com/vartikavr/bookMyClass.git
```

- Open command line in the <strong>cloned folder (bookMyClass)</strong>,
  - To install server-side dependencies, run `npm install`
  - To install client-side dependencies, run
    `cd client` and then, `npm install`
  - To run the application for development, run `npm run dev`. <br/>
    (This would run both the client and server)
  - Open [localhost:3000](http://localhost:3000/) in the browser <br/>
    (in some cases, localhost fails to load properly, so [127.0.0.1:3000](http://127.0.0.1:3000) can also be used)
- Since this repository is to be cloned and evaluated locally, therefore, for now, the environment variables file is made available too.
- A video demo is also made for this website. Open demo from [here](https://youtu.be/97zehQlWLmc).
- This website is also deployed on Heroku, the link for the same is [Book My Class](https://immense-spire-21650.herokuapp.com/).

## About the website

At the current time, with the decreasing number of Covid cases around the globe, we are slowly moving towards opening various offline activities. These also include offline classes, which have been closed ever since the pandemic began. Therefore, our website helps to ease this transformation of slowly shifting from remotely attending the classes to attending them in-person. <br />
We understand that according to the guidelines, full capacity in-person classes can't be taken at this moment. So, our website helps to include a specified number of students for in-person attendance of the class while the others can access them remotely. <br />
The clearance for attending an in-person class would depend on the total available in-person seats and the vaccination status of a particular student. Therefore, through our website, a student can easily book their seat for an in-person class, following the mentioned guidelines. There is no compulsion so far to attend the in-person classes so students willing to attend them remotely can go ahead with it, without any need of booking.

## Functionalities of the website

### User registration

A new user can register themselves on our website, by providing appropriate details, which include: name, vaccination status, email id, and password. Once registered, the user will receive an email confirmation mail on their entered email id, through which they can verify their account and move ahead with browsing the website. <br />
<strong>Note:</strong> A non-verified user can not access all the features of the website.

### Login

A registered user can simply enter their registered email id and password and log in to their account. Apart from login, the user can also access the <strong>Forgot Password</strong> feature. This feature would ask the user for the email of the account for which the user wishes to reset the password. It'll then send them an email through which they can set their new password.

### View my classrooms

The "My Classrooms" page would show all the created as well as joined classrooms of the current user. A user can act as a teacher for some classrooms and also a student for some others at the same time.

### Creating a classroom

A user can create a new classroom of their own via the "My Classrooms" page. Once created, the current user would be treated as the teacher of that classroom. The teacher of a classroom can view the classroom's code, add a new class to it, edit or delete that particular classroom. The teacher can also view the people (students) who have joined that particular classroom and invite new students to join too. Through invite, an email will be sent to the entered email id, which will include the code of the classroom.

### Joining a classroom

A user can also join an existing classroom via the "My Classrooms" page. All they need to do is, enter the classroom's code which they want to join. The classroom code can be accessed via the invite mail sent by the teacher to the student or can directly be shared by the teacher to the students through the platform of their choice.

### Creating a class

A new class can be scheduled in a classroom by the classroom's teacher. The class details would include the title of the class, scheduled date, start time and end time, and the total number of in-person seats available (by default its value would be considered as 25) for the class. There is no limit on the number of students accessing the class remotely.

### Viewing a particular classroom

Details of a particular classroom and its corresponding classes can be seen by the classroom's people (teacher and students).

- The teacher of the classroom can delete any scheduled class and can also view the roster of a particular class. The roster would indicate in which mode are the students attending that particular class. By default, it'll be considered that the student will be attending the class remotely. Once the student books a seat in that class, their mode of attendance would change from "remotely" to "in-person".
- The student of the classroom can view the people in the classroom and book any scheduled upcoming class.

### Booking a class

Any student of the classroom can book an in-person seat for a scheduled upcoming class of that classroom. The only restriction is, they should be either under 18 years of age or fully vaccinated to attend an in-person class(as per the guidelines). Upon successful booking, the count of the available number of in-person seats would decrement by one. Once the available seats' count becomes 0, no further bookings can be done for that particular class. A student can only book an upcoming class (class scheduled on the current date or after that) and can not book seats for an expired class (class scheduled before the current date).

### View my bookings or Cancel my bookings

All the in-person class bookings of a user can be seen on the "My Bookings" page. You view all the bookings, only the upcoming or only the expired ones separately also. The user can also cancel their bookings from this page. Upon successful cancellation, the count of the available number of in-person seats would increment by one.

### Reminder emails

The website also includes a feature of sending reminder emails. Before one hour of the scheduled class's start time, reminder emails would be sent to the corresponding classroom teacher and the students who have booked an in-person seat in that class.

### View my profile

A user can view their profile details, edit the details or delete their account from the "My Profile" page. A user can also change their email id. The new email id should not be registered on the website priorly. After successful submission, an email confirmation mail would be sent to their new email id and they would have to verify their account through email confirmation once again. A user can also update their password from this page. Through this, a mail would be sent to their registered email id via which they can set their new password.
<br/>

## Happy Learning!
