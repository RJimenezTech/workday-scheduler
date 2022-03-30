// GIVEN I am using a daily planner to create a schedule
// WHEN I open the planner
// THEN the current day is displayed at the top of the calendar
// create a moment for today to display <p> with id='currentDay'
let today = moment().format("dddd, MMMM Do");
$("#currentDay").text(today);
// WHEN I scroll down
// THEN I am presented with time blocks for standard business hours
// array that holds the hour blockes of the day that will by displayed
// let hoursArray = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM"];
let hoursObjArray = [
    {hour:"9AM",description:"free hour"},
    {hour:"10AM",description:"free hour"},
    {hour:"11AM",description:"free hour"},
    {hour:"12PM",description:"free hour"},
    {hour:"1PM",description:"free hour"},
    {hour:"2PM",description:"free hour"},
    {hour:"3PM",description:"free hour"},
    {hour:"4PM",description:"free hour"},
    {hour:"5PM",description:"free hour"}];
console.log(hoursObjArray)
// find container div and add "div" with "row" class
// for as many hours in the day, add as many "row" divs with "col" divs for sections
for (let i = 0; i < hoursObjArray.length; i++){
    let thisHourNumOnly = hoursObjArray[i].hour.slice(0,-1).slice(0,-1).trim();
    $(".container").append("<div class='row' data-hour='" + thisHourNumOnly + "'><div class='col-1'></div><div class='col-1 hour'>" + hoursObjArray[i].hour + "</div><div class='col-7 bg-dark description'>" + hoursObjArray[i].description +"</div><div class='col-1 saveBtn'></div><div class='col-1'></div></div>");
};

// WHEN I view the time blocks for that day
// THEN each time block is color-coded to indicate whether it is in the past, present, or future
// function that checks each rows time and compares it with the current hour
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
// initiate audit once upon loading website
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
    let textInput = $("<textarea>").addClass("col-7 description textarea").text("");
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
}
// WHEN I click the save button for that time block
// THEN the text for that event is saved in local storage
let saveInput = function() {
    
}

// WHEN I refresh the page
// THEN the saved events persist

// waiting for click on a description area
$(".description").on("click",inputText);
// waiting for click on save button
$(".saveBtn").on("click",saveInput);