using System;
using PlayerIO.GameLibrary;
using System.Collections.Generic;

namespace BurningMan {

	//implimentation from client
	static class RoomTypesEnum
	{
		public const string SeparatedRoom = "S";
	}
	static class MessagesTypesEnum
	{
		// server messages
		public const string processedMove = "a";
		public const string processedMoveReserve = "ar";
		public const string divideSpeakers = "d";
		public const string roomInitResponse = "i";
		public const string newUserJoined = "j";
		public const string userLeft = "l";
		public const string processedShout = "s";
		public const string processedShoutReserve = "sr";
		public const string unitListeners = "u";
		// users messages
		public const string shout = "y";
		public const string shoutReserve = "yr";
		public const string move = "z";
		public const string moveReserve = "zr";
	}
	static class PlayerObjectsFieldsEnum
    {
		public const string x = "x";
		public const string y = "y";
		public const string innerId = "i";
	}

	//utils class
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

	// general classes
	public class Player : BasePlayer {
		
	}

	[RoomType(RoomTypesEnum.SeparatedRoom)]
	public class GameCode : Game<Player>
    {
		const string CONFIGS_TABLE = "Configs";
		const string SERVER_CONFIG = "servers_s";

		const string MAX_SPEAKERS = "maxSpeakers";
		const string UPDATE_TIME = "updateTime";

		// room configs
		private int maxSpeakers = 55;
		private int updateTime = 300000;
		private Timer configTimer;

		// room state
		private Dictionary<ulong, Position<uint,uint>> usersPositions = new Dictionary<ulong, Position<uint, uint>>();
		private HashSet<int> speakers = new HashSet<int>();

		public override void GameStarted()
        {
			PreloadPlayerObjects = true;

			PlayerIO.BigDB.Load(CONFIGS_TABLE, SERVER_CONFIG, delegate (DatabaseObject config) {
				if (config == null) return;

				maxSpeakers = Convert.ToInt32(config.GetValue(MAX_SPEAKERS));
				updateTime = Convert.ToInt32(config.GetValue(UPDATE_TIME));
			});

			configTimer = AddTimer(delegate {
				CheckConfigsSetUp();
			}, updateTime);
        }

        public override void GameClosed() {
			//todo: save speakers position
		}

		public override void UserJoined(Player player) {
			Message messageForPlayer = Message.Create(MessagesTypesEnum.roomInitResponse); //TODO: send speakers positions
			ScheduleCallback(delegate () { player.Send(messageForPlayer); }, 50);
			ScheduleCallback(delegate () { 
				foreach(KeyValuePair<ulong, Position<uint, uint>> entry in usersPositions)
                {
					player.Send(MessagesTypesEnum.newUserJoined, entry.Key.ToString(), entry.Value.x, entry.Value.y); 
                }
			}, 5000);

			speakers.Add(player.Id);
			ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
			uint x = Convert.ToUInt32(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.x));
			uint y = Convert.ToUInt32(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.y));

			usersPositions.Add(playerInnerId, new Position<uint, uint>(x,y));
			//Broadcast(MessagesTypesEnum.newUserJoined, player.ConnectUserId, x, y);
			Broadcast(MessagesTypesEnum.newUserJoined, player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId).ToString(), x, y);

		}

		public override void UserLeft(Player player)
		{
			speakers.Remove(player.Id);
			SavePlayerPosition(player, true);

			Broadcast(MessagesTypesEnum.userLeft, player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId).ToString());
		}

		public override void GotMessage(Player player, Message message)
		{
			switch (message.Type)
			{
				case MessagesTypesEnum.move:
					{
						ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
						Position<uint, uint> pos = usersPositions[playerInnerId];
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
				case MessagesTypesEnum.shout:
					{
						ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
						string text = message.GetString(0);

						Broadcast(MessagesTypesEnum.processedShout, playerInnerId, text);
						break;
					}
				case MessagesTypesEnum.shoutReserve:
					{
						ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
						string text = message.GetString(0);

						Broadcast(MessagesTypesEnum.processedShoutReserve, player.ConnectUserId, text);
						break;
					}
				default:
					break;
			}
		}

		private void CheckConfigsSetUp()
		{
			PlayerIO.BigDB.Load(CONFIGS_TABLE, SERVER_CONFIG, delegate (DatabaseObject config) {
				if (config == null) return;

				int newMaxSpeakers = Convert.ToInt32(config.GetValue(MAX_SPEAKERS));
				int newUpdateTime = Convert.ToInt32(config.GetValue(UPDATE_TIME));

				if (newMaxSpeakers != maxSpeakers)
				{
					maxSpeakers = newMaxSpeakers;
				}

				if (newUpdateTime != updateTime)
				{
					updateTime = newUpdateTime;
					if (configTimer != null) configTimer.Stop();
					configTimer = AddTimer(delegate {
						CheckConfigsSetUp();
					}, updateTime);
				}
			});
		}

		private void SavePlayerPosition(Player player, bool removeFlag = false)
		{
			ulong playerInnerId = Convert.ToUInt64(player.PlayerObject.GetValue(PlayerObjectsFieldsEnum.innerId));
			Position<uint, uint> pos = usersPositions[playerInnerId];
			player.PlayerObject.Set(PlayerObjectsFieldsEnum.x, pos.x);
			player.PlayerObject.Set(PlayerObjectsFieldsEnum.y, pos.y);
			player.PlayerObject.Save();
			if (removeFlag) usersPositions.Remove(playerInnerId);
		}

	}
}
