const express = require('express')
const app = express()
const port = process.env.PORT || 3000

var path = require("path")
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))

let u_tab = [
    { id: 1, log: "AAA", pass: "aaa", age: 13, uczen: "checked", gender: "kobieta" },
    { id: 2, log: "BBB", pass: "bbb", age: 7, uczen: "checked", gender: "mezczyzna" },
    { id: 3, log: "CCC", pass: "ccc", age: 11, uczen: "unchecked", gender: "kobieta" },
    { id: 4, log: "DDD", pass: "ddd", age: 18, uczen: "checked", gender: "kobieta" },
    { id: 5, log: "EEE", pass: "eee", age: 11, uczen: "unchecked", gender: "mezczyzna" },
]

let log = false

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/main.html"))
    console.log(u_tab)
})
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname + "/main.html"))
})
app.get('/logout', (req, res) => {
    log = false
    res.sendFile(path.join(__dirname + "/main.html"))
})
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + "/register.html"))
})
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + "/login.html"))
})
app.get('/admin', function(req, res) {
    if (log == false) {
        res.sendFile(path.join(__dirname + "/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/logged_admin.html"))
    }
})




app.post('/register', function(req, res) {

    const login = req.body.login
    const password = req.body.password
    const age = req.body.age
    const gender = req.body.gender
    if (req.body.isStudent) {
        var ok_uczen = "checked"
    } else {
        var ok_uczen = "unchecked"
    }
    if (!login || !password || !age || !gender) {
        res.send("Proszę wprowadzić dane")
    } else {
        var x = true
        for (let i = 0; i < u_tab.length; i++) {
            if (login == u_tab[i].log) {
                var x = false
            }
        }
        if (x == false) {
            res.send("Użytkownik o takim loginie już istnieje")
            var x = true;
        } else {
            u_tab.push({ id: (u_tab.length + 1), log: login, pass: password, age: age, uczen: ok_uczen, gender: gender })
            res.send("Witaj " + login + " jesteś zarejestrowany!")
        }
    }
})
app.post('/login', function(req, res) {
    const login = req.body.login
    const password = req.body.password
    if (!login || !password) {
        res.send("Proszę wprowadzić dane")
    } else {
        var zalogowany = false
        for (let i = 0; i < u_tab.length; i++) {
            if (login == u_tab[i].log) {
                if (password == u_tab[i].pass) {
                    var zalogowany = true
                }
            }
        }
        if (zalogowany == true) {
            log = true;
            res.redirect("/admin")
        } else {
            log = false
            res.send("Brak użytkownika w bazie")
        }
    }
})

app.get("/show", (req, res) => {
    if (log){
        let y = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 15px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;}</style></head>';

        y += '<div id="links"><a href="/sort">Sort</a><a href="/gender">Gender</a><a href="/show">Show</a></div>';

        y += '<table style="width:100%;">';
        u_tab.forEach(user => {
            y += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>uczeń: ${user.uczen == "checked" ? '<input type="checkbox" disabled checked>' : '<input type="checkbox" disabled>'}</td><td>age: ${user.age}</td><td>płeć: ${user.gender}</td></tr>`;
        })
        y += "</table>"

        res.send(y);
    } else {
        res.redirect("/admin.html");
    }
})

app.get("/gender", (req, res) => {
    if (log){
        let y = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 15px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;}</style></head>';

        y += '<div id="links"><a href="/sort">Sort</a><a href="/gender">Gender</a><a href="/show">Show</a></div>';

        let m_tab = '<table style="width:100%;">';
        let k_tab = '<table style="width:100%;">';

        u_tab.forEach(user => {
            if (user.gender == "kobieta"){
                k_tab += `<tr><td width="50%">id: ${user.id}</td><td width="50%">płeć: ${user.gender}</td></tr>`
            } else {
                m_tab += `<tr><td width="50%">id: ${user.id}</td><td width="50%">płeć: ${user.gender}</td></tr>`
            }
        })

        m_tab += '</table>';
        k_tab += '</table>';

        y += m_tab;
        y += "</br></br>";
        y += k_tab;

        res.send(y);
    } else {
        res.redirect("/admin.html");
    }
});

app.get("/sort", (req, res) => {
    if (log){
        let y = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 15px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;} form{ margin: 20px 0;} input,label{margin: 0 10px; font-size: 1.3em}</style></head>';

        y += '<div id="links"><a href="/sort">Sort</a><a href="/gender">Gender</a><a href="/show">Show</a></div>';

        y += '<form onchange="this.submit()" action="/sort" method="POST"><label for="rosnaco">Rosnąco</label><input type="radio" name="sort" id="rosnaco" value="rosnaco" checked><label for="malejaco">Malejąco</label><input type="radio" name="sort" id="malejaco" value="malejaco"></form>'

        let sort_tab = [...u_tab];

        if (req.body.sort){
            if (req.body.sort == "rosnaco"){
                sort_tab.sort((a,b) => a.age - b.age);
            } else {
                sort_tab.sort((a,b) => b.age - a.age);
            }
        } else {
            sort_tab.sort((a,b) => a.age - b.age);
        }

        y += '<table style="width:100%;">';
        sort_tab.forEach(user => {
            y += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>age: ${user.age}</td></tr>`;
        })
        y += "</table>"

        res.send(y);
    } else {
        res.redirect("/admin.html");
    }
})

app.post("/sort", (req, res) => {
    if (log){
        let y = '<head><style>body{color: white; background-color: #1a1a1a;} th,tr,td{border: 1px solid #c9bf4f; padding: 15px; font-size: 1.2em;} a{color: white; margin: 0 10px; font-size: 1.5em} #links{margin: 20px 0;} form{ margin: 20px 0;} input,label{margin: 0 10px; font-size: 1.3em}</style></head>';

        y += '<div id="links"><a href="/sort">Sort</a><a href="/gender">Gender</a><a href="/show">Show</a></div>';

        y += `<form onchange="this.submit()" action="/sort" method="POST"><label for="rosnaco">Rosnąco</label><input type="radio" name="sort" id="rosnaco" value="rosnaco" ${req.body.sort == "rosnaco" ? "checked" : ""}><label for="malejaco">Malejąco</label><input type="radio" name="sort" id="malejaco" value="malejaco" ${req.body.sort == "malejaco" ? "checked" : ""}></form>`

        let sort_tab = [...u_tab];

        if (req.body.sort == "rosnaco"){
            sort_tab.sort((a,b) => a.age - b.age);
        } else {
            sort_tab.sort((a,b) => b.age - a.age);
        }

        y += '<table style="width:100%;">';
        sort_tab.forEach(user => {
            y += `<tr><td>id: ${user.id}</td><td>user: ${user.log} - ${user.pass}</td><td>age: ${user.age}</td></tr>`;
        })
        y += "</table>"

        res.send(y);
    } else {
        res.redirect("/admin.html");
    }
})


app.use(express.static(path.join(__dirname,'static')))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})