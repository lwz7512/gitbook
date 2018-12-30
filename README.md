GitBook - TL version 
=======

gitbook library `true love` version @2018/12/30 based on gitbook v3.2.3


using [theme-default](https://github.com/lwz7512/theme-default) fix version to load asset file in document.

[DEMO](http://yanhuang.space/)


## Features at 3.2.4

* Large scale page generation.
* drill down navigation in page content.
* page auto generation and refresh after change.
* asset file auto copy after change.


## Features below 3.2.3

* mobile screen support
* Write using [Markdown](http://toolchain.gitbook.com/syntax/markdown.html) or [AsciiDoc](http://toolchain.gitbook.com/syntax/asciidoc.html)
* Output as a website or [ebook](http://toolchain.gitbook.com/ebook.html)
* [Multi-Languages](http://toolchain.gitbook.com/languages.html)
* [Lexicon / Glossary](http://toolchain.gitbook.com/lexicon.html)
* [Cover](http://toolchain.gitbook.com/ebook.html)
* [Variables and Templating](http://toolchain.gitbook.com/templating/)
* [Content References](http://toolchain.gitbook.com/templating/conrefs.html)
* [Plugins](http://toolchain.gitbook.com/plugins/)
* [Beautiful default theme](https://github.com/GitbookIO/theme-default)


## Installation

```
# install command tool
$ npm install -g gitbook-cli
$ cd ~/your/work/path
# install gitbook library
$ git clone https://github.com/lwz7512/gitbook.git
# install dependency
$ yarn
# assign your cloned gitbok as latest version
$ gitbook alias ~/your/work/path/gitbook latest
```

## Creat your book with mobile screen support

```
$ gitbook init mybook
$ cd mybook
$ gitbook serve --gitbook=latest --log=debug
# then open browser to view your book, modify and see auto-refresh result..
```

## Conventions for book config

1. create `book.json` in your book directory

```
{
  "title": "Your Book Title",
  "root": "./docs",
}

```

> root property MUST BE `./docs` currently!

if you create chinese content, add "language": "zh" below the "root": "./docs"

2. MOVE all the content into `./docs` directory include README.md, SUMMARY.md ....

a typical book directory structure is:

```
|- mybook
    |- docs
       - README.md
       - SUMMARY.md
       |- chapter1
         - README.md
         - some-html-snippet.html
         - ormarkdown.md
         - ...
       |- chapter2
       |- chaptern
       ...
```


3. `SUMMARY.md` include all the chapter's `README.md`  like this:

```
# 栏目汇总


* [Part I - 文荟苑](./part1/README.md)

* [Part Ⅳ - 争鸣录](part4/README.md)

* [Part Ⅴ - 口述史](part5/README.md)

* [Part Ⅶ - 文章精萃](part7/README.md)

```

4. EACH chapter or part include ONE `README.md` file, and this file reference all the asset file in this chapter, or the asset file can be invisible.




## Output/Publish your book

in your book directory:

```
$ gitbook build --log=debug
```
_book directory holds the generated web pages...

or outside your book directory:

```
$ gitbook build ./ ./output --log=debug
```

book are generated as web pages in mybook/output directory.


## Usage examples

GitBook can be used to create book, public documentation, enterprise manual, thesis, research papers, etc.

You can find a [list of real-world examples](docs/examples.md) in the documentation.

## Help and Support

We're always happy to help out with your books or any other questions you might have. You can ask a question on the following contact form at [gitbook.com/contact](https://www.gitbook.com/contact) or signal an issue on [GitHub](https://github.com/GitbookIO/gitbook).


## Publish your book

The platform [GitBook.com](https://www.gitbook.com/) is like an "Heroku for books": you can create a book on it (public, or private) and update it using **git push**.

## Licensing

GitBook is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.
