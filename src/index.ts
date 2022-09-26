import chalk from "chalk";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import childprocess from "child_process";
import path from 'path'
import process from "process";

const APP = express();
const SERVER = http.createServer(APP);
const IO = new Server(SERVER,{
    cors:{
        origin: '*',
        allowedHeaders: ["alllowed"],
    credentials: true
    }
});
const PORT = 3000 || process.env.PORT;
let start =
  process.platform == "darwin"
    ? "open"
    : process.platform == "win32"
    ? "start"
    : "xdg-open";

APP.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(),'views','index.html'))
});

let CLIENT_IS_READY = false
let FIRST = true

IO.on("connection", (socket) => {
    //check if the connection is comming from client or dashboard
    if(socket.handshake.headers.client_type=='2')//connection coming from dashboard
    {
        if(CLIENT_IS_READY==false)  //Client is Not yet available 
        {
            socket.emit('cli_not_ready')    //emit not_ready_forcing_dashboard to not respond
        }else{
            setTimeout(()=>{
                console.clear()
                console.log(chalk.bgCyanBright("Dashboard Connected"))
            },2000)
            socket.emit('operational')
        }
    }else{
        CLIENT_IS_READY=true;
        console.clear()
        console.log(chalk.bgMagenta("Connection to Client Established"));
        if(FIRST==true){

            childprocess.exec(start + ' ' + `http://localhost:${PORT}`); 
            FIRST=false
        }
        IO.sockets.emit('operational')
        // IO.socket.emit('operational')
    }
    // if(CLIENT_IS_READY==false){
    //     if(socket.handshake.auth.token=="dashboard"){
    //         socket.disconnect()
    //     }
    // }else{
    //     CLIENT_IS_READY==true;
    //     console.log(chalk.bgMagenta("Connection to Client Established"));
    // }



//   console.clear();
//   if(socket.handshake.auth.token=="dashboard"){
//     console.log(chalk.bgCyanBright("Dashboard Connected"))
//   }else{
//       console.log(chalk.bgMagenta("Connection to Client Established"));
//       console.log()
//   }
//   childprocess.exec(start + ' ' + `http://localhost:${PORT}`); 
  socket.on("disconnect", () => {
    if(socket.handshake.headers.client_type=='1'){
        IO.sockets.emit('cli_disconnected')
        console.clear()
        console.log(chalk.bgRedBright("client disconnected"))
        console.log(chalk.red(`Waiting for Client to Reconnect`));
        CLIENT_IS_READY=false;
    }else{
        console.clear();
        console.log(chalk.bgRedBright("Dashboard Disconnected"))
    }
    // if(socket.handshake.auth.token=="dashboard"){
    //     console.clear();
    //     console.log(chalk.bgCyanBright("Dashboard Disconneted"))
    //   }else{
    //     console.clear();
    // console.log(chalk.redBright("Client Closed the Connection"));
    //   }
  });
  socket.on("data",(payload)=>{
    // console.log(payload)
    // console.log('receiing packets')
  })
});

SERVER.listen(PORT, () => {
  console.clear();
  console.log(chalk.red(`Waiting for Client to Connect to PORT ${PORT}`));
});

console.clear();

// let connected = false
// import childprocess from 'child_process';
// let url = 'http://localhost'
// let start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');

// childprocess.exec(start + ' ' + url);
