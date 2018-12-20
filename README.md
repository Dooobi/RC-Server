# RC-Server

Use ```sudo npm install --unsafe-perm``` to install.<br>
Use ```sudo node server.js``` to start.<br>

# G-Streamer Notizen

GStreamer pipelines:

H.264 Stream aus der C920 und mit RTP und UDP auf Server schicken:
gst-launch-1.0 uvch264src average-bitrate=1000000 iframe-period=1000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=1920,height=1080,framerate=30/1,profile=constrained-baseline ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink sync=false host= your.server.ip port=5000 

Server empfängt über UDP und sendet an lokalen MediaServer:
gst-launch-1.0 udpsrc caps="application/x-rtp,payload=127" port=5000 ! rtph264depay ! capsfilter caps="video/x-h264,width=1920,height=1080" ! flvmux streamable=true ! rtmpsink location='rtmp://127.0.0.1:1935/live1/sers'

Direkt von Kamera an lokalen MediaServer:
--gst-launch-1.0 uvch264src average-bitrate=1000000 iframe-period=1000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=1920,height=1080,framerate=30/1,profile=constrained-baseline ! h264parse 
gst-launch-1.0 v4l2src device=/dev/video0 ! x264enc ! flvmux streamable=true ! rtmpsink location='rtmp://127.0.0.1:1935/live/sers'

Direkt von Kamera über TCP an Host:
gst-launch-1.0 v4l2src device=/dev/video0 ! vp8enc ! webmmux ! tcpserversink host=http://192.168.0.11 port=8080

H.264 Stream aus der C920 und mit RTP und UDP auf Server schicken:
gst-launch-1.0 uvch264src average-bitrate=1000000 iframe-period=1000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=1920,height=1080,framerate=30/1,profile=constrained-baseline ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink sync=false host= your.server.ip port=5000

H.264 Stream aus der C920 und mit RTP und UDP auf Server (Janus) schicken:
gst-launch-1.0 uvch264src average-bitrate=1000000 iframe-period=1000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=1920,height=1080,framerate=30/1,profile=constrained-baseline ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink host=192.168.0.202 port=8004
gst-launch-1.0 uvch264src average-bitrate=1000000 iframe-period=1000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=1280,height=720,framerate=20/1,profile=constrained-baseline ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink host=192.168.0.202 port=8004
gst-launch-1.0 uvch264src average-bitrate=1000000 device=/dev/video0 name=src auto-start=true src.vidsrc ! video/x-h264,width=640,height=480,framerate=5/1,profile=constrained-baseline ! h264parse ! rtph264pay ! udpsink host=192.168.0.51 port=8004

Testvideo mit RTP und UDP auf Server (Janus) schicken:
gst-launch-1.0 videotestsrc ! x264enc ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink host=192.168.0.202 port=8004

H.264 Stream aus nicht H264 kompatibler Kamera encoden und mit RTP und UDP auf Server (Janus) schicken:
gst-launch-1.0 autovideosrc ! x264enc ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink host=192.168.0.202 port=8004

H.264 Stream aus mp4-Datei encoden und mit RTP und UDP auf Server (Janus) schicken:
gst-launch-1.0 filesrc location='/home/pi/Videos/Accel World - Episode 21.mp4' ! qtdemux ! h264parse ! rtph264pay pt=127 config-interval=2 ! udpsink host=192.168.0.202 port=8004


gst-launch-1.0 udpsrc ! autovideosink

sudo mv janus.plugin.streaming.cfg /opt/janus/etc/janus/

sudo ./janus -F /opt/janus/etc/janus/

v4l2-ctl --list-devices
v4l2-ctl --list-ctrls --device=/dev/video0
v4l2-ctl --set-ctrl=focus_auto=0

