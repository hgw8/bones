# Bones 

#### node.js IRC bot framework

Bones is the base framework I use for creating multithreaded IRC bots, originally developed as a way to hugely improve on the speeds of earlier versions of mercury (which were not multithreaded and was very slow)

## Deployment

Instructions are general and assume you have already developed something with this framework, not a whole lot of point trying to run this as it is.

1. Have Docker (required) and Docker Compose (optional, but strongly recommended, this guide assumes you have it) installed already.
2. Rename `config/example.default.json` to `config/default.json` and modify it accordingly. A list of variables and their descriptions can be found in this repos wiki. You do not need to do anything with `example.usersettings.json` unless you wish to predefine settings prior to the bots first start, the usersettings file will be made on the first run if it does not exist.
3. You may also want to edit the container names in the `docker-compose.yml` file accordingly. (Optional but recommended)
4. Run `docker compose up` to begin. Append `-d` to start in the background and `--build` for the first run and subsequent starts after edits have been made. If you begin the bot with `-d` you can run `docker compose logs -f` to see live logs.

## Support

If you need assistance with installation or usage, you are more than welcome to contact me in #5000 on `irc.supernets.org`

## License

This framework is licensed under the ISC License