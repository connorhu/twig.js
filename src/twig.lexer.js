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
        name: new RegExp('^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'), // flag A
        string: new RegExp('^"([^#"\\\\]*(?:\\\\.[^#"\\\\]*)*)"|^\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\''), // flag As
        number: new RegExp('^[0-9]+(?:\.[0-9]+)?'), // flag A
        DQStringDelimiter: new RegExp('^"'), // flag A
        DQStringPart: '/[^#"\\\\]*(?:(?:\\\\.|#(?!\{))[^#"\\\\]*)*/As',
        punctuation: '()[]{}?:.,|',
        
        lexVar: new RegExp('^\\\s*'+ preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.variable[1], '/') 
                        +'\\\s*|\\\s*'+ preg_quote(Twig.lexer.tags.variable[1], '/')), // flag A == ^ ?
        lexBlock: new RegExp('^\\\s*(?:'+ preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.block[1], '/') +'\\\s*|\\\s*'+
                         preg_quote(Twig.lexer.tags.block[1], '/') +')\n?'), // flag A == ^ ?
        lexRawData: new RegExp('('+ preg_quote(Twig.lexer.tags.block[0] + Twig.lexer.tags.whitespaceTrim, '/') 
                        +'|'+ preg_quote(Twig.lexer.tags.block[0], '/') + 
                        +')\s*(?:end%s)\s*(?:'+ preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.block[1], '/') 
                        +'\s*|\s*'+ preg_quote(Twig.lexer.tags.block[1], '/') +')'), // flag s?
        
        operator: getOperatorRegex(),

        lexComment: new RegExp('(?:'+ preg_quote(Twig.lexer.tags.whitespaceTrim , '/') 
                        + preg_quote(Twig.lexer.tags.comment[1], '/') +'\s*|'
                        + preg_quote(Twig.lexer.tags.comment[1], '/') +')\n?', 'm'), // flag s?
        lexBlockRaw: new RegExp('^\s*(raw|verbatim)\s*(?:'
                        + preg_quote(Twig.lexer.tags.whitespaceTrim + Twig.lexer.tags.block[1], '/') + '\s*|\s*'
                        + preg_quote(Twig.lexer.tags.block[1], '/') +')'), // flag As?
        lexBlockLine: new RegExp('^\s*line\s+(\d+)\s*'+ preg_quote(Twig.lexer.tags.block[1], '/')), // flag As?
        lexTokensStart: new RegExp('('+ preg_quote(Twig.lexer.tags.variable[0], '/') +
                        '|'+ preg_quote(Twig.lexer.tags.block[0], '/') +
                        '|'+ preg_quote(Twig.lexer.tags.comment[0], '/') +
                        ')('+ preg_quote(Twig.lexer.tags.whitespaceTrim, '/') +')?', 'g'), // s flag?

        interpolationStart: new RegExp('^'+ preg_quote(Twig.lexer.tags.interpolation[0], '/') +'\s*'), // flag A == ^ ?
        interpolationEnd: new RegExp('^\s*'+ preg_quote(Twig.lexer.tags.interpolation[1], '/')) // flag A == ^ ?
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

    var code, codePart;
    
    var cursor = 0;
    var end;
    var lineNumber = 1;

    var state = Twig.lexer.states.data;

    var states = [];
    var tokens = [];
    var brackets = [];
    var positions = [[], []];

    var position = -1;
    var filename;
    var currentVarBlockLine;

    // tokenizer state machine
    Twig.lexer.tokenize = function (c, file) {
        filename = file;
        codePart = code = c.replace(/\r\n*/, "\n");
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
        
        // var i = 0;
        while (cursor < end) {
            // console.log(state);
            switch (state) {
                case Twig.lexer.states.data:
                    Twig.lexer.analyzeData();
                    break;

                case Twig.lexer.states.block:
                    Twig.lexer.analyzeBlock();
                    break;

                case Twig.lexer.states.var:
                    Twig.lexer.analyzeVar();
                    break;

                case Twig.lexer.states.string:
                    Twig.lexer.analyzeString();
                    break;

                case Twig.lexer.states.interpolation:
                    Twig.lexer.analyzeInterpolation();
                    break;
            }
            
            // i++; if (i > 10) break;
        }
        
        pushToken(Twig.token.tokens.eof);

        console.log(tokens);

        return tokens;
    };
    
    Twig.lexer.analyzeData = function () {
        
        // if no matches are left we return the rest of the template as simple text token
        if (position == positions[0].length -1) {
            pushToken(Twig.token.tokens.text, codePart);
            setCursor(end);
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
        text = textContent = code.substr(cursor, currentPosition.index - cursor);
        if (typeof currentPositionWhitespace.type !== 'undefined') {
            text = text.trimRight();
        }
        
        pushToken(Twig.token.tokens.text, text);
        moveCursorWithText(textContent + currentPosition.type + (typeof currentPositionWhitespace.type !== 'undefined' ? currentPositionWhitespace.type : ''));
        
        // console.log(positions[0][position].type);
        
        switch (positions[0][position].type) {
            case Twig.lexer.tags.comment[0]:
                Twig.lexer.analyzeComment();
                break;

            case Twig.lexer.tags.block[0]:
                var match;
                
                // raw data?
                if (null !== (match = codePart.match(regexp.lexBlockRaw))) {
                    //             $this->moveCursorWithText($match[0]);
                    //             $this->lexRawData($match[1]);
                }
                // {% line \d+ %}
                else if (null !== (match = codePart.match(regexp.lexBlockLine))) {
                    //             $this->moveCursorWithText($match[0]);
                    //             $this->lineno = (int) $match[1];
                }
                else {
                    pushToken(Twig.token.tokens.blockStart);
                    pushState(Twig.lexer.states.block);
                    currentVarBlockLine = lineNumber;
                }
                break;

            case Twig.lexer.tags.variable[0]:
                pushToken(Twig.token.tokens.varStart);
                pushState(Twig.lexer.states.var);
                currentVarBlockLine = lineNumber;
                break;
        }
    }

    Twig.lexer.analyzeBlock = function () {
        var match;
        
        if (brackets.length === 0 && null !== (match = codePart.match(regexp.lexBlock))) {
            pushToken(Twig.token.tokens.blockEnd);
            moveCursorWithText(match[0]);
            popState();
            return;
        }

        Twig.lexer.analyzeExpression();
    }

    Twig.lexer.analyzeVar = function () {
        var match;
        
        if (brackets.length === 0 && null !== (match = codePart.match(regexp.lexVar))) {
            pushToken(Twig.token.tokens.varEnd);
            moveCursorWithText(match[0]);
            popState();
            return;
        }
        else {
            Twig.lexer.analyzeExpression();
        }
    }

    Twig.lexer.analyzeExpression = function () {
        var match;
        
        // console.log('expr');
        
        //whitespace
        if (match = codePart.match(/^\s+/)) {
            // console.log('ws');
            moveCursorWithText(match[0]);

            if (cursor >= end) {
                throw new Error('Unclosed '+ (state == Twig.lexer.states.block ? 'block' : 'variable')); // lineno filename
            }
        }
        
        if (null !== (match = codePart.match(regexp.name))) {
            // console.log('name');
            pushToken(Twig.token.tokens.name, match[0]);
            moveCursorWithText(match[0]);
        }
        else if (null !== (match = codePart.match(regexp.number))) {
            // console.log('num');
            throw new Error('unimplemented');
        }
        else if (-1 !== code[cursor].indexOf(regexp.punctation)) {
            // console.log('punc');
            throw new Error('unimplemented');
        }
        else if (null !== (match = codePart.match(regexp.string))) {
            // console.log('string');
            pushToken(Twig.token.tokens.string, match[0].substr(1, match[0].length - 2));
            moveCursorWithText(match[0]);
        }
        else if (null !== (match = codePart.match(regexp.DQStringDelimiter))) {
            throw new Error('unimplemented');
        }

        // process.exit();
        
        // // whitespace
        // if (preg_match('/\s+/A', $this->code, $match, null, $this->cursor)) {
        //     $this->moveCursorWithText($match[0]);
        //
        //     if ($this->cursor >= $this->end) {
        //         throw new Twig_Error_Syntax(sprintf('Unclosed "%s"', $this->state === self::STATE_BLOCK ? 'block' : 'variable'), $this->currentVarBlockLine, $this->filename);
        //     }
        // }
        //
        // // operators
        // if (preg_match($this->regexes['operator'], $this->code, $match, null, $this->cursor)) {
        //     $this->pushToken(Twig_Token::OPERATOR_TYPE, preg_replace('/\s+/', ' ', $match[0]));
        //     $this->moveCursorWithText($match[0]);
        // }
        // // names
        // elseif (preg_match(self::REGEX_NAME, $this->code, $match, null, $this->cursor)) {
        //     $this->pushToken(Twig_Token::NAME_TYPE, $match[0]);
        //     $this->moveCursorWithText($match[0]);
        // }
        // // numbers
        // elseif (preg_match(self::REGEX_NUMBER, $this->code, $match, null, $this->cursor)) {
        //     $number = (float) $match[0];  // floats
        //     if (ctype_digit($match[0]) && $number <= PHP_INT_MAX) {
        //         $number = (int) $match[0]; // integers lower than the maximum
        //     }
        //     $this->pushToken(Twig_Token::NUMBER_TYPE, $number);
        //     $this->moveCursorWithText($match[0]);
        // }
        // // punctuation
        // elseif (false !== strpos(self::PUNCTUATION, $this->code[$this->cursor])) {
        //     // opening bracket
        //     if (false !== strpos('([{', $this->code[$this->cursor])) {
        //         $this->brackets[] = array($this->code[$this->cursor], $this->lineno);
        //     }
        //     // closing bracket
        //     elseif (false !== strpos(')]}', $this->code[$this->cursor])) {
        //         if (empty($this->brackets)) {
        //             throw new Twig_Error_Syntax(sprintf('Unexpected "%s"', $this->code[$this->cursor]), $this->lineno, $this->filename);
        //         }
        //
        //         list($expect, $lineno) = array_pop($this->brackets);
        //         if ($this->code[$this->cursor] != strtr($expect, '([{', ')]}')) {
        //             throw new Twig_Error_Syntax(sprintf('Unclosed "%s"', $expect), $lineno, $this->filename);
        //         }
        //     }
        //
        //     $this->pushToken(Twig_Token::PUNCTUATION_TYPE, $this->code[$this->cursor]);
        //     ++$this->cursor;
        // }
        // // strings
        // elseif (preg_match(self::REGEX_STRING, $this->code, $match, null, $this->cursor)) {
        //     $this->pushToken(Twig_Token::STRING_TYPE, stripcslashes(substr($match[0], 1, -1)));
        //     $this->moveCursorWithText($match[0]);
        // }
        // // opening double quoted string
        // elseif (preg_match(self::REGEX_DQ_STRING_DELIM, $this->code, $match, null, $this->cursor)) {
        //     $this->brackets[] = array('"', $this->lineno);
        //     $this->pushState(self::STATE_STRING);
        //     $this->moveCursorWithText($match[0]);
        // }
        // // unlexable
        // else {
        //     throw new Twig_Error_Syntax(sprintf('Unexpected character "%s"', $this->code[$this->cursor]), $this->lineno, $this->filename);
        // }
    }

    Twig.lexer.analyzeRawData = function () {
        throw new Error('unimplemented');
    }

    Twig.lexer.analyzeComment = function () {
        var match = codePart.match(regexp.lexComment)
        
        if (!match) {
            throw new Error('unclosed comment at '+ lineNumber +' filename: '+ filename);
        }
        
        setCursor(cursor + match.index + match[0].length);
    }

    Twig.lexer.analyzeString = function () {
        throw new Error('unimplemented');
    }

    Twig.lexer.analyzeInterpolation = function () {
        throw new Error('unimplemented');
    }
    
    function getOperatorRegex()
    {
        var operators;
        var regexp = [];

        // TODO: get this from enviromnent and extension logic
        var unary = Object.keys(Twig.expression.operators.getUnaryOperators());
        var binary = Object.keys(Twig.expression.operators.getBinaryOperators());

        operators = unary.concat(binary, ['=']);
        operators.forEach(function (operator) {
            var r;
            if (operator[operator.length-1].match(/[a-z]$/)) {
                r = preg_quote(operator, '/') +'(?=[\s()])';
            }
            else {
                r = preg_quote(operator, '/');
            }
            
            r = r.replace(/\s+/, '\s+');
            
            regexp.push(r);
        });
        
        regexp = regexp.join('|');
        
        return new RegExp('^'+ regexp); // flag A
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
        if (type === Twig.token.tokens.text && '' === content) {
            return;
        }

        tokens.push({
            type: type,
            content: content || '',
            lineno: lineNumber
        });
    }
    
    function pushState(newState)
    {
        states.push(state);
        state = newState;
    }
    
    function popState()
    {
        if (states.length == 0) {
            throw new Error('')
        }
        
        state = states.pop();
    }
    
    function setCursor(newCursor)
    {
        lineNumber += code.substr(cursor, newCursor - cursor).split("\n").length - 1;
        cursor = newCursor;
        codePart = code.substr(cursor);
    }
    
    function moveCursorWithText(text)
    {
        setCursor(cursor + text.length);
        lineNumber += text.split("\n").length - 1;
    }
    
    return Twig;

}) (Twig || { });

