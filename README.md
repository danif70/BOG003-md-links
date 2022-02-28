# Markdown Links

Markdown is a very popular lightweight markup language among developers. It is used in many platforms that handle plain text (GitHub, forums, blogs, ...), and it is very common to find several files in this format in any type of repository (starting with the traditional README.md).

These Markdown files usually contain links that are often broken or no longer valid, and that greatly harms the value of the information that you want to share.

md-links is a tool that uses Node.js, to read and parse files in Markdown format, to check the links they contain and to report some statistics.
The library allows you to extract all the links within a file of type Markdown (md), in addition, it identifies which are the response codes of the queries and perform statistics (broken links, unique and how many are totally)
To make use of the library you must install it from [NPM](https://www.npmjs.com/package/danielafunes_mdlinks), here are the details:

To install: 

*npm i danielafunes_mdlinks*

How to use:
  1. Type danielafunes_mdlinks + the path you want to query (it could be relative or absolute)
  2. If you also want to know if the web links work type *--validate* after the path
  3. For stats, type *--stats* after the path
  4. If you want stats of broken links type *--validate --stats* after de path

Author: [Daniela Funes] (https://github.com/Danif70)