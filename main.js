const dataUrl = "data.json";
const timeframeContainer = document.querySelector(".grid__links");
const timeframeData = {};

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const { title, timeframes } = item;
      timeframeData[title] = timeframes;
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

timeframeContainer.addEventListener("click", (event) => {
  event.preventDefault();
  const clickedLink = event.target;

  if (!clickedLink.classList.contains("grid__report__link")) return;

  // Removing "clicked" class from all links
  document
    .querySelectorAll(".grid__report__link")
    .forEach((link) => link.classList.remove("clicked"));

  clickedLink.classList.add("clicked");

  const timeframe = clickedLink.classList.contains("daily")
    ? "daily"
    : clickedLink.classList.contains("weekly")
    ? "weekly"
    : "monthly";

  // Updating the display based on the selected timeframe
  updateDisplay(timeframe);
});

// Function to update data display based on the selected timeframe
function updateDisplay(timeframe) {
  Object.keys(timeframeData).forEach((title) => {
    const currentData = timeframeData[title][timeframe];

    // Finding the section corresponding to the title
    const section = document.querySelector(`.grid__${title.toLowerCase().replace(" ", "")}`);
    if (!section) {
      console.warn(`Section not found for title: ${title}`);
      return;
    }

    const hoursElement = section.querySelector(".statistics--hours");
    const previousHoursElement = section.querySelector(".statistics--previous-hours");
    const dayLabelElement = section.querySelector(".statistics__day");

    if (hoursElement) hoursElement.textContent = currentData.current;
    if (previousHoursElement) previousHoursElement.textContent = currentData.previous;

    // Update label to show "Yesterday", "Last Week", or "Last Month"
    if (dayLabelElement) {
      dayLabelElement.textContent =
        timeframe === "daily"
          ? `Yesterday - ${currentData.previous}hrs`
          : timeframe === "weekly"
          ? `Last Week - ${currentData.previous}hrs`
          : `Last Month - ${currentData.previous}hrs`;
    }
  });
}
