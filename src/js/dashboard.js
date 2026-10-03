import { supabase } from "./supabase.js";


// =========================================
// DOM ELEMENTS
// =========================================

// Dashboard views
const dashboardHome =
    document.getElementById("dashboard-home");

const facultyManagementView =
    document.getElementById("faculty-management-view");

const classroomManagementView =
    document.getElementById("classroom-management-view");


// Dashboard information
const welcomeMessage =
    document.getElementById("welcome-message");

const institutionName =
    document.getElementById("institution-name");

const studentCount =
    document.getElementById("student-count");

const facultyCount =
    document.getElementById("faculty-count");

const classroomCount =
    document.getElementById("classroom-count");

const subjectCount =
    document.getElementById("subject-count");


// Navigation buttons
const openFacultyButton =
    document.getElementById("open-faculty-button");

const openClassroomButton =
    document.getElementById("open-classroom-button");

const backFromFacultyButton =
    document.getElementById("back-from-faculty-button");

const backFromClassroomButton =
    document.getElementById("back-from-classroom-button");


// =========================================
// FACULTY MANAGEMENT ELEMENTS
// =========================================

const facultySearch =
    document.getElementById("faculty-search");

const facultyList =
    document.getElementById("faculty-list");

const createFacultyButton =
    document.getElementById("create-faculty-button");

const createFacultySection =
    document.getElementById("create-faculty-section");

const closeFacultyFormButton =
    document.getElementById("close-faculty-form-button");

const cancelFacultyButton =
    document.getElementById("cancel-faculty-button");

const createFacultyForm =
    document.getElementById("create-faculty-form");

const facultyNameInput =
    document.getElementById("faculty-name");

const facultyCodeInput =
    document.getElementById("faculty-code");

const facultyEmailInput =
    document.getElementById("faculty-email");

const facultyPhoneInput =
    document.getElementById("faculty-phone");

const facultyDepartmentInput =
    document.getElementById("faculty-department");

const facultyMessage =
    document.getElementById("faculty-message");


// Faculty details
const facultyDetailsSection =
    document.getElementById("faculty-details-section");

const facultyDetails =
    document.getElementById("faculty-details");

const closeFacultyDetailsButton =
    document.getElementById(
        "close-faculty-details-button"
    );


// =========================================
// CLASSROOM MANAGEMENT ELEMENTS
// =========================================

const classroomList =
    document.getElementById("classroom-list");

const createClassroomButton =
    document.getElementById("create-classroom-button");

const createClassroomSection =
    document.getElementById("create-classroom-section");

const closeClassroomFormButton =
    document.getElementById(
        "close-classroom-form-button"
    );

const cancelClassroomButton =
    document.getElementById(
        "cancel-classroom-button"
    );

const createClassroomForm =
    document.getElementById("create-classroom-form");

const classroomNameInput =
    document.getElementById("classroom-name");

const classroomDescriptionInput =
    document.getElementById(
        "classroom-description"
    );

const classroomMessage =
    document.getElementById("classroom-message");


// Logout
const logoutButton =
    document.getElementById("logout-button");


// =========================================
// CURRENT USER PROFILE
// =========================================

let currentProfile = null;


// =========================================
// FACULTY DATA
// =========================================
//
// Faculty records loaded from Supabase
// are kept in memory.
//
// This allows:
// - instant search
// - instant faculty details
// - no extra database request
//   every time a faculty member is clicked
//

let facultyData = [];


// =========================================
// HTML ESCAPING
// =========================================
//
// User/database values are inserted
// into HTML.
//
// Escape them before rendering.
//

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================
// VIEW MANAGEMENT
// =========================================

function showDashboardHome() {

    dashboardHome.hidden = false;

    facultyManagementView.hidden = true;

    classroomManagementView.hidden = true;


    closeFacultyForm();

    closeFacultyDetails();

    closeClassroomForm();
}


async function showFacultyManagement() {

    dashboardHome.hidden = true;

    facultyManagementView.hidden = false;

    classroomManagementView.hidden = true;


    closeFacultyForm();

    closeFacultyDetails();


    if (facultySearch) {
        facultySearch.value = "";
    }


    if (currentProfile) {

        await loadFaculty(
            currentProfile.institution_id
        );
    }
}


async function showClassroomManagement() {

    dashboardHome.hidden = true;

    facultyManagementView.hidden = true;

    classroomManagementView.hidden = false;


    closeClassroomForm();


    if (currentProfile) {

        await loadClassrooms(
            currentProfile.institution_id
        );
    }
}


// =========================================
// NAVIGATION EVENTS
// =========================================

if (openFacultyButton) {

    openFacultyButton.addEventListener(
        "click",
        showFacultyManagement
    );
}


if (openClassroomButton) {

    openClassroomButton.addEventListener(
        "click",
        showClassroomManagement
    );
}


if (backFromFacultyButton) {

    backFromFacultyButton.addEventListener(
        "click",
        showDashboardHome
    );
}


if (backFromClassroomButton) {

    backFromClassroomButton.addEventListener(
        "click",
        showDashboardHome
    );
}


// =========================================
// FACULTY FORM
// =========================================

function openFacultyForm() {

    if (!createFacultySection) {
        return;
    }


    // Close details when adding
    // a new faculty member.

    closeFacultyDetails();


    createFacultySection.hidden =
        false;


    if (facultyMessage) {
        facultyMessage.textContent = "";
    }


    if (facultyNameInput) {
        facultyNameInput.focus();
    }
}


function closeFacultyForm() {

    if (!createFacultySection) {
        return;
    }


    createFacultySection.hidden =
        true;


    if (createFacultyForm) {
        createFacultyForm.reset();
    }


    if (facultyMessage) {
        facultyMessage.textContent = "";
    }
}


if (createFacultyButton) {

    createFacultyButton.addEventListener(
        "click",
        openFacultyForm
    );
}


if (closeFacultyFormButton) {

    closeFacultyFormButton.addEventListener(
        "click",
        closeFacultyForm
    );
}


if (cancelFacultyButton) {

    cancelFacultyButton.addEventListener(
        "click",
        closeFacultyForm
    );
}


// =========================================
// FACULTY DETAILS
// =========================================

function openFacultyDetails(
    facultyId
) {

    if (
        !facultyDetailsSection ||
        !facultyDetails
    ) {
        return;
    }


    // Find the selected faculty
    // from the already loaded data.

    const member =
        facultyData.find(
            faculty =>
                faculty.id === facultyId
        );


    if (!member) {

        console.error(
            "Faculty member not found:",
            facultyId
        );

        return;
    }


    // Close Add Faculty form
    // when opening details.

    closeFacultyForm();


    // Render details.

    facultyDetails.innerHTML = `

        <div class="faculty-detail-grid">


            <div class="faculty-detail-item">

                <span>
                    Full Name
                </span>

                <strong>
                    ${escapeHtml(member.full_name)}
                </strong>

            </div>


            <div class="faculty-detail-item">

                <span>
                    Faculty ID
                </span>

                <strong>
                    ${escapeHtml(member.faculty_code)}
                </strong>

            </div>


            <div class="faculty-detail-item">

                <span>
                    Department
                </span>

                <strong>
                    ${
                        escapeHtml(
                            member.department ||
                            "Not specified"
                        )
                    }
                </strong>

            </div>


            <div class="faculty-detail-item">

                <span>
                    Email
                </span>

                <strong>
                    ${
                        escapeHtml(
                            member.email ||
                            "Not specified"
                        )
                    }
                </strong>

            </div>


            <div class="faculty-detail-item">

                <span>
                    Phone
                </span>

                <strong>
                    ${
                        escapeHtml(
                            member.phone ||
                            "Not specified"
                        )
                    }
                </strong>

            </div>


            <div class="faculty-detail-item">

                <span>
                    Status
                </span>

                <strong class="faculty-status">
                    ${escapeHtml(member.status)}
                </strong>

            </div>


        </div>

    `;


    facultyDetailsSection.hidden =
        false;


    // Scroll the details section
    // into view.

    facultyDetailsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// =========================================
// FACULTY LIST CLICK
// =========================================

if (facultyList) {

    facultyList.addEventListener(
        "click",
        event => {

            const facultyItem =
                event.target.closest(
                    ".faculty-item"
                );


            if (!facultyItem) {
                return;
            }


            const facultyId =
                facultyItem.dataset.facultyId;


            if (!facultyId) {
                return;
            }


            openFacultyDetails(
                facultyId
            );
        }
    );
}


// =========================================
// CLOSE FACULTY DETAILS
// =========================================

function closeFacultyDetails() {

    if (!facultyDetailsSection) {
        return;
    }


    facultyDetailsSection.hidden =
        true;


    if (facultyDetails) {
        facultyDetails.innerHTML = "";
    }
}


if (closeFacultyDetailsButton) {

    closeFacultyDetailsButton.addEventListener(
        "click",
        closeFacultyDetails
    );
}


// =========================================
// CLASSROOM FORM
// =========================================

function openClassroomForm() {

    if (!createClassroomSection) {
        return;
    }


    createClassroomSection.hidden =
        false;


    if (classroomMessage) {
        classroomMessage.textContent = "";
    }


    if (classroomNameInput) {
        classroomNameInput.focus();
    }
}


function closeClassroomForm() {

    if (!createClassroomSection) {
        return;
    }


    createClassroomSection.hidden =
        true;


    if (createClassroomForm) {
        createClassroomForm.reset();
    }


    if (classroomMessage) {
        classroomMessage.textContent = "";
    }
}


if (createClassroomButton) {

    createClassroomButton.addEventListener(
        "click",
        openClassroomForm
    );
}


if (closeClassroomFormButton) {

    closeClassroomFormButton.addEventListener(
        "click",
        closeClassroomForm
    );
}


if (cancelClassroomButton) {

    cancelClassroomButton.addEventListener(
        "click",
        closeClassroomForm
    );
}


// =========================================
// LOAD COMPLETE DASHBOARD
// =========================================

async function loadDashboard() {

    // -----------------------------------------
    // 1. Check authentication
    // -----------------------------------------

    const {
        data: { user },
        error: userError
    } =
        await supabase.auth.getUser();


    if (
        userError ||
        !user
    ) {

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


    // -----------------------------------------
    // 2. Load Learnix profile
    // -----------------------------------------

    const {
        data: profile,
        error: profileError
    } =
        await supabase
            .from("profiles")
            .select(
                "full_name, role, institution_id"
            )
            .eq(
                "id",
                user.id
            )
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


    currentProfile =
        profile;


    // -----------------------------------------
    // 3. Check role
    // -----------------------------------------

    if (
        profile.role !==
        "institution_admin"
    ) {

        welcomeMessage.textContent =
            "You do not have access to this dashboard.";

        return;
    }


    // -----------------------------------------
    // 4. Display user name
    // -----------------------------------------

    welcomeMessage.textContent =
        `Welcome, ${profile.full_name}`;


    // -----------------------------------------
    // 5. Load institution
    // -----------------------------------------

    const {
        data: institution,
        error: institutionError
    } =
        await supabase
            .from("institutions")
            .select(
                "name, code"
            )
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


    institutionName.textContent =
        `${institution.name} (${institution.code})`;


    // -----------------------------------------
    // 6. Load dashboard statistics
    // -----------------------------------------

    await loadDashboardStats(
        profile.institution_id
    );


    // -----------------------------------------
    // 7. Start on dashboard home
    // -----------------------------------------

    showDashboardHome();
}


// =========================================
// LOAD DASHBOARD STATISTICS
// =========================================

async function loadDashboardStats(
    institutionId
) {

    // Students are not implemented yet.

    if (studentCount) {

        studentCount.textContent =
            "0";
    }


    // -----------------------------------------
    // Faculty count
    // -----------------------------------------

    const {
        count: facultyTotal,
        error: facultyError
    } =
        await supabase
            .from("faculty")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq(
                "institution_id",
                institutionId
            );


    if (facultyError) {

        console.error(
            "Faculty count error:",
            facultyError
        );

        facultyCount.textContent =
            "—";

    } else {

        facultyCount.textContent =
            facultyTotal ?? 0;
    }


    // -----------------------------------------
    // Classroom count
    // -----------------------------------------

    const {
        count: classroomTotal,
        error: classroomError
    } =
        await supabase
            .from("classrooms")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq(
                "institution_id",
                institutionId
            );


    if (classroomError) {

        console.error(
            "Classroom count error:",
            classroomError
        );

        classroomCount.textContent =
            "—";

    } else {

        classroomCount.textContent =
            classroomTotal ?? 0;
    }


    // -----------------------------------------
    // Subject count
    // -----------------------------------------

    const {
        data: classrooms,
        error: classroomsError
    } =
        await supabase
            .from("classrooms")
            .select("id")
            .eq(
                "institution_id",
                institutionId
            );


    if (classroomsError) {

        console.error(
            "Classroom lookup error:",
            classroomsError
        );

        subjectCount.textContent =
            "—";

        return;
    }


    if (
        !classrooms ||
        classrooms.length === 0
    ) {

        subjectCount.textContent =
            "0";

        return;
    }


    const classroomIds =
        classrooms.map(
            classroom =>
                classroom.id
        );


    const {
        count: subjectTotal,
        error: subjectError
    } =
        await supabase
            .from("subjects")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .in(
                "classroom_id",
                classroomIds
            );


    if (subjectError) {

        console.error(
            "Subject count error:",
            subjectError
        );

        subjectCount.textContent =
            "—";

    } else {

        subjectCount.textContent =
            subjectTotal ?? 0;
    }
}


// =========================================
// LOAD CLASSROOMS
// =========================================

async function loadClassrooms(
    institutionId
) {

    const {
        data: classrooms,
        error: classroomError
    } =
        await supabase
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


    classroomCount.textContent =
        classrooms.length;


    const classroomIds =
        classrooms.map(
            classroom =>
                classroom.id
        );


    let subjects = [];


    // -----------------------------------------
    // Load subjects
    // -----------------------------------------

    if (
        classroomIds.length > 0
    ) {

        const {
            data: subjectData,
            error: subjectError
        } =
            await supabase
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


    subjectCount.textContent =
        subjects.length;


    // -----------------------------------------
    // No classrooms
    // -----------------------------------------

    if (
        classrooms.length === 0
    ) {

        classroomList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No classrooms yet
                </h3>

                <p>
                    Create your first classroom
                    to organize students and subjects.
                </p>

            </div>

        `;

        return;
    }


    // -----------------------------------------
    // Render classrooms
    // -----------------------------------------

    classroomList.innerHTML =
        classrooms
            .map(
                classroom => {

                    const classroomSubjects =
                        subjects.filter(
                            subject =>
                                subject.classroom_id ===
                                classroom.id
                        );


                    const subjectsHTML =
                        classroomSubjects.length > 0

                            ? classroomSubjects
                                .map(
                                    subject => `

                                        <li>

                                            ${escapeHtml(
                                                subject.name
                                            )}

                                            ${
                                                subject.code
                                                    ? ` (${escapeHtml(
                                                        subject.code
                                                    )})`
                                                    : ""
                                            }

                                        </li>

                                    `
                                )
                                .join("")

                            : `

                                <li>
                                    No subjects found.
                                </li>

                            `;


                    return `

                        <div
                            class="classroom-item"
                            data-classroom-id="${escapeHtml(
                                classroom.id
                            )}"
                        >

                            <h3>
                                ${escapeHtml(
                                    classroom.name
                                )}
                            </h3>


                            <p>
                                ${
                                    escapeHtml(
                                        classroom.description ||
                                        "No description available."
                                    )
                                }
                            </p>


                            <strong>
                                Subjects
                            </strong>


                            <ul>
                                ${subjectsHTML}
                            </ul>


                            <button
                                type="button"
                                class="add-subject-button"
                                data-classroom-id="${escapeHtml(
                                    classroom.id
                                )}"
                            >
                                + Add Subject
                            </button>


                            <div
                                class="subject-form-container"
                                id="subject-form-${escapeHtml(
                                    classroom.id
                                )}"
                                hidden
                            >

                                <form
                                    class="add-subject-form"
                                    data-classroom-id="${escapeHtml(
                                        classroom.id
                                    )}"
                                >


                                    <div class="form-group">

                                        <label>
                                            Subject Name
                                        </label>


                                        <input
                                            type="text"
                                            class="subject-name-input"
                                            placeholder="Example: Data Structures"
                                            required
                                        >

                                    </div>


                                    <div class="form-group">

                                        <label>
                                            Subject Code
                                        </label>


                                        <input
                                            type="text"
                                            class="subject-code-input"
                                            placeholder="Example: PBCST..."
                                        >

                                    </div>


                                    <button
                                        type="submit"
                                    >
                                        Add Subject
                                    </button>


                                    <p
                                        class="subject-message"
                                    ></p>


                                </form>

                            </div>


                        </div>

                    `;
                }
            )
            .join("");


    // -----------------------------------------
    // Add Subject buttons
    // -----------------------------------------

    const addSubjectButtons =
        document.querySelectorAll(
            ".add-subject-button"
        );


    addSubjectButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const classroomId =
                        button.dataset.classroomId;


                    const formContainer =
                        document.getElementById(
                            `subject-form-${classroomId}`
                        );


                    if (!formContainer) {
                        return;
                    }


                    const isHidden =
                        formContainer.hidden;


                    formContainer.hidden =
                        !isHidden;


                    if (isHidden) {

                        button.textContent =
                            "− Close";


                        const input =
                            formContainer.querySelector(
                                ".subject-name-input"
                            );


                        if (input) {
                            input.focus();
                        }

                    } else {

                        button.textContent =
                            "+ Add Subject";


                        const form =
                            formContainer.querySelector(
                                ".add-subject-form"
                            );


                        if (form) {
                            form.reset();
                        }


                        const message =
                            formContainer.querySelector(
                                ".subject-message"
                            );


                        if (message) {
                            message.textContent = "";
                        }
                    }
                }
            );
        }
    );


    // -----------------------------------------
    // Subject form submission
    // -----------------------------------------

    const subjectForms =
        document.querySelectorAll(
            ".add-subject-form"
        );


    subjectForms.forEach(
        form => {

            form.addEventListener(
                "submit",
                createSubject
            );
        }
    );
}


// =========================================
// LOAD FACULTY
// =========================================

async function loadFaculty(
    institutionId
) {

    const {
        data: faculty,
        error: facultyError
    } =
        await supabase
            .from("faculty")
            .select(
                "id, full_name, faculty_code, email, phone, department, status"
            )
            .eq(
                "institution_id",
                institutionId
            )
            .order("full_name");


    if (facultyError) {

        console.error(
            "Faculty error:",
            facultyError
        );

        facultyCount.textContent =
            "—";

        facultyList.innerHTML =
            "<p>Unable to load faculty.</p>";

        return;
    }


    console.log(
        "Faculty:",
        faculty
    );


    facultyData =
        faculty || [];


    facultyCount.textContent =
        facultyData.length;


    renderFacultyList(
        facultyData
    );
}


// =========================================
// RENDER FACULTY LIST
// =========================================

function renderFacultyList(
    faculty
) {

    if (
        !faculty ||
        faculty.length === 0
    ) {

        facultyList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No faculty members found
                </h3>

                <p>
                    Add faculty members to
                    your institution.
                </p>

            </div>

        `;

        return;
    }


    facultyList.innerHTML =
        faculty
            .map(
                member => `

                    <div
                        class="faculty-item"
                        data-faculty-id="${escapeHtml(
                            member.id
                        )}"
                        role="button"
                        tabindex="0"
                    >

                        <div>

                            <h3>
                                ${escapeHtml(
                                    member.full_name
                                )}
                            </h3>


                            <p>
                                ${escapeHtml(
                                    member.faculty_code
                                )}
                            </p>

                        </div>


                        <span
                            class="faculty-status"
                        >
                            ${escapeHtml(
                                member.status
                            )}
                        </span>


                    </div>

                `
            )
            .join("");
}


// =========================================
// FACULTY SEARCH
// =========================================

if (facultySearch) {

    facultySearch.addEventListener(
        "input",
        () => {

            const searchTerm =
                facultySearch.value
                    .trim()
                    .toLowerCase();


            if (!searchTerm) {

                renderFacultyList(
                    facultyData
                );

                return;
            }


            const filteredFaculty =
                facultyData.filter(
                    member => {

                        const name =
                            member.full_name
                                ?.toLowerCase() ||
                            "";


                        const code =
                            member.faculty_code
                                ?.toLowerCase() ||
                            "";


                        return (
                            name.includes(
                                searchTerm
                            ) ||
                            code.includes(
                                searchTerm
                            )
                        );
                    }
                );


            renderFacultyList(
                filteredFaculty
            );
        }
    );
}


// =========================================
// CREATE FACULTY
// =========================================

if (createFacultyForm) {

    createFacultyForm.addEventListener(
        "submit",
        createFaculty
    );
}


async function createFaculty(
    event
) {

    event.preventDefault();


    if (!currentProfile) {

        facultyMessage.textContent =
            "Your profile is not loaded yet.";

        return;
    }


    const facultyName =
        facultyNameInput.value.trim();


    const facultyCode =
        facultyCodeInput.value.trim();


    const facultyEmail =
        facultyEmailInput.value.trim();


    const facultyPhone =
        facultyPhoneInput.value.trim();


    const facultyDepartment =
        facultyDepartmentInput.value.trim();


    // -----------------------------------------
    // Validation
    // -----------------------------------------

    if (!facultyName) {

        facultyMessage.textContent =
            "Please enter the faculty name.";

        facultyNameInput.focus();

        return;
    }


    if (!facultyCode) {

        facultyMessage.textContent =
            "Please enter the faculty ID.";

        facultyCodeInput.focus();

        return;
    }


    facultyMessage.textContent =
        "Adding faculty...";


    // -----------------------------------------
    // Insert faculty
    // -----------------------------------------

    const {
        data: newFaculty,
        error: insertError
    } =
        await supabase
            .from("faculty")
            .insert({
                institution_id:
                    currentProfile.institution_id,

                full_name:
                    facultyName,

                faculty_code:
                    facultyCode,

                email:
                    facultyEmail ||
                    null,

                phone:
                    facultyPhone ||
                    null,

                department:
                    facultyDepartment ||
                    null
            })
            .select()
            .single();


    if (insertError) {

        console.error(
            "Create faculty error:",
            insertError
        );

        facultyMessage.textContent =
            insertError.message;

        return;
    }


    console.log(
        "New faculty created:",
        newFaculty
    );


    facultyMessage.textContent =
        "Faculty added successfully.";


    createFacultyForm.reset();


    // Reload faculty data

    await loadFaculty(
        currentProfile.institution_id
    );


    // Update dashboard statistics

    await loadDashboardStats(
        currentProfile.institution_id
    );
}


// =========================================
// CREATE SUBJECT
// =========================================

async function createSubject(
    event
) {

    event.preventDefault();


    if (!currentProfile) {
        return;
    }


    const form =
        event.currentTarget;


    const classroomId =
        form.dataset.classroomId;


    const subjectNameInput =
        form.querySelector(
            ".subject-name-input"
        );


    const subjectCodeInput =
        form.querySelector(
            ".subject-code-input"
        );


    const subjectMessage =
        form.querySelector(
            ".subject-message"
        );


    const subjectName =
        subjectNameInput.value.trim();


    const subjectCode =
        subjectCodeInput.value.trim();


    if (!subjectName) {

        subjectMessage.textContent =
            "Please enter a subject name.";

        subjectNameInput.focus();

        return;
    }


    subjectMessage.textContent =
        "Creating subject...";


    const {
        data: newSubject,
        error: insertError
    } =
        await supabase
            .from("subjects")
            .insert({
                classroom_id:
                    classroomId,

                name:
                    subjectName,

                code:
                    subjectCode ||
                    null
            })
            .select()
            .single();


    if (insertError) {

        console.error(
            "Create subject error:",
            insertError
        );

        subjectMessage.textContent =
            insertError.message;

        return;
    }


    console.log(
        "New subject created:",
        newSubject
    );


    subjectMessage.textContent =
        "Subject created successfully.";


    form.reset();


    await loadClassrooms(
        currentProfile.institution_id
    );


    await loadDashboardStats(
        currentProfile.institution_id
    );
}


// =========================================
// CREATE CLASSROOM
// =========================================

if (createClassroomForm) {

    createClassroomForm.addEventListener(
        "submit",
        createClassroom
    );
}


async function createClassroom(
    event
) {

    event.preventDefault();


    if (!currentProfile) {

        classroomMessage.textContent =
            "Your profile is not loaded yet.";

        return;
    }


    const classroomName =
        classroomNameInput.value.trim();


    const classroomDescription =
        classroomDescriptionInput.value.trim();


    if (!classroomName) {

        classroomMessage.textContent =
            "Please enter a classroom name.";

        classroomNameInput.focus();

        return;
    }


    classroomMessage.textContent =
        "Creating classroom...";


    const {
        data: newClassroom,
        error: insertError
    } =
        await supabase
            .from("classrooms")
            .insert({
                institution_id:
                    currentProfile.institution_id,

                name:
                    classroomName,

                description:
                    classroomDescription ||
                    null
            })
            .select()
            .single();


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


    classroomMessage.textContent =
        "Classroom created successfully.";


    createClassroomForm.reset();


    await loadClassrooms(
        currentProfile.institution_id
    );


    await loadDashboardStats(
        currentProfile.institution_id
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
            } =
                await supabase.auth.signOut();


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