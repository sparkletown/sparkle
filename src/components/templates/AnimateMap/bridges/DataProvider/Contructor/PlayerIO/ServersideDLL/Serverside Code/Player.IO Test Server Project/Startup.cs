﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace DevelopmentTestServer {
	public static class Startup {
		static void Main() {
			// (Uncomment line to start server and make it simulate the user 'bob' connecting for 30 seconds)
			// (this is an easy way to debug serverside code)
			//
			// PlayerIO.DevelopmentServer.Server.StartWithDebugging("<Enter your gameid here>", "public", new Dictionary<string, string>() { { "userId", "bob" } }, null, "FridgeMagnets", null, null, 30000);

			// Start the server and wait for incomming connection
			PlayerIO.DevelopmentServer.Server.StartWithDebugging();
		}
	}
}
