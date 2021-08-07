using System;
using PlayerIO.GameLibrary;

namespace BurningMan {

	//implimentation from client
	static class RoomTypesEnum
	{
		public const string Zone = "Z";
	}
	static class MessagesTypesEnum
	{
		public const string move = "z";
	}


	//Player class
	public class Player : BasePlayer {}

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

		const string SPEAKERS = "speakers";

        //Create array to store our letters
        //private Letter[] letters = new Letter[150];

        //This method is called when an instance of your the game is created
        public override void GameStarted()
        {
            //Anything you write to the Console will show up in the 
            //output window of the development server
            Console.WriteLine("Zone started, initializing letters.");

			RoomData[SPEAKERS] = "1";

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
			// Create init message for the joining player
			Message m = Message.Create("init");

			RoomData[SPEAKERS] = (int.Parse(RoomData[SPEAKERS])+1).ToString();

			//Tell player their own id
			m.Add(player.Id);

			//Add the current position of all letters to the init message
			//for (int a = 0; a < letters.Length; a++) {
			//	Letter l = letters[a];
			//	m.Add(l.X, l.Y);
			//}

			//Send init message to player with a delay, to ensure client has setup all message handlers
			ScheduleCallback(delegate () { player.Send(m); }, 50);
		}

		//This method is called when a player leaves the game
		public override void UserLeft(Player player) {
			Console.WriteLine("Player " + player.Id + " left the room");
		}

		//This method is called when a player sends a message into the server code
		public override void GotMessage(Player player, Message message) {
			//Switch on message type
			switch (message.Type) {
				case "move": {
						//Move letter in internal representation
						//Letter l = letters[message.GetInteger(0)];
						//l.X = message.GetInteger(1);
						//l.Y = message.GetInteger(2);

						//Broadcast move to all players
						//Broadcast("move", message.GetInteger(0), l.X, l.Y);
						break;
					}
				default:
					break;
			}
		}
	}
}
