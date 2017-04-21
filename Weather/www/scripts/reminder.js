var allIdsArray;
var allPendingArray;
var allObj;

function getAllIdsFunc() {
    cordova.plugins.notification.local.getAllIds(function allIds(d) {
        console.log(d);
        allIdsArray = d;
    });
}
function getAllSchedFunc() {
    cordova.plugins.notification.local.getAllScheduled(function allPending(d) {
        console.log(d);
        allPendingArray = d;
    });
}
function getAllFunc() {
    cordova.plugins.notification.local.getAll(function allPending(d) {
        console.log(d);
        all = d;
    });
}

function retrieveAll() {
    getAllIdsFunc();
    getAllSchedFunc();
    getAllFunc();
}

document.addEventListener("deviceready", function () {
    retrieveAll();
}, false);

info = JSON.parse(localStorage.getItem("rp_data"));

function add_reminder() {
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var title = document.getElementById("title").value;
    var message = document.getElementById("message").value;
    var daily = document.getElementById("daily").checked;

    if (daily) navigator.notification.alert('daily selected');

    if (date == "" || time == "" || title == "" || message == "") {
        navigator.notification.alert("Please enter all details");
        return;
    }

    var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = info.data.length;

    cordova.plugins.notification.local.hasPermission(function (granted) {
        if (granted == true) {
            schedule(id, title, message, schedule_time, daily);
        }
        else {
            cordova.plugins.notification.local.registerPermission(function (granted) {
                if (granted == true) {
                    schedule(id, title, message, schedule_time, daily);
                }
                else {
                    navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                }
            });
        }
    });
}

function schedule(id, title, message, schedule_time, daily) {

    if (daily) {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            message: message,
            at: schedule_time,
            every:'day'
        });
    } else {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            message: message,
            at: schedule_time
        });
    }
    

    navigator.notification.alert("Reminder added successfully");
    retrieveAll();
    window.navigator.location = "reminder.html"
}

$(document).on("pagebeforeshow", "#all", function () {

    var html = '';

    var prettyTime;
    for (var count = 0; count < all.length; count++) {
        var daily = all[count].every ? ' <i class="fa fa-check-circle-o fa-" aria-hidden="true"></i> ' : "";
        prettyTime = new Date(all[count].at);
        html = html + "<tr><td>" + all[count].title + "</td><td>" + prettyTime + "</td><td>" + daily + "</td></tr>";

    }

    $("table#allTable tbody").empty();
    $("table#allTable tbody").append(html).closest("table#allTable").table("refresh").trigger("create");
});


$(document).on("pagebeforeshow","#pending",function(){

    var html = '';

    for (var count = 0; count < allPendingArray.length; count++) {
        var daily = allPendingArray[count].every ? ' <i class="fa fa-check-circle-o fa-" aria-hidden="true"></i> ' : "";
        if (new Date(allPendingArray[count].at) < new Date()) {
            html = html + "<tr><td>" + allPendingArray[count].title + "</td><td>" + new Date(allPendingArray[count].at*1000) + "</td><td>" + daily + "</td></tr>";
        }
    }

    $("table#pendingTable tbody").empty();
    $("table#pendingTable tbody").append(html).closest("table#pendingTable").table("refresh").trigger("create");  
});