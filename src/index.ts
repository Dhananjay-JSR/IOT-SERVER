import chalk from "chalk";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import childprocess from "child_process";
import path from "path";
import process from "process";
import { logger } from "./logger";
import { Sequelize, DataTypes } from "sequelize";
// const XNG1037 = require('../model/XNG1037')
import moment from "moment";

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

const sequelize = new Sequelize("iot", "root", "", {
  logging: (msg) => logger.warn(msg),
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  timezone: "+05:30",
});

const XNG1037 = sequelize.define("XNG1037", {
  vid: {
    type: DataTypes.STRING,
    defaultValue: "XNG1037",
  },
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  created: {
    type: DataTypes.DATE,
  },
  inserted: {
    type: DataTypes.DATE,
    defaultValue: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  cell_1: {
    type: DataTypes.FLOAT,
  },
  cell_2: {
    type: DataTypes.FLOAT,
  },
  cell_3: {
    type: DataTypes.FLOAT,
  },
  cell_4: {
    type: DataTypes.FLOAT,
  },
  cell_5: {
    type: DataTypes.FLOAT,
  },
  cell_6: {
    type: DataTypes.FLOAT,
  },
  cell_7: {
    type: DataTypes.FLOAT,
  },
  cell_8: {
    type: DataTypes.FLOAT,
  },
  cell_9: {
    type: DataTypes.FLOAT,
  },
  cell_10: {
    type: DataTypes.FLOAT,
  },
  cell_11: {
    type: DataTypes.FLOAT,
  },
  cell_12: {
    type: DataTypes.FLOAT,
  },
  cell_13: {
    type: DataTypes.FLOAT,
  },
  cell_14: {
    type: DataTypes.FLOAT,
  },
  avg_cell: {
    type: DataTypes.FLOAT,
  },
  pack_voltage: {
    type: DataTypes.FLOAT,
  },
  current: {
    type: DataTypes.FLOAT,
  },
  battery_percent: {
    type: DataTypes.FLOAT,
  },
});

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
    // if(socket.handshake.auth.token=="dashboard"){
    //     console.clear();
    //     console.log(chalk.bgCyanBright("Dashboard Disconneted"))
    //   }else{
    //     console.clear();
    // console.log(chalk.redBright("Client Closed the Connection"));
    //   }
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
          if (LastDate.getDate() <= Updateddate.getDate()) {
            INDEX++
          }else if((LastDate.getDate() == Updateddate.getDate())){
            if(LastDate.getHours() < Updateddate.getHours()){
              INDEX++
            }else if (LastDate.getHours() == Updateddate.getHours()){

                FLAG=true
              
            }
          }
        // } else {
        //   if(LastDate.getHours() < Updateddate.getHours()){
        //     INDEX++
        //   }else{
        //     FLAG=true
        //     // if(LastDate.getSeconds() <= Updateddate.getSeconds()){
        //     //   INDEX++
        //     // }else{
        //     //   FLAG=true
        //     // }
        //   }


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
      console.clear();
      console.log("New Data Received");
      try {
        let Local_index = await TableIndex(payload);
        // console.log(Local_index);
        //@ts-ignore
        // console.log(new Date(payload.records[Local_index].created as any).getDate(),":",new Date(payload.records[Local_index].created as any).getHours(),":",new Date(payload.records[Local_index].created as any).getMinutes())

        if (payload.records.length != Local_index) {
          await XNG1037.sync({
            alter: true,
                // force:true
          });
          // console.log(chalk.bgBlackBright("Rebuilding Table Column"));
          payload.records.map(async (e, index, array) => {

            if (index + 1 === array.length) {


              setTimeout(()=>{
              console.log(chalk.red("Updating Data"))
              socket.emit("ready_to_serve");
              setTimeout(()=>{
                console.clear();
                console.log(chalk.greenBright("Server on Idle State"))
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
                    created: moment(e.created).format("YYYY-MM-DD hh:mm:ss"),
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
          console.clear();
          console.log(chalk.bgCyanBright("File Already Up to Date"))
          setTimeout(()=>{
            console.clear();
            console.log(chalk.bgCyanBright("Server on Idle State"))
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

      //find last timing
      //   XNG1037.findOne({
      //     order: [ [ 'created', 'DESC' ]],
      // }).then((data:any)=>{
      //   const date = new Date(data.created);
      //   console.log(
      //     date.getHours()
      //     )
      // }).catch(e=>{
      //   console.log(e)
      // });

      // XNG1037.sync({
      //     // alter: true,
      //     force:true
      // }).then(()=>{
      //     console.log(chalk.bgBlackBright("Rebuilding Table Column"))
      //     data.records.map((e,index,array)=>{
      //         XNG1037.create({
      //             vid:e.vid,
      //             id:(Math.random()*10).toString(),
      //             created:e.created,
      //             cell_1:e.tdata.split(',')[3],
      //             cell_2:e.tdata.split(',')[4],
      //             cell_3:e.tdata.split(',')[5],
      //             cell_4:e.tdata.split(',')[6],
      //             cell_5:e.tdata.split(',')[7],
      //             cell_6:e.tdata.split(',')[8],
      //             cell_7:e.tdata.split(',')[9],
      //             cell_8:e.tdata.split(',')[10],
      //             cell_9:e.tdata.split(',')[11],
      //             cell_10:e.tdata.split(',')[12],
      //             cell_11:e.tdata.split(',')[13],
      //             cell_12:e.tdata.split(',')[14],
      //             cell_13:e.tdata.split(',')[15],
      //             cell_14:e.tdata.split(',')[16],
      //             avg_cell:e.tdata.split(',')[17],
      //             pack_voltage:e.tdata.split(',')[18],
      //             current:e.tdata.split(',')[19],
      //             battery_percent:e.tdata.split(',')[20]
      //         }).then(()=>{
      //           if(data.records.length==(index+1)){
      //             console.log(chalk.bgGreen.yellowBright("Complete Data Inserted at ",new Date()))
      //           }
      //         }).catch((e)=>{
      //             logger.error(e)
      //             console.log(e)
      //         })
      //     })

      // }).catch((e)=>{
      //     logger.error(e)
      // })
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

// let connected = false
// import childprocess from 'child_process';
// let url = 'http://localhost'
// let start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');

// childprocess.exec(start + ' ' + url);

import { data } from "./json";
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
