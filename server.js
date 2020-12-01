const express = require('express')
const app = express()
const port = process.env.PORT || 3000

var path = require("path")
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))

let users = [
    { id: 1, log: "AAA", pass: "aaa", wiek: 10, uczen: "checked", plec: "mezczyzna" },
    { id: 2, log: "BBB", pass: "bbb", wiek: 5, uczen: "unchecked", plec: "kobieta" },
    { id: 3, log: "CCC", pass: "ccc", wiek: 15, uczen: "unchecked", plec: "mezczyzna" },
    { id: 4, log: "DDD", pass: "ddd", wiek: 6, uczen: "checked", plec: "kobieta" },
    { id: 5, log: "EEE", pass: "eee", wiek: 10, uczen: "checked", plec: "mezczyzna" },
]

let isLogged = false

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/main.html"))
    console.log(users)
})
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname + "/main.html"))
})
app.get('/logout', (req, res) => {
    isLogged = false
    res.sendFile(path.join(__dirname + "/main.html"))
})
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + "/register.html"))
})
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + "/login.html"))
})
app.get('/admin', function(req, res) {
    if (isLogged == false) {
        res.sendFile(path.join(__dirname + "/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/logged_admin.html"))
    }
})




app.post('/register', function(req, res) {

    const login = req.body.login
    const passwd = req.body.passwd
    const age = req.body.age
    const gender = req.body.plec
    if (req.body.isStudent) {
        var uczenF = "checked"
    } else {
        var uczenF = "unchecked"
    }
    if (!login || !passwd || !age || !gender) {
        res.send("Proszę uzupełnić wszystkie pola poprawnie")
    } else {
        var isValid = true
        for (let i = 0; i < users.length; i++) {
            if (login == users[i].log) {
                var isValid = false
            }
        }
        if (isValid == false) {
            res.send("Użytkownik o takim loginie już istnieje")
            console.log(users)
            var isValid = true;
        } else {
            users.push({ id: (users.length + 1), log: login, pass: passwd, wiek: age, uczen: uczenF, plec: gender })
            console.log(users)
            res.send("Witaj " + login + " jesteś zarejestrowany!")
        }
    }
})
app.post('/login', function(req, res) {
    const login = req.body.login
    const passwd = req.body.passwd
    if (!login || !passwd) {
        res.send("Proszę uzupełnić wszystkie pola poprawnie")
    } else {
        var isFound = false
        for (let i = 0; i < users.length; i++) {
            if (login == users[i].log) {
                if (passwd == users[i].pass) {
                    var isFound = true
                }
            }
        }
        if (isFound == true) {
            isLogged = true;
            res.redirect("/admin")
        } else {
            isLogged = false
            res.send("Brak użytkownika w bazie")
        }
    }
})

app.get("/show", (req, res) => {
    if (isLogged){
        let response = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 10px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;}</style></head>';

        response += '<div id="links"><a href="/sort">sort</a><a href="/gender">gender</a><a href="/show">show</a></div>';

        response += '<table style="width:100%;">';
        users.forEach(user => {
            response += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>uczeń: ${user.uczen == "checked" ? '<input type="checkbox" disabled checked>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.wiek}</td><td>płeć: ${user.plec}</td></tr>`;
        })
        response += "</table>"

        res.send(response);
    } else {
        res.redirect("/admin.html");
    }
})
app.get("/gender", (req, res) => {
    if (isLogged){
        let response = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 10px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;}</style></head>';

        response += '<div id="links"><a href="/sort">sort</a><a href="/gender">gender</a><a href="/show">show</a></div>';

        let maleTable = '<table style="width:100%;">';
        let femaleTable = '<table style="width:100%;">';

        users.forEach(user => {
            if (user.plec == "kobieta"){
                femaleTable += `<tr><td width="50%">id: ${user.id}</td><td width="50%">płeć: ${user.plec}</td></tr>`
            } else {
                maleTable += `<tr><td width="50%">id: ${user.id}</td><td width="50%">płeć: ${user.plec}</td></tr>`
            }
        })

        maleTable += '</table>';
        femaleTable += '</table>';

        response += maleTable;
        response += "</br></br>";
        response += femaleTable;

        res.send(response);
    } else {
        res.redirect("/admin.html");
    }
});
app.get("/sort", (req, res) => {
    if (isLogged){
        let response = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 10px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;} form{ margin: 20px 0;} input,label{margin: 0 10px; font-size: 1.3em}</style></head>';

        response += '<div id="links"><a href="/sort">sort</a><a href="/gender">gender</a><a href="/show">show</a></div>';

        response += '<form onchange="this.submit()" action="/sort" method="POST"><label for="rosnaco">rosnąco</label><input type="radio" name="sort" id="rosnaco" value="rosnaco" checked><label for="malejaco">malejąco</label><input type="radio" name="sort" id="malejaco" value="malejaco"></form>'

        let sortedTable = [...users];

        if (req.body.sort){
            if (req.body.sort == "rosnaco"){
                sortedTable.sort((a,b) => a.wiek - b.wiek);
            } else {
                sortedTable.sort((a,b) => b.wiek - a.wiek);
            }
        } else {
            sortedTable.sort((a,b) => a.wiek - b.wiek);
        }

        response += '<table style="width:100%;">';
        sortedTable.forEach(user => {
            response += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>wiek: ${user.wiek}</td></tr>`;
        })
        response += "</table>"

        res.send(response);
    } else {
        res.redirect("/admin.html");
    }
})
app.post("/sort", (req, res) => {
    if (isLogged){
        let response = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 10px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;} form{ margin: 20px 0;} input,label{margin: 0 10px; font-size: 1.3em}</style></head>';

        response += '<div id="links"><a href="/sort">sort</a><a href="/gender">gender</a><a href="/show">show</a></div>';

        response += `<form onchange="this.submit()" action="/sort" method="POST"><label for="rosnaco">rosnąco</label><input type="radio" name="sort" id="rosnaco" value="rosnaco" ${req.body.sort == "rosnaco" ? "checked" : ""}><label for="malejaco">malejąco</label><input type="radio" name="sort" id="malejaco" value="malejaco" ${req.body.sort == "malejaco" ? "checked" : ""}></form>`

        let sortedTable = [...users];

        if (req.body.sort == "rosnaco"){
            sortedTable.sort((a,b) => a.wiek - b.wiek);
        } else {
            sortedTable.sort((a,b) => b.wiek - a.wiek);
        }

        response += '<table style="width:100%;">';
        sortedTable.forEach(user => {
            response += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>wiek: ${user.wiek}</td></tr>`;
        })
        response += "</table>"

        res.send(response);
    } else {
        res.redirect("/admin.html");
    }
})

app.use(express.static(path.join(__dirname,'static')))
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})