// GIVEN I am using a daily planner to create a schedule
// WHEN I open the planner
// THEN the current day is displayed at the top of the calendar
// create a moment for today to display <p> with id='currentDay'
let today = moment().format("dddd, MMMM Do");
$("#currentDay").text(today);
// WHEN I scroll down
// THEN I am presented with time blocks for standard business hours
// default schedule
let defaultScheduleArray = [
    {hour:"9",description:"9am hour is free"},
    {hour:"10",description:"10am hour is free"},
    {hour:"11",description:"11am hour is free"},
    {hour:"12",description:"12pm hour is free"},
    {hour:"1",description:"1pm hour is free"},
    {hour:"2",description:"2pm hour is free"},
    {hour:"3",description:"3pm hour is free"},
    {hour:"4",description:"4pm hour is free"},
    {hour:"5",description:"5pm hour is free"}
];
// WHEN I refresh the page
// THEN the saved events persist
// if no local storage schedule, then schedule is default
if (!localStorage.getItem("localScheduleArray")) {
    localStorage.setItem("localScheduleArray", JSON.stringify(defaultScheduleArray));
    let currentSchedule = JSON.parse(localStorage.getItem("localScheduleArray"));
    $(".row").each(function(el) {
        let thisHour = $(this).attr("data-hour");
        console.log(thisHour);
        $(this).find(".description").text(currentSchedule.find(el => el.hour === thisHour).description);
    });
    console.log("was empty")

} else { // if local storage has data, use that data when page loads/refreshes
    let currentSchedule = JSON.parse(localStorage.getItem("localScheduleArray"));
    $(".row").each(function(el) {
        let thisHour = $(this).attr("data-hour");
        console.log(thisHour);
        $(this).find(".description").text(currentSchedule.find(el => el.hour === thisHour).description);
    });
    console.log("was NOT empty")
}

// WHEN I view the time blocks for that day
// THEN each time block is color-coded to indicate whether it is in the past, present, or future
// function that changes class of description area at different hours
let auditTime = function(el) {
    // given a row, retreieve its time
    let rowTime = el.attr("data-hour");
    rowTime = Number(rowTime);
    let currentHour = moment().format("H");
    currentHour = Number(currentHour);
    // let currentHour = 13;
    // since moments are returned in 24-hour format, add 12 hours to hours 1 thru 5
    if (rowTime >= 1 && rowTime <= 5) {
        rowTime = rowTime + 12;
    }
    // compare that row's time to the current time
    // // if the current time is passed the row's hour
    if (rowTime < currentHour) {
        // change color to past 
        el.find(".description").addClass("past").removeClass("bg-dark");
    }
    // // if the current time is in the middle of the row's hour
    if (rowTime === currentHour) {
    //     // change color to present
        el.find(".description").addClass("present").removeClass("bg-dark");
    }
    // // if the current time has not reached the row's hour
    if (rowTime > currentHour) {
    //     // change color to future
        el.find(".description").addClass("future").removeClass("bg-dark");
    }
};
// initiate hour check for color at least once upon loading 
$(".row").each(function(el) {
    auditTime($(this));
});
// repeat audit process every hour
setInterval(function() {
    // find a row each row and audit time
    $(".row").each(function(el) {
        auditTime($(this));
    })
}, (1000 * 60) * 60)
// WHEN I click into a time block
// THEN I can enter an event
let inputText = function(el) {
    let textInput = $("<textarea>").addClass("col-8 col-lg-10 description textarea").text("");
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
};

// WHEN I click the save button for that time block
// THEN the text for that event is saved in local storage
let saveInput = function(event) {
    // capture input text
    let inputText = "";
    // if description element is a textarea use .val
    if ($(this).prev().val()) {
        inputText = $(this).prev().val();
    } else {
    // if it is a div, use .text
        inputText = $(this).prev().text();
    }
    // reference the HOUR of this row
    let thisHour = $(this).parent().attr("data-hour");
    // retreive the local storage schedule info
    let currentSchedule = JSON.parse(localStorage.getItem("localScheduleArray"));
    // find the corresponding element in the schedule array that matches this hour
    // and assign the new input
    currentSchedule.find(el => el.hour === thisHour).description = inputText;
    // update local storage with the schedule that has new input
    localStorage.setItem("localScheduleArray", JSON.stringify(currentSchedule));
    // revert text area to normal div
    let normalEl = $("<div>").addClass("col-8 col-lg-10 description");
    $(this).prev().replaceWith(normalEl);
    // pull info that was just saved into local
    $(this).prev().text(currentSchedule.find(el => el.hour === thisHour).description);
    localStorage.setItem("localScheduleArray", JSON.stringify(currentSchedule));
    // update time color for this row
    auditTime($(this).parent());
};

let revertOriginal = function() {
        // reference the HOUR of this row
        let thisHour = $(this).parent().attr("data-hour");
        // retreive the local storage schedule info
        let currentSchedule = JSON.parse(localStorage.getItem("localScheduleArray"));
        // revert text area to normal div
        let normalEl = $("<div>").addClass("col-8 col-lg-10 description");
        console.log(normalEl);
         let originalText = currentSchedule.find(el => el.hour === thisHour).description;
        console.log(originalText);
        $(this).replaceWith(normalEl);
        $(this).text(originalText);

        // $(this).find(".textarea").replaceWith(normalEl);
        // $(this).find(".description").text(originalText);
        // find the corresponding element in the schedule array that matches this hour
        // and assign the origina input to my normal div
        // this reverts the original info and discards the input text

        // update time color for this row
        auditTime($(this).parent());
};


$(".row").on("click",".description",inputText);
$(".row").on("click",".saveBtn",saveInput);
$(".row").on("blur",".description",revertOriginal);