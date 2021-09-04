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
		// server messages
		public const string processedMove = "a";
		public const string processedMoveReserve = "ar";
		//public const string requestInnerId = "b";
		public const string divideSpeakers = "d";
		public const string roomInitResponse = "i";
		public const string newUserJoined = "j";
		public const string userLeft = "l";
		public const string processedShout = "s";
		public const string processedShoutReserve = "sr";
		public const string unitListeners = "u";
		// users messages
		//public const string innerId = "x";
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

	public class Player : BasePlayer
	{
		public uint x;
		public uint y;
		public bool isSpeaker;
		protected ulong _innerId;
		public ulong InnerId
        {
			get
			{
				if (_innerId > 0)
					return _innerId;

				_innerId = (ulong) this.PlayerObject.GetLong(PlayerObjectsFieldsEnum.innerId, 0);

				if (_innerId <= 0)
				{
					//this.Send(MessagesTypesEnum.requestInnerId);
					throw new Exception("Inner id not exist " + this.ConnectUserId);
				}
				return _innerId;
			}
            set
            {
				_innerId = value;
				this.PlayerObject.Set(PlayerObjectsFieldsEnum.innerId, value);
				this.PlayerObject.Save();
			}
        }
	}

	[RoomType(RoomTypesEnum.Zone)]
	public class GameCode : Game<Player>
    {
		const string CONFIGS_TABLE = "Configs";
		const string SERVER_CONFIG = "servers";

		const string MAX_SPEAKERS = "maxSpeakers";
		const string UPDATE_TIME = "updateTime";

		// room configs
		private int maxSpeakers = 55;
		private int updateTime = 300000;
		private Timer configTimer;
		private bool isClosedAndDivided = false;

		// room state
		private int speakersCount;

		public override void GameStarted()
        {
			PreloadPlayerObjects = true;

			PlayerIO.BigDB.Load(CONFIGS_TABLE, SERVER_CONFIG, delegate (DatabaseObject config) {
				if (config == null) return;

				maxSpeakers = config.GetInt(MAX_SPEAKERS);
				updateTime = config.GetInt(UPDATE_TIME);
			});

			configTimer = AddTimer(delegate {
				CheckConfigsSetUp();
			}, updateTime);
        }

        public override void GameClosed() {
			//todo: save speakers position
		}
		public override bool AllowUserJoin(Player player)
		{
			if (isClosedAndDivided)
            {
				player.Send(MessagesTypesEnum.divideSpeakers);
				return false;
			}

			bool needDivide = player.JoinData["isMain"] == "true" && CountSpeakers() >= maxSpeakers;

			if (needDivide)
            {
				player.Send(MessagesTypesEnum.divideSpeakers);
				DivideSpeakers(true);
			}

			return !needDivide;
		}

		public override void UserJoined(Player player) {

			ScheduleCallback(delegate () { 
				foreach (Player user in Players)
                {
					player.Send(MessagesTypesEnum.newUserJoined, user.ConnectUserId, user.x, user.y);
				}
			}, 5000);

			if (player.JoinData["isMain"] == "true")
			{
				player.isSpeaker = true;
				player.x = player.PlayerObject.GetUInt(PlayerObjectsFieldsEnum.x, 0);
				player.y = player.PlayerObject.GetUInt(PlayerObjectsFieldsEnum.y, 0);
				Broadcast(MessagesTypesEnum.newUserJoined, player.ConnectUserId, player.x, player.y);
			}

		}

		public override void UserLeft(Player player)
		{
			if (player.JoinData["isMain"] == "true")
			{
				SavePlayerPosition(player, true);
			}

			Broadcast(MessagesTypesEnum.userLeft, player.ConnectUserId);
		}

		public override void GotMessage(Player player, Message message) {
			switch (message.Type) {
				case MessagesTypesEnum.move: {
						player.x = message.GetUInt(0);
						player.y = message.GetUInt(1);

						Broadcast(MessagesTypesEnum.processedMove, player.InnerId, player.x, player.y);
						break;
					}
				case MessagesTypesEnum.moveReserve:
					{
						player.x = message.GetUInt(0);
						player.y = message.GetUInt(1);

						Broadcast(MessagesTypesEnum.processedMove, player.ConnectUserId, player.x, player.y);
						break;
					}
				case MessagesTypesEnum.shout:
					{
						string text = message.GetString(0);

						Broadcast(MessagesTypesEnum.processedShout, player.InnerId, text);
						break;
					}
				case MessagesTypesEnum.shoutReserve:
					{
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

				int newMaxSpeakers = config.GetInt(MAX_SPEAKERS, maxSpeakers);
				int newUpdateTime = config.GetInt(UPDATE_TIME, updateTime);

				if (newMaxSpeakers != maxSpeakers)
				{
					maxSpeakers = newMaxSpeakers;
					DivideSpeakers();
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

		private void DivideSpeakers(bool hardFlag = false)
		{
			if (CountSpeakers() <= maxSpeakers && !hardFlag) return;

			Broadcast(MessagesTypesEnum.divideSpeakers);
			this.isClosedAndDivided = true;

			ScheduleCallback(delegate () {
				foreach (Player player in Players)
				{
					SavePlayerPosition(player);
					player.Disconnect();
				}
			}, 10000);
		}

		private void SavePlayerPosition(Player player, bool removeFlag = false)
		{
			player.PlayerObject.Set(PlayerObjectsFieldsEnum.x, player.x);
			player.PlayerObject.Set(PlayerObjectsFieldsEnum.y, player.y);
			player.PlayerObject.Save();
		}

		private int CountSpeakers()
		{
			speakersCount = 0;
			foreach (Player user in Players)
			{
				if (user.isSpeaker) speakersCount++;
			}
			return speakersCount;
		}
	}
}
