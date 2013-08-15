Tentacles: Realtime Network Visualization Tool
==============================================

What is it?
-----------
Tentacles is a tool for visualizing network traffic in realtime, allowing you to see what machines your computer or network is talking to at any given point in time, and whose networks your packets are traversing to get there.

What's it for?
--------------
Tentacles has a multitude of uses:
 * Debug connectivity issues
 * Watch changes in network topology as they happen
 * Keep an eye out for software that phones home, hidden tracking networks on websites, etc
 * Monitor a network for suspicious behavior, and identify attack patterns
 * Peer into the inner workings of backbone providers
 * Indulge your paranoid "If I were the NSA..." wiretapping fantasies

How does it work?
-----------------
Tentacles runs a Python data collector on your server, which uses pcap to watch for any newly-established connections.  As new connections are noticed, we start asynchronously gathering information about that IP - reverse dns, network owner, and a traceroute to that host.  This information is fed to the web-based frontend which keeps an upated map of what hosts you're talking to, and which networks are involved in the conversation.

Is it done?
-----------
Nope.  Tentacles is still a work in progress.  The web UI is roughly complete, but the server-side data collection needs work.

Who is responsible for this?
----------------------------
Tentacles was originally written by James Baicoianu.  The code is released under the terms of the MIT license.
