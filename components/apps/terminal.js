import React, { Component } from 'react'
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Terminal extends Component {
    constructor() {
        super();
        this.cursor = "";
        this.terminal_rows = 1;
        this.current_directory = "~";
        this.curr_dir_name = "root";
        this.prev_commands = [];
        this.commands_index = -1;
        this.child_directories = {
            root: ["projects", "skills", "personal documents", "interests", "languages", "readme.txt"],
            skills: ["Go", "Python", "C++", "Docker", "PostgreSQL", "gRPC", "Redis", "skills_summary.txt"],
            projects: ["cloud-share", "pothole-detection", "anomaly-detection", "simnovus"],
            interests: ["Distributed Systems", "Backend Engineering", "DevOps", "Network Simulation", "interests.txt"],
            languages: ["Go", "Python", "C++", "JavaScript", "Bash", "SQL"],
            "cloud-share": ["cloud-share.txt"],
            "pothole-detection": ["pothole-detection.txt"],
            "anomaly-detection": ["anomaly-detection.txt"],
            "simnovus": ["simnovus.txt"],
        };
        this.file_contents = {
            "readme.txt": "Welcome to Praneeth Reddy's Ubuntu Portfolio!\n\nAvailable system apps:\n- code (VSCode)\n- chrome (Google Chrome)\n- doom (Doom game)\n- game-2048 (2048 game)\n- settings (System Settings)\n- about-praneeth (About Me page)\n- sendmsg (Contact Form via gedit)\n\nTry running 'cat' to view text files.",
            "skills_summary.txt": "Technical Skills Overview\n\nCore Languages: Go, Python, C++, SQL, Bash, JavaScript\nBackend & Frameworks: gRPC, Protobuf, Next.js, Node.js, Flask\nDatabases: PostgreSQL, MySQL, Redis, MongoDB\nInfrastructure & DevOps: Docker, Podman, Kubernetes, AWS, Jenkins, Linux Systems\nSpecializations: Distributed Systems Orchestration, API Gateway Design, Microservices, Network Telemetry",
            "interests.txt": "Areas of Interest & Research\n\n- Distributed Systems & Cloud Infrastructure: Building fault-tolerant, scalable backends and orchestration platforms.\n- High-Performance Networking: Optimizing network protocols, gRPC communication, and simulation environments.\n- Cybersecurity & Cryptography: Exploring passwordless architectures and network anomaly detection.\n- DevOps & Automation: Streamlining CI/CD pipelines and infrastructure-as-code (IaC) using modern containerization tools.",
            "cloud-share.txt": "CloudShare: A Passwordless Cloud Storage Architecture Using Encrypted Shamir Secret Sharing\n\nIn an era where data breaches are increasingly common, relying solely on single-point encryption or traditional passwords creates vulnerabilities. CloudShare addresses this by implementing a passwordless authentication system combined with Encrypted Shamir's Secret Sharing (ESSS). Instead of storing a single encrypted file on one server, CloudShare cryptographically splits your data into multiple distinct shares and distributes them across a decentralized node network. To reconstruct the file, a minimum threshold of these shares must be retrieved. This mathematically ensures that even if one or more storage nodes are compromised, the attacker gains absolutely zero information about the original data.\n\n<a href='https://ieeexplore.ieee.org/document/11118777/' target='_blank' class='text-ubt-blue underline'>View IEEE Publication</a>",
            "pothole-detection.txt": "Pothole Detection and Repair System\n\nRoad maintenance is traditionally a manual, time-consuming, and reactive process. This patented system introduces a fully automated, proactive approach to road repairs. Utilizing high-resolution image acquisition and advanced computer vision algorithms, the system can detect and classify potholes in real-time as a vehicle drives over them. Once a pothole is identified, the system logs its precise GPS coordinates. It then triggers an automated mechanism that dispenses filler material to temporarily or permanently repair the damage on the spot. This IoT-enabled approach significantly reduces maintenance costs and improves road safety.\n\nStatus: Indian Patent Published (2025)",
            "anomaly-detection.txt": "Cloud-Based Real-Time Anomaly Detection for Network Traffic\n\nAs networks grow in scale and complexity, detecting malicious traffic in real-time requires immense computational power. This project leverages Apache Spark's distributed computing framework alongside advanced Machine Learning models to analyze massive streams of network packets on the fly. By extracting key features and identifying statistical deviations from normal traffic baselines, the system can detect DDoS attacks, unauthorized access attempts, and other anomalies with high precision and low latency, scaling dynamically across cloud infrastructure.\n\n<a href='https://ieeexplore.ieee.org/document/11118829' target='_blank' class='text-ubt-blue underline'>View IEEE Publication</a>",
            "simnovus.txt": "Simnovus - Software Developer and DevOps Engineer\n\nAt Simnovus, the challenge was building highly scalable infrastructure for telecommunications network simulation. I designed and developed a robust distributed orchestrator using GoLang to automate the provisioning of 5G/LTE simulation environments across multi-host deployments. Additionally, I implemented real-time performance telemetry using Redis and MySQL, allowing engineers to monitor latency-sensitive simulation nodes instantly.\n\n<a href='https://simnovus.com' target='_blank' class='text-ubt-blue underline'>Visit Simnovus Website</a>"
        };
        this.state = {
            terminal: [],
            viMode: false,
            viFile: "",
            viContent: "",
            viInsertMode: false,
            viCommandValue: ""
        }
    }

    componentDidMount() {
        this.reStartTerminal();
    }

    componentDidUpdate() {
        clearInterval(this.cursor);
        let terminalBody = document.getElementById("terminal-body");
        let windowEl = terminalBody ? terminalBody.closest('.main-window') : null;
        let isFocused = windowEl && !windowEl.classList.contains('notFocused');

        if (isFocused) {
            this.startCursor(this.terminal_rows - 2);
        }

        let rowId = this.terminal_rows - 2;
        let inputEl = document.getElementById(`terminal-input-${rowId}`);
        if (inputEl) {
            inputEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    componentWillUnmount() {
        clearInterval(this.cursor);
    }

    reStartTerminal = (showHelp = true) => {
        clearInterval(this.cursor);

        let initialTerminal = [];
        if (showHelp) {
            initialTerminal.push(
                <div key="initial-help" className="mb-2 font-normal text-xs md:text-sm text-white select-none">
                    {/* Fake initial command line */}
                    <div className="flex w-full h-5 mb-1 font-bold">
                        <div className="flex">
                            <div className="text-ubt-green">praneeth@Ubuntu</div>
                            <div className="mx-px font-medium text-white">:</div>
                            <div className="text-ubt-blue">~</div>
                            <div className="mx-px font-medium mr-1 text-white">$</div>
                        </div>
                        <div className="text-white font-normal tracking-wider">praneeth --help</div>
                    </div>

                    <div style={{ color: "#ffffff", fontWeight: "bold", marginBottom: "4px" }}>Available Commands:</div>
                    <div style={{ paddingLeft: "8px", fontFamily: "monospace" }}>
                        <div><strong style={{ color: "#3465A4" }}>ls</strong> - List files and folders</div>
                        <div><strong style={{ color: "#3465A4" }}>cd [dir]</strong> - Change directory</div>
                        <div><strong style={{ color: "#3465A4" }}>cat [file]</strong> - View text file contents</div>
                        <div><strong style={{ color: "#3465A4" }}>vi [file]</strong> - Edit text files (Vim editor)</div>
                        <div><strong style={{ color: "#3465A4" }}>pwd</strong> - Print current path</div>
                        <div><strong style={{ color: "#3465A4" }}>whoami</strong> - Profile bio</div>
                        <div><strong style={{ color: "#3465A4" }}>clear</strong> - Clear terminal screen</div>
                        <div><strong style={{ color: "#3465A4" }}>exit</strong> - Close terminal window</div>
                    </div>

                    <div style={{ color: "#ffffff", fontWeight: "bold", marginTop: "10px", marginBottom: "4px" }}>GUI Applications:</div>
                    <div style={{ paddingLeft: "8px", fontFamily: "monospace" }}>
                        <div><strong style={{ color: "#3465A4" }}>code</strong> - Open VSCode editor</div>
                        <div><strong style={{ color: "#3465A4" }}>chrome</strong> - Open Google Chrome</div>
                        <div><strong style={{ color: "#3465A4" }}>doom</strong> - Play Doom game</div>
                        <div><strong style={{ color: "#3465A4" }}>game-2048</strong> - Play 2048 game</div>
                        <div><strong style={{ color: "#3465A4" }}>about-praneeth</strong> - View 'About Me' page</div>
                        <div><strong style={{ color: "#3465A4" }}>sendmsg</strong> - Open Contact Form (gedit)</div>
                        <div><strong style={{ color: "#3465A4" }}>varshion</strong> - Chat with Praneeth's AI Agent</div>
                    </div>
                </div>
            );
        }

        this.terminal_rows = 1;
        this.setState({ terminal: initialTerminal }, () => {
            this.appendTerminalRow();
        });
    }

    appendTerminalRow = () => {
        let terminal = this.state.terminal;
        terminal.push(this.terminalRow(this.terminal_rows));
        this.setState({ terminal });
        this.terminal_rows += 2;
    }

    terminalRow = (id) => {
        const isDark = true; // Terminal always stays dark
        const textNormal = "text-white";
        return (
            <div key={id} className="w-full">
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">praneeth@Ubuntu</div>
                        <div className={`mx-px font-medium ${textNormal}`}>:</div>
                        <div className=" text-ubt-blue">{this.current_directory}</div>
                        <div className={`mx-px font-medium mr-1 ${textNormal}`}>$</div>
                    </div>
                    <div id={`cmd-${id}`} onClick={this.focusCursor} className=" bg-transperent relative flex-1 overflow-hidden">
                        <span id={`show-${id}`} className={`float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider ${textNormal}`}></span>
                        <div id={`cursor-${id}`} className={`float-left mt-1 w-1.5 h-3.5 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                        <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className=" absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
                    </div>
                </div>
                <div id={`row-result-${id}`} className={`my-2 font-normal ${textNormal}`}></div>
            </div>
        );

    }

    focusCursor = (e) => {
        clearInterval(this.cursor);
        this.startCursor($(e.target).data("row-id"));
    }

    unFocusCursor = (e) => {
        this.stopCursor($(e.target).data("row-id"));
    }

    startCursor = (id) => {
        clearInterval(this.cursor);
        $(`input#terminal-input-${id}`).trigger("focus");
        // On input change, set current text in span
        $(`input#terminal-input-${id}`).on("input", function () {
            $(`#show-${id}`).text($(this).val());
        });
        this.cursor = window.setInterval(function () {
            if ($(`#cursor-${id}`).css('visibility') === 'visible') {
                $(`#cursor-${id}`).css({ visibility: 'hidden' });
            } else {
                $(`#cursor-${id}`).css({ visibility: 'visible' });
            }
        }, 500);
    }

    stopCursor = (id) => {
        clearInterval(this.cursor);
        $(`#cursor-${id}`).css({ visibility: 'visible' });
    }

    removeCursor = (id) => {
        this.stopCursor(id);
        $(`#cursor-${id}`).css({ display: 'none' });
    }

    clearInput = (id) => {
        $(`input#terminal-input-${id}`).trigger("blur");
    }

    checkKey = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            let terminal_row_id = $(e.target).data("row-id");
            let inputVal = $(`input#terminal-input-${terminal_row_id}`).val();
            let words = inputVal.split(' ');

            if (words.length === 1) {
                let query = words[0].toLowerCase();
                if (query.length > 0) {
                    const commands = ["cd", "ls", "pwd", "echo", "clear", "exit", "mkdir", "code", "doom", "game-2048", "chrome", "about-praneeth", "trash", "settings", "sendmsg", "varshion", "whoami", "uname", "cat", "help", "praneeth", "vi", "vim"];
                    let matches = commands.filter(c => c.startsWith(query));
                    if (matches.length === 1) {
                        $(`input#terminal-input-${terminal_row_id}`).val(matches[0]);
                        $(`#show-${terminal_row_id}`).text(matches[0]);
                    }
                }
            } else if (words.length > 1) {
                let cmd = words[0].toLowerCase();
                let searchStr = inputVal.substring(cmd.length).trimLeft().toLowerCase();
                let children = this.child_directories[this.curr_dir_name] || [];

                // Filter by command context
                if (cmd === "cat" || cmd === "vi" || cmd === "vim") {
                    children = children.filter(c => c.endsWith(".txt"));
                } else if (cmd === "cd") {
                    children = children.filter(c => !c.endsWith(".txt"));
                }

                let matches = children.filter(c => c.toLowerCase().startsWith(searchStr));
                if (matches.length === 1) {
                    let completed = inputVal.substring(0, inputVal.length - searchStr.length) + matches[0];
                    $(`input#terminal-input-${terminal_row_id}`).val(completed);
                    $(`#show-${terminal_row_id}`).text(completed);
                }
            }
        }
        else if (e.key === "Enter") {
            let terminal_row_id = $(e.target).data("row-id");
            let command = $(`input#terminal-input-${terminal_row_id}`).val().trim();
            if (command.length !== 0) {
                this.removeCursor(terminal_row_id);
                this.handleCommands(command, terminal_row_id);
            }
            else return;
            // push to history
            this.prev_commands.push(command);
            this.commands_index = this.prev_commands.length - 1;

            this.clearInput(terminal_row_id);
        }
        else if (e.key === "ArrowUp") {
            let prev_command;

            if (this.commands_index <= -1) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index--;
        }
        else if (e.key === "ArrowDown") {
            let prev_command;

            if (this.commands_index >= this.prev_commands.length) return;
            if (this.commands_index <= -1) this.commands_index = 0;

            if (this.commands_index === this.prev_commands.length) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index++;
        }
    }

    childDirectories = (parent) => {
        let files = [];
        files.push(`<div class="flex justify-start flex-wrap text-xs md:text-sm">`)
        this.child_directories[parent].forEach(file => {
            if (file.endsWith(".txt")) {
                files.push(
                    `<span class="mr-3 text-white">${file}</span>`
                )
            } else {
                files.push(
                    `<span class="font-bold mr-3 text-ubt-blue">${file}</span>`
                )
            }
        });
        files.push(`</div>`)
        return files;
    }

    closeTerminal = () => {
        $("#close-terminal").trigger('click');
    }

    handleCommands = (command, rowId) => {
        let words = command.split(' ').filter(Boolean);
        let main = words[0];
        words.shift()
        let result = "";
        let rest = words.join(" ");
        rest = rest.trim();

        const sudoMemes = ["sudo-1.jpg", "sudo-2.jpg", "sudo-3.jpg", "sudo-4.jpg", "sudo-4.webp", "sudo-5.jpeg"];
        const linuxMemes = ["linux.jpeg", "linux-2.jpeg"];
        const rmMemes = ["rm-1.webp", "rm-2.jpeg", "rm-3.jpeg"];
        const cdMemes = ["cd-1.jpeg"];
        const getRandomMeme = (memes) => `<img class=' w-2/5 mt-2 mb-2' src='./images/memes/${memes[Math.floor(Math.random() * memes.length)]}' />`;

        switch (main) {
            case "rm":
                result = getRandomMeme(rmMemes);
                break;
            case "cd":
                if (words.length === 0 || rest === "") {
                    this.current_directory = "~";
                    this.curr_dir_name = "root";
                    break;
                }

                if (rest.includes("personal documents") || rest.includes("personal-documents")) {
                    result = `bash /${this.curr_dir_name} : Permission denied 😏<br>` + getRandomMeme(cdMemes);
                    break;
                }

                let targetPath = rest;
                let pathParts = this.current_directory.split("/");
                let currentDir = this.curr_dir_name;
                let targetParts = targetPath.split("/");
                let errorOccurred = false;

                for (let i = 0; i < targetParts.length; i++) {
                    let part = targetParts[i].trim();
                    if (part === "" || part === ".") continue;

                    if (part === "~") {
                        pathParts = ["~"];
                        currentDir = "root";
                        continue;
                    }

                    if (part === "..") {
                        if (pathParts.length > 1) {
                            pathParts.pop();
                            let lastPart = pathParts[pathParts.length - 1];
                            currentDir = (lastPart === "~" ? "root" : lastPart);
                        }
                        continue;
                    }

                    let children = this.child_directories[currentDir] || [];
                    let match = children.find(c => c.toLowerCase() === part.toLowerCase());

                    if (match) {
                        if (match.endsWith(".txt")) {
                            result = `bash: cd: ${part}: Not a directory<br>` + getRandomMeme(cdMemes);
                            errorOccurred = true;
                            break;
                        } else {
                            pathParts.push(match);
                            currentDir = match;
                        }
                    } else {
                        result = `bash: cd: ${part}: No such file or directory<br>` + getRandomMeme(cdMemes);
                        errorOccurred = true;
                        break;
                    }
                }

                if (!errorOccurred) {
                    this.current_directory = pathParts.join("/");
                    this.curr_dir_name = currentDir;
                }

                break;
            case "vi":
            case "vim":
                if (words.length === 0 || rest === "") {
                    result = "vi: missing filename";
                    break;
                }
                let fileName = rest;
                let content = "";
                if (this.child_directories[this.curr_dir_name] && this.child_directories[this.curr_dir_name].includes(fileName)) {
                    if (fileName.endsWith(".txt")) {
                        content = this.file_contents[fileName] || "";
                    } else {
                        result = `vi: ${fileName}: Is a directory`;
                        break;
                    }
                } else {
                    if (fileName.endsWith(".txt")) {
                        content = "";
                    } else {
                        result = `vi: ${fileName}: Invalid text file extension (must be .txt)`;
                        break;
                    }
                }

                this.setState({
                    viMode: true,
                    viFile: fileName,
                    viContent: content,
                    viInsertMode: false,
                    viCommandValue: ""
                });
                return;
            case "cat":
                if (words.length === 0 || rest === "") {
                    result = "cat: missing filename";
                    break;
                }
                if (this.child_directories[this.curr_dir_name] && this.child_directories[this.curr_dir_name].includes(rest)) {
                    if (rest in this.file_contents) {
                        result = this.file_contents[rest].replace(/\n/g, "<br>");
                    } else {
                        result = `cat: ${rest}: Is a directory`;
                    }
                } else {
                    result = `cat: ${rest}: No such file or directory`;
                }
                break;
            case "praneeth":
                if (words[0] === "--help" || words.length === 0) {
                    // Fallthrough to help case
                } else {
                    result = `bash: praneeth: ${words[0]}: command not found`;
                    break;
                }
            case "help":
                result = `
<div style="color: #ffffff; font-weight: bold; margin-bottom: 4px; user-select: none;">Available Commands:</div>
<div style="padding-left: 8px; font-family: monospace; user-select: none;">
  <div><strong style="color: #3465A4;">ls</strong> - List files and folders</div>
  <div><strong style="color: #3465A4;">cd [dir]</strong> - Change directory</div>
  <div><strong style="color: #3465A4;">cat [file]</strong> - View text file contents</div>
  <div><strong style="color: #3465A4;">vi [file]</strong> - Edit text files (Vim editor)</div>
  <div><strong style="color: #3465A4;">pwd</strong> - Print current path</div>
  <div><strong style="color: #3465A4;">whoami</strong> - Profile bio</div>
  <div><strong style="color: #3465A4;">clear</strong> - Clear terminal screen</div>
  <div><strong style="color: #3465A4;">exit</strong> - Close terminal window</div>
</div>
<div style="color: #ffffff; font-weight: bold; margin-top: 10px; margin-bottom: 4px; user-select: none;">GUI Applications:</div>
<div style="padding-left: 8px; font-family: monospace; user-select: none;">
  <div><strong style="color: #3465A4;">code</strong> - Open VSCode editor</div>
  <div><strong style="color: #3465A4;">chrome</strong> - Open Google Chrome</div>
  <div><strong style="color: #3465A4;">doom</strong> - Play Doom game</div>
  <div><strong style="color: #3465A4;">game-2048</strong> - Play 2048 game</div>
  <div><strong style="color: #3465A4;">about-praneeth</strong> - View 'About Me' page</div>
  <div><strong style="color: #3465A4;">sendmsg</strong> - Open Contact Form (gedit)</div>
  <div><strong style="color: #3465A4;">varshion</strong> - Chat with Praneeth's AI Agent</div>
</div>
`;
                break;
            case "ls":
                let target = words[0];
                if (target === "" || target === undefined || target === null) target = this.curr_dir_name;

                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }
                if (target in this.child_directories) {
                    result = this.childDirectories(target).join("");
                }
                else if (target === "personal-documents") {
                    result = "Nope! 🙃";
                    break;
                }
                else if (target === this.curr_dir_name) {
                    result = "";
                }
                else {
                    result = `ls: cannot access '${words}': No such file or directory`;
                }
                break;
            case "mkdir":
                if (words[0] !== undefined && words[0] !== "") {
                    this.props.addFolder(words[0]);
                    result = "";
                } else {
                    result = "mkdir: missing operand";
                }
                break;
            case "pwd":
                let str = this.current_directory;
                result = str.replace("~", "/home/praneeth")
                break;
            case "code":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("vscode");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "echo":
                result = this.xss(words.join(" "));
                break;
            case "doom":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("doom");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "game-2048":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("game-2048");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "chrome":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("chrome");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "trash":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("trash");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "about-praneeth":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("about-praneeth");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "terminal":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("terminal");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "settings":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("settings");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg ]";
                }
                break;
            case "sendmsg":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("gedit");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg, varshion ]";
                }
                break;
            case "varshion":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("varshion");
                } else {
                    result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg, varshion ]";
                }
                break;
            case "clear":
                this.reStartTerminal(false);
                return;
            case "exit":
                this.closeTerminal();
                return;
            case "sudo":
                ReactGA.event({
                    category: "Sudo Access",
                    action: "lol",
                });
                result = getRandomMeme(sudoMemes);
                break;
            case "whoami":
                result = "praneeth — Backend Engineer | Go | Distributed Systems | DevOps";
                break;
            case "uname":
                result = "Linux praneeth-Ubuntu-24-04 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux";
                break;
            default:
                result = "Command '" + main + "' not found.<br>Available Commands: [ help, ls, cd, cat, pwd, whoami, uname, clear, exit, code, chrome, doom, game-2048, about-praneeth, sendmsg, varshion ]<br>" + getRandomMeme(linuxMemes);
        }
        document.getElementById(`row-result-${rowId}`).innerHTML = result;
        this.appendTerminalRow();
    }

    renderViEditor = () => {
        const { viFile, viContent, viInsertMode, viCommandValue } = this.state;
        const lineCount = viContent.split("\n").length;

        return (
            <div className="w-full h-full flex flex-col bg-black text-white font-mono select-none relative" style={{ height: "100%", minHeight: "100%" }}>
                {/* Editor Content Area */}
                <div className="flex-1 flex overflow-hidden p-2">
                    {/* Line Numbers */}
                    <div className="text-gray-500 pr-3 text-right select-none font-normal" style={{ minWidth: "2rem" }}>
                        {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
                            <div key={i}>{i < lineCount ? i + 1 : "~"}</div>
                        ))}
                    </div>
                    {/* Text Area */}
                    <div className="flex-1 relative">
                        {viInsertMode ? (
                            <textarea
                                id="vi-textarea"
                                value={viContent}
                                onChange={(e) => this.setState({ viContent: e.target.value })}
                                onKeyDown={this.handleViTextAreaKeyDown}
                                className="w-full h-full bg-transparent text-white border-none outline-none resize-none font-mono font-normal"
                                autoFocus
                            />
                        ) : (
                            <div
                                onClick={this.focusViCommand}
                                className="w-full h-full whitespace-pre-wrap font-mono cursor-text font-normal text-left"
                                style={{ outline: "none" }}
                            >
                                {viContent || " "}
                            </div>
                        )}
                    </div>
                </div>
                {/* Status Bar */}
                <div className="h-6 bg-gray-800 text-xs px-2 flex justify-between items-center text-gray-300 border-t border-gray-700">
                    <div>
                        {viInsertMode ? (
                            <span className="text-green-400 font-bold">-- INSERT --</span>
                        ) : (
                            <span>{viFile} {viContent === (this.file_contents[viFile] || "") ? "" : "[Modified]"}</span>
                        )}
                    </div>
                    <div>
                        <span>Lines: {lineCount}</span>
                    </div>
                </div>
                {/* Command Line Input */}
                <div className="h-6 bg-black text-sm px-2 flex items-center">
                    {!viInsertMode && (
                        <div className="flex w-full">
                            <span>:</span>
                            <input
                                id="vi-command-input"
                                value={viCommandValue}
                                onChange={(e) => this.setState({ viCommandValue: e.target.value })}
                                onKeyDown={this.handleViCommandKeyDown}
                                className="flex-1 bg-transparent text-white border-none outline-none font-mono ml-0.5"
                                placeholder="Press 'i' to insert, or type command (:wq, :q)"
                                autoComplete="off"
                                autoFocus={!viInsertMode}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    handleViTextAreaKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            this.setState({ viInsertMode: false, viCommandValue: "" }, () => {
                setTimeout(() => {
                    document.getElementById("vi-command-input")?.focus();
                }, 50);
            });
        }
    }

    handleViCommandKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let cmd = this.state.viCommandValue.trim();
            if (cmd.startsWith(":")) {
                cmd = cmd.slice(1);
            }

            if (cmd === "wq") {
                let fileName = this.state.viFile;
                let content = this.state.viContent;

                this.file_contents[fileName] = content;

                if (!this.child_directories[this.curr_dir_name].includes(fileName)) {
                    this.child_directories[this.curr_dir_name].push(fileName);
                }

                this.setState({ viMode: false, viFile: "", viContent: "" }, () => {
                    this.appendTerminalRow();
                });
            } else if (cmd === "q" || cmd === "q!") {
                this.setState({ viMode: false, viFile: "", viContent: "" }, () => {
                    this.appendTerminalRow();
                });
            } else {
                this.setState({ viCommandValue: "Unknown command. Try :wq or :q" });
            }
        } else if (e.key === "Escape") {
            this.setState({ viCommandValue: "" });
        }

        if (e.key === "i" && this.state.viCommandValue === "") {
            e.preventDefault();
            this.setState({ viInsertMode: true }, () => {
                setTimeout(() => {
                    document.getElementById("vi-textarea")?.focus();
                }, 50);
            });
        }
    }

    focusViCommand = () => {
        if (this.state.viInsertMode) {
            document.getElementById("vi-textarea")?.focus();
        } else {
            document.getElementById("vi-command-input")?.focus();
        }
    }

    xss(str) {
        if (!str) return;
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp';
                case '<':
                    return '&lt';
                case '>':
                    return '&gt';
                case '"':
                    return '&quot';
                case "'":
                    return '&#x27';
                case '/':
                    return '&#x2F';
                default:
                    return char;
            }
        }).join('');
    }

    render() {
        const bgStyle = "bg-ub-drk-abrgn text-white";
        if (this.state.viMode) {
            return this.renderViEditor();
        }
        return (
            <div className={`h-full w-full text-sm font-bold p-2 ${bgStyle}`} id="terminal-body">
                {
                    this.state.terminal
                }
            </div>
        )
    }
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
