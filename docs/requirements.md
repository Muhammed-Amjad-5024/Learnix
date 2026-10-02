# Learnix - Requirements
## 1. Project overview

Learnix is a centralized academic platform designed to connect students, faculty, and educational institutions in one secure environment.

The primary purpose of Learnix is to make academic resources easier to publish, organize, discover, access, and communicate about. Instead of relying on multiple messaging groups where notes, PDFs, presentations, links, and other academic resources can become difficult to find later, Learnix provides a structured platform where resources are organized according to institutions, classrooms, subjects, and faculty.

Learnix will also provide private communication between students and faculty. Students can communicate with relevant faculty members, request academic resources, and receive replies and notifications without exposing private conversations to other users.

The system will use institution-based access control. Students and faculty belong to an institution, and access to classrooms, subjects, resources, and other functionality will depend on their role and permissions.

Learnix is intended to be developed as a real, maintainable software product rather than a temporary prototype. The system will be designed with security, scalability, usability, maintainability, and future expansion in mind.

## 2. Problem Statement

Students and faculty often exchange academic materials through multiple messaging groups and other communication channels. These materials may include notes, PDFs, presentations, documents, important links, and educational videos.

As the number of messages and groups increases, previously shared academic resources become difficult to locate. Students may have to search through large amounts of unrelated conversations to find a particular note or link. Important academic information can also become buried among regular messages.

Faculty members also lack a dedicated platform for organizing and publishing resources according to specific classrooms and subjects. Communication between individual students and faculty may also become mixed with other conversations.

Learnix aims to address these problems by providing a centralized academic platform where institutions can organize students and faculty, faculty can publish resources to authorized classrooms and subjects, students can search and access those resources, and students and faculty can communicate privately within the platform.

## 3. Core Objectives

The main objectives of Learnix are:

1. Provide a centralized platform for academic resources instead of relying on scattered messaging groups.

2. Allow educational institutions to organize their academic community within Learnix.

3. Allow institutions to manage their students, faculty, classrooms, subjects, and related permissions.

4. Allow faculty members to publish academic resources such as notes, PDFs, presentations, documents, educational links, and YouTube links.

5. Allow students to access resources belonging to classrooms for which they have been authorized.

6. Provide search and filtering capabilities so students can find academic resources more easily.

7. Provide private communication between students and relevant faculty members.

8. Provide notifications for important events such as new resources, messages, classroom requests, and faculty responses.

9. Allow students to request access to classrooms and require appropriate faculty approval before classroom resources become accessible.

10. Provide faculty members with information about resource engagement, such as whether authorized students have opened or downloaded resources, where appropriate.

11. Provide students with a personal library for organizing resources they have saved within Learnix.

12. Enforce role-based and institution-based authorization so users can only access data and functionality they are permitted to use.

13. Build the system with security, maintainability, scalability, and future expansion in mind.

14. Keep the architecture flexible enough to support multiple educational institutions in future versions.

15. Provide a foundation for future features, including a genuine AI-powered academic assistant, without introducing artificial or non-functional AI features into the initial system.

## 4. User Roles

Learnix will use a role-based system. Each user will have a defined role that determines which features and data they are authorized to access.

### 4.1 Learnix Platform Administrator

The Learnix Platform Administrator operates at the platform level.

Responsibilities may include:

- Reviewing and managing institution registrations.
- Verifying institutions during the institution onboarding process.
- Activating, suspending, or managing institutions at the platform level.
- Handling platform-level administrative issues.
- Managing platform-wide policies and security where required.

The Platform Administrator does not normally manage individual students, faculty members, or classroom resources inside an institution.

### 4.2 Institution Administrator

Each institution can have one or more authorized Institution Administrators.

Responsibilities may include:

- Managing the institution's information.
- Creating and managing student records.
- Creating and managing faculty records.
- Managing institution-issued student and faculty IDs.
- Managing classrooms.
- Managing subjects.
- Assigning faculty members to classrooms and subjects.
- Managing institution-level user status and permissions.
- Handling institutional account administration.

The Institution Administrator can manage users and academic structures belonging to their own institution but should not have access to unrelated institutions.

### 4.3 Faculty

Faculty members belong to an institution and receive their institutional identity from the institution.

Faculty members may:

- Activate their Learnix account using an institution-issued faculty ID or activation mechanism.
- Create their own username and password during account activation.
- Log in using their Learnix credentials.
- Access classrooms and subjects for which they have been authorized.
- Publish academic resources.
- Share notes, PDFs, presentations, documents, external links, and educational videos.
- Receive and respond to private student messages.
- Receive classroom membership requests where applicable.
- Approve or reject student requests for classrooms they are authorized to manage.
- Remove students from classrooms where they have appropriate authority.
- View permitted resource engagement information.

A faculty member should not automatically have access to every classroom or subject in the institution. Their permissions should be based on their assigned teaching responsibilities.

### 4.4 Student

Students belong to an institution and receive their institutional identity from the institution.

Students may:

- Activate their Learnix account using an institution-issued student ID or activation mechanism.
- Create their own username and password during account activation.
- Log in using their Learnix credentials.
- Request access to classrooms.
- Access classrooms only after the appropriate authorization has been granted.
- View subjects available within authorized classrooms.
- Search for academic resources.
- Open and download permitted resources.
- Save permitted resources to their personal Learnix library where supported.
- Communicate privately with relevant faculty members.
- Request academic materials through private communication.
- Receive notifications.
- Manage their own profile and permitted personal settings.

Students cannot automatically access every classroom or every resource within an institution.

### 4.5 Role Separation

Learnix must enforce clear separation between roles.

For example:

- A student must not be able to perform Institution Administrator functions.
- A student must not be able to access another student's private conversations.
- A faculty member must not automatically access classrooms or subjects outside their assigned responsibilities.
- An Institution Administrator must not automatically gain access to unrelated institutions.
- Platform-level administration must be separated from ordinary institution-level administration.

Role restrictions must eventually be enforced by the backend and database security mechanisms, not only by hiding interface elements in the frontend.

## 5. Institution Model

Learnix will be designed as an institution-based academic platform. An institution represents an educational organization such as a college, university, school, or other recognized educational organization using Learnix.

Each institution will have its own users, classrooms, subjects, academic resources, and related data. Data belonging to one institution must remain isolated from data belonging to other institutions.

### 5.1 Institution Administration

An institution will have one or more authorized Institution Administrators.

The Institution Administrator is responsible for managing the academic environment of that institution within Learnix.

The Institution Administrator may:

- Manage institution information.
- Create and manage student records.
- Create and manage faculty records.
- Provide institution-issued IDs or activation mechanisms to students and faculty.
- Create and manage classrooms.
- Create and manage subjects.
- Assign faculty members to appropriate classrooms and subjects.
- Manage the status of institution users.
- Perform other institution-level administrative operations permitted by Learnix.

### 5.2 Institution Membership

Students and faculty members must belong to an institution before they can use institution-specific academic functionality.

An institution-issued identity will be used to establish that a student or faculty member has been provisioned by the institution.

The institution-issued identity may be used during account activation. After successful activation, the user can create and use their own Learnix username and password for normal authentication.

The institution-issued identity and the user's Learnix login credentials are separate concepts.

### 5.3 Initial Development Institution

The first development version of Learnix will not depend on a public institution-registration and verification system.

During development, an institution will be created and configured directly for testing. The developer will use the Institution Administrator role to create test faculty, students, classrooms, subjects, and teaching assignments.

This allows the core Learnix functionality to be developed and tested before implementing a complete public institution onboarding system.

### 5.4 Future Institution Registration

A future version of Learnix may allow educational institutions to register directly on the platform.

The proposed future workflow is:

Institution Registration
        ↓
Institution Verification
        ↓
Institution Approval
        ↓
Institution Administrator Setup
        ↓
Institution Management

The exact verification mechanism will be determined later. Learnix should therefore be designed so that introducing public institution registration and verification does not require a complete redesign of the core application.

### 5.5 Institution Data Isolation

Every institution-specific resource must be associated with the appropriate institution.

Users must not be able to access or modify data belonging to another institution unless explicitly authorized by a platform-level administrative function.

Institution isolation must eventually be enforced at the backend/database level rather than relying only on frontend navigation or interface restrictions.

## 6. Classroom and Subject Model

Learnix will organize academic content using classrooms and subjects.

A classroom represents a specific academic group within an institution. A classroom may represent a batch, section, semester group, class division, or another academic grouping defined by the institution.

### 6.1 Classroom

Each classroom belongs to exactly one institution.

A classroom may contain:

- A classroom name or identifier.
- Students who have been authorized to join the classroom.
- Subjects offered within the classroom.
- Faculty members assigned to teach subjects in the classroom.
- Academic resources associated with those subjects.

Example:

Institution: Example College

Classroom:

S5 CSE A

Subjects:

- Design and Analysis of Algorithms
- Machine Learning
- Microcontrollers
- Computer Networks

### 6.2 Student Classroom Membership

A student does not automatically gain access to a classroom simply because the student belongs to an institution.

The student must request access to the appropriate classroom.

The basic workflow is:

Student
    ↓
Selects or identifies classroom
    ↓
Submits classroom access request
    ↓
Request remains pending
    ↓
Authorized faculty reviews request
    ↓
Approve / Reject
    ↓
If approved → Student becomes a classroom member

Only approved classroom members can access resources belonging to that classroom.

A student may be removed from a classroom by an authorized faculty member or institution administrator according to the permissions defined by the system.

### 6.3 Faculty Teaching Assignments

A faculty member may teach multiple subjects and may teach the same or different subjects across multiple classrooms.

Faculty access must therefore be based on explicit teaching assignments rather than simply giving every faculty member access to every classroom.

Example:

Faculty A:

- S5 CSE A → Design and Analysis of Algorithms
- S5 CSE B → Design and Analysis of Algorithms
- S6 CSE A → Algorithms

The faculty member should only be authorized to manage the classrooms and subjects associated with their teaching assignments.

### 6.4 Subjects

A subject belongs to an appropriate academic context within an institution and classroom.

Resources published by faculty will be associated with the relevant subject and classroom.

A subject may contain resources such as:

- Notes
- PDF documents
- Presentations
- Other academic documents
- External links
- YouTube links
- Other supported educational resources

### 6.5 Classroom Access Rules

The following rules apply:

- Institution membership does not automatically provide classroom access.
- Students must receive classroom authorization before accessing classroom resources.
- Pending classroom requests must not provide access to classroom resources.
- Faculty members can manage classroom resources only where they have the appropriate teaching assignment or administrative authority.
- Institution administrators may manage classroom structures and memberships according to their permissions.
- Access restrictions must be enforced by backend and database authorization mechanisms.

### 6.6 Classroom Membership and Resource Access

Classroom membership is an important authorization boundary.

If a student is an active member of a classroom:

Student
    ↓
Classroom
    ↓
Subject
    ↓
Authorized Resource

If the student's classroom membership is removed:

Student
    ↓
Classroom access revoked
    ↓
Classroom resources no longer accessible through Learnix

A resource that has already been downloaded to the student's own device is outside Learnix's direct access control after the download has occurred.

The system must not treat a previously downloaded local file as continued authorization to access the protected classroom resource through Learnix.

## 7. Academic Resources

Learnix will allow authorized faculty members to publish and manage academic resources within the classrooms and subjects they are assigned to.

Supported resources may include:

- Notes and PDF files
- Presentations and documents
- Important academic links
- YouTube and other educational video links
- Other supported academic resource types

Each resource will be associated with the appropriate institution, classroom, subject, and publishing faculty member.

Students will only be able to access resources for classrooms to which they have been authorized. Students may open and download permitted resources and may organize permitted resources within their personal Learnix library where supported.

Faculty members will be able to edit, update, replace, archive, or delete resources they are authorized to manage. The system may support resource versioning so that updated resources can be tracked when required.

If a student's classroom membership is revoked, the student must no longer be able to access the protected classroom resource through Learnix. A file that was previously downloaded to the student's own device remains under the student's control.

Learnix may also record appropriate resource engagement information, such as resource opens and downloads, for authorized faculty and institutional purposes.