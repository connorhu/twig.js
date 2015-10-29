//     Twig.js
//     Available under the BSD 2-Clause License
//     https://github.com/justjohn/twig.js

// ## twig.expression.operator.js
//
// This file handles operator lookups and parsing.
var Twig = (function (Twig) {
    "use strict";

    /**
     * Operator associativity constants.
     */
    Twig.expression.operator = {
        leftToRight: 'leftToRight',
        rightToLeft: 'rightToLeft',
        left: 1,
        right: 2
    };

    var containment = function(a, b) {
        if (b.indexOf !== undefined) {
            // String
            return a === b || a !== '' && b.indexOf(a) > -1;

        } else {
            var el;
            for (el in b) {
                if (b.hasOwnProperty(el) && b[el] === a) {
                    return true;
                }
            }
            return false;
        }
    };

    function parseTestExpression()
    {
        
    }
    
    function parseNotTestExpression()
    {
        
    }

    // TODO: init this in extension logic core
    Twig.expression.operators = {
        unary: {
            'not': {
                precedence: 50,
                'class': 'Twig_Node_Expression_Unary_Not'
            },
            '-': {
                precedence: 500,
                'class': 'Twig_Node_Expression_Unary_Neg'
            },
            '+': {
                precedence: 500,
                'class': 'Twig_Node_Expression_Unary_Pos'
            }
        },
        binary: {
            'or': {
                precedence: 10, 
                'class': 'Twig_Node_Expression_Binary_Or', 
                associativity: Twig.expression.operator.left
            },
            'and': {
                precedence: 15, 
                'class': 'Twig_Node_Expression_Binary_And', 
                associativity: Twig.expression.operator.left
            },
            'b-or': {
                precedence: 16, 
                'class': 'Twig_Node_Expression_Binary_BitwiseOr', 
                associativity: Twig.expression.operator.left
            },
            'b-xor': {
                precedence: 17, 
                'class':'Twig_Node_Expression_Binary_BitwiseXor', 
                associativity: Twig.expression.operator.left
            },
            'b-and': {
                precedence: 18, 
                'class':'Twig_Node_Expression_Binary_BitwiseAnd', 
                associativity: Twig.expression.operator.left
            },
            '==': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_Equal', 
                associativity: Twig.expression.operator.left
            },
            '!=': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_NotEqual', 
                associativity: Twig.expression.operator.left
            },
            '<': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_Less', 
                associativity: Twig.expression.operator.left
            },
            '>': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_Greater', 
                associativity: Twig.expression.operator.left
            },
            '>=': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_GreaterEqual', 
                associativity: Twig.expression.operator.left
            },
            '<=': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_LessEqual', 
                associativity: Twig.expression.operator.left
            },
            'not in': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_NotIn', 
                associativity: Twig.expression.operator.left
            },
            'in': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_In', 
                associativity: Twig.expression.operator.left
            },
            'matches': {
                precedence: 20, 
                'class':'Twig_Node_Expression_Binary_Matches', 
                associativity: Twig.expression.operator.left
            },
            'starts with': {
                precedence: 20, 
                'class': 'Twig_Node_Expression_Binary_StartsWith', 
                associativity: Twig.expression.operator.left
            },
            'ends with': {
                precedence: 20, 
                'class': 'Twig_Node_Expression_Binary_EndsWith', 
                associativity: Twig.expression.operator.left
            },
            '..': {
                precedence: 25, 
                'class': 'Twig_Node_Expression_Binary_Range', 
                associativity: Twig.expression.operator.left
            },
            '+': {
                precedence: 30, 
                'class': 'Twig_Node_Expression_Binary_Add', 
                associativity: Twig.expression.operator.left
            },
            '-': {
                precedence: 30, 
                'class': 'Twig_Node_Expression_Binary_Sub', 
                associativity: Twig.expression.operator.left
            },
            '~': {
                precedence: 40, 
                'class': 'Twig_Node_Expression_Binary_Concat', 
                associativity: Twig.expression.operator.left
            },
            '*': {
                precedence: 60, 
                'class': 'Twig_Node_Expression_Binary_Mul', 
                associativity: Twig.expression.operator.left
            },
            '/': {
                precedence: 60, 
                'class': 'Twig_Node_Expression_Binary_Div', 
                associativity: Twig.expression.operator.left
            },
            '//': {
                precedence: 60, 
                'class': 'Twig_Node_Expression_Binary_FloorDiv', 
                associativity: Twig.expression.operator.left
            },
            '%': {
                precedence: 60, 
                'class': 'Twig_Node_Expression_Binary_Mod', 
                associativity: Twig.expression.operator.left
            },
            'is': {
                precedence: 100,
                'callable': parseTestExpression, 
                associativity: Twig.expression.operator.left
            },
            'is not': {
                precedence:100,
                'callable': parseNotTestExpression, 
                associativity: Twig.expression.operator.left
            },
            '**': {
                precedence:200, 
                'class': 'Twig_Node_Expression_Binary_Power', 
                associativity: Twig.expression.operator.right
            }
        }
    }
    Twig.expression.operators.getUnaryOperators = function() {
        return Twig.expression.operators.unary;
    }
    Twig.expression.operators.getBinaryOperators = function() {
        return Twig.expression.operators.binary;
    }

    /**
     * Get the precidence and associativity of an operator. These follow the order that C/C++ use.
     * See http://en.wikipedia.org/wiki/Operators_in_C_and_C++ for the table of values.
     */
    Twig.expression.operator.lookup = function (operator, token) {
        switch (operator) {
            case "..":
            case 'not in':
            case 'in':
                token.precidence = 20;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case ',':
                token.precidence = 18;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            // Ternary
            case '?':
            case ':':
                token.precidence = 16;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            case 'or':
                token.precidence = 14;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'and':
                token.precidence = 13;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '==':
            case '!=':
                token.precidence = 9;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '<':
            case '<=':
            case '>':
            case '>=':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;


            case '~': // String concatination
            case '+':
            case '-':
                token.precidence = 6;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '//':
            case '**':
            case '*':
            case '/':
            case '%':
                token.precidence = 5;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'not':
                token.precidence = 3;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
        token.operator = operator;
        return token;
    };

    /**
     * Handle operations on the RPN stack.
     *
     * Returns the updated stack.
     */
    Twig.expression.operator.parse = function (operator, stack) {
        Twig.log.trace("Twig.expression.operator.parse: ", "Handling ", operator);
        var a, b, c;
        switch (operator) {
            case ':':
                // Ignore
                break;

            case '?':
                c = stack.pop(); // false expr
                b = stack.pop(); // true expr
                a = stack.pop(); // conditional
                if (a) {
                    stack.push(b);
                } else {
                    stack.push(c);
                }
                break;

            case '+':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a + b);
                break;

            case '-':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a - b);
                break;

            case '*':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a * b);
                break;

            case '/':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a / b);
                break;

            case '//':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(parseInt(a / b));
                break;

            case '%':
                b = parseFloat(stack.pop());
                a = parseFloat(stack.pop());
                stack.push(a % b);
                break;

            case '~':
                b = stack.pop();
                a = stack.pop();
                stack.push( (a != null ? a.toString() : "")
                          + (b != null ? b.toString() : "") );
                break;

            case 'not':
            case '!':
                stack.push(!stack.pop());
                break;

            case '<':
                b = stack.pop();
                a = stack.pop();
                stack.push(a < b);
                break;

            case '<=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a <= b);
                break;

            case '>':
                b = stack.pop();
                a = stack.pop();
                stack.push(a > b);
                break;

            case '>=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a >= b);
                break;

            case '===':
                b = stack.pop();
                a = stack.pop();
                stack.push(a === b);
                break;

            case '==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a == b);
                break;

            case '!==':
                b = stack.pop();
                a = stack.pop();
                stack.push(a !== b);
                break;

            case '!=':
                b = stack.pop();
                a = stack.pop();
                stack.push(a != b);
                break;

            case 'or':
                b = stack.pop();
                a = stack.pop();
                stack.push(a || b);
                break;

            case 'and':
                b = stack.pop();
                a = stack.pop();
                stack.push(a && b);
                break;

            case '**':
                b = stack.pop();
                a = stack.pop();
                stack.push(Math.pow(a, b));
                break;


            case 'not in':
                b = stack.pop();
                a = stack.pop();
                stack.push( !containment(a, b) );
                break;

            case 'in':
                b = stack.pop();
                a = stack.pop();
                stack.push( containment(a, b) );
                break;

            case '..':
                b = stack.pop();
                a = stack.pop();
                stack.push( Twig.functions.range(a, b) );
                break;

            default:
                throw new Twig.Error(operator + " is an unknown operator.");
        }
    };

    return Twig;

})( Twig || { } );
