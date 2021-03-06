'use strict';

var config = require('./config'),
	path = require('path'),
	database = require('../../content/config/database'),
	appLog = require('../../content/config/logger'),
	logger,
	db,
	mongoose,
	periodicResources,
	appconfig;

var cli = function (argv) {
	var models,
		periodic = {};

	var loadConfig = function () {
		appconfig = new config();
		db = database[appconfig.settings().application.environment];
		mongoose = db.mongoose;
	};
	var useLogger = function () {
		logger = new appLog(appconfig.settings().application.environment);
		periodic.logger = logger;
		process.on('uncaughtException', function (err) {
			logger.error(err.message);
		});
	};
	var setupMongoDB = function () {
		models = require('../../content/config/model')({
			mongoose: db.mongoose,
			dburl: db.url,
			debug: appconfig.settings().debug,
			periodic: periodic
		});
	};
	var setResources = function () {
		periodicResources = {
			logger: logger,
			settings: appconfig.settings(),
			db: db,
			mongoose: mongoose
		};
	};
	var loadScript = function (argv) {
		if (argv.controller) {
			try {
				var cliController = require('../controller/' + argv.controller)(periodicResources);
				cliController.cli(argv);
			}
			catch (e) {
				logger.error(e);
				logger.error(e.stack);
				process.exit(0);
			}
		}
		else if (argv.extension) {
			try {
				var cliExtension = require(path.resolve(process.cwd(), './node_modules/periodicjs.ext.' + argv.extension + '/cli'))(periodicResources);
				cliExtension.cli(argv);
			}
			catch (e) {
				logger.error(e);
				logger.error(e.stack);
				process.exit(0);
			}
		}
		else {
			logger.error('no valid arguments', argv);
			process.exit(0);
		}
		//node index.js --cli --controller theme --install true --name "typesettin/periodicjs.theme.minimal" --version latest
		//node index.js --cli --controller theme --install true --name "typesettin/periodicjs.theme.minimal" --version latest
		// var Item = mongoose.model('Item');
		// Item.find({}).limit(2).exec(function(err,items){ if(err){ console.error(err); } else{ console.info(items); } });
	};

	var init = function (argv) {
		loadConfig();
		useLogger();
		setupMongoDB();
		mongoose.connection.on('open', function () {
			setResources();
			loadScript(argv);
		});
	};

	init(argv);
};

module.exports = cli;
