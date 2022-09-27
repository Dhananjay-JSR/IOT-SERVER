import chalk from "chalk";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import childprocess from "child_process";
import path from "path";
import process from "process";
import { logger } from "./logger";
import sequelize from "./DB_connection";
import XNG1037 from './model/XNG1037'

const APP = express();
const SERVER = http.createServer(APP);
const IO = new Server(SERVER, {
  cors: {
    origin: "*",
    allowedHeaders: ["alllowed"],
    credentials: true,
  },
});
const PORT = 3000 || process.env.PORT;



let start =
  process.platform == "darwin"
    ? "open"
    : process.platform == "win32"
    ? "start"
    : "xdg-open";

APP.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "index.html"));
});
let IOT_STATUS_ONLINE = false
let CLIENT_IS_READY = false;
let FIRST = true;
let DB_ONLINE = false;

IO.on("connection", (socket) => {
  //check if the connection is comming from client or dashboard
  if (socket.handshake.headers.client_type == "2") {
    //connection coming from dashboard
    if (CLIENT_IS_READY == false) {
      //Client is Not yet available
      socket.emit("cli_not_ready"); //emit not_ready_forcing_dashboard to not respond
    } else {
      setTimeout(() => {
        console.clear();
        console.log(chalk.bgCyanBright("Dashboard Connected"));
        socket.emit("operational");
        if (DB_ONLINE == true) {
          socket.emit("mysql_online");
        } else {
        }
      }, 2000);
    }
  } else {
    CLIENT_IS_READY = true;
    console.clear();
    console.log(chalk.bgMagenta("Connection to Client Established"));
     IOT_STATUS_ONLINE = true
    // if (DB_ONLINE&&CLIENT_IS_READY){
    //   IO.sockets.emit('ready')
    // }
    if (FIRST == true) {
      // childprocess.exec(start + ' ' + `http://localhost:${PORT}`);
      FIRST = false;
    }
    IO.sockets.emit("operational");
    IO.sockets.emit("mysql_online");
    // IO.socket.emit('operational')
  }

  socket.on("power_on",()=>{
    if(IOT_STATUS_ONLINE==true){
      console.log("Putting IOT on Sleep")
      IO.sockets.emit("power_off")
      IOT_STATUS_ONLINE=false
    }else{
      console.log("Walking Up IOT")
      IO.sockets.emit("power_off")
      IOT_STATUS_ONLINE=true
    }


  })
  socket.on("disconnect", () => {
    if (socket.handshake.headers.client_type == "1") {
      IO.sockets.emit("cli_disconnected");
      console.clear();
      console.log(chalk.bgRedBright("client disconnected"));
      console.log(chalk.red(`Waiting for Client to Reconnect`));
      CLIENT_IS_READY = false;
    } else {
      console.clear();
      console.log(chalk.bgRedBright("Dashboard Disconnected"));
    }
  });

  async function TableIndex(payload: {
    records: {
      id: String;
      vid: String;
      datavia: String;
      tdata: String;
      created: String;
    }[];
  }) {
    let INDEX = 0;
    try {
      let lastData = await XNG1037.findOne({
        order: [["created", "DESC"]],
      });
      //@ts-ignore
      if (lastData==0) {
        return INDEX=0
      }
      let FLAG = false;
      let length = payload.records.length;
      // console.clear()
      // console.log("****************")
      payload.records.map((value, index, _) => {
        const Updateddate = new Date(
          payload.records[length - (index + 1)].created as any
        );
        //@ts-ignore
        const LastDate = new Date(lastData.created as any);
        // console.log("",
                  //@ts-ignore
                  // new Date(lastData.created as any).getDate(),":",new Date(lastData.created as any).getHours(),":",new Date(lastData.created as any).getMinutes(),"-","",new Date(payload.records[length - (index + 1)].created as any).getDate(),":",new Date(payload.records[length - (index + 1)].created as any).getHours(), ":",new Date(payload.records[length - (index + 1)].created as any).getMinutes())
        if (FLAG == false) {
          if (LastDate.getDate() < Updateddate.getDate()) {
            INDEX++
          }else if((LastDate.getDate() == Updateddate.getDate())){
            if(LastDate.getHours() < Updateddate.getHours()){
              INDEX++
            }else{
            
            // if (LastDate.getHours() == Updateddate.getHours()){

                FLAG=true
              
            }
          }
    
        }
      });

      return length-INDEX;
    } catch (e) {
      console.log(e);
    }
  }

  socket.on(
    "data",
    async (payload: {
      records: {
        id: String;
        vid: String;
        datavia: String;
        tdata: String;
        created: String;
      }[];
    }) => {
      // console.log("New Data Received");
      try {
        let Local_index = await TableIndex(payload);
      
        if (payload.records.length != Local_index) {


          await XNG1037.sync({
            alter: true,
                // force:true
          });
          // console.log(chalk.bgBlackBright("Rebuilding Table Column"));
          payload.records.map(async (e, index, array) => {
            console.log("INSERTING")
            //@ts-ignore
            console.log(payload.records[Local_index])

            if (index + 1 === array.length) {


              setTimeout(()=>{
              // console.log(chalk.red("Updating Data"))
              socket.emit("ready_to_serve");
              setTimeout(()=>{
                // console.clear();
                // console.log(chalk.greenBright("Server on Idle State"))
              },1000)
              },1000)
        

            }
            else{
              if (index <= (Local_index as Number)) {
                // console.log(index)
                return;
              }else{
                  await XNG1037.create({
                    vid: e.vid,
                    id: (Math.random() * 10).toString(),
                    //@ts-ignore
                    created: new Date(e.created),
                    cell_1: e.tdata.split(",")[3],
                    cell_2: e.tdata.split(",")[4],
                    cell_3: e.tdata.split(",")[5],
                    cell_4: e.tdata.split(",")[6],
                    cell_5: e.tdata.split(",")[7],
                    cell_6: e.tdata.split(",")[8],
                    cell_7: e.tdata.split(",")[9],
                    cell_8: e.tdata.split(",")[10],
                    cell_9: e.tdata.split(",")[11],
                    cell_10: e.tdata.split(",")[12],
                    cell_11: e.tdata.split(",")[13],
                    cell_12: e.tdata.split(",")[14],
                    cell_13: e.tdata.split(",")[15],
                    cell_14: e.tdata.split(",")[16],
                    avg_cell: e.tdata.split(",")[17],
                    pack_voltage: e.tdata.split(",")[18],
                    current: e.tdata.split(",")[19],
                    battery_percent: e.tdata.split(",")[20],
                  });
           }  
            }

          });
        } else {
          socket.emit("ready_to_serve");
          // console.clear();
          // console.log(chalk.bgCyanBright("File Already Up to Date"))
          setTimeout(()=>{
            // console.clear();
            // console.log(chalk.bgCyanBright("Server on Idle State"))
          },1000)

        }
      } catch (e) {}
    }
  );
});

SERVER.listen(PORT, () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log(chalk.bgYellow.black("Connected to Database"));
      DB_ONLINE = true;

    })
    .catch((e) => {
      if (e.message == "Unknown database 'io'") {
        console.log(
          chalk.bgBlue("System Couldn't Find IOT database inside Mysql")
        );
      } else {
        console.log("CHeck for DB Connection");
      }
      logger.error(e);
    });
  console.clear();
  console.log(chalk.red(`Waiting for Client to Connect to PORT ${PORT}`));
});
//ENABLE THIS

console.clear();
