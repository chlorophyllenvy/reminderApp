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

function cancelAll() {
    navigator.notification.confirm(
        'You definitely want to delete all reminders?', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Are you sure you want to delete all?',           // title
        ['Yes', 'No']     // buttonLabels
    );
    function onConfirm(btnInd) {
        if (btnInd == 1) {
            cordova.plugins.notification.local.cancelAll(function () {
                alert("All reminders are removed" + btnInd);
            }, this);
            return;
        }
        console.log("chose not to delete all");
    }
    
}

function retrieveAll() {
    getAllIdsFunc();
    getAllSchedFunc();
    getAllFunc();
}


function makeRow(obj) {
    var daily = obj.every ? ' <i class="fa fa-check-circle-o fa-" aria-hidden="true"></i> ' : "",
    prettyTime = new Date(obj.at * 1000);
    return "<tr><td><button class='edit-button' data-id='" + obj.id + "'>Edit</button></td><td>" + obj.title + "</td><td>" + prettyTime + "</td><td>" + daily + "</td><td><button class='delete-button' data-id='" + obj.id + "'>DELETE</button></tr>";
}

document.addEventListener("deviceready", function () {
    retrieveAll();

}, false);


// Event Listeners
function eL() {
    var editable = Array.prototype.slice.call(document.getElementsByClassName('edit-button')),
        deleteable = Array.prototype.slice.call(document.getElementsByClassName('delete-button'));
    editable.forEach(function (c, i, a) {
        c.addEventListener('click', function (e) {
            console.log(e.target.getAttribute('data-id'));
            localStorage.setItem('id', e.target.getAttribute('data-id'));
            window.location = "#update";
        })
    })
    deleteable.forEach(function (c, i, a) {
        c.addEventListener('click', function (e) {
            var i = e.target.getAttribute('data-id');
            console.log(i);
        })
    })

}

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

    var id;
    cordova.plugins.notification.local.getAllIds(function (arr) {
        arr = arr.sort();
        console.log("arr len is ", arr.length, "the highest number is:", arr[arr.length - 1]);
        id = (arr[arr.length - 1]) + 1;
        console.log("the id is: " + id);
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
    });


   
}


function update_reminder() {

    var id = localStorage.getItem('id');
    var currDate;
    cordova.plugins.notification.local.get(parseInt(id), function (n) {
        currDate = new Date(n.at*1000);
        localStorage.removeItem('id');
        var day = ('0' + currDate.getDate()).slice(-2),
            month = currDate.getMonth() < 10 ? '0' + (currDate.getMonth() + 1) : currDate.getMonth() + 1,
            hour = currDate.getHours(),
            min = currDate.getMinutes();

        var setDate = currDate.getFullYear() + "-" + month + "-" + day,
            setTime = hour+":"+min,
            everyDay = n.every == "day" ? true : false;
        document.getElementById("id-update").value = id;
        document.getElementById("date-update").value = String(setDate);
        document.getElementById("time-update").value = String(setTime);
        document.getElementById("title-update").value = n.title;
        document.getElementById("message-update").value = n.text;
        document.getElementById("daily-update").value = everyDay;
        document.getElementById("daily-update").checked = everyDay;
        document.getElementById("delete-update").setAttribute("data-id", id);
    });
   
}

function update_reminder_submit() {
    var date = document.getElementById("date-update").value;
    var time = document.getElementById("time-update").value;
    var title = document.getElementById("title-update").value;
    var message = document.getElementById("message-update").value;
    var daily = document.getElementById("daily-update").checked;
    var id = document.getElementById("id-update").value;


    if (date == "" || time == "" || title == "" || message == "") {
        navigator.notification.alert("Please enter all details");
        return;
    }

    var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    schedule_time = new Date(schedule_time);

    schedule(id, title, message, schedule_time, daily);
}

function schedule(id, title, message, schedule_time, daily) {

    if (daily) {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            message: message,
            at: schedule_time,
            every: 'day',
            icon: "res://icons/android/icon-36-ldpi.png",
            sound:"file://sounds/chime.mp3"
        });
    } else {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            message: message,
            at: schedule_time,
            icon: "res://icons/android/icon-36-ldpi.png",
            sound: "file://sounds/chime.mp3"
        });
    }
    

    navigator.notification.alert("Reminder added successfully", redirectHome, "Success", "Done");
    function redirectHome(d) {
        console.log(d);
        retrieveAll();
        window.navigator.location = "reminder.html"
    }
    
}

$(document).on("pagebeforeshow", "#all", function () {

    var html = '';

    var prettyTime;
    for (var count = 0; count < all.length; count++) {
        html = html + makeRow(all[count]);
    }
    $("table#allTable tbody").empty();
    $("table#allTable tbody").append(html).closest("table#allTable").table("refresh").trigger("create");
    eL();
});


$(document).on("pagebeforeshow","#pending",function(){

    var html = '';

    for (var count = 0; count < allPendingArray.length; count++) {
        var daily = allPendingArray[count].every ? ' <i class="fa fa-check-circle-o fa-" aria-hidden="true"></i> ' : "";
        if (new Date(allPendingArray[count].at) < new Date()) {
            html = html + makeRow(all[count]);
            //html = html + "<tr><td>" + allPendingArray[count].title + "</td><td>" + new Date(allPendingArray[count].at*1000) + "</td><td>" + daily + "</td></tr>";
        }
    }

    $("table#pendingTable tbody").empty();
    $("table#pendingTable tbody").append(html).closest("table#pendingTable").table("refresh").trigger("create");  
});

$(document).on("pageshow", "#update", function () {
    update_reminder();
})