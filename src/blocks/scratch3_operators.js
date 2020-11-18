const Cast = require('../util/cast.js');
const MathUtil = require('../util/math-util.js');

class Scratch3OperatorsBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop
        };
    }

    add (args) {
        if(typeof(args.NUM1) === 'object' || typeof(args.NUM2) === 'object')
        {
            return args.NUM1.add(args.NUM2);
        }
        return Cast.toNumber(args.NUM1) + Cast.toNumber(args.NUM2);
    }

    subtract (args) {
        if(typeof(args.NUM1) === 'object' || typeof(args.NUM2) === 'object')
        {
            return args.NUM1.sub(args.NUM2);
        }
        return Cast.toNumber(args.NUM1) - Cast.toNumber(args.NUM2);
    }

    multiply (args) {
        if(typeof(args.NUM1) === 'object')
        {
            return args.NUM1.mul(args.NUM2);
        }
        else if( typeof(args.NUM2) === 'object')
        {
            return args.NUM2.mul(args.NUM1);
        }
        return Cast.toNumber(args.NUM1) * Cast.toNumber(args.NUM2);
    }

    divide (args) {
        if(typeof(args.NUM1) === 'object')
        {
            return args.NUM1.div(args.NUM2);
        }
        else if( typeof(args.NUM2) === 'object')
        {
            return args.NUM2.div(args.NUM1);
        }
        return Cast.toNumber(args.NUM1) / Cast.toNumber(args.NUM2);
    }

    lt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0;
    }

    equals (args) {
        if(typeof(args.NUM1) === 'object')
        {
            return args.NUM1.equals(args.NUM2);
        }
        else if( typeof(args.NUM2) === 'object')
        {
            return args.NUM2.equals(args.NUM1);
        }
        return Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0;
    }

    and (args) {
        return Cast.toBoolean(args.OPERAND1) && Cast.toBoolean(args.OPERAND2);
    }

    or (args) {
        return Cast.toBoolean(args.OPERAND1) || Cast.toBoolean(args.OPERAND2);
    }

    not (args) {
        return !Cast.toBoolean(args.OPERAND);
    }

    random (args) {
        const nFrom = Cast.toNumber(args.FROM);
        const nTo = Cast.toNumber(args.TO);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(args.FROM) && Cast.isInt(args.TO)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    join (args) {
        return Cast.toString(args.STRING1) + Cast.toString(args.STRING2);
    }

    letterOf (args) {
        const index = Cast.toNumber(args.LETTER) - 1;
        const str = Cast.toString(args.STRING);
        // Out of bounds?
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    length (args) {
        return Cast.toString(args.STRING).length;
    }

    contains (args) {
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        const n = Cast.toNumber(args.NUM1);
        const modulus = Cast.toNumber(args.NUM2);
        let result = n % modulus;
        // Scratch mod uses floored division instead of truncated division.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    round (args) {
        if(typeof(args.NUM) === 'object')
        {
            return args.NUM.round();
        }
        return Math.round(Cast.toNumber(args.NUM));
    }

    mathop (args) {
        const operator = Cast.toString(args.OPERATOR).toLowerCase();
        if(typeof(args.NUM) === 'object')
        {
            let n = args.NUM;
            const Complex  = require('complex.js');
            switch (operator) {
            case 'abs': return n.abs();
            case 'floor': return n.floor();
            case 'ceiling': return n.ceil();
            case 'sqrt': return MathUtil.sqrt(n);
            case 'sin': return parseFloat(n.sin());
            case 'cos': return parseFloat(n.cos());
            case 'tan': return n.tan();
            case 'asin': return n.asin().mul(180).divide(Math.PI);
            case 'acos': return n.acos().mul(180).divide(Math.PI);
            case 'atan': return n.atan().mul(180).divide(Math.PI);
            case 'ln': return n.log();
            case 'log': return n.log().divide(Math.LN10);
            case 'e ^': return n.exp();
            case '10 ^': return new Complex(10, 0).pow(n);
            case '^ 2': return n.pow(new Complex(2, 0));
            }
        }
        else
        {
            const n = Cast.toNumber(args.NUM);
            switch (operator) {
            case 'abs': return Math.abs(n);
            case 'floor': return Math.floor(n);
            case 'ceiling': return Math.ceil(n);
            case 'sqrt': return MathUtil.sqrt(n);
            case 'sin': return parseFloat(Math.sin((Math.PI * n) / 180).toFixed(10));
            case 'cos': return parseFloat(Math.cos((Math.PI * n) / 180).toFixed(10));
            case 'tan': return MathUtil.tan(n);
            case 'asin': return (Math.asin(n) * 180) / Math.PI;
            case 'acos': return (Math.acos(n) * 180) / Math.PI;
            case 'atan': return (Math.atan(n) * 180) / Math.PI;
            case 'ln': return Math.log(n);
            case 'log': return Math.log(n) / Math.LN10;
            case 'e ^': return Math.exp(n);
            case '10 ^': return Math.pow(10, n);
            case '^ 2': return Math.pow(n, 2);
            }
        }
        return 0;
    }
}

module.exports = Scratch3OperatorsBlocks;
