#!/usr/bin/python

import SimpleHTTPServer
import SocketServer

# minimal web server.  serves files relative to the
# current directory.

PORT = 8003

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	print ' received, shutting down the web server'
	httpd.socket.close()