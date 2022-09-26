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

            // childprocess.exec(start + ' ' + `http://localhost:${PORT}`); 
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

// SERVER.listen(PORT, () => {
//   console.clear();
//   console.log(chalk.red(`Waiting for Client to Connect to PORT ${PORT}`));
// });
//ENABLE THIS

console.clear();

// let connected = false
// import childprocess from 'child_process';
// let url = 'http://localhost'
// let start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');

// childprocess.exec(start + ' ' + url);


import {data} from './json'
// console.log(data.records[1].tdata.split(','))



// console.clear()
// console.log("Name:-           ",data.records[1].tdata.split(',')[0])
// console.log("Latitude:-       ",data.records[1].tdata.split(',')[1])
// console.log("Longitude:-      ",data.records[1].tdata.split(',')[2])
// console.log("cell_1_v:-       ",data.records[1].tdata.split(',')[3]," mV")
// console.log("cell_2_v:-       ",data.records[1].tdata.split(',')[4]," mV")
// console.log("cell_3_v:-       ",data.records[1].tdata.split(',')[5]," mV")
// console.log("cell_4_v:-       ",data.records[1].tdata.split(',')[6]," mV")
// console.log("cell_5_v:-       ",data.records[1].tdata.split(',')[7]," mV")
// console.log("cell_6_v:-       ",data.records[1].tdata.split(',')[8]," mV")
// console.log("cell_7_v:-       ",data.records[1].tdata.split(',')[9]," mV")
// console.log("cell_8_v:-       ",data.records[1].tdata.split(',')[10]," mV")
// console.log("cell_9_v:-       ",data.records[1].tdata.split(',')[11]," mV")
// console.log("cell_10_v:-      ",data.records[1].tdata.split(',')[12]," mV")
// console.log("cell_11_v:-      ",data.records[1].tdata.split(',')[13]," mV")
// console.log("cell_12_v:-      ",data.records[1].tdata.split(',')[14]," mV")
// console.log("cell_13_v:-      ",data.records[1].tdata.split(',')[15]," mV")
// console.log("cell_14_v:-      ",data.records[1].tdata.split(',')[16]," mV")
// console.log("avg_cell_v:-     ",data.records[1].tdata.split(',')[17]," mV")
// console.log("pack_voltage:-   ",data.records[1].tdata.split(',')[18]," mV")
// console.log("current:-        ",data.records[1].tdata.split(',')[19]," mAmp")
// console.log("battery_percent:-",data.records[1].tdata.split(',')[20]," %")


data.records.map((e)=>{
  console.log(e.vid)
  console.log(e.datavia)
  console.log(e.created)
  console.log(e.tdata.split(',')[0])
  console.log(e.tdata.split(',')[1])
  console.log(e.tdata.split(',')[2])
  console.log(e.tdata.split(',')[3])
  console.log(e.tdata.split(',')[4])
  console.log(e.tdata.split(',')[5])
  console.log(e.tdata.split(',')[6])
  console.log(e.tdata.split(',')[7])
  console.log(e.tdata.split(',')[8])
  console.log(e.tdata.split(',')[9])
  console.log(e.tdata.split(',')[10])
  console.log(e.tdata.split(',')[11])
  console.log(e.tdata.split(',')[12])
  console.log(e.tdata.split(',')[13])
  console.log(e.tdata.split(',')[14])
  console.log(e.tdata.split(',')[15])
  console.log(e.tdata.split(',')[16])
  console.log(e.tdata.split(',')[17])
  console.log(e.tdata.split(',')[18])
  console.log(e.tdata.split(',')[19])
  console.log(e.tdata.split(',')[20])
})
