This is the server code for CSE218 project MafiaVR.

- [Emitted Events](#emitted-events)
  - [connect](#connect)
  - [joined room](#joined-room)
  - [new player joined](#new-player-joined)
  - [player disconnected](#player-disconnected)
  - [start](#start)
  - [night](#night)
  - [day](#day)
  - [game ended](#game-ended)
  - [voted player](#voted-player)
  - [existing players](#existing-players)
  - [killed players](#killed-players)
- [Received Events](#received-events)
  - [create room](#create-room)
  - [join room](#join-room)
  - [vote](#vote)
  - [start](#start-1)
  - [kill](#kill)

# Emitted Events

## connect

This event is sent to the client when the connection is established.

## joined room

Parameter: `role`

This event is sent to the client after the player has joined the game room. The parameter `role` contains the role of the player, it could be `"mafia"`, `"doctor"`, `"villager"`, `"sheriff"`.

## new player joined

Parameter: `socketId`, `username`, `role`

This event is sent to all players in the game room when a new player has joined the room.

## player disconnected

Parameter: `socketId`, `username`

This event is sent to all players in the game room when a player has disconnected.

## start

This event is sent to all players in the game room to indicate that the game has started.

## night

The event is sent to all players in the game room to indicate that the night phase has started. This is a signal to front-end to change phase.

## day

The event is sent to all players in the game room to indicate that the day phase has started. This is a signal to front-end to change phase.

## game ended

Parameter: `winner`

The event is sent to all players in the game room when the game has ended. The parameter `winner` contains the socketId of the winner. Front-end could use this socketId to show winner information.

## voted player

Parameter: `votedPlayer`

The event is sent to all players in the game room when after the night phase has ended to tell the players the voted out player. The parameter `votedPlayer` contains the socketId of the killed player.

## existing players

Parameter: `existingPlayers`

The event is sent to newly joined player about already existing players.

`existingPlayers` is an array containing already existing players.

## killed players

Parameter: `killedPlayers`

The event is sent to all players in the game room when after the night phase has ended to tell the players the players killed by mafias. The parameter `killedPlayers` is an array containing socketIds of the killed players.

# Received Events

## create room

Parameter: `roomConfig`, `roomId`, `username`

Front-end should send this event to the server to indicate that the host tries to create a new game room.

`roomConfig` is an object contains the following properties:

- `villagerNum`: `number`
- `mafiaNum`: `number`
- `doctorNum`: `number`
- `sheriffNum`: `number`

`roomId` is the roomId.

`username` is the username of the host.

## join room

Parameters: `roomId`, `username`

Front-end should send this event to the server when the player tries to join a game room.

## vote

Parameter: `votedPlayer`

The front-end should send this event to the server to indicate the player it votes.

`votedPlayer` contains the socketId of the voted player.

## start

The host should send this event to the server to indicate that the game has started.

## kill

Parameter: `killedPlayer`

The front-end should only send this event to the server if the player is a mafia and it is during night phase.

The parameter ` killedPlayer` should be a string containing the socketId of the killed player.
