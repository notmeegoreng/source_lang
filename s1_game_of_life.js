import {
    show, animate_rune,
    square,
    white,
    beside, stack
} from 'rune'; 

// rune stuff is at the top to be easily all disabled
// for no module environments (i.e. no internet)
// convert balanced binary tree into runes
// tree is treated as a H tree
const c = p => 
    is_function(p)
    ? beside(
        stack(
            c(p(true)(true)),
            c(p(true)(false))
        ), stack(
            c(p(false)(true)),
            c(p(false)(false))
        )
    )
    : p ? square : white(square);
// */

// alternate pair definition, optimised for tokens
// head(pair(...)) === p(...)(true)
// tail(pair(...)) === p(...)(false)
const p = (x, y) => c => c ? x : y;
// this leads to an alternate list definitions
// p(x0, p(x1, p(x2, x3)))
// undelimited
// p(x0, p(x1, p(x2, p(x3, undefined))))
// the tail is not defined to be any specific value, can be used to tag lists

// nul - list of itself
const nul = _ => nul;
// THIS nul IS VERY DIFFERENT FROM A NORMAL null!
// for one it passes the pair check (is_function)
// this is useful to pass in circumstances that expect a list/tree
// to eat up the head/tails


// debug display function
/*
const d = l => {
    if (is_function(l)) {
        // nul check
        // well i cant compare functions so
        // more like one parameter starting with _ check
        if (char_at(stringify(l), 0) === '_') {
            display('nul');
        } else {
            display(l(true), 'elem');
            d(l(false));
        }
    } else {
        display(l, 'end tag');
    }
    return l;
};
*/

// traverse balanced binary tree `s` in reverse order of `l`
const t = (s, l) => is_function(l) ? t(s, l(false))(l(true)) : s;

// heart of the system - used to find surrounding squares
// combination of t with c1 (change1) that only applies once every 2 
// recurses into a different t2c? and back agin
// change1 adds or subtracts based on m
// m: minus, so true - sub, false - add, undefined - no change
// treat l as terminated list of 2 binary numbers alternating reversed
// f, function to recurse into
// if overflow returns nul (note: is_function(nul) === true)
// else element of s (assuming proper length of l)
// warning - length too short cannot be distingushed
// from overflow / underflow without stringification
const t2c1 = m => 
    (s, l, f) =>
        is_undefined(m)
        ? is_function(l)
        ? f(s, l(false), t2c1(undefined))(l(true))
        : is_undefined(f) // true when | with f === t2c0
        ? s // this stuff wont be     \/ needed if we could compare functions
        : f(s, 0, undefined) // f === t2c1, !is_function(l) => overflow 
        : is_function(l)
        ? (l(true) ? !m : m) // xor
        ? f(s, l(false), t2c1(m))(m) // carry. m === !l(true). alternate
        // carry end. m === l(true), early end
        : f(s, l(false), t2c1(undefined))(!m)
        : nul; // overflow;

/*
// when passed in as a list/binary tree,
// returns a list of the booleans passed to it reversed (tagged undefined)
const _m = l => b => is_undefined(b) ? l : _m(p(b, l));
const mock = _m(undefined);
*/



// no cast
const int = b => !is_function(b) && b ? 1 : 0;
const i = f => f(true) + f(false) + f(undefined);



const n = (ti, s) => {
    // function to determine new square
    // l is path to current square
    // to is filled squares in 3x3 centered on current
    // this implemenation is Conway's Game of Life
    const test = (l, to) => to === 3 || to === 4 && t(s, l);

    const g = (l, n) => 
        n === 0
        ? test(l, i(a => i(b => int(t2c1(a)(s, l, t2c1(b))))))
        : p(g(p(true, l), n - 1), g(p(false, l), n - 1));
    return ti <= 0 ? c(s) : n(ti - 1, g(0, de));
};

const de = 6;

//*
const s = p(
    p(
        p(
            p(
                p(p(false, true), p(false, true)),
                p(p(true, false), p(true, false))
            ), p(
                p(p(true, true), p(true, true)),
                p(p(true, false), p(true, false))
            )
        ), p(
            p(
                p(p(false, false), p(false, false)),
                p(p(false, true), p(false, true))
            ), p(
                p(p(false, true), p(true, true)),
                p(p(false, false), p(false, false))
            )
        )
    ), p(
        p(
            p(
                p(p(false, true), p(false, true)),
                p(p(true, false), p(true, false))
            ), p(
                p(p(true, true), p(true, true)),
                p(p(true, false), p(true, false))
            )
        ), p(
            p(
                p(p(false, false), p(false, false)),
                p(p(true, true), p(false, true))
            ), p(
                p(p(false, true), p(false, true)),
                p(p(false, false), p(false, false))
            )
        )
    )
);
// */
/*
const s = p(
    p(
        p(p(false, false), p(false, false)),
        p(p(false, false), p(true, false))
    ), p(
        p(p(false, false), p(false, false)),
        p(p(true, false), p(true, false))
    )
);
// */

animate_rune(14, 1, t => n(t, s));
