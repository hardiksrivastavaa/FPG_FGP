// Helper function to update dropdown options
function updateDropdown(dropdown, options) {
  dropdown.innerHTML = '<option value="">Select</option>';
  options.forEach((item) => {
    const option = document.createElement("option");
    option.text = item;
    dropdown.add(option);
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
