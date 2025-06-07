const branchDropdown = document.getElementById("branch");
const sessionDropdown = document.getElementById("session");
const yearSemDropdown = document.getElementById("yearSem");
const subjectDropdown = document.getElementById("subjects");
const teacherDropdown = document.getElementById("teacher");
const form = document.getElementById("frontPageForm");

// Function to populate subjects dropdown based on selected branch and yearSem
const populateSubjects = () => {
  if (!(branchDropdown.value in subjectsData) || !(yearSemDropdown.value in subjectsData[branchDropdown.value])) {
    updateDropdown(subjectDropdown, []);
    return;
  }
  const subjects = subjectsData[branchDropdown.value][yearSemDropdown.value];
  updateDropdown(subjectDropdown, subjects);
}

// Function to populate teacher dropdown based on selected branch
const populateTeachers = () => {
  if (!(branchDropdown.value in teachersData)) {
    updateDropdown(teacherDropdown, []);
    return;
  }
  const teachers = teachersData[branchDropdown.value];
  updateDropdown(teacherDropdown, teachers);
}

// Function to handle dropdown change based on selected branch and yearSem
const handleDropdownChange = () => {
  populateSubjects();
  populateTeachers();
};

// Event listener to submit form and generate front page PDF
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formData = {
    branch: branchDropdown.value,
    yearSem: yearSemDropdown.value,
    subjects: subjectDropdown.value,
    nameInput: document.getElementById("nameInput").value.trim()
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

// Function to generate front page PDF
const generateFrontPage = async () => {

  const branch = branchDropdown.options[branchDropdown.selectedIndex].innerText;
  const session = sessionDropdown.options[sessionDropdown.selectedIndex].innerText;
  const yearSem = yearSemDropdown.options[yearSemDropdown.selectedIndex].innerText;
  const teacher = teacherDropdown.options[teacherDropdown.selectedIndex].innerText;
  const subject = subjectDropdown.options[subjectDropdown.selectedIndex].innerText;
  const studentName = document.getElementById("nameInput").value.trim();
  const studentEnrollment = document.getElementById("enrollmentInput").value.trim();

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
  const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);

  const pageWidth = page.getWidth();

  const nameX = pageWidth - timesRomanFont.widthOfTextAtSize(studentName, 23) - 20;
  const enrollmentX = pageWidth - timesRomanFont.widthOfTextAtSize(studentEnrollment, 21) - 20;

  await drawText(page, `${studentEnrollment}`, enrollmentX, yPositions.enrollmentY, 21, [0, 0, 0], timesRomanFont);
  await drawText(page, `${studentName}`, nameX, yPositions.nameY, 23, [0, 0, 0], timesRomanFont);

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
  link.download = `${subject} - ${studentName}.pdf`;
  link.click();
  window.open(urlBlob);
}
