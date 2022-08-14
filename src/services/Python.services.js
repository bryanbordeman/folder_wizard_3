let {PythonShell} = require('python-shell')
var path = require("path")


function createOppLog(){
    // creates excel log of opportunity
    getOpportunityInput()
    var args = localStorage.getItem("opportunity-inputs"); //get local var
    
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_opp_log.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        failLog.setAttribute("style","display:none;");
        successLog.setAttribute("style","display:inline;");
        createOppRecord();
        });

    pyshell.end(function (err) {
        if (err) {
            console.log('Error')
            successLog.setAttribute("style","display:none;");
            failLog.setAttribute("style","display:inline;");
            successRecord.setAttribute("style","display:none;");
            failRecord.setAttribute("style","display:inline;");
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
    
};

function eraseOppLog(){
    // erase last excel log of entry
    var args = localStorage.getItem("opportunity-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('erase_opp_log.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

function createOppRecord(){

    var args = localStorage.getItem("opportunity-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_opp_record.py', options);
  
    pyshell.on('message', function(message) {
            console.log(message);
            failRecord.setAttribute("style","display:none;");
            successRecord.setAttribute("style","display:inline;");
            createOppFolder()
            })

    pyshell.end(function (err) {
        if (err) {
            eraseOppLog();
            successRecord.setAttribute("style","display:none;");
            failRecord.setAttribute("style","display:inline;");
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
}

function eraseOppRecord(){
    // erase last record of entry
    var args = localStorage.getItem("opportunity-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('erase_opp_record.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

function createOppFolder(){

    var args = localStorage.getItem("opportunity-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_opp_folder.py', options);
  
    pyshell.on('message', function(message) {
            // console.log(message);
            console.log('Opportunity Folder Created')
            failFolder.setAttribute("style","display:none;");
            successFolder.setAttribute("style","display:inline;");
            createOppReadme(message)
            localStorage.setItem("directory", message);
            })

    pyshell.end(function (err) {
        if (err) {
            eraseOppLog();
            eraseOppRecord();
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
}

function eraseOppFolder(){
    // Delete folder
    var args = localStorage.getItem("directory"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : [args],
        env: process.env,
    }
    let pyshell = new PythonShell('erase_opp_folder.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

function createOppReadme(currentPath){

    var args = localStorage.getItem("opportunity-inputs"); //get local var
    
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : [args, currentPath],
        env: process.env,
    }
    let pyshell = new PythonShell('create_opp_readme.py', options);

    pyshell.on('message', function(message) {
            console.log(message);
            failReadme.setAttribute("style","display:none;");
            successReadme.setAttribute("style","display:inline;");
            createOppTask()
            })

    pyshell.end(function (err) {
        if (err) {
            eraseOppLog();
            eraseOppRecord();
            eraseOppFolder();
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
    });
};

function createOppTask(){

    var args = localStorage.getItem("opportunity-inputs"); //get local var
    
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : [args],
        env: process.env,
    }
    let pyshell = new PythonShell('create_opp_task.py', options);

    pyshell.on('message', function(message) {
            console.log(message);
            })

    pyshell.end(function (err) {
        console.log(err);
    });
};


// project functions below
function createProjectLog(){
    // creates excel log of project
    getProjectInput()
    var args = localStorage.getItem("project-inputs"); //get local var
    
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_project_log.py', options);
  
    pyshell.on('message', function(message) {
        console.log(message);
        failLog.setAttribute("style","display:none;");
        successLog.setAttribute("style","display:inline;");
        createProjectRecord()
        })

    pyshell.end(function (err) {
        if (err) {
            console.log('Error')
            successLog.setAttribute("style","display:none;");
            failLog.setAttribute("style","display:inline;");
            successRecord.setAttribute("style","display:none;");
            failRecord.setAttribute("style","display:inline;");
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
    
}

function eraseProjectLog(){
    // erase last excel log of entry
    var args = localStorage.getItem("project-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('erase_project_log.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

function createProjectRecord(){

    var args = localStorage.getItem("project-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_project_record.py', options);
  
    pyshell.on('message', function(message) {
            console.log(message);
            failRecord.setAttribute("style","display:none;");
            successRecord.setAttribute("style","display:inline;");
            createProjectFolder()
            })

    pyshell.end(function (err) {
        if (err) {
            eraseProjectLog();
            successRecord.setAttribute("style","display:none;");
            failRecord.setAttribute("style","display:inline;");
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
}

function eraseProjectRecord(){
    // erase last record of entry
    var args = localStorage.getItem("project-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args :args,
        env: process.env,
    }
    let pyshell = new PythonShell('erase_project_record.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

function createProjectFolder(){

    var args = localStorage.getItem("project-inputs"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : args,
        env: process.env,
    }
    let pyshell = new PythonShell('create_project_folder.py', options);
  
    pyshell.on('message', function(message) {
            // console.log(message);
            console.log('Project Folder Created')
            failFolder.setAttribute("style","display:none;");
            successFolder.setAttribute("style","display:inline;");
            createProjectReadme(message);
            localStorage.setItem("directory", message);
            })

    pyshell.end(function (err) {
        if (err) {
            eraseProjectLog();
            eraseProjectRecord();
            successFolder.setAttribute("style","display:none;");
            failFolder.setAttribute("style","display:inline;");
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
        });
}

function createProjectReadme(currentPath){

    var args = localStorage.getItem("project-inputs"); //get local var
    
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : [args, currentPath],
        env: process.env,
    }
    let pyshell = new PythonShell('create_project_readme.py', options);

    pyshell.on('message', function(message) {
            console.log(message);
            failReadme.setAttribute("style","display:none;");
            successReadme.setAttribute("style","display:inline;");
            })

    pyshell.end(function (err) {
        if (err) {
            eraseProjectLog();
            eraseProjectRecord();
            eraseOppFolder();
            successReadme.setAttribute("style","display:none;");
            failReadme.setAttribute("style","display:inline;");
        }
    });
};

// project and opportunity functions below
function getNextNumber(dataType) {
    // fetches next number from database
    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        mode: 'text',
        encoding: 'UTF-8',
        args : [dataType],
        pythonOptions: ['-u'],
        env: process.env,
    }

    let pyshell = new PythonShell('get_next_num.py', options);
   
    pyshell.on('message', function(message) {
        switch (dataType) {
            case "opportunity":
                localStorage.setItem("quote_number", message); //create local var
                document.getElementById("next-opp-num").innerHTML = "Are you sure you want to create Opportunity " + message + "?"
                console.log('Opportunity Number Created');
            break;
            case "project":
                localStorage.setItem("p_project_number", message); //create local var
                document.getElementById("next-project-num").innerHTML = "Are you sure you want to create Project " + message + "?"
                console.log('Project Number Created')
            break;
            case "service":
                localStorage.setItem("p_project_number", message); //create local var
                document.getElementById("next-project-num").innerHTML = "Are you sure you want to create Service " + message + "?"
                console.log('Service Number Created')
            break;
            case "HSE":
                localStorage.setItem("p_project_number", message); //create local var
                document.getElementById("next-project-num").innerHTML = "Are you sure you want to create " + message + "?"
                console.log('HSE Number Created')
            break;
        };
    });

    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
        });
    }


function openFolder(){
    // Open new folder created by wizard
    var args = localStorage.getItem("directory"); //get local var

    var options = {
        scriptPath : path.join(__dirname, './engine/'),
        args : [args],
        env: process.env,
    }
    let pyshell = new PythonShell('open_folder.py', options);

    pyshell.on('message', function(message) {
        console.log(message);
        })

    pyshell.end(function (err,code,signal) {
        if (err) {
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        }
        });
}

