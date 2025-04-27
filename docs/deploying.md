In the server, create a user content folder and a `.env` file. Make sure the
environment variables defined in the latter indicate the served origin and the
address of the database correctly.

If there is no existing database, a new one needs to be made that matches the
schema.

In the development environment, build the app:

```sh
bun run build
```

Then load it in the server:

```sh
rsync -avz build/ doggy@server.example:/furever/
```

<!-- /home/santi/fur/furever/ -->

You can set up a `systemd` service to keep the server software online:

```ini
[Unit]
Description=FureverHome Server
After=network.target

[Service]
ExecStart=/usr/bin/bun run /furever
WorkingDirectory=/
Restart=always
User=doggy

[Install]
WantedBy=multi-user.target
```
