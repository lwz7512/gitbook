/* eslint-disable no-console */

var tinylr = require('tiny-lr');
var open = require('open');
var path = require('path');

var Parse = require('../parse');
var Output = require('../output');
var ConfigModifier = require('../modifiers').Config;

var Promise = require('../utils/promise');
var fs = require('../utils/fs');
var options = require('./options');
var getBook = require('./getBook');
var getOutputFolder = require('./getOutputFolder');
var Server = require('./server');
var watch = require('./watch');

// 2018/11/21
var Page = require('../models/page');
var generatePage = require('../output/generatePage');
var parsePage = require('../parse/parsePage');



var server, lrServer, lrPath, _outputFolder, _output, _generator;



function parseFilePage(book, filePath) {
    var fs = book.getContentFS();
    return fs.statFile(filePath)
    .then(
        function(file) {
            var page = Page.createForFile(file);
            return parsePage(book, page);
        },
        function(err) {
            // file doesn't exist
            return null;
        }
    )
    .fail(function(err) {
        console.log(err)
        var logger = book.getLogger();
        logger.error.ln('error while parsing page "' + filePath + '":');
        throw err;
    });
}


function waitForCtrlC() {
    var d = Promise.defer();

    process.on('SIGINT', function() {
        d.resolve();
    });

    return d.promise;
}

/**
 * finally workable md regeneration function
 * @2018/12/30
 * 
 * @param {*} book, result book
 * @param {*} readmemd, README.md
 */
function regeneratePage(book, readmemd) {
    var logger = book.getLogger();
    logger.debug.ln('regenerate pages...');
    var pages = _output.getPages();
    logger.debug.ln('pages size: ', pages.size);

    // FIXME, remove `docs/`
    // TODO, HERE NEED TO IMPROVE...@2018/12/29
    var pageKey = readmemd.substr(readmemd.indexOf('/')+1);
    var orgParsedPage = pages.get(pageKey);

    logger.debug.ln('reparsing page... ');
    // newly parsed page
    parseFilePage(book, pageKey).then(modpage => {
        pages.set(pageKey, modpage);// update pages map
    
        logger.debug.ln('regenerating page... ');
        generatePage(_output, modpage)// regenerate changed page
        .then(function(resultPage) {
            logger.debug.ln('>>> page redenered!');
            return _generator.onPage(_output, resultPage).then(what => {
                logger.debug.ln('>>> page file created !');
                logger.debug.ln('>>> notify lrserver refresh....');
                lrServer.changed({body: {files: [lrPath]}});// until now to notify...@2018/12/29
            });
        })
        .fail(function(err) {
            logger.error.ln('error while generating page "' + file.getPath() + '":');
            throw err;
        });
    });
}

/**
 * copy asset file...
 * @2018/12/30
 * 
 * @param {*} book 
 * @param {*} asset 
 */
function copyAssetFile(book, asset) {
    // need to remove `docs/`
    var assetFile = asset.substr(asset.indexOf('/')+1);
    var outputPath = path.resolve(_outputFolder, assetFile);
    var bookFS = book.getContentFS();
    var logger = book.getLogger();
    logger.debug.ln('copy asset: ', asset);
    
    fs.ensureFile(outputPath)
    .then(function() {
        return bookFS.readAsStream(assetFile)
        .then(function(stream) {
            logger.debug.ln('>>> asset file copyied !');
            return fs.writeStream(outputPath, stream);
        });
    });
}

/**
 * Watch the RESULT book ONLY!
 * then copy or regenerate it!
 * first refactoring @2018/11/01,16, in weihai city, china
 * 
 * then try again in 12/27 at halifax, canada
 * FINALLY, succeed in 2018/12/29
 * 
 * @param {*} book 
 */
function watchBook(book) {
  var logger = book.getLogger();

  return watch(book.getRoot())
  .then(function(filepath) {
      // set livereload path
      lrPath = filepath;

      logger.debug.ln(' >>>>>>>>>>>>>> Changed in file: ', filepath, '  <<<<<<<<<<<<<<<');
      var isREADME = filepath.indexOf('README')>-1?true:false;
      if(isREADME) {
        regeneratePage(book, filepath);
      } else {
        copyAssetFile(book, filepath);
      }

      logger.debug.ln('>>> reStarting server ...');
      return watchBook(book);
  });
}

function generateBook(args, kwargs) {
    // save the folder for file change copy @2018/11/16
    _outputFolder = getOutputFolder(args);

    var book = getBook(args, kwargs);
    var logger=book.getLogger();
    // logger.debug.ln('outputFolder: ', _outputFolder);
    logger.debug.ln('1. serve.generateBook: ', kwargs.format);
    var port = kwargs.port;
    var Generator = Output.getGenerator(kwargs.format);
    _generator = Generator; // save for later use @2018/11/22
    logger.debug.ln('1.1 generator name: ', _generator.name);
    
    var browser = kwargs['browser'];

    var hasWatch = kwargs['watch'];
    var hasLiveReloading = kwargs['live'];
    var hasOpen = kwargs['open'];
    logger.debug.ln('hasLiveReloading: ', hasLiveReloading);
    // Stop server if running
    if (server.isRunning()) console.log('Stopping server');

    // FIXME, USE THIS TO WATCH! @2018/12/29
    var watchedBook;

    return server.stop()
    .then(function() {
        return Parse.parseBook(book)
        .then(function(resultBook) {
            if (hasLiveReloading) {
                // Enable livereload plugin
                var config = resultBook.getConfig();
                config = ConfigModifier.addPlugin(config, 'livereload');
                resultBook = resultBook.set('config', config);
                watchedBook = resultBook;// saved!
            }
            logger.debug.ln('2. Output.generate ...');
            // *** core function ***
            // output/generateBook()
            return Output.generate(Generator, resultBook, {
                root: _outputFolder
            }).then(function(op) {// save the output @2018/11/19
              console.log('output saved !');
              _output = op;
              // console.log(output.getRoot());
              // console.log(output.getGenerator());
            });
        });
    })
    .then(function() {
        console.log();
        console.log('>>> Starting server ...');
        return server.start(_outputFolder, port);
    })
    .then(function() {
        console.log('Serving book on http://localhost:'+port);
        console.log('lrPath: ', lrPath);
        console.log('hasLiveReloading: ', hasLiveReloading);
        // NOTE: first run without watch for no lrPath!
        // if (lrPath && hasLiveReloading) {
        //     logger.debug.ln('live server work on: ', lrPath);
        //     // trigger livereload
        //    lrServer.changed({body: {files: [lrPath]}});
        // }

        if (hasOpen) {
            open('http://localhost:'+port, browser);
        }
    })
    .then(function() {
        logger.debug.ln('hasWatch: ', hasWatch)
        if (!hasWatch) {
            return waitForCtrlC();
        }
        // FIXME, use recursive function here instead of generateBook
        // @2018/11/01
        return watchBook(watchedBook);
    });
}

module.exports = {
    name: 'serve [book] [output]',
    description: 'serve the book as a website for testing',
    options: [
        {
            name: 'port',
            description: 'Port for server to listen on',
            defaults: 4000
        },
        {
            name: 'lrport',
            description: 'Port for livereload server to listen on',
            defaults: 35729
        },
        {
            name: 'watch',
            description: 'Enable file watcher and live reloading',
            defaults: true
        },
        {
            name: 'live',
            description: 'Enable live reloading',
            defaults: true
        },
        {
            name: 'open',
            description: 'Enable opening book in browser',
            defaults: false
        },
        {
            name: 'browser',
            description: 'Specify browser for opening book',
            defaults: ''
        },
        options.log,
        options.format
    ],
    exec: function(args, kwargs) {
        server = new Server();
        var hasWatch = kwargs['watch'];
        var hasLiveReloading = kwargs['live'];

        return Promise()
        .then(function() {
            if (!hasWatch || !hasLiveReloading) {
                return;
            }

            lrServer = tinylr({});
            return Promise.nfcall(lrServer.listen.bind(lrServer), kwargs.lrport)
            .then(function() {
                console.log('Live reload server started on port:', kwargs.lrport);
                console.log('Press CTRL+C to quit ...');
                console.log('');

            });
        })
        .then(function() {
            return generateBook(args, kwargs);
        });
    }
};
