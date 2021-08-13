using System;
using PlayerIO.GameLibrary;
using System.Collections.Generic;

namespace BurningMan {

	//implimentation from client
	static class RoomTypesEnum
	{
		public const string Zone = "Z";
	}
	static class MessagesTypesEnum
	{
		// users messages
		public const string move = "z";
		public const string moveReserve = "x";
		// server messages
		public const string processedMove = "a";
		public const string processedMoveReserve = "b";
		public const string roomInitResponse = "i";
		public const string newUserJoined = "j";
		public const string userLeft = "l";
	}
	static class PlayerObjectsFieldsEnum
    {
		public const string x = "x";
		public const string y = "y";
		public const string innerId = "i";
	}
	public class Position<X, Y>
	{
		public X x { get; set; }
		public Y y { get; set; }

		public Position(X x, Y y)
		{
			this.x = x;
			this.y = y;
		}
	}

	//Player class
	public class Player : BasePlayer {
		
	}

	//Letter class. Each letter on the screen is represented by an instance of this class.
	//public class Letter {
	//	public int X { get; set; }
	//	public int Y { get; set; }
	//	public Letter(int x, int y) {
	//		X = x;
	//		Y = y;
	//	}
	//}

	[RoomType(RoomTypesEnum.Zone)]
	public class GameCode : Game<Player>
    {

		//const string SPEAKERS = "speakers";


		//Create array to store our letters
		//private Letter[] letters = new Letter[150];
		//private Dictionary<int, uint> playerInnerIds = new Dictionary<int, uint>();
		private Dictionary<ulong, Position<uint,uint>> usersPositions = new Dictionary<ulong, Position<uint, uint>>();
		private HashSet<int> speakers = new HashSet<int>();
		private uint listenersCount;

		//This method is called when an instance of your the game is created
		public override void GameStarted()
        {
			PreloadPlayerObjects = true;
            //Anything you write to the Console will show up in the 
            //output window of the development server
            Console.WriteLine("Zone started, initializing letters.");
			//RoomData[SPEAKERS] = "0";
			//RoomData["listeners"] = "0";
			//RoomData.Save();

            // Create 150 letters
            //for (int i = 0; i < letters.Length; i++) {
            //	letters[i] = new Letter(-1, -1);
            //}
        }

        // This method is called when the last player leaves the room, and it's closed down.
        public override void GameClosed() {
			Console.WriteLine("FridgeMagnets stopped.");
		}

		// This method is called whenever a player joins the game
		public override void UserJoined(Player player) {
			listenersCount++;

			if (player.JoinData["isMain"] == "true")
			{
				speakers.Add(player.Id);
				ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
				uint x = Convert.ToUInt32(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.x));
				uint y = Convert.ToUInt32(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.y));

				usersPositions.Add(playerInnerId, new Position<uint, uint>(x,y));
				//Broadcast(MessagesTypesEnum.newUserJoined, player.ConnectUserId, x, y);
				Broadcast(MessagesTypesEnum.newUserJoined, player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId).ToString(), x, y);
			}

			Message messageForPlayer = Message.Create(MessagesTypesEnum.roomInitResponse); //TODO: send players positions
			ScheduleCallback(delegate () { player.Send(messageForPlayer); }, 50);
		}

		//This method is called when a player leaves the game
		public override void UserLeft(Player player)
		{
			listenersCount--;
			if (player.JoinData["isMain"] == "true")
			{
				speakers.Remove(player.Id);
				ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
				Position<uint, uint> pos = usersPositions[playerInnerId];
				player.PlayerObject.Set(PlayerObjectsFieldsEnum.x, pos.x);
				player.PlayerObject.Set(PlayerObjectsFieldsEnum.y, pos.y);
				player.PlayerObject.Save();
				usersPositions.Remove(playerInnerId);
			}

			Broadcast(MessagesTypesEnum.userLeft, player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId).ToString());
		}

		//This method is called when a player sends a message into the server code
		public override void GotMessage(Player player, Message message) {
			//Switch on message type
			switch (message.Type) {
				case MessagesTypesEnum.move: {
						ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
						Position<uint,uint> pos = usersPositions[playerInnerId];
						pos.x = message.GetUInt(0);
						pos.y = message.GetUInt(1);

						Broadcast(MessagesTypesEnum.processedMove, playerInnerId, pos.x, pos.y);
						break;
					}
				case MessagesTypesEnum.moveReserve:
					{
						ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
						Position<uint, uint> pos = usersPositions[playerInnerId];
						pos.x = message.GetUInt(0);
						pos.y = message.GetUInt(1);

						Broadcast(MessagesTypesEnum.processedMove, player.ConnectUserId, pos.x, pos.y);
						break;
                    }
				default:
					break;
			}
		}
	}
}
