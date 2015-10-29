//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/connorhu/twig.js

var Twig = (function (Twig) {
    "use strict";
    // ## twig.lexer.js
    //
    // Lexer alayzer

    Twig.lexer = {};
    
    Twig.lexer.tags = {
        comment: ['{#', '#}'],
        block: ['{%', '%}'],
        variable: ['{{', '}}'],
        whitespaceTrim: '-',
        interpolation: ['#{', '}']
    };
    
    var regexp = {
        name: '/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/A',
        string: '/"([^#"\\\\]*(?:\\\\.[^#"\\\\]*)*)"|\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'/As',
        DQStringDelimiter: '/"/A',
        DQStringPart: '/[^#"\\\\]*(?:(?:\\\\.|#(?!\{))[^#"\\\\]*)*/As',
        punctuation: '()[]{}?:.,|',
        
        lexVar: new RegExp('\s*'+ preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.variable[1], '/') +'\s*|\s*'+ preg_quote(Twig.lexer.tags.variable[1], '/')), // A flag?
        lexBlock: new RegExp('/\s*(?:'+ preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.variable[1], '/') +'\s*|\s*'+ preg_quote(Twig.lexer.tags.variable[1], '/') +')\n?'), // A flag?
        // 'lex_block' => '/\s*(?:'.preg_quote($this->options['whitespace_trim'].$this->options['tag_block'][1], '/').'\s*|\s*'.preg_quote($this->options['tag_block'][1], '/').')\n?/A',
        // 'lex_raw_data' => '/('.preg_quote($this->options['tag_block'][0].$this->options['whitespace_trim'], '/').'|'.preg_quote($this->options['tag_block'][0], '/').')\s*(?:end%s)\s*(?:'.preg_quote($this->options['whitespace_trim'].$this->options['tag_block'][1], '/').'\s*|\s*'.preg_quote($this->options['tag_block'][1], '/').')/s',
        // 'operator' => $this->getOperatorRegex(),
        // 'lex_comment' => '/(?:'.preg_quote($this->options['whitespace_trim'], '/').preg_quote($this->options['tag_comment'][1], '/').'\s*|'.preg_quote($this->options['tag_comment'][1], '/').')\n?/s',
        // 'lex_block_raw' => '/\s*(raw|verbatim)\s*(?:'.preg_quote($this->options['whitespace_trim'].$this->options['tag_block'][1], '/').'\s*|\s*'.preg_quote($this->options['tag_block'][1], '/').')/As',
        // 'lex_block_line' => '/\s*line\s+(\d+)\s*'.preg_quote($this->options['tag_block'][1], '/').'/As',
        lexTokensStart: new RegExp('('+ preg_quote(Twig.lexer.tags.variable[0], '/') +
                        '|'+ preg_quote(Twig.lexer.tags.block[0], '/') +
                        '|'+ preg_quote(Twig.lexer.tags.comment[0], '/') +
                        ')('+ preg_quote(Twig.lexer.tags.whitespaceTrim, '/') +')?', 'g') // s flag? dotall
        // lex
        // 'interpolation_start' => '/'.preg_quote($this->options['interpolation'][0], '/').'\s*/A',
        // 'interpolation_end' => '/\s*'.preg_quote($this->options['interpolation'][1], '/').'/A',
    };
    Twig.lexer.regexp = regexp;
    
    Twig.lexer.states = {
        data: 0,
        block: 1,
        var: 2,
        string: 3,
        interpolation: 4
    }
    
    Twig.token.tokens = {
        eof: -1,
        text: 0,
        blockStart: 1,
        varStart: 2,
        blockEnd: 3,
        varEnd: 4,
        name: 5,
        number: 6,
        string: 7,
        operator: 8,
        punctuation: 9,
        interpolationStart: 10,
        interpolationEnd: 11
    }

    var code;
    
    var cursor = 0;
    var end;
    var lineNumber = 1;

    var state = Twig.lexer.states.data;

    var states = [];
    var tokens = [];
    var brackets = [];
    var positions = [[], []];

    var position = -1;

    // tokenizer state machine
    Twig.lexer.tokenize = function (c, filename) {
        code = c.replace(/\r\n*/, "\n");
        end = code.length
        
        var match;
        
        while (match = regexp.lexTokensStart.exec(code)) {
            
            positions[0].push({
                type: match[1],
                index: match.index
            });

            var whitespaceMatch = {};
            if (match[2]) {
                whitespaceMatch = {
                    type: match[2],
                    index: match.index + match[1].length
                };
            }
            positions[1].push(whitespaceMatch);
        }
        
        while (cursor < end) {
            
            switch (state) {
                case Twig.lexer.states.data:
                    Twig.lexer.analyzeData();
                    break;
            }
            
            console.log(tokens);
            
            return;
        }
        
        pushToken(Twig.token.tokens.eof);
    };
    
    Twig.lexer.analyzeData = function () {
        
        // if no matches are left we return the rest of the template as simple text token
        if (position == positions[0].length -1) {
            pushToken(Twig.token.tokens.text, code.substr(cursor));
            cursor = end;
            return;
        }

        ++position;

        // Find the first token after the current cursor
        var currentPosition = positions[0][position];
        var currentPositionWhitespace = positions[1][position];
        while (currentPosition[1] < cursor) {
            if (position == positions[0].length - 1) {
                return;
            }
            currentPosition = positions[0][position];
            currentPositionWhitespace = positions[1][position];
            ++position;
        }
        
        // push the template text first
        var text, textContent;
        text = textContent = code.substr(cursor, position - cursor);
        if (typeof positions[1][position].type !== 'undefined') {
            text = text.trimRight();
        }
        
        pushToken(Twig.token.tokens.text, text);
        moveCursor(textContent + currentPosition.type + (typeof currentPositionWhitespace.type !== 'undefined' ? currentPositionWhitespace.type : ''));

        switch (positions[0][position].type) {
            case Twig.lexer.tags.comment[0]:
                Twig.lexer.analyzeComment();
                break;

            case Twig.lexer.tags.block[0]:
                console.log('');
                //     case $this->options['tag_block'][0]:
                //         // raw data?
                //         if (preg_match($this->regexes['lex_block_raw'], $this->code, $match, null, $this->cursor)) {
                //             $this->moveCursor($match[0]);
                //             $this->lexRawData($match[1]);
                //         // {% line \d+ %}
                //         } elseif (preg_match($this->regexes['lex_block_line'], $this->code, $match, null, $this->cursor)) {
                //             $this->moveCursor($match[0]);
                //             $this->lineno = (int) $match[1];
                //         } else {
                //             $this->pushToken(Twig_Token::BLOCK_START_TYPE);
                //             $this->pushState(self::STATE_BLOCK);
                //             $this->currentVarBlockLine = $this->lineno;
                //         }
                //         break;
                break;

            case Twig.lexer.tags.variable[0]:
                console.log('');
                //         $this->pushToken(Twig_Token::VAR_START_TYPE);
                //         $this->pushState(self::STATE_VAR);
                //         $this->currentVarBlockLine = $this->lineno;
                break;
        }
    }

    Twig.lexer.analyzeBlock = function () {
        
    }

    Twig.lexer.analyzeVar = function () {
        
    }

    Twig.lexer.analyzeExpression = function () {
        
    }

    Twig.lexer.analyzeRawData = function () {
        
    }

    Twig.lexer.analyzeComment = function () {
        // if (!preg_match($this->regexes['lex_comment'], $this->code, $match, PREG_OFFSET_CAPTURE, $this->cursor)) {
        //     throw new Twig_Error_Syntax('Unclosed comment', $this->lineno, $this->filename);
        // }
        //
        // $this->moveCursor(substr($this->code, $this->cursor, $match[0][1] - $this->cursor).$match[0][0]);
    }

    Twig.lexer.analyzeString = function () {
        
    }

    Twig.lexer.analyzeInterpolation = function () {
        
    }
    
    function preg_quote(str, delimiter) {
        // discuss at: http://phpjs.org/functions/preg_quote/
        // original by: booeyOH
        // improved by: Ates Goral (http://magnetiq.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Onno Marsman
        //   example 1: preg_quote("$40");
        //   returns 1: '\\$40'
        //   example 2: preg_quote("*RRRING* Hello?");
        //   returns 2: '\\*RRRING\\* Hello\\?'
        //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
        //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

        return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    }
    
    function pushToken(type, content) {
        tokens.push({
            type: type,
            content: content || ''
        });
    }
    
    function moveCursor(text)
    {
        cursor += text.length;
        lineNumber += text.split("\n").length - 1;
    }
    
    return Twig;

}) (Twig || { });

