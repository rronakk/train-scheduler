// Initialize Firebase
var config = {
apiKey: "AIzaSyCjq-M02_aReQIiB2dy-QVqLqi0xgYbqxc",
authDomain: "train-scheduler-af5e2.firebaseapp.com",
databaseURL: "https://train-scheduler-af5e2.firebaseio.com",
projectId: "train-scheduler-af5e2",
storageBucket: "",
messagingSenderId: "139319698238"
};
firebase.initializeApp(config);

var database = firebase.database();

//saving train info in DB on save.

$("#form").on("submit", function(){
    var trainName = $("#train-name").val();
    var destination = $("#destination").val();
    var tfTime = $("#f-train-time").val();
    var freq = $("#frequency").val();

    var newTrain = {
        trainName : trainName,
        dest : destination,
        firstTrainTime : tfTime,
        freq : freq, 
    };
    database.ref().push(newTrain);
})

// displaying information on table
database.ref().on("child_added", getTrainInfo);


function getTrainInfo(snap){
    var TrainName = snap.val().trainName;
    var destination = snap.val().dest;
    var firstTrainTime = snap.val().firstTrainTime;
    var freq = snap.val().freq;

    var trainStartTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    var currentTime = moment();
    var timeDiff = moment().diff(moment(trainStartTime), "minutes");

    var timeReminder = timeDiff % freq;

    var minsAway = freq - timeReminder;

    var nextTrain = moment().add(minsAway, "minutes");

    var nextArrival =  moment(nextTrain).format("hh:mm");

    var newRow = $("<tr>").append(
        $("<td>").text(TrainName),
        $("<td>").text(destination),
        $("<td>").text(freq),
        $("<td>").text(nextArrival),
        $("<td>").text(minsAway)
    )

    $(".train-schedule > tbody").append(newRow);
}
