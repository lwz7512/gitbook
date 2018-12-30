GitBook - TL version 
=======

gitbook library `true love` version @2018/12/30 based on gitbook v3.2.3


using [theme-default](https://github.com/lwz7512/theme-default) fix version to load asset file in document.


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

## Output your book

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

## Features

* Write using [Markdown](http://toolchain.gitbook.com/syntax/markdown.html) or [AsciiDoc](http://toolchain.gitbook.com/syntax/asciidoc.html)
* Output as a website or [ebook (pdf, epub, mobi)](http://toolchain.gitbook.com/ebook.html)
* [Multi-Languages](http://toolchain.gitbook.com/languages.html)
* [Lexicon / Glossary](http://toolchain.gitbook.com/lexicon.html)
* [Cover](http://toolchain.gitbook.com/ebook.html)
* [Variables and Templating](http://toolchain.gitbook.com/templating/)
* [Content References](http://toolchain.gitbook.com/templating/conrefs.html)
* [Plugins](http://toolchain.gitbook.com/plugins/)
* [Beautiful default theme](https://github.com/GitbookIO/theme-default)

## Publish your book

The platform [GitBook.com](https://www.gitbook.com/) is like an "Heroku for books": you can create a book on it (public, or private) and update it using **git push**.

## Licensing

GitBook is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.
