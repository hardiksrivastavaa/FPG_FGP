// Helper function to update dropdown options
// function updateDropdown(dropdown, options) {
//   dropdown.innerHTML = '<option value="">Select</option>';
//   options.forEach((item) => {
//     const option = document.createElement("option");
//     option.text = item;
//     dropdown.add(option);
//   });
// }

function updateDropdown(dropdown, items) {
  dropdown.innerHTML = '<option value="">Select</option>';

  // Add 'Others' option last with visual cue 
  const othersOption = document.createElement("option");
  othersOption.classList.add("text-red-800", "font-semibold");
  othersOption.value = "others";
  othersOption.textContent = "Others (Type Manually)";
  dropdown.appendChild(othersOption);

  // Add regular options
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

function handleCustomInputToggle(dropdown, input) {
  dropdown.addEventListener("change", () => {
    if (dropdown.value === "others") {
      input.classList.remove("hidden");
      input.setAttribute("required", "required");
    } else {
      input.classList.add("hidden");
      input.removeAttribute("required");
    }
  });
}

// Helper Function to calculate centered x position based on text length and page width
function getCenteredX(text, fontSize, font, pageWidth) {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  return (pageWidth - textWidth) / 2;
}

// Helper Function to Draw text on PDF page
const drawText = async (page, text, x, y, size, color, font) => {
  page.drawText(text, {
    x: x,
    y: y,
    size: size,
    color: PDFLib.rgb(color[0] / 255, color[1] / 255, color[2] / 255),
    font: font,
  });
};

// Helper Function to adjust font size based on text length and page width
function adjustFontSize(text, font, pageWidth) {
  let size = 28;
  let width = font.widthOfTextAtSize(text, size);

  while (width > pageWidth - 40 && size > 10) {
    size--;
    width = font.widthOfTextAtSize(text, size);
  }

  return size;
}
