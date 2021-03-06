const graphql = require('graphql');
const Bus = require('../models/bus')
const Terminal = require('../models/terminal')
const mongoose = require('mongoose')





const { GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull  } = graphql


const BusType = new GraphQLObjectType({
    name:'Bus',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        depart_time:{type:GraphQLInt},

        terminal:{
          type:TerminalType,
          resolve({ terminalId },args){ 
            return(
                Terminal.findById(terminalId)
              )
          }
        }

    })
})


const TerminalType = new GraphQLObjectType({
    name:'Terminal',
    fields:()=>({
        id:{type:GraphQLID},
        number:{type:GraphQLString } ,
        name:{type:GraphQLString},
        location:{type:GraphQLString},

        buses:{
         type: new  GraphQLList(BusType),
         resolve({ id },args){
             return(
               Bus.find({terminalId:id})
             )
         }
        }

    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        bus:{
            type:BusType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
              return( Bus.findById(args.id) )
            }
        },
        
        terminal:{
            type:TerminalType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
               
                return(Terminal.findById(args.id) )
            }
        },

        buses:{
            type:new GraphQLList(BusType),
            resolve(parent,args){
                return(
                    Bus.find()
                )
            }
        },

        terminals:{
            type:new GraphQLList(TerminalType),
            resolve(){
                return(Terminal.find())
            }
        }

    }
})


const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addBus:{
            type:BusType,
            args:{name:{type: new GraphQLNonNull(GraphQLString)},depart_time:{type:new GraphQLNonNull(GraphQLInt)},terminalId:{type:new GraphQLNonNull(GraphQLID)}},
            resolve(parent,{name,depart_time,terminalId}){
                let bus = new Bus({
                    name,
                    depart_time,
                    terminalId
                })

               return bus.save()
            }
        },

        addTerminal:{
            type:TerminalType,
            args:{name:{type:new GraphQLNonNull(GraphQLString)},number:{type: new GraphQLNonNull(GraphQLString)},location:{type:new GraphQLNonNull(GraphQLString)}},
            resolve(parent,{name,number,location}){
                let terminal = new Terminal({
                    name,
                    number,
                    location
                })

                return terminal.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})