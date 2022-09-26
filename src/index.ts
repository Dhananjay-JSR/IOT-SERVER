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

IO.on("connection", (socket) => {
    console.clear()
    //check if the connection is comming from client or dashboard
    if(socket.handshake.headers.client_type=='2')//connection coming from dashboard
    {
        if(CLIENT_IS_READY==false)  //Client is Not yet available 
        {
            socket.emit('not_ready')    //emit not_ready_forcing_dashboard to not respond
        }else{
            console.log(chalk.bgCyanBright("Dashboard Connected"))
        }
    }else{
        CLIENT_IS_READY=true;
        console.log(chalk.bgMagenta("Connection to Client Established"));
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
        //client disconnected
        console.log("client disconnected")
        CLIENT_IS_READY=false;
        socket.emit('client_disconnect') 
        //force dashboard to switch off
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
  console.log(chalk.red(`Waiting for Client to Connect to ${PORT}`));
});

console.clear();

// let connected = false
// import childprocess from 'child_process';
// let url = 'http://localhost'
// let start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');

// childprocess.exec(start + ' ' + url);
