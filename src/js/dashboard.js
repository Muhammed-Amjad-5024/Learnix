import { supabase } from "./supabase.js";


// =========================================
// DOM ELEMENTS
// =========================================

const welcomeMessage =
    document.getElementById("welcome-message");

const institutionName =
    document.getElementById("institution-name");

const classroomList =
    document.getElementById("classroom-list");

const classroomCount =
    document.getElementById("classroom-count");

const subjectCount =
    document.getElementById("subject-count");

const createClassroomButton =
    document.getElementById("create-classroom-button");

const createClassroomSection =
    document.getElementById("create-classroom-section");

const createClassroomForm =
    document.getElementById("create-classroom-form");

const classroomNameInput =
    document.getElementById("classroom-name");

const classroomDescriptionInput =
    document.getElementById("classroom-description");

const classroomMessage =
    document.getElementById("classroom-message");

const logoutButton =
    document.getElementById("logout-button");


// =========================================
// CURRENT USER PROFILE
// =========================================

let currentProfile = null;


// =========================================
// CREATE CLASSROOM FORM TOGGLE
// =========================================

if (createClassroomButton && createClassroomSection) {

    createClassroomButton.addEventListener(
        "click",
        () => {

            const isHidden =
                createClassroomSection.hidden;

            createClassroomSection.hidden =
                !isHidden;

            if (isHidden) {

                createClassroomButton.textContent =
                    "− Close";

                classroomNameInput.focus();

            } else {

                createClassroomButton.textContent =
                    "+ Create Classroom";

                createClassroomForm.reset();

                classroomMessage.textContent = "";
            }
        }
    );
}


// =========================================
// LOAD COMPLETE DASHBOARD
// =========================================

async function loadDashboard() {

    // 1. Check whether a user is logged in

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();


    if (userError || !user) {

        console.log(
            "No authenticated user found."
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "Authenticated user:",
        user
    );


    // 2. Get the user's Learnix profile

    const {
        data: profile,
        error: profileError
    } = await supabase
        .from("profiles")
        .select(
            "full_name, role, institution_id"
        )
        .eq("id", user.id)
        .single();


    if (profileError) {

        console.error(
            "Profile error:",
            profileError
        );

        welcomeMessage.textContent =
            "Unable to load your profile.";

        return;
    }


    console.log(
        "Learnix profile:",
        profile
    );


    // Store profile for later use

    currentProfile = profile;


    // 3. Check the user's role

    if (
        profile.role !==
        "institution_admin"
    ) {

        welcomeMessage.textContent =
            "You do not have access to this dashboard.";

        return;
    }


    // 4. Display the user's name

    welcomeMessage.textContent =
        `Welcome, ${profile.full_name}`;


    // 5. Get the institution

    const {
        data: institution,
        error: institutionError
    } = await supabase
        .from("institutions")
        .select("name, code")
        .eq(
            "id",
            profile.institution_id
        )
        .single();


    if (institutionError) {

        console.error(
            "Institution error:",
            institutionError
        );

        institutionName.textContent =
            "Unable to load institution information.";

        return;
    }


    console.log(
        "Institution:",
        institution
    );


    // 6. Display institution information

    institutionName.textContent =
        `${institution.name} (${institution.code})`;


    // 7. Load classrooms and subjects

    await loadClassrooms(
        profile.institution_id
    );
}


// =========================================
// LOAD CLASSROOMS AND SUBJECTS
// =========================================

async function loadClassrooms(
    institutionId
) {

    // Get classrooms belonging
    // to this institution

    const {
        data: classrooms,
        error: classroomError
    } = await supabase
        .from("classrooms")
        .select(
            "id, name, description"
        )
        .eq(
            "institution_id",
            institutionId
        )
        .order("name");


    if (classroomError) {

        console.error(
            "Classroom error:",
            classroomError
        );

        classroomList.innerHTML =
            "<p>Unable to load classrooms.</p>";

        return;
    }


    console.log(
        "Classrooms:",
        classrooms
    );


    // Display classroom count

    classroomCount.textContent =
        classrooms.length;


    // Get classroom IDs

    const classroomIds =
        classrooms.map(
            (classroom) =>
                classroom.id
        );


    // Prepare subjects

    let subjects = [];


    // Get subjects for all classrooms

    if (
        classroomIds.length > 0
    ) {

        const {
            data: subjectData,
            error: subjectError
        } = await supabase
            .from("subjects")
            .select(
                "id, classroom_id, name, code"
            )
            .in(
                "classroom_id",
                classroomIds
            )
            .order("name");


        if (subjectError) {

            console.error(
                "Subject error:",
                subjectError
            );

            classroomList.innerHTML =
                "<p>Unable to load subjects.</p>";

            return;
        }


        subjects =
            subjectData || [];
    }


    console.log(
        "Subjects:",
        subjects
    );


    // Display subject count

    subjectCount.textContent =
        subjects.length;


    // Display classrooms

    if (
        classrooms.length === 0
    ) {

        classroomList.innerHTML =
            "<p>No classrooms found.</p>";

        return;
    }


    classroomList.innerHTML =
        classrooms
            .map(
                (classroom) => {

                    // Find subjects belonging
                    // to this classroom

                    const classroomSubjects =
                        subjects.filter(
                            (subject) =>
                                subject.classroom_id ===
                                classroom.id
                        );


                    // Create subject list

                    const subjectsHTML =
                        classroomSubjects.length > 0

                            ? classroomSubjects
                                .map(
                                    (subject) => `
                                        <li>
                                            ${subject.name}
                                            ${
                                                subject.code
                                                    ? ` (${subject.code})`
                                                    : ""
                                            }
                                        </li>
                                    `
                                )
                                .join("")

                            : "<li>No subjects found.</li>";


                    // Create classroom card

                    return `
                        <div class="classroom-item">

                            <h3>
                                ${classroom.name}
                            </h3>

                            <p>
                                ${
                                    classroom.description ||
                                    "No description available."
                                }
                            </p>

                            <strong>
                                Subjects
                            </strong>

                            <ul>
                                ${subjectsHTML}
                            </ul>

                        </div>
                    `;
                }
            )
            .join("");
}


// =========================================
// CREATE NEW CLASSROOM
// =========================================

async function createClassroom(
    event
) {

    event.preventDefault();


    // Make sure the profile
    // has loaded

    if (!currentProfile) {

        classroomMessage.textContent =
            "Your profile is not loaded yet.";

        return;
    }


    // Get form values

    const classroomName =
        classroomNameInput.value.trim();

    const classroomDescription =
        classroomDescriptionInput.value.trim();


    // Basic validation

    if (!classroomName) {

        classroomMessage.textContent =
            "Please enter a classroom name.";

        classroomNameInput.focus();

        return;
    }


    // Show loading message

    classroomMessage.textContent =
        "Creating classroom...";


    // Insert classroom into Supabase

    const {
        data: newClassroom,
        error: insertError
    } = await supabase
        .from("classrooms")
        .insert({
            institution_id:
                currentProfile.institution_id,

            name:
                classroomName,

            description:
                classroomDescription || null
        })
        .select()
        .single();


    // Handle database error

    if (insertError) {

        console.error(
            "Create classroom error:",
            insertError
        );

        classroomMessage.textContent =
            insertError.message;

        return;
    }


    console.log(
        "New classroom created:",
        newClassroom
    );


    // Show success message

    classroomMessage.textContent =
        "Classroom created successfully.";


    // Clear the form

    createClassroomForm.reset();


    // Reload classrooms

    await loadClassrooms(
        currentProfile.institution_id
    );
}


// =========================================
// FORM SUBMISSION
// =========================================

if (createClassroomForm) {

    createClassroomForm.addEventListener(
        "submit",
        createClassroom
    );
}


// =========================================
// LOGOUT
// =========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await supabase.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return;
            }


            window.location.href =
                "login.html";
        }
    );
}


// =========================================
// START DASHBOARD
// =========================================

loadDashboard();