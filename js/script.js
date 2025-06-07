
// Function to populate subjects dropdown based on selected branch and yearSem
function populateSubjects() {
  const branch = document.getElementById("branch").value;
  const yearSem = document.getElementById("yearSem").value;
  const subjectsDropdown = document.getElementById("subjects");

  if (!(branch in subjectsData) || !(yearSem in subjectsData[branch])) {
    updateDropdown(subjectsDropdown, []);
    return;
  }

  const subjects = subjectsData[branch][yearSem];
  updateDropdown(subjectsDropdown, subjects);
}

// Function to populate teacher dropdown based on selected branch
function populateTeachers() {
  const branch = document.getElementById("branch").value;
  const teacherDropdown = document.getElementById("subjectTeacher");

  if (!(branch in teachersData)) {
    updateDropdown(teacherDropdown, []);
    return;
  }

  const teachers = teachersData[branch];
  updateDropdown(teacherDropdown, teachers);
}

// Function to generate front page PDF
async function generateFrontPage() {

  const branchElement = document.getElementById("branch");
  const sessionElement = document.getElementById("session");
  const yearSemElement = document.getElementById("yearSem");
  const teacherElement = document.getElementById("subjectTeacher");
  const subjectElement = document.getElementById("subjects");
  const name = document.getElementById("nameInput").value.trim();
  const enrollment = document.getElementById("enrollmentInput").value.trim();

  const requiredFields = [
    branchElement,
    sessionElement,
    yearSemElement,
    teacherElement,
    subjectElement,
    name,
  ];

  const isEmpty = requiredFields.some(field => field.value === "");
  if (isEmpty) {
    alert("Please fill in all fields.");
    return;
  }

  const branch = branchElement.options[branchElement.selectedIndex].innerText;
  const session = sessionElement.options[sessionElement.selectedIndex].innerText;
  const yearSem = yearSemElement.options[yearSemElement.selectedIndex].innerText;
  const teacher = teacherElement.options[teacherElement.selectedIndex].innerText;
  const subject = subjectElement.options[subjectElement.selectedIndex].innerText;

  const yPositions = {
    branchY: 265,
    subjectY: 340,
    yearSemY: 236,
    sessionY: 405,
    teacherY: 70,
    nameY: 70,
    enrollmentY: 40,
  };

  const url = "./assets/format.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPage(0);
  const timesRomanFont = await pdfDoc.embedFont(
    PDFLib.StandardFonts.TimesRoman
  );
  const timesRomanBoldFont = await pdfDoc.embedFont(
    PDFLib.StandardFonts.TimesRomanBold
  );

  const pageWidth = page.getWidth();

  const nameX = pageWidth - timesRomanFont.widthOfTextAtSize(name, 23) - 20;
  const enrollmentX = pageWidth - timesRomanFont.widthOfTextAtSize(enrollment, 21) - 20;

  await drawText(page, `${enrollment}`, enrollmentX, yPositions.enrollmentY, 21, [0, 0, 0], timesRomanFont);
  await drawText(page, `${name}`, nameX, yPositions.nameY, 23, [0, 0, 0], timesRomanFont);

  // Teacher (left aligned)
  await drawText(page, `${teacher}`, 20, yPositions.teacherY, 23, [0, 0, 0], timesRomanFont);

  // Branch, Year & Sem, Session (centered)
  await drawText(page, `${branch}`, getCenteredX(branch, 28, timesRomanFont, pageWidth), yPositions.branchY, 28, [255, 0, 0], timesRomanFont);
  await drawText(page, `${yearSem}`, getCenteredX(yearSem, 24, timesRomanFont, pageWidth), yPositions.yearSemY, 24, [255, 0, 0], timesRomanFont);
  await drawText(page, `Session - ${session}`, getCenteredX(`Session - ${session}`, 26, timesRomanFont, pageWidth), yPositions.sessionY, 26, [0, 0, 0], timesRomanFont);

  // Subject (centered and dynamically adjusted font size)
  let subjectFontSize = 28;
  let subjectTextWidth = timesRomanBoldFont.widthOfTextAtSize(subject, subjectFontSize);

  while (subjectTextWidth > pageWidth - 40 && subjectFontSize > 10) {
    subjectFontSize -= 1;
    subjectTextWidth = timesRomanBoldFont.widthOfTextAtSize(subject, subjectFontSize);
  }

  await drawText(page, `${subject}`, getCenteredX(subject, subjectFontSize, timesRomanBoldFont, pageWidth), yPositions.subjectY, subjectFontSize, [61, 104, 180], timesRomanBoldFont);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const urlBlob = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = urlBlob;
  link.download = `${subject} - ${name}.pdf`;
  link.click();

  // 👇 Open in new tab
  window.open(urlBlob);

}

// Event listeners to populate subjects and teachers dropdowns
const elementsToWatch = [
  "branch",
  "yearSem",
  "subjects",
  "nameInput",
  "session",
  "subjectTeacher",
];

elementsToWatch.forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    document.getElementById("downloadLink").style.display = "none";
  });
});

document.getElementById("branch").addEventListener("change", () => {
  populateSubjects();
  populateTeachers();
});

document.getElementById("yearSem").addEventListener("change", populateSubjects);

// Event listener for form submission data to google sheet

document.getElementById("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  let formData = {
    branch: document.getElementById("branch").value,
    yearSem: document.getElementById("yearSem").value,
    subjects: document.getElementById("subjects").value,
    nameInput: document.getElementById("nameInput").value,
  };

  generateFrontPage();

  fetch(
    "https://script.google.com/macros/s/AKfycbzKHTp21jc4HwsTI7JckJVJ30aC9FAuC82zQQhTHrjaTSvXP_P-s9yfBD6AKQjfodJXNg/exec",
    {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  ).catch((error) => console.error("Error:", error));
});
